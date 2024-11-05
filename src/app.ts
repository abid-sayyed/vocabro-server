import '@config/envConfig';
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import sequelize from './database/connection'; // Ensure your sequelize connection is set up correctly
import books from './api/routes/booksRoutes';

const app: Application = express();
const port = process.env.PORT;

// CORS configuration
const corsOptions = {
  origin: process.env.Frontend_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

// API routes
app.use('/api', books);

// Function to start the server and sync the database
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true }); // Avoid using { force: true } in production to prevent data loss
    console.info('Database & tables created!');

    app.listen(port, () => {
      if (process.env.NODE_ENV === 'development') {
        console.info(`Server is Fire at http://localhost:${port}`);
      }
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Start the server
startServer();
