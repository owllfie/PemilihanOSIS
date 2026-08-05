<template>
  <div
    ref="containerRef"
    :class="['relative w-full h-full overflow-hidden', className]"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  className: {
    type: String,
    default: '',
  },
  sensitivity: {
    type: Number,
    default: 0.6,
  },
  easingFactor: {
    type: Number,
    default: 0.08,
  },
});

const containerRef = ref(null);
const registeredElements = ref([]);
const mousePos = { x: 0, y: 0 };
let animationFrameId = null;

const handleMouseMove = (e) => {
  if (!containerRef.value) return;
  const rect = containerRef.value.getBoundingClientRect();
  
  // Calculate relative mouse coordinates: range [-0.5, 0.5]
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  
  mousePos.x = x;
  mousePos.y = y;
};

const registerElement = (id, el, depth) => {
  registeredElements.value.push({
    id,
    el,
    depth,
    currentX: 0,
    currentY: 0,
  });
};

const unregisterElement = (id) => {
  registeredElements.value = registeredElements.value.filter(item => item.id !== id);
};

// Provide context so child components can register themselves
provide('floatingContext', {
  registerElement,
  unregisterElement,
});

const animate = () => {
  const targetX = mousePos.x * props.sensitivity * 100;
  const targetY = mousePos.y * props.sensitivity * 100;

  registeredElements.value.forEach((item) => {
    // Smooth interpolation (lerp)
    item.currentX += (targetX * item.depth - item.currentX) * props.easingFactor;
    item.currentY += (targetY * item.depth - item.currentY) * props.easingFactor;
    
    // Apply 3D translate for GPU acceleration
    item.el.style.transform = `translate3d(${item.currentX}px, ${item.currentY}px, 0)`;
  });

  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>
