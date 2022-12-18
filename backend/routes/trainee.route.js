import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import course from "../models/course.model.js";
import instructor from "../models/instructor.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import individualTrainee from "../models/individualTrainee.model.js";
import user from "../models/user.model.js";
import nodemailer from "nodemailer";
import generateCertificate from "../middleware/certificateGenerator.js";

const router = express.Router();

router.get('/getTraineeInfo/:username', async (req, res) => {
    if( !req.params.username ){
        return res.status(400).json({message: 'The username must be provided in URI.'});
    }
    const targetUser = await user.findOne({Username: req.params.username});
    if( !targetUser ){
        return res.status(404).json({message: 'No trainee found with this username.'});
    }

    let traineeWithInfo;
    switch(targetUser.Type){
        case 'individualTrainee':
            traineeWithInfo = await individualTrainee.findOne({Username: req.params.username});
            break;
        case 'corporateTrainee':
            traineeWithInfo = await corporateTrainee.findOne({Username: req.params.username});
            break;
        default:
            return res.status(500).json({message: 'An error has occured while fetchin the trainee from his collection.'});
    }

    if( !traineeWithInfo ){
        return res.status(500).json({message: 'An error has occured while fetchin the trainee from his collection.'});
    }

    let enrolledCoursesIds = [];
    for(var courseIndex in traineeWithInfo.EnrolledCourses){
        enrolledCoursesIds.push(traineeWithInfo.EnrolledCourses[courseIndex].courseId);
    }

    const enrolledCourseData = await course.find({
        _id: {
            $in: enrolledCoursesIds
        }
    });
    const result = {
        Name: traineeWithInfo.Name,
        Email: traineeWithInfo.Email,
        Username: traineeWithInfo.Username,
        Type: targetUser.Type,
        CourseInfo: enrolledCourseData
    };
    
    return res.status(200).json(result);

});

router.get("/getAnswers", verifyJWT, async (req, res) => {
    try {
        if (req.User.Type !== "corporateTrainee" && req.User.Type !== "individualTrainee") {
            return handleError(res, "Invalid Access")
        }

        let Trainee = null;
        if (req.User.Type === "individualTrainee") {
            Trainee = await individualTrainee.findOne({ Username: req.User.Username });
        }
        else {
            Trainee = await corporateTrainee.findOne({ Username: req.User.Username });
        }

        let Exercise = null;
        Trainee.EnrolledCourses.forEach(course => {
            if (course.courseId === req.query.courseId)
                Exercise = course.exercises[Number.parseInt(req.query.exerciseNum)];
        }
        )
        res.json(Exercise);
    }
    catch (error) {
        handleError(res, error);
    }
});

router.post("/submitExercise", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "corporateTrainee" && req.User.Type !== "individualTrainee"){
            return handleError(res, "Invalid Access")
        }

        let Trainee = null;
        if(req.User.Type === "individualTrainee"){
            Trainee = await individualTrainee.findOne({Username: req.User.Username});
        }
        else{
            Trainee = await corporateTrainee.findOne({Username: req.User.Username});
        }

        let enrolledCourse = await course.findById(req.query.courseId);
        let enrolledCourseQuestions = enrolledCourse.Exercises[Number.parseInt(req.query.exerciseNum)].questions;
        let submittedAnswers = req.body.traineeChoices;
        let grade = 0;
        for (let i = 0; i < submittedAnswers.length; i++){
            if (enrolledCourseQuestions[i].answer == submittedAnswers[i]) {
                grade++;
            }
        }
        grade = grade / enrolledCourseQuestions.length;


        Trainee.EnrolledCourses.forEach(course => {
            if(course.courseId === req.query.courseId){
                course.exercises[Number.parseInt(req.query.exerciseNum)] = {
                    grade: grade,
                    choices: req.body.traineeChoices
                }
            }
        })
        
        if(req.User.Type === "individualTrainee"){
            await individualTrainee.findByIdAndUpdate(Trainee._id, {EnrolledCourses: Trainee.EnrolledCourses});
        }
        else{
            await corporateTrainee.findByIdAndUpdate(Trainee._id, {EnrolledCourses: Trainee.EnrolledCourses});
        }
        res.json({message: "Exercise Submitted Successfully"});
    }
    catch(error){
        handleError(res,error);
    }
});

function calculateNewRating(ratings){
    if(ratings.length === 0){
        return 0;
    }
    let sum = 0;
    for(var ratingIndex in ratings){
        sum += ratings[ratingIndex].Rating;  
    }
    return sum / (ratings.length);
}

