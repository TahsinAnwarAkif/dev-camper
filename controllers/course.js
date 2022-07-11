import asyncHandler from 'express-async-handler';
import Course from '../models/Course.js';
import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import {DEFAULT_PAGE_LIMIT} from '../utils/constants.js';
import { advancedResults } from '../middlewares/advancedResults.js';


// @ desc   Get Courses
// @ route  GET /api/v1/courses
// @ route  GET /api/v1/bootcamps/:bootcampId/courses
// @ access Public
export const getCourses = asyncHandler(async (req, res) => {
  if(req.params.bootcampId){
    const courses = await Course.find({bootcamp: req.params.bootcampId});
    
    res.status(200).json({
      success: true,
      dataCount: courses.length,
      data: courses
    })
  }else{
    res.status(200).json(res.advancedResults);
  }
});

// @ desc   Get Course
// @ route  GET /api/v1/courses/:id
// @ access Public
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate('bootcamp', 'name website email phone')
    .populate('user', 'name email');

  if(!course){
    return next(new ErrorResponse(404, `Course not found with id of ${req.params.id}`));
  }
  
  res.status(200).json({
      success: true,
      data: course
  });
});

// @ desc   Create New Course
// @ route  POST /api/v1/bootcamps/:bootcampId/courses
// @ access Private
export const saveCourse = asyncHandler(async (req, res, next) => {  
  const {bootcampId} = req.params;
  const bootcamp = await Bootcamp.findById(bootcampId);
  
  if(!bootcamp){
    return next(new ErrorResponse(404, `Bootcamp not found with id of ${bootcampId}`));
  }
  
  if(req.user.role !== 'admin'){
    const isOwner = bootcamp.user.equals(req.user._id);
    
    if(!isOwner){
      return next(new ErrorResponse(401, `The user with ID of ${req.user._id} is not the owner of this bootcamp`));
    }
  }
  
  const {
    title, 
    description,
    weeks,
    tuition,
    phone,
    minimumSkill,
    scholarhipsAvailable
  } = req.body;
  
  let course = new Course({
    title, 
    description,
    weeks,
    tuition,
    phone,
    minimumSkill,
    scholarhipsAvailable,
    bootcamp: req.params.bootcampId,
    user: req.user._id
  });
  
  course = await course.save();
  
  res.status(201).json({
    success: true, 
    data: course
  });
});

// @ desc   Update Course
// @ route  PUT /api/v1/courses/:id
// @ access Public
export const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  
  if(!course){
    return next(new ErrorResponse(404, `Course not found with id of ${req.params.id}`));
  }

  if(req.user.role !== 'admin'){
    const isOwner = course.user.equals(req.user._id);
    
    if(!isOwner){
      return next(new ErrorResponse(401, `The user with ID of ${req.user._id} is not the owner of this course`));
    }
  }
  
  const {
    title,
    description,
    weeks,
    tuition,
    minimumSkill,
    address,
    scholarhipsAvailable,
    bootcamp: bootcampId
  } = req.body;
  
  course.title = title || course.title;
  course.description = description || course.description;
  course.weeks = weeks ? Number(weeks) : course.weeks;
  course.tuition = tuition ? Number(tuition) : course.tuition;
  course.minimumSkill = minimumSkill || course.minimumSkill;
  course.address = address || course.titaddressle;
  course.scholarhipsAvailable = scholarhipsAvailable || course.scholarhipsAvailable;
  
  if(bootcampId){
    const bootcamp = await Bootcamp.findById(bootcampId);
    
    if(!bootcamp){
      return next(new ErrorResponse(404, `Bootcamp not found with id of ${bootcampId}`));
    }
    
    course.bootcamp = bootcamp;
  }
  
  course = await course.save();
  
  res.status(200).json({
    success: true,
    data: course
  });
});

// @ desc   Delete Course
// @ route  DELETE /api/v1/courses/:id
// @ access Public
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if(!course){
    return next(new ErrorResponse(404, `Course not found with id of ${req.params.id}`));;
  }

  if(req.user.role !== 'admin'){
    const isOwner = course.user.equals(req.user._id);
    
    if(!isOwner){
      return next(new ErrorResponse(401, `The user with ID of ${req.user._id} is not the owner of this course`));
    }
  }
  
  await course.remove();
    
  res.status(200).json({
    success: true,
    data: {}
  });
});