import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { deflateSync } from 'node:zlib'

const ICONS = [
  { size: 192, file: 'icon-192.png' },
  { size: 512, file: 'icon-512.png' },
]

const COLORS = {
  start: [17, 94, 89], // teal 900
  end: [244, 114, 182], // pink 400
}

const crcTable = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

const crc32 = (buffer) => {
  let crc = 0xffffffff
  for (let i = 0; i < buffer.length; i += 1) {
    const byte = buffer[i]
    crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff]
  }
  return (crc ^ 0xffffffff) >>> 0
}

const chunk = (type, data) => {
  const typeBuffer = Buffer.from(type, 'ascii')
  const length = data.length
  const chunkBuffer = Buffer.alloc(length + 12)
  chunkBuffer.writeUInt32BE(length, 0)
  typeBuffer.copy(chunkBuffer, 4)
  data.copy(chunkBuffer, 8)
  const crcInput = Buffer.concat([typeBuffer, data])
  chunkBuffer.writeUInt32BE(crc32(crcInput), length + 8)
  return chunkBuffer
}

const createPng = (size) => {
  const width = size
  const height = size
  const bytesPerPixel = 4
  const stride = width * bytesPerPixel + 1
  const raw = Buffer.alloc(stride * height)

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * stride
    raw[rowStart] = 0 // filter type 0
    for (let x = 0; x < width; x += 1) {
      const ratio = (x + y) / (width + height)
      const r = Math.round(COLORS.start[0] + (COLORS.end[0] - COLORS.start[0]) * ratio)
      const g = Math.round(COLORS.start[1] + (COLORS.end[1] - COLORS.start[1]) * ratio)
      const b = Math.round(COLORS.start[2] + (COLORS.end[2] - COLORS.start[2]) * ratio)
      const idx = rowStart + 1 + x * bytesPerPixel
      raw[idx] = r
      raw[idx + 1] = g
      raw[idx + 2] = b
      raw[idx + 3] = 255
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  const idat = deflateSync(raw)

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  return Buffer.concat([signature, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

const outDir = resolve('client', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

ICONS.forEach(({ size, file }) => {
  const png = createPng(size)
  const target = resolve(outDir, file)
  writeFileSync(target, png)
  console.log(`Generated ${file}`)
})
