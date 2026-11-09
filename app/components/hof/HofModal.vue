<template>
  <Transition name="hof-modal">
    <div
      v-if="isHofModalOpen"
      class="hof-modal-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="modalTitle"
      @click.self="closeHofModal"
    >
      <div ref="panel" class="hof-modal-panel" tabindex="-1">
        <header class="hof-modal-head">
          <div class="hof-modal-head-title">
            <span class="hof-modal-kicker" aria-hidden="true">
              <Icon name="material-symbols:auto-awesome" class="hof-modal-kicker-icon" />
            </span>
            <h3 class="hof-modal-title">{{ modalTitle }}</h3>
          </div>
          <button class="hof-modal-close" aria-label="Tutup" @click="closeHofModal">
            <Icon name="material-symbols:close" class="hof-modal-close-icon" />
          </button>
        </header>

        <div class="hof-modal-body">
          <!-- ── MEMBER PROFILE ───────────────────────────────── -->
          <div v-if="modalType === 'MEMBER_PROFILE'" class="hof-profile">
            <div class="hof-profile-avatar">
              <AppImg
                :src="useImageUrl(modalData?.foto, modalData?.nama)"
                :alt="modalData?.nama"
                rounded="full"
                loading="lazy"
                class="w-full h-full"
              />
              <span class="hof-profile-ring" />
            </div>
            <p class="hof-profile-role">{{ modalData?.jabatan }}</p>
            <h4 class="hof-profile-name">{{ modalData?.nama }}</h4>
            <p v-if="modalData?.motto" class="hof-profile-motto">“{{ modalData?.motto }}”</p>
          </div>

          <!-- ── PERIOD MEMBERS ───────────────────────────────── -->
          <div v-else-if="modalType === 'PERIOD_MEMBERS'" class="hof-members">
            <div
              v-for="m in (modalData?.members ?? modalData)"
              :key="m.id ?? m.nama"
              class="hof-member"
              :class="{ 'is-mpk': modalData?.org === 'MPK' }"
            >
              <button class="hof-member-card" @click="openMemberProfileModal(m)">
                <span class="hof-member-avatar">
                  <AppImg
                    :src="useImageUrl(m.foto, m.nama)"
                    :alt="m.nama"
                    rounded="full"
                    loading="lazy"
                    class="w-full h-full"
                  />
                  <span class="hof-member-ring" />
                </span>
                <span class="hof-member-role">{{ m.jabatan }}</span>
                <span class="hof-member-name">{{ m.nama }}</span>
              </button>
            </div>
          </div>

          <!-- ── OLDER PERIODS ────────────────────────────────── -->
          <div v-else-if="modalType === 'OLDER_PERIODS'" class="hof-older">
            <div v-for="g in modalData" :key="g.angkatan" class="hof-older-group">
              <div class="hof-older-year">Angkatan Ke-{{ g.angkatan }}</div>
              <button
                v-if="g.osis"
                class="hof-older-row"
                @click="openPeriodMembersModal(g.osis, 'OSIS', true)"
              >
                <span class="hof-older-org is-osis">OSIS</span>
                <span class="hof-older-info">
                  <span class="hof-older-name">Periode {{ g.osis.nama }}</span>
                  <span class="hof-older-meta">{{ g.osis.tahun }}</span>
                </span>
                <Icon name="material-symbols:chevron-right" class="hof-older-arrow" />
              </button>
              <button
                v-if="g.mpk"
                class="hof-older-row"
                @click="openPeriodMembersModal(g.mpk, 'MPK', true)"
              >
                <span class="hof-older-org is-mpk">MPK</span>
                <span class="hof-older-info">
                  <span class="hof-older-name">Periode {{ g.mpk.nama }}</span>
                  <span class="hof-older-meta">{{ g.mpk.tahun }}</span>
                </span>
                <Icon name="material-symbols:chevron-right" class="hof-older-arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useHof } from '~/composables/useHof'

const {
  isHofModalOpen,
  modalType,
  modalTitle,
  modalData,
  closeHofModal,
  openPeriodMembersModal,
  openMemberProfileModal,
} = useHof()

const panel = ref<HTMLElement | null>(null)

watch(isHofModalOpen, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isHofModalOpen.value) closeHofModal()
}

onMounted(() => {
  if (import.meta.client) window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})

// Move focus into the dialog when it opens.
watch(isHofModalOpen, (val) => {
  if (val && import.meta.client) {
    panel.value?.focus()
  }
})
</script>

<style scoped>
.hof-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 9, 26, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.hof-modal-panel {
  width: 100%;
  max-width: 820px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border, rgba(99, 102, 241, 0.11));
  border-radius: var(--radius-lg, 24px);
  box-shadow: var(--shadow-lg, 0 16px 48px rgba(99, 102, 241, 0.18));
  overflow: hidden;
  outline: none;
}

