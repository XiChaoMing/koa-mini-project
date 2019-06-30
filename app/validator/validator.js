const { LinValidator, Rule } = require('../../core/lin-validator-v2');
const { User } = require('../models/user');
const { LoginType, ArtType } = require('../lib/enum');

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
        if (psw1 !== psw2) {
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
        if (user) {
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
        if (!vals.body.type) {
            throw new Error('type 是必须参数');
        }
        if (!LoginType.isThisType(vals.body.type)) {
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
        this.validateType = checkArtType;
        // const checker = new Checker(ArtType)
        // this.validateType = checker.check.bind(checker);
    }
}

function checkType(vals) {
    let type = vals.body.type || vals.path.type;
    if (!type) {
        throw new Error('type 是必须参数');
    }
    type = parseInt(type);
    if (!LoginType.isThisType(type)) {
        throw new Error('type 参数不合法');
    }
}

function checkArtType(vals) {
    let type = vals.body.type || vals.path.type;
    if (!type) {
        throw new Error('type 是必须参数');
    }
    type = parseInt(type);
    if (!ArtType.isThisType(type)) {
        throw new Error('type 参数不合法');
    }
}

class Checker {
    constructor(type) {
        this.enumType = type;
    }
    check(vals) {
        let type = vals.body.type || vals.path.type;
        if (!type) {
            throw new Error('type 是必须参数');
        }
        type = parseInt(type);
        if (!this.enumType.isThisType(type)) {
            throw new Error('type 参数不合法');
        }
    }
}

class ClassicValidator extends LikeValidator {
}

class SearchValidator extends LinValidator {
    constructor() {
        super();
        this.q = [
            new Rule('isLength', '搜索关键词不能为空', {
                min: 1,
                max: 16
            })
        ]
        this.start = [
            new Rule('isInt', 'start 不符合规范', {
                min: 0,
                max: 60000
            }),
            new Rule('isOptional', '', 0)
        ]
        this.count = [
            new Rule('isInt', 'count 不符合规范', {
                min: 1,
                max: 20
            }),
            new Rule('isOptional', '', 0)
        ]
    }
}

class AddShortCommentValidator extends PositiveIntegerValidator {
    constructor() {
        super()
        this.content = [
            new Rule('isLength', '必须在1到12个字符之间', {
                min: 1,
                max: 12
            })
        ]
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    NotEmptyValidator,
    LikeValidator,
    ClassicValidator,
    SearchValidator,
    AddShortCommentValidator
}