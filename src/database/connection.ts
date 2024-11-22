import { Sequelize } from 'sequelize-typescript';
// import path from 'path';
import User from '@models/user.model';
import Book from '@models/book.model';

const sequelize = new Sequelize({
  dialect: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  models: [User, Book],
});

export default sequelize;
