<template>
  <main class="art-page">
    <!-- Back link -->
    <NuxtLink to="/dokumentasi" class="art-back">
      <Icon name="material-symbols:arrow-back-rounded" aria-hidden="true" />
      Kembali ke Dokumentasi
    </NuxtLink>

    <!-- Loading skeleton (mirrors article layout) -->
    <div v-if="pending" class="art-card art-skel" role="status" aria-live="polite">
      <span class="sr-only">Memuat artikel…</span>
      <div class="art-hero art-skel__hero" aria-hidden="true">
        <div class="art-skel__lines">
          <span class="art-skel__pill" />
          <span class="art-skel__title" />
          <span class="art-skel__meta" />
        </div>
      </div>
      <div class="art-body" aria-hidden="true">
        <span class="art-skel__h" />
        <span class="art-skel__p" />
        <span class="art-skel__p" />
        <span class="art-skel__p art-skel__p--short" />
        <div class="art-grid art-skel__grid">
          <span v-for="i in 4" :key="i" class="art-skel__tile" />
        </div>
      </div>
    </div>

    <!-- Not found -->
    <div v-else-if="!article" class="art-empty">
      <span class="art-empty__icon" aria-hidden="true">
        <Icon name="material-symbols:article-off-rounded" />
      </span>
      <h1 class="art-empty__title">Artikel tidak ditemukan</h1>
      <p class="art-empty__text">Artikel yang kamu cari mungkin sudah dihapus atau dipindahkan.</p>
      <NuxtLink to="/dokumentasi" class="art-empty__cta">Lihat Dokumentasi</NuxtLink>
    </div>

    <!-- Article -->
    <article v-else class="art-card">
      <!-- Hero -->
      <header class="art-hero">
        <AppImg
          :src="useImageUrl(article.thumbnail)"
          :alt="article.title"
          loading="eager"
          class="art-hero__img"
        />
        <span class="art-hero__scrim" aria-hidden="true" />
        <div class="art-hero__body">
          <span class="art-hero__tag">{{ article.tag_text || 'Kegiatan' }}</span>
          <h1 class="art-hero__title">{{ article.title }}</h1>
          <p class="art-hero__date">
            <time :datetime="article.start_date || ''">
              {{ formatRangeIndo(article.start_date, article.end_date) }}
            </time>
          </p>
        </div>
      </header>

      <!-- Body -->
      <div class="art-body">
        <h2 v-if="article.narasi_title" class="art-subhead">{{ article.narasi_title }}</h2>

        <div class="art-prose" v-html="renderedNarasi" />

        <p v-if="article.narasi_footer" class="art-credit">{{ article.narasi_footer }}</p>

        <!-- Photo gallery -->
        <template v-if="hasPhotos">
          <div class="art-gallery__head">
            <h2 class="art-gallery__title">Galeri kegiatan</h2>
            <span class="art-gallery__count">{{ photos.length }} foto</span>
          </div>

          <div class="art-grid" :class="gridClass">
            <button
              v-for="(img, i) in previewPhotos"
              :key="i"
              type="button"
              class="art-shot group"
              :class="{ 'art-shot--lead': isHeroPhoto(Number(i), previewPhotos.length) }"
              :aria-label="`Buka foto ${Number(i) + 1} dari ${previewPhotos.length}${img.caption ? `: ${img.caption}` : ''}`"
              @click="openLightboxModal(photos, Number(i), article.title)"
            >
              <AppImg
                :src="useImageUrl(img.url)"
                :alt="img.caption || article.title"
                img-class="transition-transform duration-500 ease-out brightness-95 group-hover:scale-105 group-hover:brightness-100"
                class="absolute inset-0 h-full w-full"
              />
              <span v-if="img.caption" class="art-shot__caption">
                {{ img.caption }}
              </span>
            </button>
          </div>

          <button
            v-if="photos.length > previewPhotos.length"
            type="button"
            class="art-more"
            @click="openLightboxModal(photos, previewPhotos.length, article.title)"
          >
            <Icon name="material-symbols:photo-library-rounded" aria-hidden="true" />
            Lihat semua {{ photos.length }} foto
          </button>
        </template>
      </div>
    </article>

    <DokumLightboxModal />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { parseArticleSlug, articleSlug } from '~/utils/articleSlug'
import { formatRangeIndo } from '~/utils/formatDate'

