import { ref } from 'vue'

// ─── Module-level singleton state ─────────────────────────────────────────────
const loading       = ref(true)
const dokumentasi   = ref<any[]>([])

const selectedPhotos       = ref<any[]>([])
const selectedPhotoIndex   = ref(0)
const lightboxTitle        = ref('')
const isLightboxModalOpen  = ref(false)

let _loaded = false

// ─── Composable (auto-imported by Nuxt) ──────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDokumentasi() {
  const { fetchDokumentasi } = useApi()

  const loadDokumentasiData = async (force = false) => {
    if (_loaded && !force) return
    loading.value = true
    try {
      const data = await fetchDokumentasi()
      dokumentasi.value = Array.isArray(data) ? data : []
    } catch (e) {
      console.error('Failed to load dokumentasi:', e)
      dokumentasi.value = []
    } finally {
      loading.value = false
      _loaded = true
    }
  }

  // ── Lightbox modal ──────────────────────────────────
  const openLightboxModal = (photos: any[], startIndex = 0, title = '') => {
    selectedPhotos.value      = photos
    selectedPhotoIndex.value  = startIndex
    lightboxTitle.value       = title
    isLightboxModalOpen.value = true
  }

  const closeLightboxModal = () => {
    isLightboxModalOpen.value = false
  }

  return {
    loading,
    dokumentasi,
    loadDokumentasiData,

    selectedPhotos,
    selectedPhotoIndex,
    lightboxTitle,
    isLightboxModalOpen,
    openLightboxModal,
    closeLightboxModal,
  }
}
