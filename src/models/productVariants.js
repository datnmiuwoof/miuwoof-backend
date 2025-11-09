const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { allow } = require('joi');

const ProductVariants = sequelize.define('ProductVariants', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true,
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
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    import_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    available_quantity: {
        type: DataTypes.INTEGER, defaultValue: 0, allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER.UNSIGNED, allowNull: false,
        references: {
            model: 'product',
            key: 'id',
        }
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'product_variants',
    timestamps: true,
    underscored: true,
}
);

module.exports = ProductVariants;