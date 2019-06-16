const Router = require('koa-router');
// 实现自动引入
const requireDirectory = require('require-directory');

class InitManager {
    static initCore(app) {
        InitManager.app = app;
        InitManager.initLoadRouters();
        InitManager.loadConfig();
    }

    static loadConfig(path='') {
        const configPath = path || process.cwd() + '/config/config.js';
        const config = require(configPath);
        global.config = config;
    }

    static initLoadRouters() {
        // 路径 (process.cwd() 获得绝对路径)
        const apiDirectory = `${process.cwd()}/app/api`;
        // 路由注册
        requireDirectory(module,  apiDirectory, {
            visit: (obj) => {
                if (obj instanceof Router) {
                    InitManager.app.use(obj.routes());
                }
            }
        });
    }
}

module.exports = InitManager;