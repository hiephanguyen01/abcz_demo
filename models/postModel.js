const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A post must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    address: {
      type: String,
      required: [true, 'A post must have a Address'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratung must be about 1'],
      max: [5, 'Ratung must be about 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    price: {
      type: Number,
      required: [true, 'A post must have a price'],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a  descriptiom'],
    },
    description: {
      type: String,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
postSchema.pre(/^find/, function (next) {
  this.find({ isVisible: { $ne: true } });
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
