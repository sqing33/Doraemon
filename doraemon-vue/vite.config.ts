import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // 打包压缩图片
        ViteImageOptimizer()
    ],
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler"
            },
            sass: {
                api: "modern-compiler"
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
    },
})
