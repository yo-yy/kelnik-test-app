<template>
  <section>
    <div class="filter-panel">
      <div class="row fltr-btns">
        <template v-for="i in [1, 2, 3, 4]" :key="i">
          <button 
            class="fltr-btn round"
            :class="{ 'fltr-btn-active': roomsSelected.includes(i) }" 
            @click="toggleRoom(i)" >{{ i }}к</button>
        </template>
      </div>
      <div class="column fltr-sec">
        <span class="p3 text-light">Стоимость квартиры, ₽</span>
        <div class="row slider-text">
          <p>
            <span class="p3">от</span>
            <span class="text-bold">{{ formatPrice(localPrice[0]) }}</span>
          </p>
          <p>
            <span class="p3">до</span>
            <span class="text-bold">{{ formatPrice(localPrice[1]) }}</span>
          </p>
        </div>
        <Slider 
          v-model="localPrice" 
          :min="2000000" 
          :max="15000000" 
          :step="10000"
          :lazy="false"
          :tooltips="false" />
      </div>
      <div class="column fltr-sec">
        <span class="p3 text-light">Площадь, м<sup>2</sup></span>
        <div class="row slider-text">
          <p>
            <span class="p3">от</span>
            <span class="text-bold">{{ localArea[0] }}</span>
          </p>
          <p>
            <span class="p3">до</span>
            <span class="text-bold">{{ localArea[1] }}</span>
          </p>
        </div>
        <Slider 
          v-model="localArea" 
          :min="30" 
          :max="120" 
          :step="1"
          :lazy="false"
          :tooltips="false" />
      </div>
      <div class="clear-btn-row">
        <button class="clear-btn row" @click="onReset">
          <span class="p3">Сбросить параметры</span>
          <img src="/icons/close.svg" alt="close" width="8px">
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'
import { useFlatsStore } from '#imports'

const store = useFlatsStore()

const localPrice = ref<[number, number]>([...store.filters.price])
const localArea  = ref<[number, number]>([...store.filters.area])

const roomsSelected = computed(() => store.filters.rooms)

function formatPrice(v: number) {
  return new Intl.NumberFormat('ru-RU').format(v)
}

let t1: any = null
let t2: any = null
const DEBOUNCE = 250

watch(localPrice, (val) => {
  clearTimeout(t1)
  t1 = setTimeout(() => {
    store.setFilters({ price: val })
  }, DEBOUNCE)
}, { deep: true })

watch(localArea, (val) => {
  clearTimeout(t2)
  t2 = setTimeout(() => {
    store.setFilters({ area: val })
  }, DEBOUNCE)
}, { deep: true })

function toggleRoom(r: number) {
  const rooms = new Set(store.filters.rooms)
  rooms.has(r) ? rooms.delete(r) : rooms.add(r)
  store.setFilters({ rooms: Array.from(rooms).sort() })
}

function onReset() {
  store.resetFilters()
}
</script>