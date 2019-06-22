const basicAuth = require('basic-auth');
const jwt = require('jsonwebtoken');
const { Forbbiden } = require('../core/http-exception');

class Auth {
    constructor(level) {
        this.level = level || 1;
        // 权限分级
        Auth.USER = 8;
        Auth.ADMIN = 16;
        Auth.SUPER_ADMIN = 32;
    }

    get m() {
        return async (ctx, next) => {
            // token 检测
            const userToken = basicAuth(ctx.req);
            if(!userToken || !userToken.name) {
                throw new Forbbiden('token 不合法');
            }
            let decode;
            try {
                // 校验令牌
                decode = jwt.verify(userToken.name, global.config.security.secretKey)
            } catch (error) {
                // token 不合法
                // token过期
                if(error.name == 'TokenExpiredError') {
                    throw new Forbbiden('token 过期');
                }
                throw new Forbbiden('token 不合法');
            }
            // 权限判断
            if(decode.scope < this.level) {
                throw new Forbbiden('权限不足');
            }
            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            };
            await next();
        }
    }

    static verifyToken(token) {
        try {
            jwt.verify(token, global.config.security.secretKey)
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = {
    Auth
}