const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductCategory = sequelize.define('produc_category', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'product',
            key: 'id',
        }
    },
    category_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'category',
            key: 'id',
        }
    }
}, {
    tableName: 'product_category',
    timestamps: true,
    underscored: true,
});

module.exports = ProductCategory;