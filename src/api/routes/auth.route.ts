import express from 'express';
import {
  register,
  login,
  refreshToken,
} from '@api/controllers/auth.Controller';

import passport from '@api/middleware/passport.middleware';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post(
  '/refresh-token',
  passport.authenticate('jwt', { session: false }),
  refreshToken,
);

router.post('/forgot-password', (req, res) => {
  res.status(200).json({ message: 'POST request to the homepage' });
});

router.post('/reset-password', (req, res) => {
  res.status(200).json({ message: 'POST request to the homepage' });
});

export default router;
