import { sequelize } from '../Database/db';
import { Order } from './order';
import { OrderItem } from './orderItem';


sequelize.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
  
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
});

sequelize.sync().then(() => {
    console.log("synced successfully");
  }).catch((err) => {
    console.error(err)
});