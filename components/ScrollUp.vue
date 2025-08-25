<template>
  <Transition name="fade">
    <button 
      class="btn-up round" 
      @click="toTop" 
      v-show="visible">
        <img src="/icons/arrow-upward.svg" alt="Up">
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleScroll() {
  visible.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>