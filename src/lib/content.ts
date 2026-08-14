import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { noteUrl, topicUrl, tagUrl, type NoteType } from './urls';

export type { NoteType } from './urls';

export interface Note {
  type: NoteType;
  lang: Lang;
  slug: string; // dùng chung cho cả 2 ngôn ngữ -> để ghép bản dịch
  url: string;
  entry: CollectionEntry<'field'> | CollectionEntry<'insight'>;
  data: CollectionEntry<'field'>['data'];
}

const HIDE_DRAFTS = import.meta.env.PROD;

function normalize(
  type: NoteType,
  entry: CollectionEntry<'field'> | CollectionEntry<'insight'>
): Note | null {
  const parts = entry.id.split('/');
  const lang = parts[0] as Lang;
  const slug = parts.slice(1).join('/');
  if (lang !== 'vi' && lang !== 'en') return null;
  return { type, lang, slug, url: noteUrl(type, lang, slug), entry, data: entry.data };
}

let _cache: Note[] | null = null;

export async function getAllNotes(): Promise<Note[]> {
  if (_cache) return _cache;
  const [field, insight] = await Promise.all([
    getCollection('field'),
    getCollection('insight'),
  ]);
  const notes: Note[] = [];
  for (const e of field) {
    const n = normalize('field', e);
    if (n && !(HIDE_DRAFTS && n.data.draft)) notes.push(n);
  }
  for (const e of insight) {
    const n = normalize('insight', e);
    if (n && !(HIDE_DRAFTS && n.data.draft)) notes.push(n);
  }
  _cache = notes;
  return notes;
}

export async function getNotes(lang: Lang, type?: NoteType): Promise<Note[]> {
  const all = await getAllNotes();
  return all
    .filter((n) => n.lang === lang && (!type || n.type === type))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getNote(
  type: NoteType,
  lang: Lang,
  slug: string
): Promise<Note | undefined> {
  const all = await getAllNotes();
  return all.find((n) => n.type === type && n.lang === lang && n.slug === slug);
}

// Bản dịch của một note = cùng type + slug nhưng khác lang
export async function getTranslation(note: Note): Promise<Note | undefined> {
  const other: Lang = note.lang === 'vi' ? 'en' : 'vi';
  return getNote(note.type, other, note.slug);
}

export interface TermCount {
  slug: string;
  count: number;
}

export async function getTopics(lang: Lang): Promise<TermCount[]> {
  return aggregate(await getNotes(lang), (n) => n.data.topics);
}
export async function getTags(lang: Lang): Promise<TermCount[]> {
  return aggregate(await getNotes(lang), (n) => n.data.tags);
}

function aggregate(notes: Note[], pick: (n: Note) => string[]): TermCount[] {
  const map = new Map<string, number>();
  for (const n of notes) for (const term of pick(n)) map.set(term, (map.get(term) ?? 0) + 1);
  return [...map.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export async function getNotesByTopic(lang: Lang, topic: string): Promise<Note[]> {
  return (await getNotes(lang)).filter((n) => n.data.topics.includes(topic));
}
export async function getNotesByTag(lang: Lang, tag: string): Promise<Note[]> {
  return (await getNotes(lang)).filter((n) => n.data.tags.includes(tag));
}

// Ghi chú kết nối: connections khai báo (cùng type) + bài chung topic/tag
export async function getConnectedNotes(note: Note, limit = 6): Promise<Note[]> {
  const pool = await getNotes(note.lang);
  const scores = new Map<string, number>();
  const byKey = new Map<string, Note>();
  const keyOf = (n: Note) => `${n.type}:${n.slug}`;

  for (const other of pool) {
    if (other.type === note.type && other.slug === note.slug) continue;
    byKey.set(keyOf(other), other);
    let score = 0;
    if (note.type === other.type && note.data.connections.includes(other.slug)) score += 100;
    score += note.data.topics.filter((x) => other.data.topics.includes(x)).length * 3;
    score += note.data.tags.filter((x) => other.data.tags.includes(x)).length * 2;
    if (score > 0) scores.set(keyOf(other), score);
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1] || byKey.get(b[0])!.data.date.getTime() - byKey.get(a[0])!.data.date.getTime())
    .slice(0, limit)
    .map(([k]) => byKey.get(k)!)
    .filter(Boolean);
}

// Dữ liệu cho Constellation Map (theo ngôn ngữ)
export interface GraphNode {
  id: string;
  label: string;
  type: NoteType | 'topic' | 'tag';
  url: string;
}
export interface GraphLink {
  source: string;
  target: string;
  weight: number;
}
export interface Graph {
  nodes: GraphNode[];
  links: GraphLink[];
}

export async function buildGraph(lang: Lang): Promise<Graph> {
  const notes = await getNotes(lang);
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const seenTerm = new Set<string>();
  const noteId = (n: Note) => `note:${n.type}:${n.slug}`;

  for (const n of notes) {
    nodes.push({ id: noteId(n), label: n.data.title, type: n.type, url: n.url });
  }

  // node topic/tag + cạnh note<->term
  const addTerm = (kind: 'topic' | 'tag', slug: string, url: string) => {
    const id = `${kind}:${slug}`;
    if (!seenTerm.has(id)) {
      seenTerm.add(id);
      nodes.push({ id, label: (kind === 'tag' ? '#' : '') + slug, type: kind, url });
    }
    return id;
  };
  for (const n of notes) {
    for (const topic of n.data.topics) {
      const id = addTerm('topic', topic, topicUrl(lang, topic));
      links.push({ source: noteId(n), target: id, weight: 1 });
    }
    for (const tag of n.data.tags) {
      const id = addTerm('tag', tag, tagUrl(lang, tag));
      links.push({ source: noteId(n), target: id, weight: 0.6 });
    }
  }

  // cạnh note<->note do connections khai báo (đậm hơn)
  const exists = new Set(notes.map((n) => `${n.type}:${n.slug}`));
  for (const n of notes) {
    for (const c of n.data.connections) {
      if (exists.has(`${n.type}:${c}`)) {
        links.push({ source: noteId(n), target: `note:${n.type}:${c}`, weight: 2.4 });
      }
    }
  }

  return { nodes, links };
}
