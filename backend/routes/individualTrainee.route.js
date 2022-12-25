import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import refundRequest from "../models/refundRequest.model.js";
import individualTrainee from "../models/individualTrainee.model.js";
import course from '../models/course.model.js';
import Stripe from "stripe";
import currencyConverter from "../middleware/currencyConverter.js";
import paymentRecord from "../models/paymentRecord.model.js";

import dotenv from 'dotenv';

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/requestRefund/", verifyJWT, async (req, res) => {
    try {

        if (req.User.Type !== 'individualTrainee') {
            return res.status(400).json({ message: 'Invalid Access' });
        }

        let trainee = await individualTrainee.findOne({ Username: req.User.Username });

        let isEnrolled = false;
        trainee.EnrolledCourses.forEach(course => {
            if (course.courseId === req.query.courseId) {
                isEnrolled = true;
            }
        })

        if (!isEnrolled) {
            return res.status(400).json({ message: 'Cannot refund a course that you are not enrolled in' });
        }

        const newRefundRequest = new refundRequest({
            TraineeUsername: req.User.Username,
            CourseId: req.query.courseId,
            Reason: req.body.reason,
            Description: req.body.description
        });

        await newRefundRequest.save();
        res.status(201).json(newRefundRequest);
    }
    catch (err) {
        handleError(res, err);
    }
})

router.get("/getRefundStatus/", verifyJWT, async (req, res) => {
    if (req.User.Type !== 'individualTrainee') {
        return res.status(400).json({ message: 'Invalid Access' });
    }

    let fetchedRefundRequest = await refundRequest.findOne({ CourseId: req.query.courseId, TraineeUsername: req.User.Username });
    if (fetchedRefundRequest) {
        res.send(fetchedRefundRequest.Status);
    }
    else {
        res.send("None");
    }

});

router.get('/getPaymentKey', verifyJWT, (req, res) => {
    if (req.user && req.User.Type !== 'individualTrainee') {
        return res.status(401).json({ message: 'The user is not authorized to get the payment key.' })
    }
    return res.status(200).json({
        paymentKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
});

router.post('/checkoutDetails', verifyJWT, async (req, res) => {
    if( !req.User || !req.User.Username || !req.User.Type){
        return res.status(401).json({message: 'Failed to authenticate the user.'});
    }

    const { Username, Type } = req.User;

    if( Type !== 'individualTrainee' ){
        return res.status(403).json({
            message: 'The user is not an individual trainee.'
        });
    }

    if (!req.body.courseId || !req.body.currency) {
        return res.status(400).json({
            message: 'The courseId and currency fields need to be provided in the request body.'
        });
    }
    const { courseId, currency } = req.body;

    const trainee = await individualTrainee.findOne({
        Username: Username
    }); 

    if( !trainee ){
        return res.status(404).json({
            message: 'Invalid individualTrainee'
        });
    }

    const courseToBuy = await course.findById(courseId);
    if( !courseToBuy ){
        return res.status(404).json({
            message: 'Invalid course ID.'
        });
    }

    const traineeOwnsCourse = false;
    trainee.EnrolledCourses.forEach(courseEnrolled => {
        if(courseEnrolled.CourseId === courseId){
            traineeOwnsCourse = true;
        }
    });

    if(traineeOwnsCourse){
        return res.status(403).json({
            message: 'The user already owns this course.'
        });
    }

    const courseOriginalPriceInUSD = courseToBuy.PriceInUSD;
    let discountAmountInUSD = 0;

    if(courseToBuy.Discount){
        discountAmountInUSD = (courseOriginalPriceInUSD * (courseToBuy.Discount / 100)).toFixed(2);
        
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
    
        if(currentYear > courseToBuy.DiscountExpiryDate.getFullYear()) {
            discountAmountInUSD = 0;
        }
        else if(currentYear == courseToBuy.DiscountExpiryDate.getFullYear()) {
            if(currentMonth > courseToBuy.DiscountExpiryDate.getMonth()) {
                discountAmountInUSD = 0;
            }
            else if(currentMonth == courseToBuy.DiscountExpiryDate.getMonth()) {
                if(currentDay > courseToBuy.DiscountExpiryDate.getDate()) {
                    discountAmountInUSD = 0;
                }
            }
        }
    
    }
    let amountToBePaidInUSD = courseOriginalPriceInUSD - discountAmountInUSD;
    let amountPaidFromWalletInUSD = 0;

    // Check the user wallet first then create the payment intent...
    if(trainee.WalletAmountInUSD >= amountToBePaidInUSD){
        amountPaidFromWalletInUSD = amountToBePaidInUSD;
        amountToBePaidInUSD = 0.0;
    }else{
        amountPaidFromWalletInUSD = trainee.WalletAmountInUSD;
        amountToBePaidInUSD = amountToBePaidInUSD - amountPaidFromWalletInUSD;
    }

    amountToBePaidInUSD = amountToBePaidInUSD.toFixed(2);
    let exchangeRate = await currencyConverter.from('USD').to(currency).convert();
    //TODO Add the course id and the user username and more info in the metadata.
    try{
        let paymentIntent;
        if(amountToBePaidInUSD > 0){
            paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: amountToBePaidInUSD * 100,
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                    amountToBePaidInUSD: amountToBePaidInUSD,
                    amountPaidFromWalletInUSD: amountPaidFromWalletInUSD,
                    currencyUserPaidWith: currency
                }
            });
        }
        const dummyClientSecret = "pi_3MIEOECiBvnkrLCQ1sHEVIPC_secret_6TJnjfvdbcSPB4hQQWxMHhtDi";
        return res.status(200).json({
            courseDetails:{
                title: courseToBuy.Title,
                instructorName: courseToBuy.InstructorName,
                rating: courseToBuy.Rating,
                numberOfRatings: courseToBuy.NumberOfReviews,
                image: courseToBuy.ImgURL,
                duration: courseToBuy.TotalMinutes
            },
            courseOriginalPrice: parseFloat((courseOriginalPriceInUSD * exchangeRate).toFixed(2)),
            discountAmount: parseFloat((discountAmountInUSD * exchangeRate).toFixed(2)),
            amountPaidFromWallet: parseFloat((amountPaidFromWalletInUSD * exchangeRate).toFixed(2)),
            amountToBePaid: parseFloat((amountToBePaidInUSD * exchangeRate).toFixed(2)),
            clientSecret: paymentIntent? paymentIntent.client_secret : dummyClientSecret
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: 'An error has occured while creating the payment intent.'
        });
    }
});