// Errors returned: 201, 400, 403, 404, 409, 500.
router.post('/rateCourse/:courseId', verifyJWT, async (req, res) => {
    const { Username, Type } = req.User;
    const courseId = req.params.courseId;
    const requestingUser = await user.findOne({Username: Username});

    //making sure the request come from valid user with valid type
    if ((requestingUser.Type !== Type) || (Type !== 'corporateTrainee' && Type !== 'individualTrainee')){
        return res.status(403).json({message: 'The user is not allowed to rate courses.'})
    }

    // Check whether the user is enrolled in this course or not
    let userWithCourses;
    switch(requestingUser.Type){
        case 'individualTrainee':
            userWithCourses = await individualTrainee.findOne({Username: Username});
            break;
        case 'corporateTrainee':
            userWithCourses = await corporateTrainee.findOne({Username: Username});
            break;
    }


    if(!userWithCourses || !userWithCourses.EnrolledCourses){
        return res.status(500).json({message: 'An error has occured while fetching the user and the courses of the user'})
    }

    let courseFound = false;
    for(var courseIndex in userWithCourses.EnrolledCourses){
        if(userWithCourses.EnrolledCourses[courseIndex].courseId === courseId){
            courseFound = true;
        }

    }

    if( !courseFound ){
        return res.status(403).json({message: 'The user is not enrolled in the course to be able to rate it.'})
    }

    const courseToRate = await course.findById(courseId);

    if( !courseToRate ){
        return req.status(404).json({message: 'No course found with this id.'});
    }
    const listOfRatings = courseToRate.Ratings;
    // Seeing if the user already rated the course before.
    for(var rating in listOfRatings){
        if( listOfRatings[rating].TraineeUsername === Username){
            return res.status(409).json({message: 'The user has already rated this course.'})
        }
    }

    //Checking that the needed data is in the request body.
    const { Rating} = req.body;
    if( !Rating ){
        return req.status(400).json({message: 'The (Rating) field must be provided in the body.'});
    }
    const Review = (req.body.Review)? req.body.Review : '';

    const RatingEntry = {
        TraineeUsername: Username,
        Rating: Rating,
        Review: Review
    };

    courseToRate.Ratings.push(RatingEntry);
    courseToRate.Rating = calculateNewRating(courseToRate.Ratings);
    courseToRate.NumberOfReviews += 1;

    courseToRate.save().then(
        _ => {
            return res.status(201).json({
                message: 'The rating has been added successfully.',
                newNumberOfRatings: courseToRate.NumberOfReviews,
                newAverageRating: courseToRate.Rating
            })
        }
    ).catch(error => {
        console.log(error);
        return res.status(500).json({message: 'An error has occurred while adding the rating.'})
    });
});


router.put('/updateCourseRating/:courseId', verifyJWT, async (req, res) => {

    let Rating;
    

    if(req.body.Rating){
        Rating = req.body.Rating;
    }

    let Review = (req.body.Review === undefined)? undefined : (req.body.Review === ''? '' : req.body.Review);



    if( !Rating && Review === undefined){
        return res.status(400).json({message: 'At least the (Rating) or the (Review) fields must be provided in the body.'}); 
    }

    const { Username, Type } = req.User;
    const courseId = req.params.courseId;
    const requestingUser = await user.findOne({Username: Username});

    //making sure the request come from valid user with valid type
    if ((requestingUser.Type !== Type) || (Type !== 'corporateTrainee' && Type !== 'individualTrainee')){
        return res.status(403).json({message: 'The user is not allowed to rate courses.'})
    }


    // Check whether the user is enrolled in this course or not
    let userWithCourses;
    switch(requestingUser.Type){
        case 'individualTrainee':
            userWithCourses = await individualTrainee.findOne({Username: Username});
            break;
        case 'corporateTrainee':
            userWithCourses = await corporateTrainee.findOne({Username: Username});
            break;
    }


    if(!userWithCourses || !userWithCourses.EnrolledCourses){
        return res.status(500).json({message: 'An error has occured while fetching the user and the courses of the user'})
    }

    let courseFound = false;
    for(var courseIndex in userWithCourses.EnrolledCourses){
        if(userWithCourses.EnrolledCourses[courseIndex].courseId === courseId){
            courseFound = true;
        }

    }

    if( !courseFound ){
        return res.status(403).json({message: 'The user is not enrolled in the course to be able to rate it.'})
    }

    const courseToRate = await course.findById(courseId);

    if( !courseToRate ){
        return req.status(404).json({message: 'No course found with this id.'});
    }

    const listOfRatings = courseToRate.Ratings;
    let userRatedCourse = false;
    // Seeing if the user already rated the course before.
    for(var rating in listOfRatings){
        if( listOfRatings[rating].TraineeUsername === Username){
            const oldRating = listOfRatings[rating].Rating;
            const oldReview = listOfRatings[rating].Review;

            listOfRatings[rating].Rating = Rating? Rating: oldRating;
            const newAverageRating = calculateNewRating(listOfRatings);
            course.updateOne(
                {_id:courseId, "Ratings.TraineeUsername": Username},
                {
                    $set:{
                        Rating: newAverageRating,
                        "Ratings.$.Rating": Rating? Rating: oldRating,
                        "Ratings.$.Review": Review? Review : (Review === '' ? Review : oldReview),
                    }
                }
            ).then(_ => {
                return res.status(201).json({
                    message: 'The rating was updated successfully.',
                    newNumberOfRatings: courseToRate.NumberOfReviews,
                    newAverageRating: newAverageRating
                });
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json({message: 'An error has occured while updating the rating.'});
                }
            );

            userRatedCourse = true;
            break;
        }
    }

    if( !userRatedCourse ){
        return res.status(409).json({message: 'The user did not rate this course.'})
    }
});


