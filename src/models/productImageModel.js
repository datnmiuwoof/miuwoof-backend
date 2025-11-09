const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductImage = sequelize.define('ProductImage', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true,
    },
    image: {
        type: DataTypes.STRING, allowNull: false,
    },
    alt_text: {
        type: DataTypes.STRING, allowNull: true,
    },
    description: {
        type: DataTypes.TEXT, allowNull: true,
    },
    sort_order: {
        type: DataTypes.INTEGER, defaultValue: 0,
    },
    product_variants_id: {
        type: DataTypes.INTEGER.UNSIGNED, allowNull: false,
        references: {
            model: 'product_variants',
            key: 'id'
        }
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'product_image',
    timestamps: true,
    underscored: true,

}
);

module.exports = ProductImage;