import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import course from "../models/course.model.js";
import instructor from "../models/instructor.model.js";
import corporateTrainee from "../models/corporateTrainee.model.js";
import individualTrainee from "../models/individualTrainee.model.js";
import user from "../models/user.model.js";

const router = express.Router();

router.get("/getExercise", verifyJWT, async (req, res) => {
    try{
        if(req.User.Type !== "corporateTrainee" && req.User.Type !== "individualTrainee"){
            return handleError(res, "Invalid Access")
        }
        
        const Course = await course.findById(req.query.courseId);
        let Trainee = null;
        if(req.User.Type === "individualTrainee"){
            Trainee = await individualTrainee.findOne({Username: req.User.Username});
        }
        else{
            Trainee = await corporateTrainee.findOne({Username: req.User.Username});
        }
    
        let isEnrolled = false;
        Trainee.EnrolledCourses.forEach(course => {
            if(course.courseId === req.query.courseId){
                isEnrolled = true;
            }
        })
    
        if(!isEnrolled){
            return handleError(res, "You are not Enrolled in this course");
        }
    
        const Exercise = Course.Exercises[req.query.exerciseNum];
        res.json(Exercise);
    }
    catch(error){
        handleError(res,error);
    }
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
                course.exercises[Number.parseInt(req.query.exerciseNum)].choices = req.body.traineeChoices;
                course.exercises[Number.parseInt(req.query.exerciseNum)].grade = grade;
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
    const { Rating, Review } = req.body;
    if( !Rating || !Review ){
        return req.status(400).json({message: 'The (Rating) and the (Review) fields must be provided in the body.'});
    }

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
            return res.status(201).json({message: 'The rating has been added successfully.'})
        }
    ).catch(error => {
        console.log(error);
        return res.status(500).json({message: 'An error has occurred while adding the rating.'})
    });
});


router.put('/updateCourseRating/:courseId', verifyJWT, async (req, res) => {

    let Rating;
    let Review;

    if(req.body.Rating){
        Rating = req.body.Rating;
    }

    if(req.body.Review){
        Review = req.body.Review;
    }

    if( !Rating && !Review){
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

            course.updateOne(
                {_id:courseId, "Ratings.TraineeUsername": Username},
                {
                    $set:{
                        Rating: calculateNewRating(listOfRatings),
                        "Ratings.$.Rating": Rating? Rating: oldRating,
                        "Ratings.$.Review": Review? Review: oldReview,
                    }
                }
            ).then(_ => {
                return res.status(201).json({message: 'The rating was updated successfully.'});
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
            
            course.updateOne(
                {_id : courseId},
                {
                    $pull:{
                        Ratings: {TraineeUsername: Username}
                    },
                    $set:{
                        NumberOfReviews: oldNumberOfReviews - 1,
                        Rating: calculateNewRating(courseToRate.Ratings.filter(rating => rating.TraineeUsername !== Username))
                    }
                }
            ).then(_ => {
                return res.status(200).json({message: 'The rating has been removed successfully'})
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

    if( !req.body.Rating || !req.body.Review){
        return res.status(400).json({message: 'The (Rating) and the (Review) fields must be provided in the body.'});
    }
    const { Rating, Review } = req.body;

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
    let Review;

    if(req.body.Rating){
        Rating = req.body.Rating;
    }

    if(req.body.Review){
        Review = req.body.Review;
    }

    if( !Rating && !Review){
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
                        'Ratings.$.Review': Review? Review : oldReview
                    }
                }
            ).then(_ => {
                return res.status(201).json({message: 'The rating has been updated successfully.'})
            }).catch(error => {
                //console.log(error);
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

function handleError(res, err) {
    return res.status(400).send(err);
}

export default router;