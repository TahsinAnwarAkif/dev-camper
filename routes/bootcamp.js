import express from 'express';
import courseRoutes from './course.js';
import reviewRoutes from './review.js';
import { upload } from '../utils/upload.js';
import { 
  deleteBootcamp,
  getBootcamp,
  getBootcamps, 
  getBootcampsInRadius, 
  saveBootcamp,
  updateBootcamp,
  uploadBootcampPhoto
} from '../controllers/bootcamp.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { advancedResults } from '../middlewares/advancedResults.js';
import Bootcamp from '../models/Bootcamp.js';

const router = express.Router();

router.use('/:bootcampId/courses', courseRoutes);
router.use('/:bootcampId/reviews', reviewRoutes);

router
  .route('/')
  .get(advancedResults(Bootcamp, {
    path: 'courses',
    select: 'title weeks description minimumSkill'
  }), getBootcamps)
  .post(authenticate, authorize('admin', 'publisher'), saveBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(authenticate, authorize('admin', 'publisher'), updateBootcamp)
  .delete(authenticate, authorize('admin', 'publisher'), deleteBootcamp);

router
  .route('/:id/photo')
  .put(authenticate, authorize('admin', 'publisher'), upload.single('photo'), uploadBootcampPhoto);

router
  .route('/search/radius/:zipCode/:distance')
  .get(getBootcampsInRadius);

export default router;