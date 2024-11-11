import express from 'express';
import { login, register } from '@api/controllers/auth.Controller';

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

export default router;