router.delete('/deleteCourseRating/:courseId', verifyJWT, async (req, res) => {
    const { Username, Type } = req.User;
    const courseId = req.params.courseId;

    const requestingUser = await user.findOne({Username: Username});

    //making sure the request come from valid user with valid type
    if ((requestingUser.Type !== Type) || (Type !== 'corporateTrainee' && Type !== 'individualTrainee')){
        return res.status(403).json({message: 'The user is not allowed to delete ratings of courses.'})
    }


    // Check whether the user is enrolled in this course or not
    let userWithCourses;
    switch(requestingUser.Type){
        case 'individualTrainee':
            userWithCourses = await individualTrainee.findOne({Username: Username});
            break;
        case 'corporateTrainee':
            userWithCourses = await corporateTrainee.findOne({Username: Username});
            break;
    }


    if(!userWithCourses || !userWithCourses.EnrolledCourses){
        return res.status(500).json({message: 'An error has occured while fetching the user and the courses of the user'})
    }

    let courseFound = false;
    for(var courseIndex in userWithCourses.EnrolledCourses){
        if(userWithCourses.EnrolledCourses[courseIndex].courseId === courseId){
            courseFound = true;
        }

    }

    if( !courseFound ){
        return res.status(403).json({message: 'The user is not enrolled in the course to be able to delete a rating.'})
    }

    const courseToRate = await course.findById(courseId);
    if( !courseToRate ){
        return req.status(404).json({message: 'No course found with this id.'});
    }
    
    let isRatingFound = false;
    for(var rating in courseToRate.Ratings){
        if(courseToRate.Ratings[rating].TraineeUsername === Username){
            isRatingFound = true;
            const oldNumberOfReviews = courseToRate.NumberOfReviews;
            
            const newAverageRating = calculateNewRating(courseToRate.Ratings.filter(rating => rating.TraineeUsername !== Username))
            course.updateOne(
                {_id : courseId},
                {
                    $pull:{
                        Ratings: {TraineeUsername: Username}
                    },
                    $set:{
                        NumberOfReviews: oldNumberOfReviews - 1,
                        Rating: newAverageRating
                    }
                }
            ).then(_ => {
                return res.status(200).json({
                    message: 'The rating has been removed successfully',
                    newNumberOfRatings: oldNumberOfReviews - 1,
                    newAverageRating: newAverageRating
                })
            }).catch(error => {
                console.log(error);
                return res.status(500).json({message: 'An error has occurred while deleting the rating.'});
            });
        }
    }
    if(!isRatingFound){
        return res.status(409).json({message: 'The user did not rate this course.'})
    }
});

