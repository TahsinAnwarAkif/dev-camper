import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: Number,
    required: [true, 'Please add weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add tuition fee']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add minimum skills required'],
    enum: [
      'Beginner',  
      'Intermediate',  
      'Advanced'
    ]
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please add a bootcamp'],
    ref: 'Bootcamp'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please add a user'],
    ref: 'User'
  }
}, {
  timestamps: true
});

courseSchema.statics.updateAverageCostOfBootcamp = async function(bootcampId){
  const aggregator = await this.aggregate([
    {
      $match: {bootcamp: bootcampId}
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: {$avg: '$tuition'}
      }
    }
  ]);

  try{
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(aggregator[0].averageCost / 10) * 10
    })
  }catch(error){
    console.log(error);
  }
}

courseSchema.post('save', async function(){
  this.constructor.updateAverageCostOfBootcamp(this.bootcamp);
});

courseSchema.pre('remove', async function(){
  this.constructor.updateAverageCostOfBootcamp(this.bootcamp);
});

const Course = mongoose.model('Course', courseSchema);

export default Course;