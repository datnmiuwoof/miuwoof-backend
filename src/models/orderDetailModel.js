const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderDetail = sequelize.define('OrderDetail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    id_product_variant: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'product_variants',
            key: 'id',
        }
    },
    id_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'order',
            key: 'id',
        }
    },
}, {
    tableName: 'order_detail',
    timestamps: true,
    underscored: true,
});

module.exports = OrderDetail;