router.post('/enrollInFreeCourse/:courseId', verifyJWT, async (req, res) => {

    if(!req.params.courseId ){
        return res.status(400).json({
            message: 'The courseId must be sent as a query parameter in the URL.'
        })
    }
    const { courseId } = req.params;

    if( !req.User || !req.User.Username || !req.User.Type){
        return res.status(401).json({message: 'Failed to authenticate the user.'});
    }
    const { Username, Type } = req.User;

    if( Type !== 'individualTrainee' ){
        return res.status(403).json({
            message: 'The user is not an individual trainee.'
        });
    }

    const trainee = await individualTrainee.findOne({Username: Username});
    if( !trainee ){
        return res.status(404).json({
            message: 'Invalid Username'
        });
    }
    let isCourseOwned = false;
    trainee.EnrolledCourses.forEach(ownedCourse => {
        if(ownedCourse.courseId === courseId){
            isCourseOwned = true;
        }
    });
    if(isCourseOwned){
        return res.status(400).json({
            message: 'The user already owns this course.'
        });
    }

    const courseToEnrollIn = await course.findById(courseId);
    if( !courseToEnrollIn ){
        return res.status(404).json({
            message: 'Invalid course ID'
        });
    }
    if( courseToEnrollIn.PriceInUSD !== 0){
        return res.status(400).json({
            message: 'This endpoint is only for free courses.'
        })
    }

    trainee.EnrolledCourses.push({
        courseId: courseToEnrollIn._id.toString(),
        exercises: new Array(courseToEnrollIn.Exercises.length),
        progress: new Array(courseToEnrollIn.Subtitles.length),
        certificateSent: false
    })

    const courseStudents = courseToEnrollIn.NumberOfEnrolledStudents;
    courseToEnrollIn.NumberOfEnrolledStudents = courseStudents + 1;
    trainee.save().then(_ => {
        courseToEnrollIn.save().then(_ => {
            return res.status(201).json({
                message: 'Trainee Enrolled successfully'
            });
        }).catch(error => {
            console.log(error.message);
            return res.status(500).json({
                message: 'An error cas occured while updating the course in DB'
            });               
        })
    }).catch(error => {
        console.log(error.message);
        return res.status(500).json({
            message: 'An error cas occured while saving the trainee in DB'
        });
    });


});

