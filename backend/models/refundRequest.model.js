import mongoose from "mongoose";

const Schema = mongoose.Schema;

const refundRequestSchema = new Schema({

    TraineeUsername: {
        type: String,
        required: true
    },
    CourseId: {
        type: String,
        required: true
    },
    Reason: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        default: "Processing"
    }
    
}, {
    timestamps: true,
    collection: "refundRequests"
});


const refundRequest = mongoose.model('refundRequests', refundRequestSchema);

export default refundRequest;