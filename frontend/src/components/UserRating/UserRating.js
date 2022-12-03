import React from "react"
import { Rating } from "@mui/material";

function UserRating() {
    //230
    let reviewText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat";

    return (
        <div className="rating">
            <div className="rating--icon--username--starscount">
                <p className="rating--usericon"><i class="fa-solid fa-user"></i></p>
                <div className="rating--username--starscount">
                    <h4 className="rating--username">Omar Sameh</h4>
                    <Rating className='rating--starscount' name="half-rating-read" defaultValue={4.5} precision={0.1} readOnly />
                </div>
            </div>
            <div className="rating--review">
                <p className="rating--reviewtext">{reviewText.length >= 230 ? reviewText.substring(0, 230) + "..." : reviewText}</p>
                {reviewText.length >= 230 && 
                    <a className="fullrating--hyperlink" href="">Show more</a>
                }
            </div>
        </div>
    )
}

export default UserRating;