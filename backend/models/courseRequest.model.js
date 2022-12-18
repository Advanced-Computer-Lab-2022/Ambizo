import mongoose from "mongoose";

const Schema = mongoose.Schema;

const courseRequestSchema = new Schema({

    CorporateTraineeUsername: {
        type: String,
        required: true
    },
    CourseId: {
        type: String,
        required: true
    },
    CourseTitle: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        default: "Processing"
    }

}, {
    timestamps: true,
    collection: "courseRequests"
});


const courseRequest = mongoose.model('courseRequests', courseRequestSchema);

export default courseRequest;