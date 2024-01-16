import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('eCommerce', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
})

export {sequelize};