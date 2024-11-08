import express from 'express';
import { login, register } from '@api/controllers/auth.Controller';

const router = express.Router();

router.get('/login', login);

router.get('/register', register);

export default router;