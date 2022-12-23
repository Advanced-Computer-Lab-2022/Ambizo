import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reportSchema = new Schema({

    Username: {
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
    Description: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        default: "unseen"
    },
    FollowUp: {
        type: String,
    }

}, {
    timestamps: true,
    collection: "reports"
});


const report = mongoose.model('reports', reportSchema);

export default report;