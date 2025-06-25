import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import jsonAssetsLoader from "./plugins/vite-plugin-json-assets-loader";
import configProvider from "./plugins/vite-plugin-config-provider";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const prod = mode === 'production';
    return {
        // base: prod ? "/easyblog/admin" : '',
        base: "/easyblog/admin",
        plugins: [
            vue(),
            vueJsx(),
            vueDevTools(),
            configProvider({ configPath: './config/config.json', route: '/easyblog/config.json' }),
            jsonAssetsLoader([{ configPath: './src/application.json', alias: 'appConfig' }]),
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
            proxy: {
                "^/(image|temp)": {
                    target: "http://localhost"
                },
                "/0": {
                    target: "http://localhost"
                }
            }
        }
    }
});
