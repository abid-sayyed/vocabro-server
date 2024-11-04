import express, { Request, Response, Application } from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import sequelize from './database/connection';

//routes
import books from './api/routes/booksRoutes';

// console.log('Current Environment of abid:', process.env.NODE_ENV);
// console.log('Current Environment of PORT:', process.env.PORT)
// console.log('Current Environment All :', process.env);

const app: Application = express();
const port = process.env.PORT;

const corsOptions = {
  origin: process.env.Frontend_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type'], // Allow specific headers
};
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.use('/api', books);

app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.info(`Server is Fire at http://localhost:${port}`);
  }
});

const run = async () => {
  try {
    await sequelize.sync({ force: true }); // `force: true` drops the table if it exists and recreates it
    console.info('Database & tables created!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

run();
