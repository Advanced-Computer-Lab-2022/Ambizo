import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import course from "../models/course.model.js";
import currencyConverter from "../middleware/currencyConverter.js";
import instructor from "../models/instructor.model.js"

const router = express.Router();

router.get("/getCourses", verifyJWT, async (req,res) => {
    try{
        if(req.User.Type !== "instructor"){
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

        filter = {
            InstructorUsername: req.User.Username,
            ...filter
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
        res.json(courses);
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.get("/getInstructorCourses", async (req,res) => {
    try{        
        
        let courses = null;
        let exchangeRateToUSD = null;
        let exchangeRateToCountry = null;

        let instructorUsernameReceived = req.query.instrusername;
        
        let filter = {
            InstructorUsername: instructorUsernameReceived,
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
        res.json(courses);
    }
    catch(err){
        handleError(res, err.message);
    }
})

router.get("/getInstructorInfo/" , async (req, res) => {
    try{
        let instructorUsernameReceived = req.query.instrusername;

        const fetchedInfo = await instructor.findOne({Username: instructorUsernameReceived})
        res.json({
            Name: fetchedInfo.Name,
            Email: fetchedInfo.Email,
            Ratings: fetchedInfo.Ratings,
            Bio: fetchedInfo.Bio,
            Website: fetchedInfo.Website,
            LinkedIn: fetchedInfo.LinkedIn,
            ProfileImage: fetchedInfo.ProfileImage
        })
    } catch (err) {
        handleError(res, err);
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

router.put("/addSubtitleDetails", verifyJWT, async (req, res) => {
    try {
        let courseId = req.query.courseId;
        let oldCourse = await course.findById(courseId)

        if(req.User.Username !== oldCourse.InstructorUsername) {
            return handleError(res, "You can only add Subtitle Details to your Courses")
        }

        let subtitleIndex = req.query.index;
        const updatedSubtitle = req.body;

        let newSubtitles = oldCourse.Subtitles;
        newSubtitles[subtitleIndex] = updatedSubtitle;

        await course.findByIdAndUpdate(courseId, {
            Subtitles: newSubtitles
        })

        res.status(200).send("Video and Description added successfully");
    } catch (err) {
        handleError(res, err);
    }
});

router.put("/addCoursePreview", verifyJWT, async (req, res) => {
    try {
        let courseId = req.query.courseId;
        let oldCourse = await course.findById(courseId)

        if(req.User.Username !== oldCourse.InstructorUsername) {
            return handleError(res, "You can only add Preview to your Courses")
        }
        
        await course.findByIdAndUpdate(courseId, {
            CoursePreviewLink: req.body.previewLink
        })

        res.status(200).send("Video added successfully");
    } catch (err) {
        handleError(res, err);
    }
});

router.put("/updateEmail", verifyJWT, async (req, res) => {
    try {
        if(req.User.Type !== "instructor") {
            return handleError(res, "Invalid Access")
        }

        let updatedEmail = req.query.updatedEmail;

        await instructor.findOneAndUpdate({Username: req.User.Username}, {
            Email: updatedEmail
        })

        res.status(200).send("Email updated successfully");
    } catch (err) {
        handleError(res, err);
    }
});

router.put("/updateBio", verifyJWT, async (req, res) => {
    try {
        if(req.User.Type !== "instructor") {
            return handleError(res, "Invalid Access")
        }

        let enteredBio = req.query.enteredBio;

        await instructor.findOneAndUpdate({Username: req.User.Username}, {
            Bio: enteredBio
        })

        res.status(200).send("Bio added/updated successfully");
    } catch (err) {
        handleError(res, err);
    }
});

router.get("/checkIfInstructor", async (req, res) => {
    try{
        let usernameReceived = req.query.username;

        const User = await instructor.findOne({Username: usernameReceived})
        if(User){
            res.json({
                isInstructor: true
            })
        }
        else{
            res.json({
                isInstructor: false
            })
        }

    } catch (err) {
        res.json({
            isInstructor: false
        })
    }
})

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

router.put("/acceptContract", verifyJWT, async (req, res) => {
    try {
        if(req.User.Type !== "instructor"){
            return handleError(res, "Invalid Access")
        }

        await instructor.findOneAndUpdate({Username: req.User.Username}, {AcceptedContract: true})
        res.send("Contract accepted successfully")
    
    } catch (err) {
        handleError(res, err);
    }
});

router.get("/isContractAccepted", verifyJWT, async (req, res) => {
    try {
        if(req.User.Type !== "instructor"){
            return handleError(res, "Invalid Access")
        }

        const Instructor = await instructor.findOne({Username: req.User.Username})
        if(Instructor.AcceptedContract){
            res.json({isAccepted: true})
        }
        else{
            res.json({isAccepted: false})
        }
    
    } catch (err) {
        handleError(res, err);
    }
});

router.get("/getCourseDetails", verifyJWT, async (req,res) => {
    try {
        const courseDetails = await course.findOne({_id: req.query.courseId})

        if(req.User.Username !== courseDetails.InstructorUsername) {
            return handleError(res, "Invalid Acess")
        }

        const exchangeRateToCountry = await currencyConverter.from("USD").to(req.query.currencyCode).convert();

        const price = (courseDetails.PriceInUSD * exchangeRateToCountry).toFixed(2)

        res.json({
            Title: courseDetails.Title,
            Price: price,
            Discount: courseDetails.Discount,
            DiscountExpiryDate: courseDetails.DiscountExpiryDate
        })
    }
    catch(err) {
        handleError(res, err.message);
    }
})

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;