import React from "react";
import { useNavigate } from "react-router-dom"

function UserMenu(props) {
    const navigate = useNavigate();

    return (
        <div className="userMenu--div">
                {props.userType === "instructor" && <div className="userMenu--item" onClick={() => navigate("/addcourse")}>Add Course</div>}
                {props.userType === "instructor" && <div className="userMenu--item" onClick={() => navigate("/mycourses")}>My Courses</div>}
                {props.userType === "admin" && <div className="userMenu--item" onClick={() => navigate("/addAdmin")}>Add Admin</div>}
                {props.userType === "admin" && <div className="userMenu--item" onClick={() => navigate("/addinstructor")}>Add Instructor</div>}
                {props.userType === "admin" && <div className="userMenu--item" onClick={() => navigate("/addtrainee")}>Add Corporate Trainee</div>}
                <div className="userMenu--item" onClick={props.toggleLogOut}>Log Out</div>
        </div>
    )
}

export default UserMenu;