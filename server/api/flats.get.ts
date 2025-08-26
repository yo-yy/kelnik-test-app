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

  const afterRange = items.filter(f =>
    f.area  >= areaMin && f.area  <= areaMax &&
    f.price >= priceMin && f.price <= priceMax
  )

  const roomCounts: Record<number, number> = { 1:0, 2:0, 3:0, 4:0 }
  for (const f of afterRange) {
    if (roomCounts[f.rooms] != null) roomCounts[f.rooms]++
  }

  let filtered = afterRange
  if (rooms?.length) filtered = filtered.filter(f => rooms.includes(f.rooms))

  const total = filtered.length
  const slice = filtered.slice(offset, offset + limit)
  const nextOffset = offset + slice.length < total ? offset + slice.length : null

  return { items: slice, total, nextOffset, roomCounts }
})