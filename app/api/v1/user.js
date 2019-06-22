const Router = require('koa-router');
const bcrypt = require('bcryptjs');
const { RegisterValidator } = require('../../validator/validator');
const { User } = require('../../models/user');
const { Success } = require('../../../core/http-exception');

const router = new Router({
    prefix: '/v1/user'
});

// 注册
router.post('/register', async (ctx) => {
    const v = await new RegisterValidator().validate(ctx);
    // 盐值
    const salt = bcrypt.genSaltSync(10);
    // 加密
    const psw = bcrypt.hashSync(v.get('body.password2'), salt);
    const user = {
        email: v.get('body.email'),
        password: psw,
        nickname: v.get('body.nickname')
    };
    await User.create(user);
    throw new Success();
});

module.exports = router;