router.post('/fulfillCoursePayment', verifyJWT, async (req, res) => {

    if( !req.body.courseId || !req.body.currencyCode 
        || !req.body.courseOriginalPrice || !req.body.discountAmount || !req.body.amountPaidFromWallet){
        return res.status(400).json({
            message: 'The (courseId), (currencyCode),(courseOriginalPrice),(discountAmount),(amountPaidFromWallet) and (amountToBePaid) fields are all required.'
        });
    }

    const { courseId, currencyCode, courseOriginalPrice, discountAmount, amountPaidFromWallet} = req.body;

    if( !req.User || !req.User.Username || !req.User.Type){
        return res.status(401).json({message: 'Failed to authenticate the user.'});
    }
    const { Username, Type } = req.User;

    if( Type !== 'individualTrainee' ){
        return res.status(403).json({
            message: 'The user is not an individual trainee.'
        });
    }

    const trainee = await individualTrainee.findOne({Username: Username});
    if( !trainee ){
        return res.status(404).json({
            message: 'Invalid Username'
        });
    }

    let isCourseOwned = false;
    trainee.EnrolledCourses.forEach(ownedCourse => {
        if(ownedCourse.courseId === courseId){
            isCourseOwned = true;
        }
    });
    if(isCourseOwned){
        return res.status(400).json({
            message: 'The user already owns this course.'
        });
    }

    const courseToEnrollIn = await course.findById(courseId);
    if( !courseToEnrollIn ){
        return res.status(404).json({
            message: 'Invalid course ID'
        });
    }
    if( courseToEnrollIn.PriceInUSD === 0){
        return res.status(400).json({
            message: 'This endpoint is only for paid courses.'
        })
    }
    
    let exchangeRate = await currencyConverter.from(currencyCode).to('USD').convert();
    let exchangeRateToCurrency = await currencyConverter.from('USD').to(currencyCode).convert();

    const moneyMadeInDollars = (courseOriginalPrice - discountAmount)*exchangeRate;
    const amountPaidFromWalletInUSD = parseFloat((amountPaidFromWallet*exchangeRate).toFixed(2));

    const newPaymentRecord = new paymentRecord({
        CourseId: courseId,
        InstructorUsername: courseToEnrollIn.InstructorUsername,
        TraineeUsername: Username,
        CurrencyCodeUsed: currencyCode,
        CourseOriginalPriceInUSD: parseFloat((courseOriginalPrice*exchangeRate).toFixed(2)),
        DiscountAmountInUSD: parseFloat((discountAmount*exchangeRate).toFixed(2)),
        ExchangeRateToCurrency: exchangeRateToCurrency,
        InstructorProfitInUSD: parseFloat((moneyMadeInDollars*0.85).toFixed(2)),
        WebsiteProfitInUSD: parseFloat((moneyMadeInDollars*0.15).toFixed(2))
    });
    
    newPaymentRecord.save().then(_ =>{
        const traineeOldWallet = trainee.WalletAmountInUSD;

        trainee.WalletAmountInUSD = parseFloat((traineeOldWallet - amountPaidFromWalletInUSD).toFixed(2));
        trainee.EnrolledCourses.push({
            courseId: courseToEnrollIn._id.toString(),
            exercises: new Array(courseToEnrollIn.Exercises.length),
            progress: new Array(courseToEnrollIn.Subtitles.length),
            certificateSent: false
        });

        const courseStudents = courseToEnrollIn.NumberOfEnrolledStudents;
        courseToEnrollIn.NumberOfEnrolledStudents = courseStudents + 1;

        trainee.save().then(_ => {
            courseToEnrollIn.save().then(_ => {
                return res.status(201).json({
                    message: 'Trainee Enrolled successfully'
                });
            }).catch(error => {
                console.log(error.message);
                return res.status(500).json({
                    message: 'An error has occured while updating the course in DB'
                });               
            })
        }).catch(error => {
            console.log(error.message);
            return res.status(500).json({
                message: 'An error has occured while saving the trainee in DB'
            });
        });
    }).catch(error => {
        console.log(error.message);
        return res.status(500).json({
            message: 'An error has occured while saving the payment record.'
        });
    })


});

router.get('/walletAmount', verifyJWT, async (req, res) => {
    if( !req.User || !req.User.Username || !req.User.Type){
        return res.status(401).json({message: 'Failed to authenticate the user.'});
    }
    const { Username, Type } = req.User;

    if( Type !== 'individualTrainee' ){
        return res.status(403).json({
            message: 'The user is not an individual trainee.'
        });
    }

    const trainee = await individualTrainee.findOne({Username: Username});
    if( !trainee ){
        return res.status(404).json({
            message: 'Invalid Username'
        });
    }

    const walletAmountInDollars = trainee.WalletAmountInUSD;
    const currencyCode = req.query.currencyCode;
    const exchangeRate = await currencyConverter.from('USD').to(currencyCode).convert();

    return res.status(200).json({
        wallet: parseFloat((walletAmountInDollars*exchangeRate).toFixed(2))
    });


});

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;