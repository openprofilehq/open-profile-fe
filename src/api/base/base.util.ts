export function isQueryEnabled(
  id: string | undefined | Record<string, unknown>
) {
  if (typeof id !== "object") {
    return id == "undefined" ? false : (id?.length ?? 0) > 0 || !!id;
  }

  return Object.values(id).every((item) =>
    item == "undefined" ? false : (String(item)?.length ?? 0) > 0 || !!item
  );
}
