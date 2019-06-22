const { Sequelize, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../core/db');
const { NotFound, AuthFailed } = require('../../core/http-exception');

class User extends Model {
    static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: {
                email
            }
        })
        if(!user) {
            throw new AuthFailed('账号不存在')
        }
        const correct = bcrypt.compareSync(plainPassword, user.password);
        if(!correct) {
            throw new AuthFailed('密码不正确');
        }
        return user;
    }

    static async getUserByOpenid(openid) {
        const user = await User.findOne({
            where: {
                openid
            }
        });
        return user
    }

    static async registerByOpenid(openid) {
        return await User.create({
            openid
        })
    }
}

// 初始化创建表
User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true // 自增长
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(64),
        unique: true
    },
    password: Sequelize.STRING,
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    }
}, { sequelize, tableName: 'user' });

module.exports = {
    User
}