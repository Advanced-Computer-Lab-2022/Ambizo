import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import course from "../models/course.model.js";
import currencyConverterLt from "currency-converter-lt";

const router = express.Router();
const currencyConverter = new currencyConverterLt();

router.get("/getCourses", verifyJWT, async (req,res) => {
    try{
        if(req.User.Type !== "instructor"){
            return handleError(res, "Invalid Access")
        }
        
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

        filter = {
            InstructorUsername: req.User.Username,
            ...filter
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

router.get("/searchCourses/:searchTerm", verifyJWT, async (req, res) => {
    try {
        if(req.User.Type !== "instructor"){
            return handleError(res, "Invalid Access")
        }

        let filter ={
            InstructorUsername: req.User.Username,
            $or: [
                {Title: {$regex: '.*' + req.params.searchTerm + '.*', $options: 'i'}},
                {Subject: {$regex: '.*' + req.params.searchTerm + '.*', $options: 'i'}}
            ]
        }

        const [courses, exchangeRateToCountry] = await Promise.all(
            [
                course.find(filter)
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

router.post("/createCourse", verifyJWT, async (req, res) => {
    try {
        if(req.User.Type !== "instructor"){
            return handleError(res, "Invalid Access")
        }

        let instructorUsername = req.User.Username;
        let instructorName = req.User.Name;
        
        const newCourse = new course({
            InstructorUsername: instructorUsername,
            InstructorName: instructorName,
            ...(req.body)
        });

        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        handleError(res, err);
    }
});

router.put("/addSubtitleDetails", async (req, res) => {
    try {
        let courseId = req.query.courseId;
        let subtitleIndex = req.query.index;
        const updatedSubtitle = req.body;

        let oldCourse = await course.findById(courseId)

        let newSubtitles = oldCourse.Subtitles;
        newSubtitles[subtitleIndex] = updatedSubtitle;

        await course.findByIdAndUpdate(courseId, {
            Subtitles: newSubtitles
        })
    } catch (err) {
        handleError(res, err);
    }
});

router.post("/addExercise", verifyJWT, async (req, res) => {
    try {
        if(req.User.Type !== "instructor"){
            return handleError(res, "Invalid Access")
        }

        const Course = await course.findById(req.query.courseId);
        if(req.User.Username !== Course.InstructorUsername){
            return handleError(res, "You can only add exercises to your courses")
        }

        Course.Exercises[req.query.exerciseNum] = req.body.newExercise;
        const updatedExercises = Course.Exercises;
        await course.findByIdAndUpdate(req.query.courseId, {Exercises: updatedExercises})

        res.status(201).json(req.body.newExercise);
    } catch (err) {
        handleError(res, err);
    }
});

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;