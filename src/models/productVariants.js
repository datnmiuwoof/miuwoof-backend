const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductVariants = sequelize.define('ProductVariants', {
    id: {
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,
    },
    size: {
        type: DataTypes.STRING, allowNull: true,
    },
    style: {
        type: DataTypes.STRING, allowNull: true,
    },
    unit: {
        type: DataTypes.STRING, allowNull: true,
    },
    flavor: {
        type: DataTypes.STRING, allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), allowNull: false,
    },
    available_quantity: {
        type: DataTypes.INTEGER, defaultValue: 0, allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: 'product',
            key: 'id',
        }
    },
}, {
    tableName: 'product_variants',
    timestamps: true,
    underscored: true,
}
);

module.exports = ProductVariants;