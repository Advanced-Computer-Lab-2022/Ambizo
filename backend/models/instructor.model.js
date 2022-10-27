import mongoose from "mongoose";

const Schema = mongoose.Schema;

const instructorSchema = new Schema({
    Username: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    collection: "instructors"
});

const instructor = mongoose.model('instructors', instructorSchema);

export default instructor;