import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  text: {
    type: String,
    required: [true, 'Please add a text']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 and 10']
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Bootcamp'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
}, {
  timestamps: true
});

reviewSchema.index({bootcamp: 1, user: 1}, {unique: true});

reviewSchema.post('save', async function(){
  this.constructor.updateAverageRatingOfBootcamp(this.bootcamp);
});

reviewSchema.pre('remove', async function(){
  this.constructor.updateAverageRatingOfBootcamp(this.bootcamp);
});

reviewSchema.statics.updateAverageRatingOfBootcamp = async function(bootcampId){
  const aggregator = await this.aggregate([
    {
      $match: {bootcamp: bootcampId}
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: {$avg: '$rating'}
      }
    }
  ]);

  try{
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: aggregator[0].averageRating
    })
  }catch(error){
    console.log(error);
  }
}

const review = mongoose.model('Review', reviewSchema);

export default review;