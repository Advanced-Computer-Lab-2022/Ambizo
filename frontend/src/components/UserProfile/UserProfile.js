import React from "react";
import Header from "../Header/Header";
import Course from "../Course/Course";
import UserRating from "../UserRating/UserRating";
import { useParams, useNavigate } from "react-router-dom";
import InstructorService from "../../services/Instructor.service.js";
import TraineeService from "../../services/Trainee.service.js";

async function retrieveAllCourses(instrProfile, myInstrProfile, instructorUsername){
  if(instrProfile || myInstrProfile){
    return InstructorService.getInstructorCourses(instructorUsername)
    .then((result) => {
        return result;
    })
    .catch((error) => {
        console.log(error)
        return null;
    })
  }
}

async function retrieveInstructorInfo(instrProfile, myInstrProfile, instructorUsername){
  if(instrProfile || myInstrProfile){
    return InstructorService.getInstructorInfo(instructorUsername)
    .then((result) => {
        return result.data;
    })
    .catch((error) => {
        console.log(error)
        return null;
    })
  }
}

function UserProfile() {
  const params = useParams();

  const [message, setMessage] = React.useState(
    { text: "", type: ""}
  )

  const [isLoading, setIsLoading] = React.useState(true);
  
  let userTypeSession = sessionStorage.getItem("Type");
  let username = params.username;

  let user = sessionStorage.getItem("User");
  let usernameSession = "";

  const navigate = useNavigate();

  if(user) {
    usernameSession = JSON.parse(user).Username;
  }

  const [profileInstr , setProfileInstr] = React.useState(true);

  let myProfileInstr = false;
  if(userTypeSession === "instructor" &&  usernameSession === username) {
    myProfileInstr = true;
  }
  let myProfileTrainee = (userTypeSession === 'individualTrainee' || userTypeSession === 'corporateTrainee') && (usernameSession === username);
  const [traineeInfo, setTraineeInfo] = React.useState({});

  const [coursesData, setCoursesData] = React.useState([]);

  const [instructorInfo, setInstructorInfo] = React.useState({});

  React.useEffect(() => {
    document.title = "User Profile";
    setIsLoading(true);
      InstructorService.checkIfInstructor(username)
      .then(result => {
        setProfileInstr(result.data.isInstructor);
        let inValidAccess = (userTypeSession === 'individualTrainee' || userTypeSession === 'corporateTrainee') && (usernameSession !== username) && !result.data.isInstructor;
        inValidAccess = inValidAccess || (!user && !result.data.isInstructor) || (userTypeSession === 'instructor' && !result.data.isInstructor)
        if (inValidAccess) {
          navigate("/404");
        }
        else{
          if(myProfileTrainee){
            TraineeService.getTraineeData(username).then(
              response => {
                setTraineeInfo(response.data);
              }
            ).catch(error => {
              console.log(error);
            })
          }
      
          retrieveAllCourses(result.data.isInstructor, myProfileInstr, username)
          .then(coursesList => setCoursesData(coursesList?.data))
          .catch(error => {
              console.log(error);
          })
      
          retrieveInstructorInfo(result.data.isInstructor, myProfileInstr, username)
          .then(instrInfo => setInstructorInfo(instrInfo))
          .catch(error => {
              console.log(error);
          })
      
          setIsLoading(false)
        }
      })
  }, [profileInstr, myProfileTrainee ,myProfileInstr, username, navigate, user, userTypeSession, usernameSession]);

  let coursesDataElements;
  if( !myProfileTrainee ){
    coursesDataElements = coursesData?.map(course => {
      return (
          <Course
              key={course._id}
              {...course}
          />
      )
    })
  }else{
    coursesDataElements = traineeInfo?.CourseInfo?.map(course => {
      return (
          <Course
              key={course._id}
              {...course}
          />
      )
    });
  }

  let ratingDataElements = [];
  let ratingKey = 0;
  if(!myProfileTrainee && instructorInfo?.Ratings) {
    ratingDataElements = instructorInfo.Ratings.map(rating => {
      return (
        <UserRating 
          key={ratingKey++}
          {...rating}
        />
      )
    })
  }

  const [editEmailInputField, setEditEmailInputField] = React.useState(false);
  const [updatedEmail, setUpdatedEmail] = React.useState("");

  function toggleEmailInputField() {
    setEditEmailInputField(prev => !prev);
  }

  function handleUpdatedEmailChange(event) {
    const{ value } = event.target
    setUpdatedEmail(value);
  }

  function modifyUserProfileEmail(updatedEmail) {
    let modifiedInstructorInfo = {...instructorInfo};
    modifiedInstructorInfo.Email = updatedEmail;
    setInstructorInfo(modifiedInstructorInfo);
  }

  async function handleUpdateEmail(event) {
    event.preventDefault();
    if(updatedEmail !== "") {
      return InstructorService.updateEmail(updatedEmail)
      .then(result => {
        modifyUserProfileEmail(updatedEmail);
        toggleEmailInputField();
      })
      .catch((error) => {
        setMessage({ text: error.response.data, type: "form--errormessage" })
      })
    }
    else {
      setMessage({ text: "New email field is required.", type: "form--errormessage" })
    }
    
  }

  const [addBioInputField, setAddBioInputField] = React.useState(false);
  const [enteredBio, setEnteredBio] = React.useState("");

  function toggleAddBioInputField() {
    setAddBioInputField(prev => !prev);
  }

  function handleBioChange(event) {
    const{ value } = event.target
    setEnteredBio(value);
  }

  function modifyUserProfileBio(enteredBio) {
    let modifiedInstructorInfo = {...instructorInfo};
    modifiedInstructorInfo.Bio = enteredBio;
    setInstructorInfo(modifiedInstructorInfo);
  }

  async function handleAddBio(event) {
    event.preventDefault();
      return InstructorService.updateBio(enteredBio)
      .then(result => {
        modifyUserProfileBio(enteredBio);
        toggleAddBioInputField();
      })
      .catch((error) => {
        setMessage({ text: error.response.data, type: "form--errormessage" })
      })
  }

  function handleEditBioClicked() {
    setEnteredBio(instructorInfo.Bio);
    toggleAddBioInputField();
  }

  function scrollTo(id){
    document.getElementById(id).scrollIntoView( { behavior: 'smooth', block: 'start' } );
  }

  return (
      <>
      <div className={"loader-container" + (!isLoading? " hidden" : "")}>
          <div className="spinner"> </div>
      </div>
      {isLoading ?
        (
            <>
                <Header />
            </>
        )
        :
        (
        <>
            <Header />
            <div className="user--profile">
                <div className="userprofile--topcontainer">
                    <div className="userprofile--leftcontainer">
                        <h1 className="userprofile--username">{(myProfileTrainee)? traineeInfo?.Name : instructorInfo?.Name}</h1>
                        {(profileInstr || myProfileInstr) && 
                        <>
                          <h4 className="usertype--user">INSTRUCTOR</h4>
                          <h5 className="userprofile--website"><i className="fa-solid fa-earth-americas"></i>&nbsp;&nbsp;{instructorInfo?.Website ? (instructorInfo.Website.substring(0, 5) === "https" ? instructorInfo.Website.substring(12, instructorInfo.Website.length -1) : (instructorInfo.Website.substring(0, 4) === "http" ? instructorInfo.Website.substring(11, instructorInfo.Website.length -1) : instructorInfo.Website)) : <i>Not added yet.</i>}</h5>
                          <h5 className="userprofile--linkedin"><i className="fa-brands fa-linkedin"></i>&nbsp;&nbsp;{instructorInfo?.LinkedIn ? (instructorInfo.LinkedIn.substring(0, 5) === "https" ? instructorInfo.LinkedIn.substring(12, instructorInfo.LinkedIn.length -1) : (instructorInfo.LinkedIn.substring(0, 4) === "http" ? instructorInfo.LinkedIn.substring(11, instructorInfo.LinkedIn.length -1) : instructorInfo.LinkedIn)) : <i>Not added yet.</i>}</h5>
                          <div className="userprofile--emailandedit">
                            {!editEmailInputField && <h5 className="userprofile--email"><i className="fa-solid fa-envelope"></i>&nbsp;&nbsp;{instructorInfo?.Email}</h5>}
                            {myProfileInstr && !editEmailInputField && <button className="userprofile--editbutton" onClick={toggleEmailInputField}><i className="fa-solid fa-pen-to-square"></i>&nbsp;&nbsp;</button>}
                            {myProfileInstr && editEmailInputField &&
                              <div className="userprofile--editemailinput">
                                <i className="fa-solid fa-envelope"></i>
                                <input 
                                  id='email' 
                                  className="userprofile--emailinput" 
                                  type='email' 
                                  placeholder='Enter new email ...' 
                                  name='email'
                                  onChange={handleUpdatedEmailChange}
                                  value={updatedEmail}
                                />
                                <button className='userprofile--updatebutton' onClick={handleUpdateEmail}>Update</button>
                                <button className='userprofile--cancelbutton' onClick={toggleEmailInputField}>Cancel</button>
                                <p className={message.type}>{message.text}</p>
                              </div>
                            }
                          </div>
                          {!myProfileInstr &&
                            <div className="userprofile--reviewcoursesbuttons">
                              <button type="button" onClick={() => scrollTo("instructorCourses")}>Courses</button>
                              <button type="button" onClick={() => scrollTo("instructorRatings")}>Ratings</button>
                            </div>
                          }
                          {myProfileInstr && <a className="userprofile--settingshyperlink" onClick={() => navigate("/settings")}><i className="fa-solid fa-gear"></i>&nbsp;&nbsp;Settings & Privacy</a>}
                        </>
                        }
                        {!(myProfileInstr || profileInstr) &&<h4 className="usertype--user">{traineeInfo.Type === 'individualTrainee'? 'INDIVIDUAL TRAINEE' :'CORPORATE TRAINEE'}</h4>}
                        {myProfileTrainee && <a className="userprofile--settingshyperlink" onClick={() => navigate("/settings")}><i className="fa-solid fa-gear"></i>&nbsp;&nbsp;Settings & Privacy</a>}
                    </div>
                    {(profileInstr || myProfileInstr) && instructorInfo?.ProfileImage &&
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
                      <div className={instructorInfo?.Bio ? "userprofile--editbio" : "userprofile--addbio"}>
                        <h3 className="userprofile--bioheader">Bio</h3>
                        {myProfileInstr && instructorInfo.Bio && !addBioInputField && <button className="userprofile--editbutton" onClick={handleEditBioClicked}><i className="fa-solid fa-pen-to-square"></i>&nbsp;&nbsp;</button>}
                        {myProfileInstr && !instructorInfo.Bio && !addBioInputField && <button className="userprofile--addbutton" onClick={toggleAddBioInputField}><i className="fa-solid fa-plus"></i>&nbsp;&nbsp;Add Bio</button>}
                      </div>
                      {instructorInfo?.Bio && !addBioInputField && <p>{instructorInfo.Bio}</p>}
                      {!instructorInfo?.Bio && !addBioInputField  && <i>Not added yet.</i>}
                      {addBioInputField && 
                        <>
                          <textarea 
                              id="bio"
                              name="bio"
                              className="bio--input" 
                              placeholder="Enter a mini biography ..." 
                              rows="4" 
                              cols="50"
                              onChange={handleBioChange}
                              value={enteredBio}
                          >
                          </textarea>
                          <div className="userprofile--enterbiobuttons">
                            <button className="userprofile--addbutton" onClick={handleAddBio}>Submit</button>
                            <button className="userprofile--biocancelbutton" onClick={toggleAddBioInputField}>Cancel</button>
                          </div>
                          <p className={message.type}>{message.text}</p>
                        </>
                      }
                    </div>
                  </>
                }
                {/* else mafesh bio */}
                {(!myProfileInstr && !myProfileTrainee) &&
                  <>
                    <hr className="user--line"/>
                    <div className="userprofile--courses">
                      <h3 className="userprofile--coursesheader" id="instructorCourses">Courses</h3>
                      <div className="userprofile--allcourses">
                        {coursesDataElements}
                      </div>
                    </div>
                  </>
                }
                {myProfileTrainee &&
                  <>
                    <hr className="user--line"/>
                    <div className="userprofile--courses">
                      <h3 className="userprofile--coursesheader" id="instructorCourses">Enrolled In</h3>
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
                        <h3 className="userprofile--ratingssheader" id="instructorRatings">Ratings</h3>
                        <div className="userprofile--allcourses">
                            {ratingDataElements}
                        </div>
                    </div>
                  </>
                }
                {/* else mafesh ratings */}
            </div>
            
        </>
      )}
    </>
  )
}

export default UserProfile;