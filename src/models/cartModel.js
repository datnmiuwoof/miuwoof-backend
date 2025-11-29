const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const cart = sequelize.define("cart", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "user",
            key: "id",
        }
    }
}, {
    tableName: "cart",
    timestamps: false,
    underscored: true,
});

module.exports = cart;