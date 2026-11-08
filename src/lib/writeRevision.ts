/** Latest-revision tracking for browser-local writes; stale completions never clear dirty edits. */
export function createWriteRevision() {
  let revision = 0;
  let dirty = false;
  return {
    begin() { dirty = true; return ++revision; },
    complete(id: number) { if (id !== revision) return false; dirty = false; return true; },
    current(id: number) { return id === revision; },
    dirty: () => dirty,
    reset() { revision++; dirty = false; },
  };
}