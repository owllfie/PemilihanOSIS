<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <div class="text-center space-y-2">
      <h2 class="text-3xl font-black text-[#0b1f3a]">Pemungutan Suara E-Voting OSIS</h2>
      <p class="text-xs text-[#52677d]">Pilih salah satu pasangan calon untuk menentukan kepemimpinan OSIS mendatang.</p>
    </div>

    <!-- Active Period Warning -->
    <div v-if="!voteStore.activePeriod" class="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-center shadow-sm">
      <span class="text-3xl block mb-2">🔒</span>
      <h3 class="text-lg font-bold">Periode Pemilihan Belum Dibuka</h3>
      <p class="text-xs text-[#334e68] mt-1">Pemungutan suara saat ini ditutup oleh panitia/admin. Silakan cek kembali nanti.</p>
    </div>

    <!-- Already Voted Status -->
    <div v-else-if="voteStore.hasVoted" class="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center shadow-sm space-y-3">
      <span class="text-4xl block">🎉</span>
      <h3 class="text-2xl font-black text-emerald-400">Suara Anda Telah Terrekam!</h3>
      <p class="text-sm text-[#102a44]">
        Terima kasih atas partisipasi Anda dalam Pemilihan Ketua OSIS.
      </p>
      <div class="inline-block p-4 rounded-2xl bg-white/95 border border-[#d8e2ee] text-left mt-2">
        <p class="text-xs text-[#52677d]">Paslon Pilihan Anda:</p>
        <p class="text-base font-bold text-[#0b1f3a] mt-0.5">{{ voteStore.voteDetails?.calon?.nama_paslon }}</p>
        <span class="text-[11px] text-[#6b7f95] block mt-1">Waktu: {{ new Date(voteStore.voteDetails?.waktu_vote).toLocaleString('id-ID') }}</span>
      </div>
    </div>

    <!-- Voting Available -->
    <div v-else class="space-y-6">
      <div class="p-4 rounded-2xl bg-[#123a66]/10 border border-[#c8d8ea] text-[#123a66] text-xs flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span>ℹ️</span>
          <span>Anda hanya dapat memilih <strong>1 kali</strong>. Pilihan bersifat rahasia dan tidak dapat diubah setelah dikonfirmasi.</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CandidateCard
          v-for="c in candidateStore.candidates"
          :key="c.calon_id"
          :candidate="c"
          :can-vote="true"
          :show-votes="false"
          @vote="confirmVote(c)"
        />
      </div>
    </div>

    <!-- Confirmation Modal -->
    <Modal :show="showConfirmModal" title="Konfirmasi Pilihan Suara" @close="showConfirmModal = false">
      <div class="text-center space-y-3 py-2">
        <span class="text-4xl block">🗳️</span>
        <h4 class="text-lg font-bold text-[#0b1f3a]">Apakah Anda yakin ingin memilih:</h4>
        <div class="p-4 rounded-2xl bg-[#f8fafc] border border-[#d8e2ee]">
          <span class="inline-block text-xs font-extrabold text-[#164574] uppercase tracking-widest">
            Paslon Nomor Urut #{{ selectedCandidate?.nomor_urut }}
          </span>
          <p class="text-base font-black text-[#0b1f3a] mt-1">
            {{ selectedCandidate?.ketua_nama }} & {{ selectedCandidate?.wakil_nama }}
          </p>
        </div>
        <p class="text-xs text-rose-400 font-semibold">⚠️ Setelah tombol konfirmasi diklik, pilihan Anda tidak dapat diubah kembali.</p>
      </div>

      <template #footer>
        <button @click="showConfirmModal = false" class="px-4 py-2 rounded-xl bg-[#f8fafc] hover:bg-[#e8eef6] text-[#334e68] text-xs font-bold cursor-pointer">Batal</button>
        <button @click="submitVoteAction" :disabled="submitting" class="px-5 py-2 rounded-xl bg-[#0b1f3a] hover:bg-[#123a66] text-white text-xs font-bold shadow-sm cursor-pointer">
          <span v-if="submitting">Menyimpan...</span>
          <span v-else>Ya, Saya Yakin Pilih Paslon Ini</span>
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useVoteStore } from '@/stores/vote';
import { useCandidateStore } from '@/stores/candidate';
import CandidateCard from '@/components/CandidateCard.vue';
import Modal from '@/components/Modal.vue';

const voteStore = useVoteStore();
const candidateStore = useCandidateStore();

const showConfirmModal = ref(false);
const selectedCandidate = ref(null);
const submitting = ref(false);

const confirmVote = (candidate) => {
  selectedCandidate.value = candidate;
  showConfirmModal.value = true;
};

const submitVoteAction = async () => {
  if (!selectedCandidate.value) return;
  submitting.value = true;
  try {
    await voteStore.submitVote(selectedCandidate.value.calon_id);
    showConfirmModal.value = false;
  } catch (err) {
    alert(err || 'Gagal menyimpan pilihan suara.');
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  await voteStore.fetchVoteStatus();
  await candidateStore.fetchCandidates();
});
</script>
