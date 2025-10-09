const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
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
    text: {
        type: DataTypes.TEXT, allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
}, {
    tableName: 'review',
    timestamps: true,
    underscored: true,
}
);

module.exports = Review;