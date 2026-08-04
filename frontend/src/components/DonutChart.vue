<template>
  <div
    ref="containerRef"
    class="relative flex items-center justify-center"
    :style="{ width: size + 'px', height: size + 'px' }"
    @mouseleave="handleMouseLeave"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="overflow-visible -rotate-90"
    >
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="transparent"
        stroke="var(--color-border)"
        stroke-opacity="0.5"
        :stroke-width="strokeWidth"
      />

      <circle
        v-for="(segment, index) in visibleSegments"
        :key="segment.label || index"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="transparent"
        :stroke="segment.color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="getDashArray(segment)"
        :stroke-dashoffset="-getDashOffset(segment)"
        stroke-linecap="round"
        class="transition-all duration-200"
        :class="{ 'cursor-pointer': highlightOnHover }"
        :style="getSegmentStyle(segment)"
        @mouseenter="handleMouseEnter(segment)"
      />
    </svg>

    <div
      v-if="$slots.center"
      class="absolute flex flex-col items-center justify-center pointer-events-none"
      :style="{
        width: (size - strokeWidth * 2.5) + 'px',
        height: (size - strokeWidth * 2.5) + 'px',
      }"
    >
      <slot name="center" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    validator: (val) => val.every((s) => 'value' in s && 'color' in s && 'label' in s),
  },
  totalValue: { type: Number, default: null },
  size: { type: Number, default: 200 },
  strokeWidth: { type: Number, default: 20 },
  animationDuration: { type: Number, default: 1 },
  animationDelayPerSegment: { type: Number, default: 0.05 },
  highlightOnHover: { type: Boolean, default: true },
});

const emit = defineEmits(['segmentHover']);

const containerRef = ref(null);
const hoveredSegment = ref(null);

const internalTotalValue = computed(() => {
  if (props.totalValue != null) return props.totalValue;
  return props.data.reduce((sum, segment) => sum + segment.value, 0);
});

const radius = computed(() => props.size / 2 - props.strokeWidth / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);

const visibleSegments = computed(() => props.data.filter((s) => s.value > 0));

const cumulativePercentages = computed(() => {
  let cumulative = 0;
  return visibleSegments.value.map((segment) => {
    const percentage =
      internalTotalValue.value === 0
        ? 0
        : (segment.value / internalTotalValue.value) * 100;
    const offset = cumulative;
    cumulative += percentage;
    return { percentage, offset };
  });
});

function getDashArray(segment) {
  const idx = visibleSegments.value.indexOf(segment);
  const { percentage } = cumulativePercentages.value[idx];
  const dashLen = (percentage / 100) * circumference.value;
  return `${dashLen} ${circumference.value}`;
}

function getDashOffset(segment) {
  const idx = visibleSegments.value.indexOf(segment);
  const { offset } = cumulativePercentages.value[idx];
  return (offset / 100) * circumference.value;
}

function getSegmentStyle(segment) {
  const isActive = hoveredSegment.value?.label === segment.label;
  return {
    filter: isActive
      ? `drop-shadow(0px 0px 6px ${segment.color}) brightness(1.1)`
      : 'none',
    transform: isActive ? 'scale(1.03)' : 'scale(1)',
    transformOrigin: 'center',
    transition: 'filter 0.2s ease-out, transform 0.2s ease-out',
  };
}

function handleMouseEnter(segment) {
  hoveredSegment.value = segment;
  emit('segmentHover', segment);
}

function handleMouseLeave() {
  hoveredSegment.value = null;
  emit('segmentHover', null);
}
</script>