const route  = useRoute()
const cfg    = useRuntimeConfig()
const apiBase = cfg.public.apiBase as string
const siteUrl = cfg.public.siteUrl as string
const siteName = cfg.public.siteName as string

const slugParam = computed(() => String(route.params.slug || ''))
const articleId = computed(() => parseArticleSlug(slugParam.value))

// ── SSR-only SEO fetch ───────────────────────────────────────────────────────
// Runs on the server to populate <head> og: tags for social sharing / crawlers.
// On the client we intentionally never re-fetch (getCachedData always returns
// a non-undefined value so Nuxt treats it as "already have data").
// If the server-side $fetch fails, ssrData is null and we fall back to the
// reactive seoArticle computed below once the client loads the content.
const { data: ssrData } = useAsyncData(
  `doc-article-${articleId.value}`,
  () => $fetch<any[]>(`${apiBase}/api/dokumentasi`)
    .then(list => (Array.isArray(list) ? list.find((a: any) => a.id === articleId.value) ?? null : null))
    .catch(() => null),
  {
    default: () => null as any,
    lazy: true,
    // Never refetch on client — either use SSR payload or null.
    // Returning null (not undefined) tells Nuxt "I have a value, don't fetch".
    getCachedData: (key, nuxtApp) => {
      if (import.meta.client) {
        const v = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
        return v !== undefined ? v : null
      }
      return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    },
  },
)

// ── Content fetch ────────────────────────────────────────────────────────────
// Use module-level singleton from useDokumentasi so:
//   • Client nav from list page  → data already loaded, zero delay
//   • Direct URL / new tab       → onMounted fetches on the client, bypassing
//     the SSR payload cache that would otherwise permanently block a refetch
//     when the server-side $fetch fails (api unreachable from SSR process).
const { loading, dokumentasi, loadDokumentasiData, openLightboxModal } = useDokumentasi()

onMounted(() => {
  loadDokumentasiData()
})

// pending = true while data hasn't arrived yet (loading starts as true in module)
const pending = computed(() => loading.value)

const article = computed<any | null>(() => {
  if (!Array.isArray(dokumentasi.value) || isNaN(articleId.value)) return null
  return dokumentasi.value.find((a: any) => a.id === articleId.value) ?? null
})

// seoArticle: SSR data takes priority (guarantees og: tags in initial HTML when
// the API is reachable from the server). Falls back to the client-loaded article
// once useDokumentasi finishes, so meta tags stay up-to-date reactively.
const seoArticle = computed(() => ssrData.value || article.value)
const photos        = computed(() => article.value?.images || [])
const hasPhotos     = computed(() => Array.isArray(photos.value) && photos.value.length > 0)
const previewPhotos = computed(() => photos.value.slice(0, 8))

