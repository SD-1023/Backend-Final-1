import { sequelize } from '../Database/db';
import { DataTypes } from 'sequelize';

const Order = sequelize.define("Order", {
    order_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    order_date: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    timestamps: false
});

export { Order };
