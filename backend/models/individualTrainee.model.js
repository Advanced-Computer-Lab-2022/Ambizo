import mongoose from "mongoose";

const Schema = mongoose.Schema;

const individualTraineeSchema = new Schema({
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
  Gender: {
    type: String,
    required: false
  },
  EnrolledCourses: {
    type: Array,
    default: []
  },
  WalletAmountInUSD:{
    type: Number,
    default: 0.0
  }
}, {
   timestamps: true,
   collection: "individualTrainees"
  });

const individualTrainee = mongoose.model('individualTrainees', individualTraineeSchema);

export default individualTrainee;