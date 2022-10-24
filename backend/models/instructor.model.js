import mongoose from "mongoose";

const Schema = mongoose.Schema;

const instructorSchema = new Schema({
    Username: {
        type: String,
        required: true,
    },
    InstructorName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    collection: "instructors"
});

const instructor = mongoose.model('instructors', instructorSchema);

export default instructor;