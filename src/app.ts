import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import sequelize from './database/connection';
import errorHandler from '@api/middleware/errorHandler.middleware';
import apiRoutes from '@api/routes/index';
import passport from '@api/middleware/passport.middleware';
import cookieParser from 'cookie-parser';

const port = process.env.PORT;

const startServer = async () => {
  const app: Application = express();

  // CORS configuration
  const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };

  // Middleware setup
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(passport.initialize()); // Initialize passport

  // Health check route
  app.get('api/health', (req: Request, res: Response) => {
    res.json({ ok: true, environment: process.env.NODE_ENV });
  });

  app.use('/api', apiRoutes);

  // A protected route that requires a valid JWT token
  app.get(
    '/api/protected',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      // If the token is valid, the payload (user info) will be available in req.user
      res.json({
        message: 'Access granted',
        user: req.user, // This is the decoded payload (user info)
      });
    },
  );

  app.use(errorHandler);

  try {
    await sequelize.sync({ alter: false }); // Avoid using { force: true } in production to prevent data loss
    console.info('Database & tables created!');

    app.listen(port, () => {
      if (process.env.NODE_ENV === 'development') {
        console.info(`Server is running at http://localhost:${port}`);
      }
    });
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

// Start the server
startServer();
