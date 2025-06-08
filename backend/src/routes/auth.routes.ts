import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', requireAuth, registerUser);
router.post('/login', requireAuth, loginUser);

export default router;
