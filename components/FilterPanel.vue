<template>
  <section>
    <div class="filter-panel">
      <div class="row fltr-btns">
        <template v-for="i in [1, 2, 3, 4]" :key="i">
          <button class="fltr-btn round">{{ i }}к</button>
        </template>
      </div>
      <div class="column fltr-sec">
        <span class="p3 text-light">Стоимость квартиры, ₽</span>
        <div class="row slider-text">
          <p>
            <span class="p3">от</span>
            <span class="text-bold">{{ formatPrice(price[0]) }}</span>
          </p>
          <p>
            <span class="p3">до</span>
            <span class="text-bold">{{ formatPrice(price[1]) }}</span>
          </p>
        </div>
        <Slider 
          v-model="price" 
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
            <span class="text-bold">{{ area[0] }}</span>
          </p>
          <p>
            <span class="p3">до</span>
            <span class="text-bold">{{ area[1] }}</span>
          </p>
        </div>
        <Slider 
          v-model="area" 
          :min="30" 
          :max="120" 
          :step="1"
          :lazy="false"
          :tooltips="false" />
      </div>
      <div class="clear-btn-row">
        <button class="clear-btn row">
          <span class="p3">Сбросить параметры</span>
          <img src="/icons/close.svg" alt="close" width="8px">
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'

const price = ref([3000000, 5000000])
const area = ref([50, 100])

function formatPrice(v: number) {
  return new Intl.NumberFormat('ru-RU').format(v)
}
</script>