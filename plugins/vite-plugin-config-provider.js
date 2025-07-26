import path from 'path';
import fs from "fs";

// 开发配置；
// 在生产环境由nginx处理，当然，开发环境下使用nginx返回的配置也是可以的；
// 使用方法：
// 1）启用插件：configProvider({ configPath: './config/config.json', route: '/easyblog/config.json' })
// 2）请求route，以获取配置信息；
export default function configProvider({ configPath, route }) {
    const _path = path.resolve(process.cwd(), configPath);
    return {
        name: 'config-provider',
        configureServer(server) {
            server.middlewares.use(route, (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                try {
                    const content = fs.readFileSync(_path, 'utf-8');
                    const config = JSON.parse(content);
                    res.end(JSON.stringify(config));
                }
                catch (e) {
                    res.end("");
                }
            });
        }
    };
}