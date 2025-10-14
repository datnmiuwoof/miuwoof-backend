const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    import_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    is_hot: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    sold_out: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'category',
            key: 'id'
        }
    },
    brand_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: 'brand',
            key: 'id'
        }
    },
}, {
    tableName: 'product',
    timestamps: true,
    underscored: true,
});

module.exports = Product;
