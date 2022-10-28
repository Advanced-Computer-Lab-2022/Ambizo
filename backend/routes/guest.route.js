import express from "express";
import course from "../models/course.model.js";
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
            const maxPrice = priceRange[1] * exchangeRateToUSD;
            filter = {...filter, PriceInUSD: {$lte: maxPrice, $gte: minPrice}};
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

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;