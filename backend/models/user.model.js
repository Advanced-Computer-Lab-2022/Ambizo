import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({

    Username: {
        type: String,
        required: true,
    },
    Type: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    collection: "users"
});


const user = mongoose.model('users', userSchema);

export default user;