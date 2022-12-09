import mongoose from "mongoose";

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  Title: {
    type: String,
    required: true,
  },
  CoursePreviewLink: {
    type: String,
    default: ""
  },
  InstructorUsername: {
    type: String,
    required: true
  },
  InstructorName: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true,
  },
  TotalHours: {
    type: Number,
    required: true
  },
  Rating: {
    type: Number,
    default: 0
  },
  Ratings:{
    type: Array,
    default: []
  },
  NumberOfReviews: {
    type: Number,
    default: 0
  },
  PriceInUSD: {
    type: Number,
    required: true
  },
  Subject: {
    type: String,
    required: true
  },
  Subtitles: {
    type: Array,
    required: true
  },
  Exercises: {
    type: Array,
    default: []
  },
  Discount: {
    type: Number,
    default: 0
  },
  DiscountExpiryDate: {
    type: Date,
    default: Date.now
  },
  ImgURL: {
    type: String,
    default: ""
  }
}, {
   timestamps: true,
   collection: "courses"
  });

const course = mongoose.model('courses', courseSchema);

export default course;