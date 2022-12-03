import React from "react";
import { useNavigate } from "react-router-dom"

function UserMenu(props) {
    const navigate = useNavigate();

    return (
        <div className="userMenu--div">
                {props.userType === "instructor" && <div className="userMenu--item" onClick={() => navigate(`/user/${JSON.parse(sessionStorage.getItem("User")).Username}`)}><i class="fa-solid fa-user"></i>&nbsp;&nbsp;My Profile</div>}
                {props.userType === "instructor" && <div className="userMenu--item" onClick={() => navigate("/mycourses")}><i class="fa-solid fa-person-chalkboard"></i>&nbsp;&nbsp;My Courses</div>}
                {props.userType === "instructor" && <div className="userMenu--item" onClick={() => navigate("/addcourse")}><i className="fa-solid fa-plus"></i>&nbsp;&nbsp;Add Course</div>}
                {props.userType === "admin" && <div className="userMenu--item" onClick={() => navigate("/addAdmin")}><i className="fa-solid fa-plus"></i>&nbsp;&nbsp;Add Admin</div>}
                {props.userType === "admin" && <div className="userMenu--item" onClick={() => navigate("/addinstructor")}><i className="fa-solid fa-plus"></i>&nbsp;&nbsp;Add Instructor</div>}
                {props.userType === "admin" && <div className="userMenu--item" onClick={() => navigate("/addtrainee")}><i className="fa-solid fa-plus"></i>&nbsp;&nbsp;Add Corporate Trainee</div>}
                <div className="userMenu--item" onClick={props.toggleLogOut}><i class="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;Log Out</div>
        </div>
    )
}

export default UserMenu;