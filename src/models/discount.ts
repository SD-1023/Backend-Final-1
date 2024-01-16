import { sequelize } from '../Database/db';
import { DataTypes } from 'sequelize';

const Discount = sequelize.define("Discount", {
    percentage: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.STRING,
    },
    end_date: {
        type: DataTypes.STRING,
    },
    is_valid: {
        type: DataTypes.BOOLEAN,
    },
},{
    timestamps: false
});

export { Discount };
