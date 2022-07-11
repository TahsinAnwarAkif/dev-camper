import mongoose from "mongoose";
import slugify from 'slugify';
import {geocoder} from '../utils/geocoder.js';
import { BOOTCAMP_DEFAULT_ADDRESS } from "../utils/constants.js";

const bootcampSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please add a user'],
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxLength: [50, 'Name cannot be more than 50 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxLength: [500, 'Name cannot be more than 500 characters']
  },
  website: {
    type: String,
    required: [true, 'Please add a website'],
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please add a valid URL with HTTP or HTTPS'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone'],
    maxLength: [20, 'Phone Number cannot be longer than 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email address'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',  
      'Mobile Development',  
      'UI/UX',  
      'Data Science',  
      'Business',  
      'Other'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must be at least 10']
  },
  averageCost: Number,
  photo: {
    type: String,
    default: '/uploads/no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true},
  timestamps: true
});

bootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
});

bootcampSchema.pre('save', async function(next){
  if(!this.slug || this.isModified('name')){
    this.slug = slugify(this.name, {lower: true});
  }
  
  if(this.address && this.address !== BOOTCAMP_DEFAULT_ADDRESS){
    const geocode = await geocoder.geocode(this.address);
    
    this.location = {
      type: 'Point',
      coordinates: [geocode[0].longitude, geocode[0].latitude],
      formattedAddress: geocode[0].formattedAddress,
      street: geocode[0].streetName,
      city: geocode[0].city,
      state: geocode[0].stateCode,
      zipCode: geocode[0].zipcode,
      country: geocode[0].countryCode
    }
  }
  
  this.address = undefined;
  
  next();
});

bootcampSchema.pre('remove', async function(next){
  await this.model('Course').deleteMany({
    bootcamp: this._id
  });
  
  next();
});

const Bootcamp = mongoose.model('Bootcamp', bootcampSchema);

export default Bootcamp;
