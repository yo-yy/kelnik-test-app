<template>
  <section class="column gutter">
    <h1>Квартиры</h1>
    <div class="flats-table">
      <div class="text-light table-header">
        <div class="row">
          <span class="plan-col">Планировка</span>
          <span class="flat-col">Квартира</span>
          <span class="table-col">S, м<sup>2</sup></span>
          <span class="table-col">Этаж</span>
          <span class="table-col">Цена, ₽</span>
        </div>
      </div>
      <div class="table-body text-medium">
        <div class="row" v-for="flat in store.items" :key="flat.id">
          <div class="text-block">
            <div class="flat-col">{{ flat.rooms }}-комнатная №{{ flat.id }}</div>
            <div class="table-col">
              <span>{{ flat.area }}<span class="is-hidden-md"> м<sup>2</sup></span></span>
              <span>{{ flat.floor }}<span class="text-light"> из {{ flat.floors }}</span></span>
              <span>{{ formatPrice(flat.price) }}<span class="is-hidden-md"> ₽</span></span>
            </div>
          </div>
          <div class="plan-col"><img class="plan-img" :src="'/images/' + flat.plan" :alt="'Планировка' + flat.plan" loading="lazy"></img></div>
          </div>
      </div>
    </div>
    <button v-if="!store.done" class="more-btn rounded" :disabled="store.loading" @click="store.loadMore()">
      <span class="text-medium">Загрузить ещё</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFlatsStore } from '#imports'

const store = useFlatsStore()

onMounted(() => {
  store.loadInitial()
})

function formatPrice(v: number) {
  return new Intl.NumberFormat('ru-RU').format(v)
}
</script>