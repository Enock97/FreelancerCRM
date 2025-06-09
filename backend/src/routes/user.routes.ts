import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { getUser, updateUser } from '../controllers/user.controller';

const router = Router();

router.get('/', requireAuth, getUser);
router.put('/update', requireAuth, updateUser);

export default router;