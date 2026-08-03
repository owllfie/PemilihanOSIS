<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1f3a]/35">
      <div class="bg-white border border-[#d8e2ee] rounded-2xl max-w-lg w-full p-6 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-4 border-b border-[#d8e2ee]">
          <h3 class="text-lg font-bold text-[#0b1f3a]">{{ title }}</h3>
          <button @click="$emit('close')" class="text-[#52677d] hover:text-[#0b1f3a] text-xl font-bold cursor-pointer">&times;</button>
        </div>
        <div class="py-4 max-h-[70vh] overflow-y-auto">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="pt-4 border-t border-[#d8e2ee] flex justify-end space-x-3">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
});

defineEmits(['close']);
</script>
