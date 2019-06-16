const Sequelize = require('sequelize');
const { dbName, host, port, user, password } = require('../config/config').database;

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: true,
    timezone: '+8:00',
    define: {
        timestamps: true,
        paranoid: true, // 生成 deletedAt 字段
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true // 自动将驼峰转为 _
    }
});

sequelize.sync({
    force: true // 生产一定要改回 false
});

module.exports = {
    sequelize
};