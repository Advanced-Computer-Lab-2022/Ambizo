import express from "express";
import bcrypt from "bcrypt";
import verifyJWT from "../middleware/verifyJWT.js";
import administrator from "../models/administrator.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import instructor from "../models/instructor.model.js";
import user from "../models/user.model.js";
import course from "../models/course.model.js";
import currencyConverter from "../middleware/currencyConverter.js";

const router = express.Router();


function handleError(res, err) {
    return res.status(400).send(err);
}


router.post("/addAdministrator", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "admin"){
            return handleError(res, "Invalid Access")
        }

        let checkDuplicate = await user.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "Username already exists!");
        } 
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            
            const newAdministrator = new administrator({
                Username: req.body.username,
                Password: hashedPassword
            });

            const newUser = new user({
                Username: req.body.username,
                Type: "admin"
            });
    
            await newAdministrator.save();
            await newUser.save();
            res.json(newAdministrator);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.post("/addInstructor", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "admin"){
            return handleError(res, "Invalid Access")
        }

        let checkDuplicate = await user.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "Username already exists!");
        } 
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newInstructor = new instructor({
                Username: req.body.username,
                Password: hashedPassword,
                Name: req.body.name,
                Email: req.body.email
            });

            const newUser = new user({
                Username: req.body.username,
                Type: "instructor"
            });
    
            await newInstructor.save();
            await newUser.save();
            res.json(newInstructor);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.post("/addCorporateTrainee", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "admin"){
            return handleError(res, "Invalid Access")
        }
        
        let checkDuplicate = await user.findOne({Username: req.body.username});
        if (checkDuplicate) {
            return handleError(res, "Username already exists!");
        } 
        else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newCorporateTrainee = new corporateTrainee({
                Username: req.body.username,
                Password: hashedPassword,
                Name: req.body.name,
                Email: req.body.email
            });

            const newUser = new user({
                Username: req.body.username,
                Type: "corporateTrainee"
            });

            await newCorporateTrainee.save();
            await newUser.save();
            res.json(newCorporateTrainee);
        }
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.get("/getNotDiscountedCourses", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "admin"){
            return handleError(res, "Invalid Access")
        }
        
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

        courses.forEach(course => {
            course.PriceInUSD = (course.PriceInUSD * exchangeRateToCountry).toFixed(2)
        })

        var notDiscountedCourses = [];

        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        courses.forEach(course => {
            if(currentYear > course.DiscountExpiryDate.getFullYear() && course.PriceInUSD !== 0) {
                course.Discount = 0;
                notDiscountedCourses.push(course)
            }
            else if(currentYear == course.DiscountExpiryDate.getFullYear()) {
                if(currentMonth > course.DiscountExpiryDate.getMonth() && course.PriceInUSD !== 0) {
                    course.Discount = 0;
                    notDiscountedCourses.push(course)
                }
                else if(currentMonth == course.DiscountExpiryDate.getMonth()) {
                    if(currentDay > course.DiscountExpiryDate.getDate() && course.PriceInUSD !== 0) {
                        course.Discount = 0;
                        notDiscountedCourses.push(course)
                    }
                }
            }
        })
        res.json(notDiscountedCourses)
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.get("/getDiscountedCourses", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "admin"){
            return handleError(res, "Invalid Access")
        }

        let courses = await course.find();
        const exchangeRateToCountry = await currencyConverter.from("USD").to(req.query.currencyCode).convert();

        courses.forEach(course => {
            course.PriceInUSD = (course.PriceInUSD * exchangeRateToCountry).toFixed(2)
        })

        var discountedCourses = [];

        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        courses.forEach(course => {
            if(currentYear < course.DiscountExpiryDate.getFullYear() && course.Discount !==0 && course.PriceInUSD !== 0) {
                discountedCourses.push(course)
            }
            else if(currentYear == course.DiscountExpiryDate.getFullYear()) {
                if(currentMonth < course.DiscountExpiryDate.getMonth() && course.Discount !==0 && course.PriceInUSD !== 0) {
                    discountedCourses.push(course)
                }
                else if(currentMonth == course.DiscountExpiryDate.getMonth()) {
                    if(currentDay <= course.DiscountExpiryDate.getDate() && course.Discount !==0 && course.PriceInUSD !== 0) {
                        discountedCourses.push(course)
                    }
                }
            }
        })
        res.json(discountedCourses)
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.put("/applyDiscount", verifyJWT, async (req, res) => {
    try {
        if(req.User.Type !== "admin"){
            return handleError(res, "Invalid Access")
        }

        let courses = req.query.courses;
        const coursesToBeDiscounteIds = courses.split(",");

        let discountPercentage = req.query.discount;
        let expiryDate = req.query.expiryDate;

        const date = new Date(expiryDate);

        await coursesToBeDiscounteIds.forEach(async (courseId) => {
            await course.findByIdAndUpdate(courseId, {
                Discount: discountPercentage,
                DiscountExpiryDate: date
            })
        });

        res.status(200).send("Discount added/updated successfully");
    } catch (err) {
        handleError(res, err);
    }
});

export default router;