router.post('/rateInstructor/:instructorUsername', verifyJWT, async (req, res) => {

    if( !req.body.Rating){
        return res.status(400).json({message: 'The (Rating) field must be provided in the body.'});
    }
    const { Rating } = req.body;
    let Review = (req.body.Review)? req.body.Review : '';  


    if( !req.User || !req.User.Username || !req.User.Type){
        return res.status(401).json({message: 'Failed to authenticate the user.'});
    }
    const { Username, Type } = req.User;
    
    const instructorUsername = req.params.instructorUsername;
    const requestingUser = await user.findOne({Username: Username});

    //making sure the request come from valid user with valid type
    if ((requestingUser.Type !== Type) || (Type !== 'corporateTrainee' && Type !== 'individualTrainee')){
        return res.status(403).json({message: 'The user is not allowed to rate instructors.'})
    }

    const instructorToRate =await instructor.findOne({Username: instructorUsername});
    if(!instructorToRate){
        return res.status(404).json({message: 'There is no instructor with this username.'})
    }

    for(var rating in instructorToRate.Ratings){
        if(instructorToRate.Ratings[rating].TraineeUsername === Username){
            return res.status(409).json({message: 'The user has already rated this instructor.'})
        }
    }

    const newInstructorRating = {
        TraineeUsername: Username,
        Rating: Rating,
        Review: Review
    };
    instructorToRate.Ratings.push(newInstructorRating);
    instructorToRate.Rating = calculateNewRating(instructorToRate.Ratings);

    instructorToRate.save().then(_ => {
        return res.status(201).json({message: 'The rating has been added successfully.'})
    }).catch(error => { 
        console.log(error);
        return res.status(500).json({message: 'An error has occured while adding the new rating.'})
    });

});

router.put('/updateInstructorRating/:instructorUsername', verifyJWT, async (req, res) => {
    let Rating;
    

    if(req.body.Rating){
        Rating = req.body.Rating;
    }

    let Review = (req.body.Review === undefined)? undefined : (req.body.Review === ''? '' : req.body.Review);



    if( !Rating && Review === undefined){
        return res.status(400).json({message: 'At least the (Rating) or the (Review) fields must be provided in the body.'}); 
    }


    if( !req.User || !req.User.Username || !req.User.Type){
        return res.status(401).json({message: 'An error has occurred while authenticating the user.'})
    }
    const { Username, Type } = req.User;
    const instructorUsername = req.params.instructorUsername;
    const requestingUser = await user.findOne({Username: Username});

    //making sure the request come from valid user with valid type
    if ((requestingUser.Type !== Type) || (Type !== 'corporateTrainee' && Type !== 'individualTrainee')){
        return res.status(403).json({message: 'The user is not allowed to rate instructors.'})
    }

    const instructorToRate = await instructor.findOne({Username: instructorUsername});
    if(!instructorToRate){
        return res.status(404).json({message: 'There is no instructor with this username.'})
    }

    let instructorRated = false;

    for(var rating in instructorToRate.Ratings){
        if(instructorToRate.Ratings[rating].TraineeUsername === Username){
            const oldRating = instructorToRate.Ratings[rating].Rating;
            const oldReview = instructorToRate.Ratings[rating].Review;
            instructorToRate.Ratings[rating].Rating = Rating? Rating: oldRating; 
            instructorRated = true;
            instructor.updateOne(
                {Username: instructorUsername, "Ratings.TraineeUsername": Username },
                {
                    $set: {
                        Rating: calculateNewRating(instructorToRate.Ratings),
                        'Ratings.$.Rating': Rating? Rating : oldRating,
                        'Ratings.$.Review': Review? Review : (Review === '' ? Review : oldReview)
                    }
                }
            ).then(_ => {
                return res.status(201).json({message: 'The rating has been updated successfully.'})
            }).catch(error => {
                console.log(error);
                return res.status(500).json({message: 'An error has occurred while updating the rating.'})
            });
        }
        break;
    }   

    if( !instructorRated ){
        return res.status(409).json({message: 'The user did not rate this instructor before.'});
    }
    

})

router.delete('/deleteInstructorRating/:instructorUsername', verifyJWT, async (req, res) => {
    if( !req.User || !req.User.Username || !req.User.Type){
        return res.status(401).json({message: 'An error has occurred while authenticating the user.'})
    }
    const { Username, Type } = req.User;
    const instructorUsername = req.params.instructorUsername;
    const requestingUser = await user.findOne({Username: Username});

    //making sure the request come from valid user with valid type
    if ((requestingUser.Type !== Type) || (Type !== 'corporateTrainee' && Type !== 'individualTrainee')){
        return res.status(403).json({message: 'The user is not allowed to rate instructors.'})
    }

    const instructorToRate = await instructor.findOne({Username: instructorUsername});
    if(!instructorToRate){
        return res.status(404).json({message: 'There is no instructor with this username.'})
    }

    let instructorRated = false;
    for(var rating in instructorToRate.Ratings){
        if(instructorToRate.Ratings[rating].TraineeUsername === Username){
            instructorRated = true;
            instructor.updateOne(
                {Username: instructorUsername},
                {
                    $pull: {
                        Ratings: {TraineeUsername: Username}
                    },
                    $set: {
                        Rating: calculateNewRating(instructorToRate.Ratings.filter(rating => rating.TraineeUsername !== Username)),
                    }
                }
            ).then(_ => {
                return res.status(201).json({message: 'The rating has been removed successfully.'})
            }).catch(error => {
                console.log(error);
                return res.status(500).json({message: 'An error has occurred while removing the rating.'})
            });
            break;
        }
    }   

    if( !instructorRated ){
        return res.status(409).json({message: 'The user did not rate this instructor before.'});
    }
});