const gridClass = computed(() => {
  const count = previewPhotos.value.length
  if (count === 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-2'
  if (count === 3) return 'grid-cols-2 md:grid-cols-3'
  if (count === 4) return 'grid-cols-2 md:grid-cols-2'
  return 'grid-cols-2 md:grid-cols-3'
})

const isHeroPhoto = (index: number, total: number) => {
  if (index !== 0) return false
  if (total === 3) return true
  if (total >= 5) return true
  return false
}

const renderedNarasi = computed(() => {
  if (!article.value) return ''
  const html = article.value.narasi
  if (html && String(html).trim()) return html
  return article.value.description ? `<p>${article.value.description}</p>` : ''
})

// ── Auto SEO from article data ──────────────────────────────────────────────
/** Extract a clean, ~155-char description from HTML/plain text. */
function extractDescription(article: any): string {
  if (!article) return ''
  const fromText = (s?: string) => (s || '')
    .replace(/<[^>]+>/g, ' ') // strip HTML
    .replace(/\s+/g, ' ')
    .trim()
  const candidate =
    fromText(article.description) ||
    fromText(article.narasi) ||
    fromText(article.narasi_title) ||
    article.title
  if (candidate.length <= 155) return candidate
  return candidate.substring(0, 152).replace(/\s+\S*$/, '') + '…'
}

const articleDescription = computed(() => extractDescription(seoArticle.value))

const articleUrl = computed(() => {
  if (!seoArticle.value) return `${siteUrl}/dokumentasi`
  return `${siteUrl}/dokumentasi/${articleSlug(seoArticle.value)}`
})

const articleImage = computed(() => {
  if (!seoArticle.value?.thumbnail) return `${siteUrl}/og-default.png`
  const t = seoArticle.value.thumbnail as string
  if (t.startsWith('http')) return t
  // Backend serves uploads from `${apiBase}/uploads/...`
  const path = t.startsWith('/') ? t : `/${t}`
  return `${apiBase}${path}`
})

useSeoMeta({
  title:           () => seoArticle.value?.title || 'Artikel',
  description:     () => articleDescription.value,
  ogTitle:         () => seoArticle.value?.title ? `${seoArticle.value.title} — ${siteName}` : siteName,
  ogDescription:   () => articleDescription.value,
  ogType:          'article',
  ogUrl:           () => articleUrl.value,
  ogImage:         () => articleImage.value,
  twitterCard:     'summary_large_image',
  twitterTitle:    () => seoArticle.value?.title || siteName,
  twitterDescription: () => articleDescription.value,
  twitterImage:    () => articleImage.value,
  articlePublishedTime: () => seoArticle.value?.start_date || undefined,
  articleSection:  () => seoArticle.value?.tag_text || undefined,
})

useHead({
  link: [
    { rel: 'canonical', href: () => articleUrl.value },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => seoArticle.value ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: seoArticle.value.title,
        description: articleDescription.value,
        image: [articleImage.value],
        datePublished: seoArticle.value.start_date,
        dateModified: seoArticle.value.start_date,
        articleSection: seoArticle.value.tag_text || 'Kegiatan',
        url: articleUrl.value,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl.value,
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/og-default.png`,
          },
        },
      }) : '{}',
    },
  ],
})

definePageMeta({
  pageTransition: { name: 'article-slide', mode: 'out-in' },
  // 404 if slug doesn't parse to a valid id
  validate: async (route) => {
    const id = parseArticleSlug(String(route.params.slug || ''))
    return !isNaN(id) && id > 0
  },
})
</script>

<style>
/* ── Page frame ──────────────────────────────────────── */
.art-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 6rem 1rem 4rem;
}
@media (min-width: 768px) {
  .art-page {
    padding: 7rem 1.5rem 5rem;
  }
}

.art-back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.18s ease;
}
.art-back:hover {
  color: var(--accent);
}
.art-back:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 4px;
}

/* ── Card shell ──────────────────────────────────────── */
.art-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: var(--bg-card);
  box-shadow: var(--shadow-lg);
}

/* ── Hero ────────────────────────────────────────────── */
.art-hero {
  position: relative;
  height: 300px;
  overflow: hidden;
  background: var(--bg-card-2);
}
@media (min-width: 768px) {
  .art-hero {
    height: 420px;
  }
}
.art-hero__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.art-hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(6, 11, 20, 0.94) 0%,
    rgba(6, 11, 20, 0.66) 32%,
    rgba(6, 11, 20, 0.12) 72%,
    rgba(6, 11, 20, 0.04) 100%
  );
}
.art-hero__body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1.5rem;
}
@media (min-width: 768px) {
  .art-hero__body {
    padding: 2.5rem;
  }
}
.art-hero__tag {
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.art-hero__title {
  margin: 0;
  max-width: 30ch;
  font-size: clamp(1.5rem, 4.5vw, 2.5rem);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: #fff;
  text-wrap: balance;
}
.art-hero__date {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.86);
  font-variant-numeric: tabular-nums;
}

/* ── Body ────────────────────────────────────────────── */
.art-body {
  padding: 1.75rem 1.5rem 2rem;
}
@media (min-width: 768px) {
  .art-body {
    padding: 2.5rem 2.5rem 2.75rem;
  }
}
.art-subhead {
  margin: 0 0 1.25rem;
  font-size: clamp(1.25rem, 3vw, 1.6rem);
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.025em;
  color: var(--text-main);
  text-wrap: balance;
}

/* ── Narasi ──────────────────────────────────────────── */
.art-prose {
  max-width: 68ch;
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--text-main);
}
.art-prose p {
  margin: 0 0 1.1em;
}
.art-prose p:last-child {
  margin-bottom: 0;
}
.art-prose h2 {
  margin: 2rem 0 0.75rem;
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--text-main);
}
.art-prose h3 {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.015em;
  color: var(--text-main);
}
.art-prose a {
  color: var(--accent);
  text-underline-offset: 3px;
}
.art-prose img {
  display: block;
  max-width: 100%;
  margin: 1.5rem 0;
  border-radius: 16px;
}
.art-prose blockquote {
  margin: 1.5rem 0;
  padding: 0.25rem 0 0.25rem 1.1rem;
  border-left: 2px solid var(--accent);
  font-style: italic;
  color: var(--text-muted);
}
.art-prose ul,
.art-prose ol {
  margin: 0 0 1.1em;
  padding-left: 1.4rem;
}
.art-prose li {
  margin-bottom: 0.35em;
}
.art-prose li::marker {
  color: var(--accent);
}
.art-prose strong {
  font-weight: 700;
}
.art-prose hr {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}

.art-credit {
  max-width: 68ch;
  margin: 1.75rem 0 0;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border);
  font-size: 0.875rem;
  font-style: italic;
  line-height: 1.65;
  color: var(--text-muted);
}

/* ── Gallery ─────────────────────────────────────────── */
.art-gallery__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin: 2.5rem 0 1.25rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}
.art-gallery__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-main);
}
.art-gallery__count {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.art-grid {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.art-shot {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 16px;
  background: var(--bg-card-2);
  cursor: pointer;
}
.art-shot:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.art-shot::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(6, 11, 20, 0);
  transition: background-color 0.3s ease;
  pointer-events: none;
}
.art-shot:hover::after {
  background: rgba(6, 11, 20, 0.22);
}
.art-shot--lead {
  grid-column: span 2;
  grid-row: span 2;
}
@media (max-width: 767px) {
  .art-shot--lead {
    grid-column: span 2;
    grid-row: span 1;
    aspect-ratio: 16 / 10;
  }
}
.art-shot__caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 2rem 0.75rem 0.7rem;
  background: linear-gradient(to top, rgba(6, 11, 20, 0.86), rgba(6, 11, 20, 0));
  color: #fff;
  font-size: 0.75rem;
  line-height: 1.4;
  text-align: left;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.art-shot:hover .art-shot__caption,
.art-shot:focus-visible .art-shot__caption {
  opacity: 1;
  transform: translateY(0);
}

.art-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-card-2);
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}
.art-more:hover {
  background: var(--accent-soft);
  border-color: rgba(99, 102, 241, 0.3);
  color: var(--accent);
}
.art-more:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* ── Not found ───────────────────────────────────────── */
.art-empty {
  padding: 4rem 1rem;
  text-align: center;
}
.art-empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg-card);
  color: var(--text-muted);
  font-size: 1.6rem;
}
.art-empty__title {
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-main);
}
.art-empty__text {
  margin: 0 auto 1.75rem;
  max-width: 28rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--text-muted);
}
.art-empty__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.4rem;
  border-radius: 16px;
  background: var(--accent);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.18s ease;
}
.art-empty__cta:hover {
  background: var(--accent-hover);
}
.art-empty__cta:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

/* ── Skeleton ────────────────────────────────────────── */
.art-skel__hero {
  display: flex;
  align-items: flex-end;
  background: linear-gradient(to right, var(--bg-card-2) 0%, var(--bg-card) 50%, var(--bg-card-2) 100%);
  background-size: 800px 100%;
  animation: artShimmer 1.5s infinite linear;
}
.art-skel__lines {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
  padding: 1.5rem;
}
@media (min-width: 768px) {
  .art-skel__lines {
    padding: 2.5rem;
  }
}
.art-skel__pill,
.art-skel__title,
.art-skel__meta,
.art-skel__h,
.art-skel__p,
.art-skel__tile {
  display: block;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.14);
  animation: artPulse 1.6s ease-in-out infinite;
}
.art-skel__pill { width: 5rem; height: 1.35rem; border-radius: 10px; }
.art-skel__title { width: min(80%, 26rem); height: 2.25rem; }
.art-skel__meta { width: 12rem; height: 0.9rem; }
.art-skel__h { width: 60%; height: 1.6rem; margin-bottom: 1.25rem; }
.art-skel__p { width: 100%; height: 0.85rem; margin-bottom: 0.7rem; }
.art-skel__p--short { width: 65%; }
.art-skel__grid { margin-top: 2rem; }
.art-skel__tile {
  aspect-ratio: 1 / 1;
  border-radius: 16px;
}
@keyframes artShimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes artPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

@media (prefers-reduced-motion: reduce) {
  .art-skel__hero,
  .art-skel__pill,
  .art-skel__title,
  .art-skel__meta,
  .art-skel__h,
  .art-skel__p,
  .art-skel__tile {
    animation: none;
  }
  .art-shot__caption {
    transition: none;
  }
}
</style>
