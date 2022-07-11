import asyncHandler from 'express-async-handler';
import { geocoder } from '../utils/geocoder.js';
import Bootcamp from '../models/Bootcamp.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import {
  BOOTCAMP_DEFAULT_ADDRESS, 
  DEFAULT_PAGE_LIMIT,
  BOOTCAMP_DEFAULT_WORLD_RADIUS
} from '../utils/constants.js';

// @ desc   Get Bootcamps
// @ route  GET /api/v1/bootcamps
// @ access Public
export const getBootcamps = asyncHandler(async (req, res) => {  
  res.status(200).json(res.advancedResults);
});

// @ desc   Get Bootcamps within Radius
// @ route  GET /api/v1/bootcamps/search/radius/:zipCode/:distance
// @ access Public
export const getBootcampsInRadius = asyncHandler(async (req, res) => {
  const {zipCode, distance} = req.params;
  const geocode = await geocoder.geocode(zipCode);
  const {latitude, longitude} = geocode[0];
  const radius = distance / BOOTCAMP_DEFAULT_WORLD_RADIUS;
  
  let bootcamps = Bootcamp
    .find({
      location: { 
        $geoWithin: { $centerSphere: [ [ longitude, latitude ], radius ] } }
      });
  bootcamps = await bootcamps.populate('user', 'name email', User);
    
  res.status(200).json({
    success: true,
    dataCount: bootcamps.length,
    data: bootcamps
  });
});

// @ desc   Get Bootcamp by id
// @ route  GET /api/v1/bootcamps/:id
// @ access Public
export const getBootcamp = asyncHandler(async (req, res, next) => {  
  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp){
    return next(new ErrorResponse(404, `Bootcamp not found with id of ${req.params.id}`));
  }
  
  res.status(200).json({
      success: true,
      data: bootcamp
  });
});

// @ desc   Create New Bootcamp
// @ route  POST /api/v1/bootcamps
// @ access Private
export const saveBootcamp = asyncHandler(async (req, res, next) => {  
  if(req.user.role !== 'admin'){
    const hasAnyBootcamp = await Bootcamp.countDocuments({user: req.user._id}) > 0;
    
    if(hasAnyBootcamp){
      return next(new ErrorResponse(401, `The user with ID of ${req.user._id} has already published a bootcamp`));
    }
  }
  
  const {
    name,
    description,
    website,
    phone,
    email,
    address,
    careers = [],
    housing,
    jobAssistance,
    jobGuarantee,
    acceptGi
  } = req.body;
  
  let bootcamp = new Bootcamp({
    user: req.user._id,
    name,
    description,
    website,
    phone,
    email,
    address,
    careers,
    housing,
    jobAssistance,
    jobGuarantee,
    acceptGi
  });
  
  bootcamp = await bootcamp.save();
  
  res.status(201).json({
    success: true, 
    data: bootcamp
  });
});

// @ desc   Update Bootcamp by id
// @ route  PUT /api/v1/bootcamps/:id
// @ access Private
export const updateBootcamp = asyncHandler(async (req, res, next) => {  
  let bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp){
    return next(new ErrorResponse(404, `Bootcamp not found with id of ${req.params.id}`));
  }
  
  if(req.user.role !== 'admin'){
    const isOwner = bootcamp.user.equals(req.user._id);
    
    if(!isOwner){
      return next(new ErrorResponse(401, `The user with ID of ${req.user._id} is not the owner of this bootcamp`));
    }
  }
  
  const {
    name,
    description,
    website,
    phone,
    email,
    address,
    careers = [],
    housing,
    jobAssistance,
    jobGuarantee,
    acceptGi
  } = req.body;
  
  bootcamp.name = name || bootcamp.name;
  bootcamp.description = description || bootcamp.description;
  bootcamp.website = website || bootcamp.website;
  bootcamp.phone = phone || bootcamp.phone;
  bootcamp.email = email || bootcamp.email;
  bootcamp.address = address || BOOTCAMP_DEFAULT_ADDRESS;
  bootcamp.careers = careers.length !== 0 ? careers : bootcamp.careers;
  bootcamp.housing = housing || bootcamp.housing;
  bootcamp.jobAssistance = jobAssistance || bootcamp.jobAssistance;
  bootcamp.jobGuarantee = jobGuarantee || bootcamp.jobGuarantee;
  bootcamp.acceptGi = acceptGi || bootcamp.acceptGi;
  
  bootcamp = await bootcamp.save();
    
  res.status(200).json({
    success: true, 
    data: bootcamp
  });
});

// @ desc   Delete Bootcamp by id
// @ route  DELETE /api/v1/bootcamps/:id
// @ access Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {  
  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp){
    return next(new ErrorResponse(404, `Bootcamp not found with id of ${req.params.id}`));
  }

  if(req.user.role !== 'admin'){
    const isOwner = bootcamp.user.equals(req.user._id);
    
    if(!isOwner){
      return next(new ErrorResponse(401, `The user with ID of ${req.user._id} is not the owner of this bootcamp`));
    }
  }
  
  await bootcamp.remove();
    
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @ desc   Upload Bootcamp Photo
// @ route  PUT /api/v1/bootcamps/:id/photo
// @ access Private
export const uploadBootcampPhoto = asyncHandler(async (req, res, next) => {  
  let bootcamp = await Bootcamp.findById(req.params.id);  

  if(!bootcamp){
    return next(new ErrorResponse(404, `Bootcamp not found with id of ${req.params.id}`));
  }

  if(req.user.role !== 'admin'){
    const isOwner = bootcamp.user.equals(req.user._id);
    
    if(!isOwner){
      return next(new ErrorResponse(401, `The user with ID of ${req.user._id} is not the owner of this bootcamp`));
    }
  }
  
  if(req.file && req.file.path){
    bootcamp.photo = `/${req.file.path}`;
    bootcamp = await bootcamp.save({validateBeforeSave: false});
  
    res.status(200).json({
        success: true,
        data: bootcamp
    });
  }else{
    next(new ErrorResponse(500, 'Something went wrong'));
  }
});
