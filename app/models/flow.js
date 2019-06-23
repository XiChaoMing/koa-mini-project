const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('../../core/db');

class Flow extends Model {

}

Flow.init({
    index: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
}, { sequelize, tableName: 'flow' })

module.exports = {
    Flow
}