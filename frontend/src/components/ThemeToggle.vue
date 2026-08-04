<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const applyTheme = (dark) => {
  isDark.value = dark
  const root = document.documentElement

  if (dark) {
    root.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    root.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    applyTheme(true)
  } else {
    applyTheme(false)
  }
})

const toggleTheme = () => {
  applyTheme(!isDark.value)
}
</script>

<template>
  <button 
    @click="toggleTheme" 
    class="theme-toggle-button p-2 rounded-lg font-medium transition-colors duration-200 border cursor-pointer flex items-center justify-center"
    title="Ganti Mode Tampilan"
  >
    <!-- Ikon Matahari (Mode Gelap aktif) -->
    <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>

    <!-- Ikon Bulan (Mode Terang aktif) -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  </button>
</template>
