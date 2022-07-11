import express from 'express';
import Review from '../models/Review.js';
import { deleteReview, getReview, getReviews, saveReview, updateReview } from '../controllers/review.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { advancedResults } from '../middlewares/advancedResults.js';

const router = express.Router({mergeParams: true});

router 
  .route('/')
  .get(advancedResults(Review, {
    path: 'bootcamp',
    select: 'name website email'
    }, {
    path: 'user',
    select: 'name email'
    }), getReviews)
  .post(authenticate, authorize('user', 'admin'), saveReview);

router
  .route('/:id')
  .get(getReview)
  .put(authenticate, authorize('user', 'admin'), updateReview)
  .delete(authenticate, authorize('user', 'admin'), deleteReview)

export default router;