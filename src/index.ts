export default function cropImg(origin: HTMLCanvasElement) {
  // a canvas can only have one type of context, if it already have 'webgl' or 'webgl2', we can't use it to get image data
  const toCrop = document.createElement('canvas')
  toCrop.width = origin.width
  toCrop.height = origin.height

  const toCropCtx = toCrop.getContext('2d')!
  toCropCtx.drawImage(origin, 0, 0)

  const toCropData = toCropCtx.getImageData(0, 0, toCrop.width, toCrop.height).data

  // crop
  let left = toCrop.width
  let top = toCrop.height
  let right = 0
  let bottom = 0

  for (let y = 0; y < toCrop.height; y++) {
    for (let x = 0; x < toCrop.width; x++) {
      const index = (y * toCrop.width + x) * 4
      if (toCropData[index] > 0 || toCropData[index + 1] > 0 || toCropData[index + 2] > 0 || toCropData[index + 3] > 0) {
        if (y < top) {
          top = y
        }
        if (x < left) {
          left = x
        }
        if (x > right) {
          right = x
        }
        if (y > bottom) {
          bottom = y
        }
      }
    }
  }

  const croppedWidth = right - left
  const croppedHeight = bottom - top
  const croppedCanvas = document.createElement('canvas')
  croppedCanvas.width = croppedWidth
  croppedCanvas.height = croppedHeight
  const croppedCanvasCtx = croppedCanvas.getContext('2d')!
  croppedCanvasCtx.drawImage(toCrop, left, top, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight)

  return croppedCanvas
}
