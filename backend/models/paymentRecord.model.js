import mongoose from "mongoose";

const Schema = mongoose.Schema;

const paymentRecordSchema = new Schema({
    CourseId: {
        type: String,
        required: true
    },
    InstructorUsername:{
        type: String,
        required: true
    },
    TraineeUsername:{
        type: String,
        required: true
    },
    CurrencyCodeUsed:{
        type: String,
        required: true
    },
    CourseOriginalPriceInUSD:{
        type: Number,
        required: true
    },
    DiscountAmountInUSD:{
        type: Number,
        required: true
    },
    ExchangeRateToCurrency:{
        type:Number,
        required: true
    },
    InstructorProfitInUSD:{
        type: Number,
        required: true,
    },
    WebsiteProfitInUSD:{
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: "paymentRecords"
});

const paymentRecord = mongoose.model('paymentRecords', paymentRecordSchema);

export default paymentRecord;





















