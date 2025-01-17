import express from 'express';
import { login, logout, refresh, signUp, verify } from '../controllers/authController.js';
import { checkEmailExists } from '../middlewares/authMiddleware.js';
import { checkDuplicateUser } from '../middlewares/userMiddleware.js';

const router = express.Router();

router.get('/verify', verify);
router.post('/signUp', checkDuplicateUser, signUp);
router.post('/login', checkEmailExists, login);
router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;
