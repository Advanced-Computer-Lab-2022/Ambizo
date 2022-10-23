import express from "express";
import course from "../models/course.model.js";

const router = express.Router();

router.get("/getCourses", async (req,res) => {
    try{
        let filter = {}
        if(req.query.subject){
            filter = {...filter, Subject: req.query.subject.split(',')};
        }
        if(req.query.rating){
            filter = {...filter, Rating: {$gte: req.query.rating}};
        }
        if(req.query.price){
            const priceRange = req.query.price.split(',');
            const minPrice = priceRange[0];
            const maxPrice = priceRange[1];
            filter = {...filter, PriceInUSD: {$lte: maxPrice, $gte: minPrice}};
        }
        let courses = await course.find(filter);
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