router.get("/getTraineeName/", async (req, res) => {
    try {
        let username = req.query.traineeUsername;

        let trainee = await individualTrainee.findOne({Username: username});

        if(trainee == null){
            trainee = await corporateTrainee.findOne({Username: username});
        }

        res.json({
            Name: trainee.Name,
        })
    } catch (err) {
        handleError(res, err);
    }
})

router.put("/updateSubtitleProgress", verifyJWT, async (req, res) => {
    try{
        if (req.User.Type !== 'corporateTrainee' && req.User.Type !== 'individualTrainee'){
            return handleError(res, "Invalid Access")
        }

        let updateStatement = {
            "$set": {}
        }
        updateStatement["$set"]["EnrolledCourses.$.progress."+req.query.subtitleNum] = req.body.newProgress;
        
        let trainee = null;
        if(req.User.Type === 'corporateTrainee'){
           trainee = await corporateTrainee.findOneAndUpdate({Username: req.User.Username, "EnrolledCourses.courseId": req.query.courseId}, updateStatement, {new: true})
        }
        else{
            trainee = await individualTrainee.findOneAndUpdate({Username: req.User.Username, "EnrolledCourses.courseId": req.query.courseId}, updateStatement, {new: true})
        }


        let completedCourse = trainee.EnrolledCourses.filter(enrolledCourse => enrolledCourse.courseId === req.query.courseId);
        if(!completedCourse){
            return handleError(res, "Not Enrolled in course")
        }
        completedCourse = completedCourse[0];

        if(completedCourse.certificateSent){
            return res.send("Progress Updated Successfully");
        }

        let Course = await course.findById(req.query.courseId);

        let courseCompleted = true;
        for(let i =0; i<Course.Subtitles.length; i++){
            if(!completedCourse.progress[i] || completedCourse.progress[i]!== 1){
                courseCompleted = false
                break;
            }
        }

        if(!courseCompleted){
            return res.send("Progress Updated Successfully");
        }

        await mailCertificate(trainee, Course.Title, req.User.Type, req.query.courseId, res);
    }
    catch(err){
        handleError(res, err);
    }
})

async function mailCertificate(trainee, courseName, type, courseId, res) {
    try{
        let certificateFileName = "";
        if(trainee.Name.charAt(trainee.Name.length - 1) === 's'){
            certificateFileName =  + trainee.Name + "' Certificate.pdf"
        }
        else{
            certificateFileName = trainee.Name + "'s Certificate.pdf"
        }
    
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.BUSINESS_EMAIL,
              pass: process.env.BUSINESS_EMAIL_PASSWORD
            }
        });
    
        var mailOptions = {
            from: process.env.BUSINESS_EMAIL.toString(),
            to: trainee.Email,
            subject: 'Course Certificate',
            html: 
            `<h1>Hi ${trainee.Name},
            </h1><p>Congratulations on completing ${courseName}!</p>
            <p>Kindly find the certificate attached below</p>
            <p>You can now also download the certificate from the website</p>`,
            attachments: [{
                filename: `${certificateFileName}.pdf`,
                content: generateCertificate(trainee.Name, courseName)
            }]
        }

        await transporter.sendMail(mailOptions)
    
        if(type === 'corporateTrainee'){
            await corporateTrainee.findOneAndUpdate(
                {Username: trainee.Username, "EnrolledCourses.courseId": courseId}, 
            {
                $set: {
                    'EnrolledCourses.$.certificateSent': true
                }
            })
        }
        else{
            await individualTrainee.findOneAndUpdate(
                {Username: trainee.Username, "EnrolledCourses.courseId": courseId}, 
                {
                    $set: {
                        'EnrolledCourses.$.certificateSent': true
                    }
                })
        }
        return res.send("Progress Updated and Email Sent Successfully");
    }
    catch(err){
        console.log(err)
        return res.send("Error occured in emailing the certificate");
    }
}

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;