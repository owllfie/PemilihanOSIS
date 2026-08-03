<template>
  <div class="min-h-screen bg-[#eef3f8] text-[#0f2a4a] flex flex-col">
    <Navbar />
    <div class="flex flex-1">
      <Sidebar />
      <main class="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
</script>
