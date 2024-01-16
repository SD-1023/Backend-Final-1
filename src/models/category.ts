import { sequelize } from '../Database/db';
import { DataTypes } from 'sequelize';

const Category = sequelize.define('Category', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    timestamps: false
});

export { Category };