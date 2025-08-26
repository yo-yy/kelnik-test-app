<template>
  <button class="table-col sort-btn"
          :class="{'sort-btn--active': modelValue !== 'none'}"
          @click="toggle">
    <p><span>{{ label }}</span></p>
    <span class="sort-icons">
      <img :src="upIcon" alt="Up" height="4">
      <img :src="downIcon" alt="Down" height="4">
    </span>
  </button>
</template>

<script setup lang="ts">
type State = 'none' | 'asc' | 'desc'

const props = defineProps<{
  label: string
  modelValue: State
}>()

const emit = defineEmits<{ (e:'update:modelValue', v:State): void }>()

function toggle() {
  // цикл: none → desc → asc → none
  const next: Record<State, State> = { none: 'desc', desc: 'asc', asc: 'none' }
  emit('update:modelValue', next[props.modelValue])
}

const upIcon = computed(() => {
  if (props.modelValue === 'asc') return '/icons/arr-up-green.svg'
  if (props.modelValue === 'desc') return '/icons/arr-up-lgrey.svg'
  return '/icons/arr-up-grey.svg'
})
const downIcon = computed(() => {
  if (props.modelValue === 'desc') return '/icons/arr-down-green.svg'
  if (props.modelValue === 'asc') return '/icons/arr-down-lgrey.svg'
  return '/icons/arr-down-grey.svg'
})
</script>