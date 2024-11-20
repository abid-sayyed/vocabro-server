import express from 'express';
import { userProfile } from '@api/controllers/userDetail.Controller';

const router = express.Router();

router.get('/Profile', userProfile);

export default router;
