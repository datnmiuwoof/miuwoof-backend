const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Favorite = sequelize.define('Favorite', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED, allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        }
    },
    product_id: {
        type: DataTypes.INTEGER.UNSIGNED, allowNull: false,
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
            fields: ['user_id', 'product_id']
        }
    ],
}
);

module.exports = Favorite;