import { StudyItem, DocInfo, TopicMastery, AnswerPayload, GeneratePayload } from '../types';
import { SAMPLE_COURSES } from '../data/sampleNotes';

const API_BASE_URL = 'http://localhost:8000'; // Standard backend port
const STORAGE_DOCS_KEY = 'grimoire_uploaded_docs';
const STORAGE_MASTERY_KEY = 'grimoire_topic_mastery';

/**
 * Adaptive Question Generator:
 * Intelligently extracts study flashcards or MCQ questions from raw text or falls back to curated sample courses.
 * Weights weak/cursed topics to appear more frequently in quizzes!
 */
export class ArcaneApiClient {
  private isOnlineMode: boolean = false;

  constructor() {
    this.checkHealth();
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      this.isOnlineMode = res.ok;
      return this.isOnlineMode;
    } catch {
      this.isOnlineMode = false;
      return false;
    }
  }

  public getOnlineStatus(): boolean {
    return this.isOnlineMode;
  }

  public setOnlineStatus(online: boolean) {
    this.isOnlineMode = online;
  }

  /**
   * POST /upload
   * Takes a PDF / Text file, returns { docId: string }
   */
  public async uploadPdf(file: File | { name: string; content: string }): Promise<DocInfo> {
    const docId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const title = file.name.replace(/\.[^/.]+$/, '');
    
    // Attempt real backend upload if available
    if (this.isOnlineMode && file instanceof File) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          const docInfo: DocInfo = {
            docId: data.docId || docId,
            title: title || 'Grimoire Tome',
            uploadedAt: new Date().toISOString(),
          };
          this.saveDocToStorage(docInfo);
          return docInfo;
        }
      } catch (err) {
        console.warn('Backend /upload unavailable, operating in Arcane Offline Engine mode', err);
      }
    }

    // Offline / Instant Local Extraction Mode
    let textContent = '';
    if ('content' in file) {
      textContent = file.content;
    } else {
      textContent = await this.readTextFromFile(file);
    }

    const docInfo: DocInfo = {
      docId,
      title: title || 'Haunted Lecture Scroll',
      wordCount: textContent.split(/\s+/).filter(Boolean).length,
      pageCount: Math.max(1, Math.ceil(textContent.length / 2200)),
      summary: `Arcane manuscript extracted with ${textContent.split(/\s+/).length} words across topics.`,
      uploadedAt: new Date().toISOString(),
    };

    // Store generated items locally for this doc
    const generatedItems = this.extractItemsFromText(textContent, title);
    localStorage.setItem(`grimoire_items_${docId}`, JSON.stringify(generatedItems));
    this.saveDocToStorage(docInfo);

    return docInfo;
  }

  /**
   * POST /generate
   * Takes { docId, mode: 'quiz' | 'flashcards' }, returns list of StudyItem
   * Implements adaptive weighting: cursed/weak topics are prioritized!
   */
  public async generateItems(payload: GeneratePayload): Promise<StudyItem[]> {
    if (this.isOnlineMode) {
      try {
        const res = await fetch(`${API_BASE_URL}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          const items: StudyItem[] = (Array.isArray(data) ? data : data.items || []).map((item: { topic?: string; question: string; options?: string[]; answer: string; explanation?: string }, idx: number) => ({
            id: `${payload.docId}-${idx}`,
            topic: item.topic || 'General Knowledge',
            question: item.question,
            options: item.options || [],
            answer: item.answer,
            explanation: item.explanation || 'No explanation provided.',
            mastery: 'unseen',
          }));
          return this.applyAdaptivePrioritization(items);
        }
      } catch (err) {
        console.warn('Backend /generate failed, falling back to local arcane items', err);
      }
    }

    // Offline extraction check
    const stored = localStorage.getItem(`grimoire_items_${payload.docId}`);
    if (stored) {
      try {
        const parsed: StudyItem[] = JSON.parse(stored);
        return this.applyAdaptivePrioritization(parsed);
      } catch {
        // fallback
      }
    }

    // Sample course matching
    const sample = SAMPLE_COURSES.find(c => c.id === payload.docId);
    if (sample) {
      return this.applyAdaptivePrioritization([...sample.items]);
    }

    // Default sample if not found
    return this.applyAdaptivePrioritization([...SAMPLE_COURSES[0].items]);
  }

  /**
   * POST /answer
   * Takes { docId, topic, correct: boolean }
   * Updates weak-topic tracking in real-time
   */
  public async submitAnswer(payload: AnswerPayload): Promise<TopicMastery> {
    // Attempt backend update
    if (this.isOnlineMode) {
      try {
        await fetch(`${API_BASE_URL}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn('Backend /answer failed, updating local mastery', err);
      }
    }

    // Local Topic Mastery Tracking
    const masteryMap = this.getMasteryRecords();
    const current = masteryMap[payload.topic] || {
      topic: payload.topic,
      attempts: 0,
      correct: 0,
      wrong: 0,
      accuracy: 0,
      status: 'haunted',
    };

    current.attempts += 1;
    if (payload.correct) {
      current.correct += 1;
    } else {
      current.wrong += 1;
    }

    current.accuracy = Math.round((current.correct / current.attempts) * 100);
    
    // Status thresholds:
    // Cursed: accuracy < 50% (needs intense practice)
    // Haunted: accuracy 50% - 79% (moderate practice)
    // Purified: accuracy >= 80% (mastered)
    if (current.accuracy < 50) {
      current.status = 'cursed';
    } else if (current.accuracy >= 80 && current.attempts >= 2) {
      current.status = 'purified';
    } else {
      current.status = 'haunted';
    }

    masteryMap[payload.topic] = current;
    localStorage.setItem(STORAGE_MASTERY_KEY, JSON.stringify(masteryMap));

    return current;
  }

  public getMasteryRecords(): Record<string, TopicMastery> {
    try {
      const data = localStorage.getItem(STORAGE_MASTERY_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  public resetMastery() {
    localStorage.removeItem(STORAGE_MASTERY_KEY);
  }

  /**
   * Adaptive Difficulty Engine:
   * Re-sorts questions so weak / cursed topics bubble to the top of quizzes!
   */
  private applyAdaptivePrioritization(items: StudyItem[]): StudyItem[] {
    const mastery = this.getMasteryRecords();

    return [...items].sort((a, b) => {
      const masteryA = mastery[a.topic];
      const masteryB = mastery[b.topic];

      const scoreA = masteryA ? (masteryA.status === 'cursed' ? 0 : masteryA.status === 'haunted' ? 1 : 2) : 1;
      const scoreB = masteryB ? (masteryB.status === 'cursed' ? 0 : masteryB.status === 'haunted' ? 1 : 2) : 1;

      // Cursed topics first
      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }
      return 0.5 - Math.random(); // slight shuffle within same tier
    });
  }

  private saveDocToStorage(doc: DocInfo) {
    try {
      const docs: DocInfo[] = this.getSavedDocs();
      const updated = [doc, ...docs.filter(d => d.docId !== doc.docId)];
      localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  public getSavedDocs(): DocInfo[] {
    try {
      const data = localStorage.getItem(STORAGE_DOCS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private async readTextFromFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve((reader.result as string) || '');
      };
      reader.onerror = () => {
        resolve(`Failed to read file ${file.name}`);
      };
      reader.readAsText(file);
    });
  }

  /**
   * Client-side Intelligent Rune Synthesizer:
   * Generates quality flashcard & MCQ items from pasted text notes!
   */
  private extractItemsFromText(text: string, title: string): StudyItem[] {
    const paragraphs = text
      .split(/\n{2,}|\.\s+/)
      .map(p => p.trim())
      .filter(p => p.length > 35);

    if (paragraphs.length === 0) {
      return SAMPLE_COURSES[0].items;
    }

    const items: StudyItem[] = [];
    const topics = [
      `${title}: Core Fundamentals`,
      `${title}: Advanced Principles`,
      `${title}: Edge Cases & Mechanisms`,
      `${title}: Critical Analysis`
    ];

    paragraphs.slice(0, 8).forEach((para, idx) => {
      const words = para.split(/\s+/);
      const keySnippet = words.slice(0, Math.min(10, words.length)).join(' ');
      const topic = topics[idx % topics.length];

      items.push({
        id: `extracted-${idx}`,
        topic,
        question: `According to the lecture notes, which statement accurately reflects: "${keySnippet}..."?`,
        options: [
          para,
          `The opposing theory argues the contrary effect in distributed conditions.`,
          `This mechanism only applies when system frequency falls below threshold limits.`,
          `This concept has been superseded by newer non-blocking cryptographic variants.`
        ].sort(() => 0.5 - Math.random()),
        answer: para,
        explanation: `From the source lecture text: "${para.substring(0, 160)}..."`,
        mastery: 'unseen',
      });
    });

    return items;
  }
}

export const api = new ArcaneApiClient();
