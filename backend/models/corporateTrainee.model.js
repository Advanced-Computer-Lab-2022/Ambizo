import mongoose from "mongoose";

const Schema = mongoose.Schema;

const corporateTraineeSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  EnrolledCourses: {
    type: Array,
    default: []
  }
}, {
   timestamps: true,
   collection: "corporateTrainees"
  });

const corporateTrainee = mongoose.model('corporateTrainees', corporateTraineeSchema);

export default corporateTrainee;