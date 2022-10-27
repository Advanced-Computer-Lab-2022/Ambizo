import mongoose from "mongoose";

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  Title: {
    type: String,
    required: true,
  },
  InstructorUsername: {
    type: String,
    required: true
  },
  InstructorName: {
    type: String,
    required: true
  },
  ImageURL:{
    type: String,
    default:"",
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
    required: true,
    default: 0
  },
  NumberOfReviews: {
    type: Number,
    required: true,
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
    required: true,
    default: []
  },
  CountryDiscount: {
    type: Array,
    required: true,
    default: []
  },
  ImgURL: {
    type: String,
    required: true
  }
}, {
   timestamps: true,
   collection: "courses"
  });

const course = mongoose.model('courses', courseSchema);

export default course;