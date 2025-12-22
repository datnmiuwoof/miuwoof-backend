const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const cartItem = sequelize.define("cartItem", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    cart_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "cart",
            key: "id",
        }
    },
    product_variants_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "product_variants",
            key: "id",
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // total_price: {
    //     type: DataTypes.DECIMAL,
    //     allowNull: true,
    // },
    // price: {
    //     type: DataTypes.DECIMAL,
    //     allowNull: true,
    // },
}, {
    tableName: "cart_item",
    timestamps: false,
    underscored: true,
});

module.exports = cartItem;