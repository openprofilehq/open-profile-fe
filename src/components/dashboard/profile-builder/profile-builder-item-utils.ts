export const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const slugifyItemIdPart = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

export function ensureItemIds<T extends { id?: string }>(
  items: T[],
  buildFallback: (item: T, index: number) => string
): Array<T & { id: string }> {
  const seenIds = new Set<string>();

  return items.map((item, index) => {
    const existingId = typeof item.id === "string" ? item.id.trim() : "";
    const baseId = existingId || buildFallback(item, index);
    let nextId = baseId;
    let suffix = 1;

    while (seenIds.has(nextId)) {
      nextId = `${baseId}-${index}-${suffix}`;
      suffix += 1;
    }

    seenIds.add(nextId);

    return { ...item, id: nextId };
  });
}
