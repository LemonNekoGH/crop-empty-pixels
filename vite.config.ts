import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts()
  ],
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'CropEmptyPixel',
      formats: ['es']
    }
  }
})