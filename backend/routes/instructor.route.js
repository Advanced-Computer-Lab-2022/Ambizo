import express from "express";
import instructorRepo from "../models/instructor.model.js";
import course from "../models/course.model.js";

const router = express.Router();

router.get("/getCourses", async (req, res) => {
    try {
        let filter = {};
        if (req.query.subject) {
            filter = { ...filter, Subject: req.query.subject };
        }
        if (req.query.price) {
            const priceRange = req.query.price.split(',');
            const [minPrice, maxPrice] = priceRange;
            filter = { ...filter, PriceInUSD: { $lte: maxPrice, $gte: minPrice } };
        }
        filter = {
            InstructorUsername: req.query.username,
            ...filter
        }

        const courses = await course.find(filter);
        res.status(200).json(courses)
    } catch (err) {
        handleError(res, err);
    }
});

router.get("/getCourseTitles", async (req, res) => {
    try {
        let instructorUsername = req.query.username;
        let courseTitles = await course.find({ InstructorUsername: instructorUsername }, "Title");
        res.status(200).json(courseTitles);
    } catch (err) {
        handleError(res, err.message);
    }
});

router.get("/searchCourses", async (req, res) => {
    try {
        let filter = {};
        if (req.query.coursetitle) {
            filter = { 
                ...filter,
                 Title: {$regex: '.*' + req.query.coursetitle + '.*'}
                }
        }
        if (req.query.subject) {
            filter = { ...filter, Subject: req.query.subject.split(',') };
        }
        if (req.query.instructorname) {
            filter = { 
                ...filter,
                 InstructorName: {$regex: '.*' + req.query.instructorname + '.*'}
                }
        }
        const courses = await course.find(filter);
        res.status(200).json(courses)
    } catch (err) {
        handleError(res, err);
    }
});

router.post("/createCourse", async (req, res) => {
    try {
        let instructorUsername = req.query.username;
        let instructor = await instructorRepo.findOne({Username: instructorUsername});
        console.log(instructor);
        let instructorName = instructor.Name;
        
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


function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;