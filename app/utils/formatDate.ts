/**
 * Indonesian date helpers shared by the dokumentasi archive, its cards,
 * and the article page. Kept in one place so the three surfaces can never
 * drift apart on how a date range renders.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** `2025-10-12` → `12 Okt 2025`. Non-ISO input is echoed back untouched. */
export function formatDateIndo(dStr?: string | null): string {
  if (!dStr) return ''
  if (!ISO_DATE.test(dStr)) return dStr
  try {
    const d = new Date(dStr)
    if (isNaN(d.getTime())) return dStr
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
  } catch {
    return dStr
  }
}

/** `start_date`–`end_date` → `12 Okt 2025 - 14 Okt 2025`; collapses to one date when equal. */
export function formatRangeIndo(sStr?: string | null, eStr?: string | null): string {
  const start = formatDateIndo(sStr)
  if (!start) return ''
  const end = formatDateIndo(eStr)
  if (!end || start === end) return start
  return `${start} - ${end}`
}

/** Archive grouping key: the 4-digit year, or `''` when the entry carries no usable date. */
export function yearOf(dStr?: string | null): string {
  const m = String(dStr || '').match(/^(\d{4})/)
  return m ? m[1] : ''
}
