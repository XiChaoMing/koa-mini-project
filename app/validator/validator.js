const { LinValidator, Rule } = require('../../core/lin-validator-v2');
const { User } = require('../models/user');
const { LoginType } = require('../lib/enum');

class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super();
        this.id = [
            new Rule('isInt', '需要正整数', { min: 1 })
        ];
    }   
}

class RegisterValidator extends LinValidator {
    constructor() {
        super();
        this.email = [
            new Rule('isEmail', '不符合Email规范')
        ]
        this.password1 = [
            new Rule('isLength', '密码至少6个，最多32个字符', {
                min: 6,
                max: 32
            }),
            new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
        ]
        this.password2 = this.password1;
        this.nickname = [
            new Rule('isLength', '昵称不符合规范', {
                min: 4,
                max: 32
            })
        ]
    }

    validatePassword(vals) {
        const psw1 = vals.body.password1;
        const psw2 = vals.body.password2;
        if(psw1 !== psw2) {
            throw new Error('两个密码不一致');
        }
    }

    async validateEmail(vals) {
        const email = vals.body.email;
        const user = await User.findOne({
            where: {
                email
            }
        });
        if(user) {
            throw new Error('email 已存在');
        }
    }
}

class TokenValidator extends LinValidator {
    constructor() {
        super();
        this.account = [
            new Rule('isLength', '不符合账号规则', {
                min: 4,
                max: 32
            })
        ];
        this.secret = [
            // 1、可以为空
            // 2、不为空则要满足一些规则
            new Rule('isOptional'),
            new Rule('isLength', '至少6个字符', {
                min: 6,
                max: 128
            })
        ];
    }

    validateLoginType(vals) {
        if(!vals.body.type) {
            throw new Error('type 是必须参数');
        }
        if(!LoginType.isThisType(vals.body.type)) {
            throw new Error('type 参数不合法');
        }
    }
}

class NotEmptyValidator extends LinValidator {
    constructor() {
        super();
        this.token = [
            new Rule('isLength', '不允许为空', { min: 1 })
        ]
    }
}

class LikeValidator extends PositiveIntegerValidator {
    constructor() {
        super();
        this.validateType = checkType;
    }
}

function checkType(vals) {
    if(!vals.body.type) {
        throw new Error('type 是必须参数');
    }
    if(!LoginType.isThisType(vals.body.type)) {
        throw new Error('type 参数不合法');
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    LikeValidator
}