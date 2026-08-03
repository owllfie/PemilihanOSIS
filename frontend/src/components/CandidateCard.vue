<template>
  <div class="bg-white border border-[#d8e2ee] rounded-2xl overflow-hidden shadow-sm hover:border-[#9fb8d4] transition-all duration-300 flex flex-col">
    <!-- Header Badge -->
    <div class="bg-[#f8fafc] px-5 py-3 border-b border-[#d8e2ee] flex items-center justify-between">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#123a66] text-white shadow-sm">
        Paslon #{{ candidate.nomor_urut }}
      </span>
      <span v-if="showVotes" class="text-xs font-semibold text-[#334e68] bg-[#e8eef6] px-2.5 py-1 rounded-lg">
        {{ candidate.total_suara }} Suara
      </span>
    </div>

    <!-- Candidate Photo -->
    <div class="h-48 bg-white relative overflow-hidden flex items-center justify-center">
      <img
        v-if="candidate.foto"
        :src="candidate.foto.startsWith('http') ? candidate.foto : 'http://localhost:3000' + candidate.foto"
        alt="Foto Paslon"
        class="w-full h-full object-cover object-center"
      />
      <div v-else class="flex flex-col items-center justify-center text-[#6b7f95]">
        <span class="text-4xl">👥</span>
        <span class="text-xs mt-2">Belum ada foto</span>
      </div>
    </div>

    <!-- Details -->
    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div>
        <h3 class="text-lg font-bold text-[#0b1f3a] leading-tight">
          {{ candidate.ketua_nama }}
        </h3>
        <p class="text-xs text-[#164574] font-semibold mt-0.5">Calon Ketua OSIS</p>
        
        <div class="my-3 border-t border-[#d8e2ee] pt-3">
          <h4 class="text-md font-bold text-[#102a44] leading-tight">
            {{ candidate.wakil_nama }}
          </h4>
          <p class="text-xs text-[#1f5c99] font-semibold mt-0.5">Calon Wakil Ketua OSIS</p>
        </div>

        <div class="space-y-2 mt-4 text-xs">
          <div>
            <span class="font-bold text-[#52677d] uppercase tracking-wider block">Visi:</span>
            <p class="text-[#334e68] line-clamp-2 mt-0.5">{{ candidate.visi || 'Belum diisi' }}</p>
          </div>
          <div>
            <span class="font-bold text-[#52677d] uppercase tracking-wider block">Misi:</span>
            <p class="text-[#334e68] line-clamp-3 mt-0.5 whitespace-pre-line">{{ candidate.misi || 'Belum diisi' }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="canVote" class="pt-2">
        <button
          @click="$emit('vote', candidate)"
          :disabled="disabled"
          class="w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-[#0b1f3a] hover:bg-[#123a66] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm cursor-pointer"
        >
          Pilih Paslon ini
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  candidate: Object,
  canVote: Boolean,
  disabled: Boolean,
  showVotes: { type: Boolean, default: true },
});

defineEmits(['vote']);
</script>