.hof-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border, rgba(99, 102, 241, 0.11));
}
.hof-modal-head-title {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.hof-modal-kicker {
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm, 10px);
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(160deg, #6366f1, #a855f7);
}
.hof-modal-kicker-icon { font-size: 17px; }
.hof-modal-title {
  margin: 0;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.01em;
  color: var(--text-main, #1c1a3e);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hof-modal-close {
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: var(--text-muted, #6b6882);
  background: var(--bg-card-2, #f8f7ff);
  transition: background 0.2s ease, color 0.2s ease;
}
.hof-modal-close:hover,
.hof-modal-close:focus-visible {
  background: var(--accent, #6366f1);
  color: #fff;
  outline: none;
}
.hof-modal-close-icon { font-size: 20px; }

.hof-modal-body {
  padding: 20px;
  overflow-y: auto;
}
.hof-modal-body::-webkit-scrollbar { width: 8px; }
.hof-modal-body::-webkit-scrollbar-thumb { background: var(--border, rgba(99, 102, 241, 0.2)); border-radius: 9999px; }

/* ── Profile ─────────────────────────────────────────────── */
.hof-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 12px 8px;
}
.hof-profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 18px;
}
.hof-profile-ring {
  position: absolute;
  inset: -5px;
  border-radius: 9999px;
  border: 2px solid rgba(99, 102, 241, 0.55);
  box-shadow: 0 0 26px rgba(99, 102, 241, 0.4);
  pointer-events: none;
}
.hof-profile-role {
  margin: 0 0 6px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent, #6366f1);
}
.hof-profile-name {
  margin: 0;
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--text-main, #1c1a3e);
}
.hof-profile-motto {
  margin: 14px 0 0;
  max-width: 460px;
  font-size: 0.94rem;
  font-style: italic;
  line-height: 1.75;
  color: var(--text-muted, #6b6882);
}

/* ── Members grid ────────────────────────────────────────── */
.hof-members {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}
.hof-member-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 7px;
  padding: 18px 10px;
  background: var(--bg-card-2, #f8f7ff);
  border: 1px solid var(--border, rgba(99, 102, 241, 0.11));
  border-radius: 16px;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
}
.hof-member-card:hover {
  background: var(--accent-soft, rgba(99, 102, 241, 0.08));
  border-color: rgba(99, 102, 241, 0.35);
  transform: translateY(-2px);
}
.hof-member-card:focus-visible {
  outline: 2px solid var(--accent, #6366f1);
  outline-offset: 2px;
}
.hof-member-avatar {
  position: relative;
  width: 60px;
  height: 60px;
}
.hof-member-ring {
  position: absolute;
  inset: -3px;
  border-radius: 9999px;
  border: 1.5px solid rgba(99, 102, 241, 0.4);
  pointer-events: none;
}
.hof-member.is-mpk .hof-member-ring { border-color: rgba(168, 85, 247, 0.45); }
.hof-member-role {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent, #6366f1);
}
.hof-member.is-mpk .hof-member-role { color: #a855f7; }
.hof-member-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main, #1c1a3e);
}

/* ── Older periods ───────────────────────────────────────── */
.hof-older {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.hof-older-group {
  border: 1px solid var(--border, rgba(99, 102, 241, 0.11));
  border-radius: var(--radius, 16px);
  overflow: hidden;
}
.hof-older-year {
  padding: 8px 14px;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted, #6b6882);
  background: var(--bg-card-2, #f8f7ff);
}
.hof-older-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  background: transparent;
  border: none;
  border-top: 1px solid var(--border, rgba(99, 102, 241, 0.08));
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
}
.hof-older-row:first-of-type { border-top: none; }
.hof-older-row:hover,
.hof-older-row:focus-visible {
  background: var(--accent-soft, rgba(99, 102, 241, 0.07));
  outline: none;
}
.hof-older-org {
  flex: none;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  border-radius: 9999px;
  padding: 3px 9px;
}
.hof-older-org.is-osis { background: #6366f1; }
.hof-older-org.is-mpk { background: #a855f7; }
.hof-older-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.hof-older-name {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--text-main, #1c1a3e);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hof-older-meta {
  font-size: 0.74rem;
  color: var(--text-muted, #6b6882);
}
.hof-older-arrow {
  font-size: 1.2rem;
  color: var(--text-subtle, #a09dbf);
}

/* ── Transition ──────────────────────────────────────────── */
.hof-modal-enter-active,
.hof-modal-leave-active { transition: opacity 0.24s ease; }
.hof-modal-enter-active .hof-modal-panel,
.hof-modal-leave-active .hof-modal-panel { transition: transform 0.26s cubic-bezier(0.16, 1, 0.3, 1); }
.hof-modal-enter-from,
.hof-modal-leave-to { opacity: 0; }
.hof-modal-enter-from .hof-modal-panel { transform: translateY(18px) scale(0.98); }
.hof-modal-leave-to .hof-modal-panel { transform: translateY(18px) scale(0.98); }
</style>