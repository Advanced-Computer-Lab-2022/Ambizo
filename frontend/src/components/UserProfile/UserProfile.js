import React from "react";
import Header from "../Header/Header";
import Course from "../Course/Course";
import UserRating from "../UserRating/UserRating";
import { useParams } from "react-router-dom";
import InstructorService from "../../services/Instructor.service";

async function retrieveAllCourses(setIsLoading, instrProfile, myInstrProfile, instructorUsername){
  setIsLoading(true);
  if(instrProfile || myInstrProfile){
    return InstructorService.getInstructorCourses(instructorUsername)
    .then((result) => {
        setIsLoading(false);
        return result;
    })
    .catch((error) => {
        console.log(error)
        setIsLoading(false);
        return null;
    })
  }
  // else if individual trainee or corporate trainee get Courses I am enrolled in 
}

async function retrieveInstructorInfo(setIsLoading, instrProfile, myInstrProfile, instructorUsername){
  setIsLoading(true);
  if(instrProfile || myInstrProfile){
    return InstructorService.getInstructorInfo(instructorUsername)
    .then((result) => {
        setIsLoading(false);
        return result.data;
    })
    .catch((error) => {
        console.log(error)
        setIsLoading(false);
        return null;
    })
  }
}

function UserProfile() {
  const params = useParams();

  const [isLoading, setIsLoading] = React.useState(false);
  
  let userTypeSession = sessionStorage.getItem("Type");
  let username = params.username;

  let user = sessionStorage.getItem("User");
  let usernameSession = "";
  if(user) {
    usernameSession = JSON.parse(user).Username;
  }

  let profileInstr = false;
  if(usernameSession !== username) {
    profileInstr = true;
  }

  let myProfileInstr = false;
  if(userTypeSession === "instructor" &&  usernameSession === username) {
    myProfileInstr = true;
  }

  const [coursesData, setCoursesData] = React.useState([]);

  React.useEffect(() => {
    document.title = "Instructor Courses";
    retrieveAllCourses(setIsLoading, profileInstr, myProfileInstr, username)
    .then(coursesList => setCoursesData(coursesList.data))
    .catch(error => {
        console.log(error);
    })
  }, [profileInstr, myProfileInstr, username]);

  const coursesDataElements = coursesData.map(course => {
    return (
        <Course
            key={course._id}
            {...course}
        />
    )
  })

  const [instructorInfo, setInstructorInfo] = React.useState({});

  React.useEffect(() => {
    document.title = "Instructor Info";
    retrieveInstructorInfo(setIsLoading, profileInstr, myProfileInstr, username)
    .then(instrInfo => setInstructorInfo(instrInfo))
    .catch(error => {
        console.log(error);
    })
  }, [profileInstr, myProfileInstr, username]);

  let ratingDataElements = [];
  let ratingKey = 0;
  if(instructorInfo.Ratings) {
    ratingDataElements = instructorInfo.Ratings.map(rating => {
      return (
        <UserRating 
          key={ratingKey++}
          {...rating}
        />
      )
    })
  }

  return (
      <>
          <Header />
          <div className="user--profile">
              <div className="userprofile--topcontainer">
                  <div className="userprofile--leftcontainer">
                      <h1 className="userprofile--username">Slim Abdelzaher</h1>
                      {(profileInstr || myProfileInstr) && 
                      <>
                        <h4 className="usertype--user">INSTRUCTOR</h4>
                        <h5 className="userprofile--website"><i class="fa-solid fa-earth-americas"></i>&nbsp;&nbsp;slimabdelzaher.com</h5>
                        <h5 className="userprofile--linkedin"><i class="fa-brands fa-linkedin"></i>&nbsp;&nbsp;linkedin.com/in/slimabdelzaher</h5>
                        <div className="userprofile--emailandedit">
                          <h5 className="userprofile--email"><i class="fa-solid fa-envelope"></i>&nbsp;&nbsp;{instructorInfo.Email}</h5>
                          {myProfileInstr && <button className="userprofile--editbutton"><i class="fa-solid fa-pen-to-square"></i>&nbsp;&nbsp;</button>}
                        </div>
                        {!myProfileInstr &&
                          <div className="userprofile--reviewcoursesbuttons">
                            <button>Courses</button>
                            <button>Ratings</button>
                          </div>
                        }
                      </>
                      }
                      {/* else n7ot usertype 7asab hwa anhe mn el etnen el tanyen w mafesh links wla zarayr esm w type bs */}
                  </div>
                  {(profileInstr || myProfileInstr) && instructorInfo.ProfileImage &&
                    <div className="user--rightcontainer">
                      <img src={instructorInfo.ProfileImage} alt="Instructor" className="user--userimage" />
                    </div>
                  }
                  {/* else mafesh sora */}
              </div>
              {(profileInstr || myProfileInstr)  &&
                <>
                  <hr className="userprofile--line"/>
                  <div className="userprofile--bio">
                    <div className="userprofile--editbio">
                      <h3 className="userprofile--bioheader">Bio</h3>
                      {myProfileInstr && <button className="userprofile--editbutton"><i class="fa-solid fa-pen-to-square"></i>&nbsp;&nbsp;</button>}
                    </div>
                    <p>{instructorInfo.Bio}</p>
                    {/* lsa h3ml else add bio w lsa edits kolaha */}
                  </div>
                </>
              }
              {/* else mafesh bio */}
              {!myProfileInstr &&
                <>
                  <hr className="user--line"/>
                  <div className="userprofile--courses">
                    <h3 className="userprofile--coursesheader">Courses</h3>
                    <div className="userprofile--allcourses">
                      {coursesDataElements}
                    </div>
                  </div>
                </>
              }
              {/* msh htl3 el courses lw da logged in instructor 3shan kda kda yro7 yshofhom fe My Courses */}
              {(profileInstr || myProfileInstr)  &&
                <>
                  <hr className="user--line"/>
                  <div className="userprofile--ratings">
                      <h3 className="userprofile--ratingssheader">Ratings</h3>
                      <div className="userprofile--allcourses">
                          {ratingDataElements}
                      </div>
                  </div>
                </>
              }
              {/* else mafesh ratings */}
          </div>
          
      </>
  )
}

export default UserProfile;