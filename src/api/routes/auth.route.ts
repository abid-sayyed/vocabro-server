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

router.post('/refresh-token', refreshToken);

router.post(
  '/is-authenticated',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({ message: 'user is auhtenticated' });
  },
);

router.post('/forgot-password', (req, res) => {
  res.status(200).json({ message: 'POST request to the homepage' });
});

router.post('/reset-password', (req, res) => {
  res.status(200).json({ message: 'POST request to the homepage' });
});

export default router;
