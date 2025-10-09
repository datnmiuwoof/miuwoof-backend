const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
    id: {
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,
    },
    id_user: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        }
    },
    id_product: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'product',
            key: 'id',
        },
    },
}, {
    tableName: 'favorite',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['id_user', 'id_product']
        }
    ],
}
);

module.exports = Favorite;