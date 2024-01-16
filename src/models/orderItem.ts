import { sequelize } from '../Database/db';
import { DataTypes } from 'sequelize';

const OrderItem = sequelize.define("OrderItem", {
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    timestamps: false
});

export { OrderItem };
