// server/api/flats.get.ts
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { getQuery } from 'h3'

type Flat = {
  id: number
  rooms: number
  area: number
  floor: number
  floors: number
  price: number
  plan: string
}

const filePath = join(process.cwd(), 'server', 'data', 'data.json')
let cache: { data: Flat[]; mtimeMs: number } | null = null

async function getData(): Promise<Flat[]> {
  const st = await stat(filePath)
  if (cache && cache.mtimeMs === st.mtimeMs) return cache.data
  const txt = await readFile(filePath, 'utf8')
  const data: Flat[] = JSON.parse(txt)
  cache = { data, mtimeMs: st.mtimeMs }
  return data
}

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const offset = Number(q.offset ?? 0)
  const limit = Math.min(Number(q.limit ?? 20), 100)

  const rooms = q.rooms ? String(q.rooms).split(',').map(Number) : null
  const areaMin = q.areaMin != null ? Number(q.areaMin) : -Infinity
  const areaMax = q.areaMax != null ? Number(q.areaMax) : Infinity
  const priceMin = q.priceMin != null ? Number(q.priceMin) : -Infinity
  const priceMax = q.priceMax != null ? Number(q.priceMax) : Infinity

  let items = await getData()

  if (rooms?.length) items = items.filter(f => rooms.includes(f.rooms))
  if (areaMin !== -Infinity || areaMax !== Infinity) {
    items = items.filter(f => f.area >= areaMin && f.area <= areaMax)
  }
  if (priceMin !== -Infinity || priceMax !== Infinity) {
    items = items.filter(f => f.price >= priceMin && f.price <= priceMax)
  }

  const total = items.length
  const slice = items.slice(offset, offset + limit)
  const nextOffset = offset + slice.length < total ? offset + slice.length : null

  return { items: slice, total, nextOffset }
})
