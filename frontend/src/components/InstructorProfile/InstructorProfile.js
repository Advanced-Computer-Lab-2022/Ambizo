import React from "react";
import Header from "../Header/Header";
import Course from "../Course/Course";
import UserRating from "../UserRating/UserRating";

function InstructorProfile() {
    let exampleCourse ={
        "_id": {
          "$oid": "6384380310fb773ce954762e"
        },
        "Title": "Developing Effective Time Management Habits",
        "InstructorName": "Slim Abdelzaher",
        "Description": "Manage Yourself, Your Work Environment, Technology and Avoid Time Stealers",
        "TotalHours": 3,
        "Rating": 0,
        "NumberOfReviews": 323,
        "PriceInUSD": 28.99,
        "Subject": "Personal Development",
        "Subtitles": [
          {
            "subtitle": "How to develop the habits to be in control of your time",
            "duration": 43,
            "youtubeLink": "",
            "description": ""
          },
          {
            "subtitle": "Stop reacting inefficiently to demands that are made on you",
            "duration": 37,
            "youtubeLink": "https://www.youtube.com/watch?v=5iIogaJWDY4",
            "description": "Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? Where is Messi? "
          },
          {
            "subtitle": "How to organize your work environment",
            "duration": 15,
            "youtubeLink": "https://www.youtube.com/watch?v=Gvvo6vUpJRc",
            "description": "Airpods Max Amazing Airpods Max Amazing Airpods Max Amazing Airpods Max Amazing Airpods Max Amazing Airpods Max Amazing Airpods Max Amazing"
          },
          {
            "subtitle": "How to employ technology so that it is not wasting your time",
            "duration": 22,
            "youtubeLink": "https://www.youtube.com/watch?v=Q1iyBo-sewE",
            "description": "Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk Nice Desk "
          },
          {
            "subtitle": "Time stealers",
            "duration": 40,
            "youtubeLink": "https://www.youtube.com/watch?v=i540Pm1kFBs&t=2s",
            "description": "Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR Ronaldo JR "
          },
          {
            "subtitle": "Strategies to prevent the waste of time",
            "duration": 23,
            "youtubeLink": "",
            "description": ""
          }
        ],
        "Exercises": [
          {
            "exerciseName": "Languages and Data Types",
            "questions": [
              {
                "question": "How to declare an integer variable x ?",
                "answer": 3,
                "choices": [
                  "string x = 3",
                  "int x = 3",
                  "double x = 3.0",
                  "x = 3"
                ]
              },
              {
                "question": "How is a code block indicated in Python ?",
                "answer": 1,
                "choices": [
                  "Brackets",
                  "Indentation",
                  "Key",
                  "None of the above"
                ]
              },
              {
                "question": "Which of the following concepts is NOT a part of Python ?",
                "answer": 0,
                "choices": [
                  "Pointers",
                  "Loops",
                  "Dynamic Typing",
                  "All of the above"
                ]
              },
              {
                "question": "Which of the following types of loops are not supported in Python ?",
                "answer": 2,
                "choices": [
                  "for",
                  "while",
                  "do-while",
                  "None of the above"
                ]
              },
              {
                "question": "Which of the following is the proper syntax to check if element x is present in a list ?",
                "answer": 2,
                "choices": [
                  "if x in list",
                  "if not x not in list",
                  "Both A and B",
                  "None of the above"
                ]
              },
              {
                "question": "Which of the following blocks will always be executed whether an exception is encountered or not in a program ?",
                "answer": 2,
                "choices": [
                  "try",
                  "except",
                  "finally",
                  "None of the above"
                ]
              },
              {
                "question": "What keyword is used in Python to raise exceptions ?",
                "answer": 0,
                "choices": [
                  "raise",
                  "try",
                  "goto",
                  "except"
                ]
              },
              {
                "question": "Which of the following is not a valid set operation in python ?",
                "answer": 3,
                "choices": [
                  "Union",
                  "Intersection",
                  "Difference",
                  "None of the above"
                ]
              }
            ]
          },
          {
            "exerciseName": "Setting up Python",
            "questions": [
              {
                "question": "How to declare an integer variable x ?",
                "answer": 1,
                "choices": [
                  "string x",
                  "int x",
                  "double x",
                  "boolean x"
                ]
              },
              {
                "question": "How to declare a boolean variable x ?",
                "answer": 3,
                "choices": [
                  "string x",
                  "int x",
                  "double x",
                  "boolean x"
                ]
              }
            ]
          },
          {
            "exerciseName": "Mohamed Henedy",
            "questions": [
              {
                "question": "Meen habeeb baba",
                "answer": "0",
                "choices": [
                  "Ana",
                  "Enta",
                  "Homa",
                  "E7na"
                ]
              },
              {
                "question": "Meen roo7 baba",
                "answer": "2",
                "choices": [
                  "Enta",
                  "Homa",
                  "Ana",
                  "Enta"
                ]
              }
            ]
          }
        ],
        "ImgURL": "https://img-b.udemycdn.com/course/240x135/506948_f3f6_3.jpg",
        "Discount": 20,
        "InstructorUsername": "slim.abdelzaher",
        "updatedAt": {
          "$date": {
            "$numberLong": "1669938315229"
          }
        },
        "CoursePreviewLink": "https://www.youtube.com/watch?v=yqI2S0DdyXA",
        "Ratings": [],
        "__v": 1
      }

    return (
        <>
            <Header />
            <div className="instructor--profile">
                <div className="instructorprofile--topcontainer">
                    <div className="instructorprofile--leftcontainer">
                        <h1 className="instructorprofile--instructorname">Slim Abdelzaher</h1>
                        <h4 className="usertype--instructor">INSTRUCTOR</h4>
                        <h5 className="instructorprofile--website"><i class="fa-solid fa-earth-americas"></i>&nbsp;&nbsp;slimabdelzaher.com</h5>
                        <h5 className="instructorprofile--linkedin"><i class="fa-brands fa-linkedin"></i>&nbsp;&nbsp;linkedin.com/in/slimabdelzaher</h5>
                        <h5 className="instructorprofile--email"><i class="fa-solid fa-envelope"></i>&nbsp;&nbsp;slim.abdelzaher@gmail.com</h5>
                        <div className="instructorprofile--reviewcoursesbuttons">
                        <button>Courses</button>
                            <button>Ratings</button>
                        </div>
                    </div>
                    <div className="instructor--rightcontainer">
                        <img src="https://img-b.udemycdn.com/user/200_H/10260436_946b_6.jpg" className="instructor--instructorimage" />
                    </div>
                </div>
                <hr className="instructorprofile--line"/>
                <div className="instructorprofile--bio">
                    <h3 className="instructorprofile--bioheader">Bio</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
                <hr className="instructor--line"/>
                <div className="instructorprofile--courses">
                    <h3 className="instructorprofile--coursesheader">Courses</h3>
                    <div className="instructorprofile--allcourses">
                        <Course {...exampleCourse}/>
                        <Course {...exampleCourse}/>
                        <Course {...exampleCourse}/>
                        <Course {...exampleCourse}/>
                        <Course {...exampleCourse}/>
                        <Course {...exampleCourse}/>
                    </div>
                </div>
                <hr className="instructor--line"/>
                <div className="instructorprofile--ratings">
                    <h3 className="instructorprofile--ratingssheader">Ratings</h3>
                    <div className="instructorprofile--allcourses">
                        <UserRating />
                        <UserRating />
                        <UserRating />
                        <UserRating />
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default InstructorProfile;