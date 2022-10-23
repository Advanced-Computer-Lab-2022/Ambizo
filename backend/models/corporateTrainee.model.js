import mongoose from "mongoose";

const Schema = mongoose.Schema;

const corporateTraineeSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true
  },
  Corporate: {
    type: String,
    required: true
  },
  PhoneNumber: {
    type: String,
    required: true
  }
}, {
   timestamps: true,
   collection: "corporateTrainees"
  });

const corporateTrainee = mongoose.model('corporateTrainees', corporateTraineeSchema);

export default corporateTrainee;