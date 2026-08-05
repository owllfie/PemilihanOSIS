<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Selalu gunakan light mode
  document.documentElement.classList.remove('dark');
  localStorage.setItem('theme', 'light');
});
</script>

<template>
  <div class="min-h-screen transition-colors duration-300">
    <router-view />
  </div>
</template>