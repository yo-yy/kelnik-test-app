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

type Filters = {
  rooms: number[]        // [] = не выбрано, значит “все”
  area: [number, number] // мин/макс площади
  price: [number, number]// мин/макс цены
}

export const useFlatsStore = defineStore('flats', {
  state: () => ({
    items: [] as Flat[],
    total: 0,
    offset: 0,
    limit: 20,
    loading: false,
    done: false,
    error: '',
    filters: {
      rooms: [],
      area: [30, 120],
      price: [3000000, 10000000],
    } as Filters,
    _abortCtrl: null as AbortController | null,
  }),
  actions: {
    setFilters(partial: Partial<Filters>) {
      this.filters = { ...this.filters, ...partial }
      this.loadInitial()
    },

    resetFilters() {
      this.setFilters({
        rooms: [],
        area: [30, 120],
        price: [2000000, 15000000],
      })
    },

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

      if (this._abortCtrl) this._abortCtrl.abort()
      this._abortCtrl = new AbortController()

      try {
        const { rooms, area, price } = this.filters
        const params: Record<string, any> = {
          offset: this.offset,
          limit: this.limit,
        }
        if (rooms.length) params.rooms = rooms.join(',')
        if (area) { params.areaMin = area[0]; params.areaMax = area[1] }
        if (price) { params.priceMin = price[0]; params.priceMax = price[1] }

        const payload = await $fetch<FlatsResponse>('/api/flats', {
          params,
          signal: this._abortCtrl.signal,
        })

        if (reset) this.items = []
        this.items.push(...payload.items)
        this.total = payload.total
        this.offset = payload.nextOffset ?? 0
        this.done = payload.nextOffset == null
      } catch (e: any) {
        if (e?.name !== 'AbortError') this.error = e?.message || 'Ошибка загрузки'
      } finally {
        this.loading = false
      }
    },
  },
})