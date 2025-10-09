const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Banner = sequelize.define('Banner', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    is_active: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,    // 1 = hiển thị, 0 = ẩn
    },
}, {
    tableName: 'banner',
    timestamps: true,
    underscored: true,
});

module.exports = Banner;
