export const PAGE_SIZE = 18;

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * size;
  const slice = items.slice(start, start + size);
  return {
    slice,
    total: items.length,
    from: items.length === 0 ? 0 : start + 1,
    to: start + slice.length,
    pages,
    page: current,
  };
}
