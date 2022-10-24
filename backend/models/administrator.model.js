import mongoose from "mongoose";

const Schema = mongoose.Schema;

const administratorSchema = new Schema({

    Username: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
  },
}, {
    timestamps: true,
    collection: "administrators"
});


const administrator = mongoose.model('administrators', administratorSchema);

export default administrator;