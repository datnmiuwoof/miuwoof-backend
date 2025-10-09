const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Brand = sequelize.define('Brand', {
    id: {
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,
    },
    description: {
        type: DataTypes.TEXT, allowNull: true,
    },
    url: {
        type: DataTypes.STRING, allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN, defaultValue: true,
    },
    logo: {
        type: DataTypes.STRING, allowNull: true,
    },
    sort_order: {
        type: DataTypes.STRING, defaultValue: 0,
    },
}, {
    tableName: 'brand',
    timestamps: true,
    underscored: true,
}
);

module.exports = Brand;