const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../../core/db');

class User extends Model {

}

// 初始化创建表
User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, // 主键
        autoIncrement: true // 自增长
    },
    nickname: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    }
}, { sequelize, tableName: 'user' });