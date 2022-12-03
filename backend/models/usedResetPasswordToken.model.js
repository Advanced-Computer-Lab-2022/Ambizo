import mongoose from "mongoose";

const Schema = mongoose.Schema;

const usedResetPasswordTokenSchema = new Schema({
    ResetToken: {
        type:String,
        required: true,
    },
}, {
    timestamps: true,
    collection: "usedResetPasswordTokens"
});


const usedResetPasswordToken = mongoose.model('usedResetPasswordTokens', usedResetPasswordTokenSchema);

export default usedResetPasswordToken;
