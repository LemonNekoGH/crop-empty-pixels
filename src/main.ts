export default function main(origin: HTMLCanvasElement) {
  const originWidth = origin.width
  const originHeight = origin.height

  const rawImgData = origin.getContext('2d')!.getImageData(0, 0, originWidth, originHeight).data

  // 旋转 270 度之后的图片
  const rotatedImgData: number[] = []
  for (let y = 0; y < originWidth * 4; y += 4) {
    for (let x = 0; x < originHeight * 4; x += 4) {
      const position = x * originWidth - y
      rotatedImgData.push(rawImgData[position], rawImgData[position + 1], rawImgData[position + 2], rawImgData[position + 3])
    }
  }

  let top = 0
  // 检测上方边界
  for (let y = 0; y < originHeight * 4; y += 4) {
    for (let x = 0; x < originWidth * 4; x += 4) {
      const index = y * originWidth + x
      const r = rawImgData[index];
      const g = rawImgData[index + 1];
      const b = rawImgData[index + 2];
      const a = rawImgData[index + 3];
      if (r || g || b || a) {
        // 不是空像素，标记高度
        console.log(`%c top fist non empty pixel detected, x: ${x / 4}, y: ${y / 4}, r: ${r}, g: ${g}, b: ${b}, a: ${a}`, `background:rgba(${r},${g},${b},${a});color:white`)
        top = y / 4
        y = originHeight * 4
        break
      }
    }
  }
  // 检测下方边界
  let bottom = 0
  for (let y = originHeight * 4 - 4; y > 0; y -= 4) {
    for (let x = originWidth * 4 - 4; x > 0; x -= 4) {
      const index = y * originWidth + x
      const r = rawImgData[index];
      const g = rawImgData[index + 1];
      const b = rawImgData[index + 2];
      const a = rawImgData[index + 3];
      if (r || g || b || a) {
        // 不是空像素，标记高度
        console.log(`%c bottom fist non empty pixel detected, x: ${x / 4}, y: ${y / 4}, r: ${r}, g: ${g}, b: ${b}, a: ${a}`, `background:rgba(${r},${g},${b},${a});color:white`)
        bottom = y / 4
        y = 0
        break
      }
    }
  }
  // 检测右侧边界
  let right = 0
  for (let y = 0; y < originWidth * 4; y += 4) {
    for (let x = 0; x < originHeight * 4; x += 4) {
      const index = y * originHeight + x
      const r = rotatedImgData[index];
      const g = rotatedImgData[index + 1];
      const b = rotatedImgData[index + 2];
      const a = rotatedImgData[index + 3];
      if (r || g || b || a) {
        // 不是空像素，标记高度
        console.log(`%c right fist non empty pixel detected, x: ${x / 4}, y: ${y / 4}, r: ${r}, g: ${g}, b: ${b}, a: ${a}`, `background:rgba(${r},${g},${b},${a});color:white`)
        right = originWidth - y / 4
        y = originWidth * 4
        break
      }
    }
  }
  // 检测左侧边界
  let left = 0
  for (let y = originWidth * 4 - 4; y > 0; y -= 4) {
    for (let x = originHeight * 4 - 4; x > 0; x -= 4) {
      const index = y * originHeight + x
      const r = rotatedImgData[index];
      const g = rotatedImgData[index + 1];
      const b = rotatedImgData[index + 2];
      const a = rotatedImgData[index + 3];
      if (r || g || b || a) {
        // 不是空像素，标记高度
        console.log(`%c left fist non empty pixel detected, x: ${x / 4}, y: ${y / 4}, r: ${r}, g: ${g}, b: ${b}, a: ${a}`, `background:rgba(${r},${g},${b},${a});color:white`)
        left = originWidth - y / 4
        y = 0
        break
      }
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
