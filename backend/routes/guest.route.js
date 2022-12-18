import express from "express";
import course from "../models/course.model.js";
import user from "../models/user.model.js";
import instructor from "../models/instructor.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import individualTrainee from "../models/individualTrainee.model.js";
import currencyConverter from "../middleware/currencyConverter.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/getCourses", async (req,res) => {
    try{
        let filter = {}
        let courses = null;
        let exchangeRateToUSD = null;
        let exchangeRateToCountry = null;

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
             [courses, exchangeRateToUSD, exchangeRateToCountry] = await Promise.all(
                [
                    course.find(filter)
                    , 
                    currencyConverter.from(req.query.currencyCode).to("USD").convert()
                    ,
                    currencyConverter.from("USD").to(req.query.currencyCode).convert()
                ]
                );
        }
        else{
            courses = await course.find(filter);
            exchangeRateToCountry = await currencyConverter.from("USD").to(req.query.currencyCode).convert();
        }

        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        courses.forEach(course => {
            if(currentYear > course.DiscountExpiryDate.getFullYear()) {
                course.Discount = 0;
            }
            else if(currentYear == course.DiscountExpiryDate.getFullYear()) {
                if(currentMonth > course.DiscountExpiryDate.getMonth()) {
                    course.Discount = 0;
                }
                else if(currentMonth == course.DiscountExpiryDate.getMonth()) {
                    if(currentDay > course.DiscountExpiryDate.getDate()) {
                        course.Discount = 0;
                    }
                }
            }
        })

        courses.forEach(course => {
            course.PriceInUSD = (course.PriceInUSD * exchangeRateToCountry).toFixed(2)
        })
        res.json(courses);
    }
    catch(err){
        handleError(res, err.message);
    }
})

// db.collection_name.find().limit(number).sort({field_1:1})
// db.courses.find().limit(20).sort({"NumberOfEnrolledStudents": -1})
// courses = await db.courses.find(filter).limit(20).sort({"NumberOfEnrolledStudents": -1})
// course.find(filter);

router.get("/getPopularCourses", async (req,res) => {
    try{
        let filter = {}
        let courses = null;
        let exchangeRateToUSD = null;
        let exchangeRateToCountry = null;

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
             [courses, exchangeRateToUSD, exchangeRateToCountry] = await Promise.all(
                [
                    courses = course.find(filter).limit(20).sort({"NumberOfEnrolledStudents": -1})
                    , 
                    currencyConverter.from(req.query.currencyCode).to("USD").convert()
                    ,
                    currencyConverter.from("USD").to(req.query.currencyCode).convert()
                ]
                );
        }
        else{
            courses = await course.find(filter).limit(20).sort({"NumberOfEnrolledStudents": -1})
            exchangeRateToCountry = await currencyConverter.from("USD").to(req.query.currencyCode).convert();
        }

        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        courses.forEach(course => {
            if(currentYear > course.DiscountExpiryDate.getFullYear()) {
                course.Discount = 0;
            }
            else if(currentYear == course.DiscountExpiryDate.getFullYear()) {
                if(currentMonth > course.DiscountExpiryDate.getMonth()) {
                    course.Discount = 0;
                }
                else if(currentMonth == course.DiscountExpiryDate.getMonth()) {
                    if(currentDay > course.DiscountExpiryDate.getDate()) {
                        course.Discount = 0;
                    }
                }
            }
        })

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

        
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        courses.forEach(course => {
            if(currentYear > course.DiscountExpiryDate.getFullYear()) {
                course.Discount = 0;
            }
            else if(currentYear == course.DiscountExpiryDate.getFullYear()) {
                if(currentMonth > course.DiscountExpiryDate.getMonth()) {
                    course.Discount = 0;
                }
                else if(currentMonth == course.DiscountExpiryDate.getMonth()) {
                    if(currentDay > course.DiscountExpiryDate.getDate()) {
                        course.Discount = 0;
                    }
                }
            }
        })

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

        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        if(currentYear > Course.DiscountExpiryDate.getFullYear()) {
            Course.Discount = 0;
        }
        else if(currentYear == Course.DiscountExpiryDate.getFullYear()) {
            if(currentMonth > Course.DiscountExpiryDate.getMonth()) {
                Course.Discount = 0;
            }
            else if(currentMonth == Course.DiscountExpiryDate.getMonth()) {
                if(currentDay > Course.DiscountExpiryDate.getDate()) {
                    Course.Discount = 0;
                }
            }
        }

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
        let progress = [];
        for(var courseIndex in userWithCourses.EnrolledCourses){
            if(userWithCourses.EnrolledCourses[courseIndex].courseId === req.params.courseId){
                courseFound = true;
                progress = userWithCourses.EnrolledCourses[courseIndex].progress? userWithCourses.EnrolledCourses[courseIndex].progress : [];
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
                subtitlesProgress: progress
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

router.post("/addIndividualTrainee", async (req, res) => {
    try{
        
        let checkDuplicate = await user.findOne({Username: req.body.userName});
        if (checkDuplicate) {
            return handleError(res, "Username already exists!");
        } 
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newIndividualTrainee = new individualTrainee({
                Username: req.body.userName,
                Password: hashedPassword,
                Name: req.body.firstName + " " + req.body.lastName,
                Email: req.body.email,
                Gender: req.body.gender
            });

            const newUser = new user({
                Username: req.body.userName,
                Type: "individualTrainee"
            });

            await newIndividualTrainee.save();
            await newUser.save();
            res.json(newIndividualTrainee);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

export default router;