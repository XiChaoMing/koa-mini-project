const util = require('util');
const axios = require('axios');
const { AuthFailed } = require('../../core/http-exception');
const { User } = require('../models/user');
const { generateToken } = require('../../core/util');
const { Auth } = require('../../middlewares/auth');

class WXManager {
    static async codeToToken(code) {
        const { appId, appSecret, loginUrl } = global.config.wx;
        const url = util.format(loginUrl, appId, appSecret, code);
        console.log(url);
        const result = await axios.get(url);
        if(result.status !== 200) {
            throw new AuthFailed('openid 获取失败');
        }
        const errcode = result.data.errcode
        const errMsg = result.data.errmsg
        if(errcode) {
            throw new AuthFailed('openid 获取失败' + errMsg);
        }
        const user = await User.getUserByOpenid(result.data.openid);
        if(!user) {
            user = await User.registerByOpenid(result.data.openid);
        }
        return generateToken(user.id, Auth.USER)
    }
}

module.exports = { WXManager }