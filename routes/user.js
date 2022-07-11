import express from 'express';
import { deleteUser, getUser, getUsers, saveUser, updateUser } from '../controllers/user.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { advancedResults } from '../middlewares/advancedResults.js';
import User from '../models/User.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router 
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(saveUser);

router 
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
