const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true,
    },
    name: {
        type: DataTypes.STRING, allowNull: false,
    },
    slug: {
        type: DataTypes.STRING, unique: true, allowNull: true,
    },
    image: {
        type: DataTypes.STRING, allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false,
    },
    description: {
        type: DataTypes.TEXT, allowNull: true,
    },
    parent_id: {
        type: DataTypes.INTEGER.UNSIGNED, allowNull: true,
        references: {
            model: 'category',
            key: 'id'
        }
    },
}, {
    tableName: 'category',
    timestamps: true,
    underscored: true,
}
);

module.exports = Category;