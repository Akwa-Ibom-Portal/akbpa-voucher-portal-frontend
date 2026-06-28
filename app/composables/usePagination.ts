/** Client-side pagination over an already-fetched list — every store loads its full
 *  filtered result set, so pagination here just slices it for display. Resets to page 1
 *  whenever the underlying list changes (new filter, new search, etc). */
export function usePagination<T>(source: () => T[], pageSize = 10) {
  const page = ref(1)

  const total = computed(() => source().length)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))
  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize
    return source().slice(start, start + pageSize)
  })

  watch(total, () => {
    if (page.value > pageCount.value) page.value = pageCount.value
  })

  return { page, total, pageCount, paginated, pageSize }
}
