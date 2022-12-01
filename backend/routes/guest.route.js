import express from "express";
import course from "../models/course.model.js";
import user from "../models/user.model.js";
import currencyConverterLt from "currency-converter-lt";
import instructor from "../models/instructor.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import individualTrainee from "../models/individualTrainee.model.js";

const router = express.Router();
const currencyConverter = new currencyConverterLt();

router.get("/getCourses", async (req,res) => {
    try{
        let filter = {}
        let courses = null;
        let exchangeRateToUSD = null;

        if(req.query.subject){
            filter = {...filter, Subject: req.query.subject.split(',')};
        }
        if(req.query.rating){
            filter = {...filter, Rating: {$gte: req.query.rating}};
        }
        if(req.query.price){
            exchangeRateToUSD = await currencyConverter.from(req.query.currencyCode).to("USD").convert()
            const priceRange = req.query.price.split(',');
            const minPrice = priceRange[0] * exchangeRateToUSD;
            let maxPrice = priceRange[1] * exchangeRateToUSD;
            if(maxPrice){
                if(maxPrice < 0){
                    maxPrice = 0;
                }
                filter = {...filter, PriceInUSD: {$lte: maxPrice, $gte: minPrice}};
            }
            else{
                filter = {...filter, PriceInUSD: {$gte: minPrice}};
            }
        }
        if(req.query.searchTerm){
            filter ={
                ...filter,
                $or: [
                    {Title: {$regex: '.*' + req.query.searchTerm + '.*', $options: 'i'}},
                    {Subject: {$regex: '.*' + req.query.searchTerm + '.*', $options: 'i'}},
                    {InstructorName: {$regex: '.*' + req.query.searchTerm + '.*', $options: 'i'}}
                ]
            }
        }

        if(!req.query.price){
             [courses, exchangeRateToUSD] = await Promise.all(
                [
                    course.find(filter)
                    , 
                    currencyConverter.from(req.query.currencyCode).to("USD").convert()
                ]
                );
        }
        else{
            courses = await course.find(filter);
        }

        const exchangeRateToCountry = 1/exchangeRateToUSD;

        courses.forEach(course => {
            course.PriceInUSD = (course.PriceInUSD * exchangeRateToCountry).toFixed(2)
        })
        res.json(courses);
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.get("/searchCourses/:searchTerm", async (req, res) => {
    try {
        const [courses, exchangeRateToCountry] = await Promise.all(
            [
                course.find({
                    $or: [
                        {Title: {$regex: '.*' + req.params.searchTerm + '.*', $options: 'i'}},
                        {Subject: {$regex: '.*' + req.params.searchTerm + '.*', $options: 'i'}},
                        {InstructorName: {$regex: '.*' + req.params.searchTerm + '.*', $options: 'i'}}
                    ]
                 })
                , 
                currencyConverter.from("USD").to(req.query.currencyCode).convert()
            ]
            );

        courses.forEach(course => {
            course.PriceInUSD = (course.PriceInUSD * exchangeRateToCountry).toFixed(2)
        })
        res.status(200).json(courses)
    } catch (err) {
        handleError(res, err);
    }
});


// This route should be GET but was changed to POST to make axios able to send a body;
router.post("/getCourse/:courseId", async (req,res) => {
    try {
        const [Course, exchangeRateToCountry] = await Promise.all(
            [
                course.findById(req.params.courseId)
                , 
                currencyConverter.from("USD").to(req.query.currencyCode).convert()
            ]
            );

        Course.PriceInUSD = (Course.PriceInUSD * exchangeRateToCountry).toFixed(2);
        
        if( !req.body.TraineeUsername ){
            let result = {
                traineeEnrolled: false,
                traineeCourseRate: null,
                traineeInstructorRate: null,
                courseData: Course,
            }
            return res.status(200).json(result);   
        }

        const traineeUsername = req.body.TraineeUsername;

        const userRequesting = await user.findOne({Username: traineeUsername});
        
        if( !userRequesting ){
            return req.status(500).json({message: 'An error has occured while fetching the trainee.'});
        }
        
        let userWithCourses;
        switch(userRequesting.Type){
            case 'individualTrainee':
                userWithCourses = await individualTrainee.findOne({Username: traineeUsername});
                break;
            case 'corporateTrainee':
                userWithCourses = await corporateTrainee.findOne({Username: traineeUsername});
                break;
        }
    
    
        if(!userWithCourses || !userWithCourses.EnrolledCourses){
            return res.status(500).json({message: 'An error has occured while fetching the user and the courses of the user'})
        }

        let courseFound = false;
        for(var courseIndex in userWithCourses.EnrolledCourses){
            if(userWithCourses.EnrolledCourses[courseIndex].courseId === req.params.courseId){
                courseFound = true;
                break;
            }
        }

        if( !courseFound ){
            let result = {
                traineeEnrolled: false,
                traineeCourseRate: null,
                traineeInstructorRate: null,
                courseData: Course,
            }
            res.status(200).json(result); 
        }else{

            let courseRating = null;
            for(var rating in Course.Ratings){
                if(Course.Ratings[rating].TraineeUsername === traineeUsername){
                    courseRating = {
                        Rating: Course.Ratings[rating].Rating,
                        Review: Course.Ratings[rating].Review,
                    };
                    break;
                }
            }

            let instructorRating = null;
            const courseInstructor = await instructor.findOne({Username: Course.InstructorUsername});
            for(var rate in courseInstructor.Ratings){
                if(courseInstructor.Ratings[rate].TraineeUsername === traineeUsername){
                    instructorRating = {
                      Rating: courseInstructor.Ratings[rate].Rating,
                      Review: courseInstructor.Ratings[rate].Review,
                    };
                    break;
                }
            }
            let result = {
                traineeEnrolled: true,
                traineeCourseRate: courseRating,
                traineeInstructorRate: instructorRating,
                courseData: Course,
            }
            return res.status(200).json(result);
        }
    
         
    }
    catch(err) {
        handleError(res, err.message);
    }
})

router.get("/getSubtitleName", async (req, res) => {
    try{
        
        const Course = await course.findById(req.query.courseId);
        res.send(Course.Subtitles[Number.parseInt(req.query.subtitleNum)].subtitle);
    }
    catch(error){
        handleError(res,error);
    }
});

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;