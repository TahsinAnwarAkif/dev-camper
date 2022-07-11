import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';

// @ desc   Get User
// @ route  GET /api/v1/users/:id
// @ access Private
export const getUsers = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

// @ desc   Get Users
// @ route  GET /api/v1/users
// @ access Private
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  
  if(!user){
    return next(new ErrorResponse(404, `User not found with id of ${req.params.id}`));;
  }
  res.status(200).json({
    success: true,
    data: user
  });
});

// @ desc   Create a User
// @ route  POST /api/v1/users
// @ access Private
export const saveUser = asyncHandler(async (req, res, next) => {
  const {name, email, password, role} = req.body;

  if(role === 'admin'){
    return next(new ErrorResponse(401, 'Invalid Role!')); 
  }
  
  let user = new User({name, email, password, role});
  user = await user.save();
  user = user.toObject();
  delete user.password;
  
  return res.status(201).json({
    success: true,
    data: user
  });
});

// @ desc   Update User
// @ route  PUT /api/v1/users/:id
// @ access Private
export const updateUser = asyncHandler(async (req, res, next) => {
  const {name, email, role, password} = req.body;

  if(role === 'admin'){
    return next(new ErrorResponse(401, 'Invalid Role!')); 
  }

  let user = await User.findById(req.params.id).select('+password');
  
  if(!user){
    return next(new ErrorResponse(404, `User not found with id of ${req.params.id}`));;
  }
  
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.password = password || user.password;
  
  user = await user.save();
  user = user.toObject();
  delete user.password;
  
  return res.status(200).json({
    success: true,
    data: user
  });
});

// @ desc   Delete User
// @ route  DELETE /api/v1/users/:id
// @ access Public
export const deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorResponse(404, `User not found with id of ${req.params.id}`));
  }
  
  await user.remove();
    
  res.status(200).json({
    success: true,
    data: {}
  });
});
