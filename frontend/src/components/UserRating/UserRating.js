import React from "react"
import { Rating } from "@mui/material";
import Trainee from "../../services/Trainee.service"

async function getTraineeName(traineeUsername){
      return Trainee.getTraineeName(traineeUsername)
      .then((result) => {
          return result.data;
      })
      .catch((error) => {
          console.log(error)
          return null;
      })
  }
  

function UserRating(props) {
    const traineeUsername = props.TraineeUsername;

    const [traineeName, setTraineeName] = React.useState("");

    React.useEffect(() => {
        getTraineeName(traineeUsername)
        .then(traineeName => setTraineeName(traineeName.Name))
        .catch(error => {
            console.log(error);
        })
      },[traineeUsername]);

    return (
        <div className="rating">
            <div className="rating--icon--username--starscount">
                <p className="rating--usericon"><i className="fa-solid fa-user"></i></p>
                <div className="rating--username--starscount">
                    <h4 className="rating--username">{traineeName}</h4>
                    <Rating className='rating--starscount' name="half-rating-read" defaultValue={props.Rating} precision={0.5} readOnly />
                </div>
            </div>
            <div className="rating--review">
                <p className="rating--reviewtext">{props.Review.length >= 230 ? props.Review.substring(0, 230) + "..." : props.Review}</p>
                {props.Review.length >= 230 && 
                    <a className="fullrating--hyperlink" href="">Show more</a>
                }
            </div>
        </div>
    )
}

export default UserRating;