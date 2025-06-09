import { Router } from 'express';
import { createActivity, getActivitiesForContact } from '../controllers/activity.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:contactId', requireAuth, createActivity);
router.get('/:contactId', requireAuth, getActivitiesForContact);

export default router;
