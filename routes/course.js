import express from 'express';
import { 
  deleteCourse,
  getCourse,
  getCourses,
  saveCourse,
  updateCourse
} from '../controllers/course.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { advancedResults } from '../middlewares/advancedResults.js';
import Course from '../models/Course.js';

const router = express.Router({mergeParams: true});

router
  .route('/')
    .get(advancedResults(Course, {
      path: 'bootcamp',
      select: 'name website email'
    }, {
      path: 'user',
      select: 'name email'
    }), getCourses)
  .post(authenticate, authorize('admin', 'publisher'), saveCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(authenticate, authorize('admin', 'publisher'), updateCourse)
  .delete(authenticate, authorize('admin', 'publisher'), deleteCourse);

export default router;
