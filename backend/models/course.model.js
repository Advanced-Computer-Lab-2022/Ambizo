import mongoose from "mongoose";

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  Title: {
    type: String,
    required: true,
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
    required: true
  },
  NumberOfReviews: {
    type: String,
    required: true
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
    required: true
  },
  CountryDiscount: {
    type: Array,
    required: true
  }
}, {
   timestamps: true,
   collection: "courses"
  });

const course = mongoose.model('courses', courseSchema);

export default course;