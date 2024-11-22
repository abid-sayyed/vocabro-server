import express, { Router } from 'express';
import books from '@src/api/routes/book.route';
import user from '@api/routes/auth.route';
import userDetail from '@src/api/routes/userDetail';
import passport from '@api/middleware/passport.middleware';

const router: Router = express.Router();

// Register specific routes under /api
router.use('/', books);
router.use('/user', user);
router.use(
  '/user-detail',
  passport.authenticate('jwt', { session: false }),
  userDetail,
);

export default router;
