<template>
  <div
    ref="elementRef"
    :class="['absolute transition-transform duration-75 will-change-transform', className]"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  depth: {
    type: Number,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
});

const elementRef = ref(null);
const context = inject('floatingContext', null);
const id = Math.random().toString(36).substring(7);

onMounted(() => {
  if (context && elementRef.value) {
    context.registerElement(id, elementRef.value, props.depth);
  } else if (!context) {
    console.warn('FloatingElement must be placed inside a ParallaxFloating parent component.');
  }
});

onUnmounted(() => {
  if (context) {
    context.unregisterElement(id);
  }
});
</script>
