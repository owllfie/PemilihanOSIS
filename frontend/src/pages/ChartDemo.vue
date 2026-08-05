<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-[#0b1f3a] border-l-4 border-l-[#0b1f3a] dark:border-l-blue-400 border-y border-r border-[#c8d8ea] dark:border-[#1a365d] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm transition-colors duration-300">
      <div class="relative z-10">
        <h2 class="text-2xl sm:text-3xl font-black text-[#0b1f3a] dark:text-white">Chart Demos</h2>
        <p class="text-sm text-[#52677d] dark:text-gray-400 mt-1">DonutChart &amp; ChartsPreview (Line Chart Realtime) converted to Vue 3</p>
      </div>
    </div>

    <!-- Donut Chart Demo -->
    <section>
      <h3 class="text-lg font-bold text-[#0b1f3a] dark:text-white mb-4">Donut Chart</h3>
      <DonutChartDemo />
    </section>

    <!-- Line Chart Demo (Realtime) -->
    <section>
      <h3 class="text-lg font-bold text-[#0b1f3a] dark:text-white mb-4">Line Chart Realtime</h3>
      <div class="bg-white dark:bg-[#0b1f3a] border border-[#d8e2ee] dark:border-[#1a365d] rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <ChartsPreview />
      </div>
    </section>
  </div>
</template>

<script setup>
import DonutChartDemo from '@/components/DonutChartDemo.vue';
import ChartsPreview from '@/components/ChartsPreview.vue';
</script>
