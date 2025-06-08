import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        vueDevTools(),
    ],
    esbuild: {
        loader: 'jsx'
    },
    resolve: {
        extensions: [".js", ".ts", ".json", ".vue", ".css", ".scss"],
        alias: {
            // '@': fileURLToPath(new URL('./src', import.meta.url)),
            "@": path.resolve(__dirname, "./src")
        }
    },
    server: {
        fs: {
            // 限制哪些文件系统位置可以被访问
            allow: ['.', './config/'],
        },
    }
});
