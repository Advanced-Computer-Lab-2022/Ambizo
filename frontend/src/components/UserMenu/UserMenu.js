import React from "react";
import { useNavigate } from "react-router-dom"

function UserMenu(props) {
    const navigate = useNavigate();

    return (
        <div className="userMenu--div">
                {(props.userType === "instructor" || props.userType === "individualTrainee" || props.userType === "corporateTrainee") && <div className="userMenu--item" onClick={() => navigate(`/user/${JSON.parse(sessionStorage.getItem("User")).Username}`)}><i className="fa-solid fa-user"></i>&nbsp;&nbsp;My Profile</div>}
                {props.userType === "instructor" && <div className="userMenu--item" onClick={() => navigate("/mycourses")}><i className="fa-solid fa-person-chalkboard"></i>&nbsp;&nbsp;My Courses</div>}
                {props.userType === "instructor" && <div className="userMenu--item" onClick={() => navigate("/addcourse")}><i className="fa-solid fa-plus"></i>&nbsp;&nbsp;Add Course</div>}
                <div className="userMenu--item" onClick={props.toggleLogOut}><i className="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;Log Out</div>
        </div>
    )
}

export default UserMenu;