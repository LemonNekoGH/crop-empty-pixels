export default function main(origin: HTMLCanvasElement) {
  const originWidth = origin.width
  const originHeight = origin.height

  const rawImgData = origin.getContext('2d')!.getImageData(0, 0, originWidth, originHeight).data

  let top = origin.height / 2
  let bottom = origin.height / 2
  let left = origin.width / 2
  let right = origin.width / 2

  for (let y = 0; y < originHeight; y++) {
    for (let x = 0; x < originWidth; x++) {
      const a = rawImgData[originWidth * y * 4 + x * 4 + 3]
      if (a === 0) {
        continue
      }

      if (x < left) { left = x }
      if (x > right) { right = x}
      if (y < top) { top = y }
      if (y > bottom) { bottom = y }
    }
  }

  const width = right - left
  const height = bottom - top

  // 开始裁剪
  console.debug(`before crop length: ${rawImgData.length / 4}`)
  const result: number[] = []

  // 画到 canvas 上
  const cropped = document.createElement('canvas')
  cropped.style.transform = 'scale(0.25)'
  cropped.style.transformOrigin = 'top left'
  cropped.width = width
  cropped.height = height
  const croppedCtx = cropped.getContext('2d')!

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const position = (y + top) * originWidth * 4 + (x + left) * 4
      const r = rawImgData[position]
      const g = rawImgData[position + 1]
      const b = rawImgData[position + 2]
      const a = rawImgData[position + 3]
      result.push(r, g, b, a)
      croppedCtx.fillStyle = `rgba(${r},${g},${b},${a})`
      croppedCtx.fillRect(x, y, 1, 1)
    }
  }

  console.debug(`after crop length: ${result.length / 4}, width: ${width}, height: ${height}`)
  return cropped
}
