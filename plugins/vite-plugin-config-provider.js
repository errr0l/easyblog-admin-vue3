import path from 'path';
import fs from "fs";

// 开发配置；
// 在生产环境由nginx处理，当然，开发环境下使用nginx返回的配置也是可以的；
export default function configProvider(configPath) {
    const _path = path.resolve(process.cwd(), configPath);
    return {
        name: 'dev-config',
        configureServer(server) {
            const content = fs.readFileSync(_path, 'utf-8');
            const config = JSON.parse(content);
            server.middlewares.use(`/easyblog/config.json`, (req, res) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(config));
            });
        }
    };
}