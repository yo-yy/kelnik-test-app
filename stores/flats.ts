// stores/flats.ts
import { defineStore } from 'pinia'

export type Flat = {
  id: number
  rooms: number
  area: number
  floor: number
  floors: number
  price: number
  plan: string
}

type FlatsResponse = { items: Flat[]; total: number; nextOffset: number | null }

export const useFlatsStore = defineStore('flats', {
  state: () => ({
    items: [] as Flat[],
    total: 0,
    offset: 0,
    limit: 20,
    loading: false,
    done: false,
    error: '' as string
  }),
  actions: {
    async loadInitial() {
      this.items = []
      this.total = 0
      this.offset = 0
      this.done = false
      this.error = ''
      await this.loadMore(true)
    },
    async loadMore(reset = false) {
      if (this.loading || this.done) return
      this.loading = true
      try {
        const payload = await $fetch<FlatsResponse>('/api/flats', {
          params: { offset: this.offset, limit: this.limit }
        })

        if (reset) this.items = []
        this.items.push(...payload.items)
        this.total = payload.total
        this.offset = payload.nextOffset ?? this.offset
        this.done = payload.nextOffset == null
      } finally {
        this.loading = false
      }
    }
  }
})
