<template>
  <div class="bg-white dark:bg-[#0f172a] border border-[#d8e2ee] dark:border-[#1e293b] rounded-2xl overflow-hidden shadow-sm hover:border-[#9fb8d4] dark:hover:border-[#334155] transition-all duration-300 flex flex-col">
    <!-- Header Badge -->
    <div class="bg-[#f8fafc] dark:bg-[#1e293b] px-5 py-3 border-b border-[#d8e2ee] dark:border-[#334155] flex items-center justify-between">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#0b1f3a] dark:bg-slate-200 text-white dark:text-[#0b1f3a] shadow-sm">
        Paslon #{{ candidate.nomor_urut }}
      </span>
      <span v-if="showVotes" class="text-xs font-semibold text-[#334e68] dark:text-slate-300 bg-[#e8eef6] dark:bg-[#334155] px-2.5 py-1 rounded-lg">
        {{ candidate.total_suara }} Suara
      </span>
    </div>

    <!-- Candidate Photo -->
    <div class="h-48 bg-white dark:bg-[#1e293b] relative overflow-hidden flex items-center justify-center">
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
        <h3 class="text-lg font-bold text-[#0b1f3a] dark:text-slate-100 leading-tight">
          {{ candidate.ketua_nama }}
        </h3>
        <p class="text-xs text-[#164574] dark:text-blue-400 font-semibold mt-0.5">Calon Ketua OSIS</p>
        
        <div class="my-3 border-t border-[#d8e2ee] dark:border-[#334155] pt-3">
          <h4 class="text-md font-bold text-[#102a44] dark:text-slate-200 leading-tight">
            {{ candidate.wakil_nama }}
          </h4>
          <p class="text-xs text-[#1f5c99] dark:text-blue-400 font-semibold mt-0.5">Calon Wakil Ketua OSIS</p>
        </div>

        <div class="space-y-2 mt-4 text-xs">
          <div>
            <span class="font-bold text-[#52677d] dark:text-slate-400 uppercase tracking-wider block">Visi:</span>
            <p class="text-[#334e68] dark:text-slate-300 line-clamp-2 mt-0.5">{{ candidate.visi || 'Belum diisi' }}</p>
          </div>
          <div>
            <span class="font-bold text-[#52677d] dark:text-slate-400 uppercase tracking-wider block">Misi:</span>
            <p class="text-[#334e68] dark:text-slate-300 line-clamp-3 mt-0.5 whitespace-pre-line">{{ candidate.misi || 'Belum diisi' }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="canVote" class="pt-2">
        <button
          @click="$emit('vote', candidate)"
          :disabled="disabled"
          class="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-[#0b1f3a] text-white dark:bg-slate-100 dark:text-[#0b1f3a] hover:bg-[#123a66] dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm cursor-pointer"
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
