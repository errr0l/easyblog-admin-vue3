import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import config from "./config/easyblog/config.json";
import jsonAssetsLoader from "./vite-plugins/vite-plugin-json-assets-loader";

// 开发配置；
// 在生产环境由nginx处理；
function devConfig() {
    return {
        name: 'dev-config',
        configureServer(server) {
            // 在开发服务器中添加中间件
            server.middlewares.use(`/easyblog/config.json`, (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(config));
            });
        }
    };
}

// https://vite.dev/config/
export default defineConfig({
    base: config.PREFIX,
    plugins: [
        vue(),
        vueJsx(),
        vueDevTools(),
        devConfig(),
        jsonAssetsLoader([{ alias: 'appConfig', configPath: './src/application.json' }]),
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
});
