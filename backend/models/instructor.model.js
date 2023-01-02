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
    },
    Email: {
      type: String,
      required: true
    },
    Rating: {
        type: Number,
        default: 0
    },
    Ratings: {
        type: Array,
        default: []
    },
    AcceptedContract: {
        type: Boolean,
        default: false
    },
    Bio: {
        type: String,
        default: ""
    },
    Website: {
        type: String,
        default: ""
    },
    LinkedIn: {
        type: String,
        default: ""
    },
    ProfileImage: {
        type: String,
        default: ""
    },
    WalletAmountInUSD:{
        type: Number,
        default: 0.0
    }
}, {
    timestamps: true,
    collection: "instructors"
});

const instructor = mongoose.model('instructors', instructorSchema);

export default instructor;