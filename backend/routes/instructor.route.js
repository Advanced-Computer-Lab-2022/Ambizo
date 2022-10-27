import express from "express";
import instructorRepo from "../models/instructor.model.js";
import course from "../models/course.model.js";
import bodyParser from "body-parser";

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
            Username: req.query.username,
            ...filter
        }

        const courses = await course.find(filter);
        res.status(200).json(course)
    } catch (err) {
        handleError(res, err);
    }
});

router.get("/getCourseTitles", async (req, res) => {
    try {
        let instructorUsername = req.query.username;
        let courseTitles = await course.find({ Username: instructorUsername }, "Title");
        res.status(200).json(courseTitles);
    } catch (err) {
        handleError(res, err.message);
    }
});

router.get("/searchCourses", async (req, res) => {
    try {
        let filter = {};
        if (req.query.coursetitle) {
            filter = { ...filter, Title: req.query.coursetitle }
        }
        if (req.query.subject) {
            filter = { ...filter, Subject: req.query.subject.split(',') };
        }
        if (req.query.instructorname) {
            filter = { ...filter, InstructorName: instructorname }
        }
        const courses = await course.find(filter);
        res.status(200).json(course)
    } catch (err) {
        handleError(res, err);
    }
});

router.post("/createCourse", bodyParser.urlencoded({ extended: true }), async (req, res) => {
    try {

        let instructorUsername = req.query.username;
        let instructor = await instructorRepo.find({Username: instructorUsername});
        let instructorName = instructor.InstructorName;

        const newCourse = new course({
            InstructorUsername: instructorUsername,
            InstructorName: instructorName,
            ...(req.body)
        });

        await newCourse.save();
        res.status(201);
    } catch (err) {
        handleError(res, err)
    }
});


function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;