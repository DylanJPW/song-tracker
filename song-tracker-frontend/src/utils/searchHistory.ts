import * as v from "valibot";

const STORAGE_KEY = "songtracker.searchHistory.v1";
const MAX_ENTRIES = 8;

const history = v.array(v.string());

function save(list: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function list(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed = v.safeParse(history, JSON.parse(raw));
    return parsed.success ? parsed.output : [];
  } catch {
    return [];
  }
}

export function add(query: string): string[] {
  const trimmed = query.trim();
  if (trimmed === "") return list();

  const withoutDuplicate = list().filter(
    (entry) => entry.toLowerCase() !== trimmed.toLowerCase(),
  );
  const next = [trimmed, ...withoutDuplicate].slice(0, MAX_ENTRIES);
  save(next);
  return next;
}