import express from "express";
import course from "../models/course.model.js";
import user from "../models/user.model.js";
import currencyConverterLt from "currency-converter-lt";

const router = express.Router();
const currencyConverter = new currencyConverterLt();

router.get("/getCourses", async (req,res) => {
    try{
        let filter = {}
        let exchangeRateToUSD = await currencyConverter.from(req.query.currencyCode).to("USD").convert();
        let exchangeRateToCountry = await currencyConverter.from("USD").to(req.query.currencyCode).convert();

        if(req.query.subject){
            filter = {...filter, Subject: req.query.subject.split(',')};
        }
        if(req.query.rating){
            filter = {...filter, Rating: {$gte: req.query.rating}};
        }
        if(req.query.price){
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

        let courses = await course.find(filter);
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
        let exchangeRateToCountry = await currencyConverter.from("USD").to(req.query.currencyCode).convert();
        
        let courses = await course.find({
            $or: [
                {Title: {$regex: '.*' + req.params.searchTerm + '.*', $options: 'i'}},
                {Subject: {$regex: '.*' + req.params.searchTerm + '.*', $options: 'i'}},
                {InstructorName: {$regex: '.*' + req.params.searchTerm + '.*', $options: 'i'}}
            ]
        });

        courses.forEach(course => {
            course.PriceInUSD = (course.PriceInUSD * exchangeRateToCountry).toFixed(2)
        })
        res.status(200).json(courses)
    } catch (err) {
        handleError(res, err);
    }
});

router.get("/getCourse/:courseId", async (req,res) => {
    try {
        let exchangeRateToCountry = await currencyConverter.from("USD").to(req.query.currencyCode).convert();

        let Course = await course.findById(req.params.courseId);

        Course.PriceInUSD = (Course.PriceInUSD * exchangeRateToCountry).toFixed(2);

        res.json(Course);    
    }
    catch(err) {
        handleError(res, err.message);
    }
})

router.get("/getUserType/:username", async (req,res) => {
    try{
        let User = await user.findOne({Username: req.params.username});
        if(!User){
            return handleError(res, "Invalid username or password");    
        }
        res.json(User);
    }
    catch(err){
        handleError(res, err.message);
    }
})

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;