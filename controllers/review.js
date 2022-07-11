import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @ desc   Get Reviews of a bootcamp
// @ route  GET /api/v1/reviews
// @ route  GET /api/v1/bootcamps/:bootcampId/reviews
// @ access Public
export const getReviews = asyncHandler(async (req, res) => {
  if(req.params.bootcampId){
    const reviews = await Review.find({bootcamp: req.params.bootcampId});
  
    res.status(200).json({
      success: true,
      dataCount: reviews.length,
      data: reviews
    });
  }else{
        res.status(200).json(res.advancedResults);
  }
});

// @ desc   Get Review
// @ route  GET /api/v1/reviews/:id
// @ access Public
export const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('bootcamp', 'name website email phone')
    .populate('user', 'name email');

  if(!review){
    return next(new ErrorResponse(404, `Review not found with id of ${req.params.id}`));
  }
  
  res.status(200).json({
      success: true,
      data: review
  });
});

// @ desc   Create New Review
// @ route  POST /api/v1/bootcamps/:bootcampId/reviews
// @ access Private
export const saveReview = asyncHandler(async (req, res, next) => {  
  const {bootcampId} = req.params;
  const bootcamp = await Bootcamp.findById(bootcampId);
  
  if(!bootcamp){
    return next(new ErrorResponse(404, `Bootcamp not found with id of ${bootcampId}`));
  }
  
  const {title, text, rating} = req.body;
  
  let review = new Review({
    title, 
    text, 
    rating, 
    bootcamp: bootcampId,
    user: req.user._id
  });
  review = await review.save();
  
  res.status(201).json({
    success: true, 
    data: review
  });
});

// @ desc   Update Review
// @ route  PUT /api/v1/reviews/:id
// @ access Private
export const updateReview = asyncHandler(async (req, res, next) => {  
  let review = await Review.findById(req.params.id);

  if(!review){
    return next(new ErrorResponse(404, `Review not found with id of ${req.params.id}`));
  }

  if(req.user.role !== 'admin' && !req.user._id.equals(review.user._id)){
    return next(new ErrorResponse(401, 'Not Authorized to update others\' reviews'));
  }
  
  const {title, text, rating} = req.body;
  
  review.title = title || review.title;
  review.text = text || review.text;
  review.rating = rating || review.rating;
  review = await review.save();
  
  res.status(200).json({
    success: true, 
    data: review
  });
});

// @ desc   Delete Review
// @ route  DELETE /api/v1/reviews/:id
// @ access Private
export const deleteReview = asyncHandler(async (req, res, next) => {  
  let review = await Review.findById(req.params.id);

  if(!review){
    return next(new ErrorResponse(404, `Review not found with id of ${req.params.id}`));
  }

  if(req.user.role !== 'admin' && !req.user._id.equals(review.user._id)){
    return next(new ErrorResponse(401, 'Not Authorized to delete others\' reviews'));
  }
  
  await review.remove();
  
  res.status(200).json({
    success: true, 
    data: {}
  });
});