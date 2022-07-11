import mongoose from "mongoose";
import dotenv from 'dotenv';
import colors from 'colors';
import {connectDB} from './config/db.js';
import {users} from './data/users.js';
import {bootcamps} from './data/bootcamps.js';
import {courses} from './data/courses.js';
import {reviews} from './data/reviews.js';
import user from './models/User.js';
import bootcamp from './models/Bootcamp.js';
import course from './models/Course.js';
import review from './models/Review.js';

dotenv.config();
connectDB();

const importData = async() => {
  try{
    await user.deleteMany();
    await bootcamp.deleteMany();
    await course.deleteMany();
    await review.deleteMany();
    
    await user.create(users);
    await bootcamp.create(bootcamps);
    await course.create(courses);
    await review.create(reviews);
    
    console.log('Data Imported!'.green.inverse);
  }catch(error){
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
}

const destroyData = async() => {
  try{
    await user.deleteMany();
    await bootcamp.deleteMany();
    await course.deleteMany();
    await review.deleteMany();
    
    console.log('Data Destroyed!'.green.inverse);
  }catch(error){
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
}

if(process.argv[2] == '-d'){
  destroyData();
}else{
  importData();
}