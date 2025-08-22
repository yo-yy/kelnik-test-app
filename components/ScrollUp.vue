<template>
  <button class="button" @click="toTop" v-show="visible"><img src="/icons/arrow-upward.svg" alt="Up"></button>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(true)

function toTop() {
  console.log("Top")
}
</script>