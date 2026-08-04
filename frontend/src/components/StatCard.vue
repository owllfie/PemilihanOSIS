<template>
  <div class="bg-[#f8fafc] border border-[#d8e2ee] rounded-2xl p-5 shadow-sm hover:border-[#b9c8da] transition-all duration-300">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold text-[#52677d] uppercase tracking-wider">{{ title }}</p>
        <h3 class="text-2xl font-black text-[#0b1f3a] mt-1">{{ value }}</h3>
        <p v-if="subtitle" class="text-xs text-[#52677d] mt-1">{{ subtitle }}</p>
      </div>
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
        :class="iconBg || 'bg-[#123a66]/10 text-[#164574] border border-[#c8d8ea]'"
      >
        <slot name="icon"><ChartSpline class="w-6 h-6"></ChartSpline></slot>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ChartSpline } from 'lucide-vue-next';

defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
  iconBg: String,
});
</script>
