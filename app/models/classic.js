const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../../core/db');

// 模型基类
const classicFields = {
    image: Sequelize.STRING, // 图片
    content: Sequelize.STRING, // 内容
    pubdate: Sequelize.DATEONLY, // 子内容
    fav_nums: Sequelize.INTEGER, // 点赞数
    title: Sequelize.STRING, // 标题
    type: Sequelize.TINYINT // 类型
}

// 电影
class Movie extends Model {}
Movie.init(classicFields, {
    sequelize, tableName: 'movie'
})

// 
class Sentence extends Model {}
Sentence.init(classicFields, {
    sequelize, tableName: 'sentence'
})

// 音乐
class Music extends Model {}
Music.init(
    Object.assign({
        url: Sequelize.STRING
    }, classicFields), {
    sequelize, tableName: 'sentence'
})

module.exports = {
    Movie, Sentence, Music
}