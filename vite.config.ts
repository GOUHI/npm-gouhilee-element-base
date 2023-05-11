import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),dts()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // 到处文件目录，penk-ui 用于存放package.json，避免被覆盖
    // 这里不设置也是默认dist
    outDir:"dist",
    // 兼容
    target: "es2015",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "GouhileeUi",
      // the proper extensions will be added
      // 如果不用format文件后缀可能会乱
      fileName: (format) => `gouhilee-ui.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue", "element-plus", "sass"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
          "element-plus": "ElementPlus",
        },
      },
    },
  },
});