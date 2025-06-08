import { Router } from 'express';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  getContactById,
} from '../controllers/contact.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requireAuth, getContacts);
router.get('/:id', requireAuth, getContactById);
router.post('/', requireAuth, createContact);
router.put('/:id', requireAuth, updateContact);
router.delete('/:id', requireAuth, deleteContact);


export default router;
