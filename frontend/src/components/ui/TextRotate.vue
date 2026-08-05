<template>
  <span :class="['inline-flex flex-wrap relative overflow-hidden', mainClassName]">
    <span class="sr-only">{{ texts[currentIndex] }}</span>
    <span class="flex flex-wrap" aria-hidden="true">
      <transition-group
        name="char-rotate"
        tag="span"
        class="relative flex flex-wrap"
      >
        <span
          v-for="(item, index) in splitElements"
          :key="currentIndex + '-' + index"
          class="char-item inline-block"
          :style="{ '--delay': `${getStaggerDelay(index)}s` }"
          :class="elementLevelClassName"
        >
          <span v-if="item.needsSpace" class="whitespace-pre">&nbsp;</span>
          <span v-else>{{ item.char }}</span>
        </span>
      </transition-group>
    </span>
  </span>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  texts: {
    type: Array,
    required: true,
  },
  rotationInterval: {
    type: Number,
    default: 2500,
  },
  staggerDuration: {
    type: Number,
    default: 0.03,
  },
  staggerFrom: {
    type: String,
    default: 'first', // 'first', 'last', 'center'
  },
  splitBy: {
    type: String,
    default: 'characters', // 'characters' or 'words'
  },
  mainClassName: {
    type: String,
    default: '',
  },
  elementLevelClassName: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['next']);
const currentIndex = ref(0);
let intervalId = null;

const splitIntoCharacters = (text) => {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
};

const splitElements = computed(() => {
  const currentText = props.texts[currentIndex.value] || '';
  
  if (props.splitBy === 'characters') {
    const chars = [];
    const words = currentText.split(' ');
    words.forEach((word, wordIdx) => {
      const wordChars = splitIntoCharacters(word);
      wordChars.forEach((char) => {
        chars.push({ char, needsSpace: false });
      });
      if (wordIdx !== words.length - 1) {
        chars.push({ char: ' ', needsSpace: true });
      }
    });
    return chars;
  } else if (props.splitBy === 'words') {
    return currentText.split(' ').map((word, wordIdx, arr) => ({
      char: word + (wordIdx !== arr.length - 1 ? ' ' : ''),
      needsSpace: false,
    }));
  }
  
  return [{ char: currentText, needsSpace: false }];
});

const getStaggerDelay = (index) => {
  const total = splitElements.value.length;
  if (props.staggerFrom === 'last') {
    return (total - 1 - index) * props.staggerDuration;
  } else if (props.staggerFrom === 'center') {
    const center = Math.floor(total / 2);
    return Math.abs(center - index) * props.staggerDuration;
  }
  return index * props.staggerDuration;
};

const next = () => {
  const nextIndex = (currentIndex.value + 1) % props.texts.length;
  currentIndex.value = nextIndex;
  emit('next', nextIndex);
};

onMounted(() => {
  intervalId = setInterval(next, props.rotationInterval);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.char-item {
  display: inline-block;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.char-rotate-enter-active {
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
  transition-delay: var(--delay);
}

.char-rotate-leave-active {
  transition: transform 0.35s ease-in, opacity 0.3s ease-in;
  transition-delay: var(--delay);
  position: absolute !important;
}

.char-rotate-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.char-rotate-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.char-rotate-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.char-rotate-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
