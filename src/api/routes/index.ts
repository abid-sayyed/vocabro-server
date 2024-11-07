import express, { Router } from 'express';
import books from '@api/routes/booksRoutes';
import user from '@api/routes/auth.route';

const router: Router = express.Router();

// Register specific routes under /api
router.use('/', books);
router.use('/user', user);

export default router;
