const { Sequelize, Model } = require('sequelize');
const { unset, clone, isArray } = require('lodash');
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
        underscored: true, // 自动将驼峰转为 _
        scopes: {
            bh: {
                attributes: {
                    exclude: ['created_at', 'deleted_at', 'updated_at'] // 排除不想要的字段
                }
            }
        }
    }
});

sequelize.sync({
    force: false // 生产一定要改回 false
});

Model.prototype.toJSON= function(){
    let data = clone(this.dataValues)
    unset(data, 'updated_at')
    unset(data, 'created_at')
    unset(data, 'deleted_at')

    for (key in data){
        if(key === 'image'){
            if(!data[key].startsWith('http'))
                data[key]=global.config.host + data[key]
        }
    }

    if(isArray(this.exclude)){
        this.exclude.forEach(
            (value)=>{
                unset(data,value)
            }
        )
    }
    return data
}

module.exports = {
    sequelize
};