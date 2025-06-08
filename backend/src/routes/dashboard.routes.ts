import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, getDashboardData);

export default router;
