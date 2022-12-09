import React from "react";
import Header from "../Header/Header";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import countryToCurrency  from 'country-to-currency';
import InstructorService from "../../services/Instructor.service";

async function retrieveCourseDetails(id){
    return InstructorService.getCourseDetails(id)
    .then((result) => {
        console.log(result)
        return result;
    })
}

function DiscountPage() {
    const params = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = React.useState(true);
    const [course, setCourse] = React.useState({});

    React.useEffect(() => {
        document.title = "Define a Promotion";

        retrieveCourseDetails(params.courseId)
        .then(course => {
            setCourse(course.data)
            setIsLoading(false);
        })
        .catch(error => {
            navigate("/404")
        })
    }, [params.courseId]);

    let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";

    const [discountPercentage, setDiscountPercentage] = React.useState();

    function handleDiscountPercentageChange(event) {
        const{ value } = event.target
        setDiscountPercentage(value);
    }

    const [date, setDate] = React.useState(new Date());

    const onChange = date => {
        setDate(date);
    };

    const coursePrice = parseFloat(course.Price);

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
                <div className="definediscount--page">
                    <p className="discount--goback" onClick={() => navigate(`/coursedetails/${params.courseId}`)}>{"<"} Back to Course details</p>
                    <h1 className="discountpage--header"><i className="fa-solid fa-tag"></i>&nbsp;&nbsp;Define a Promotion</h1>
                    <p className="discount--titles">Course title:</p>
                    <h3>{course.Title}</h3>
                    <div className="discount--input">
                        <p className="discount--titles">Discount percentage:</p>
                        <input 
                            id='discount' 
                            className="discount--percentageinput" 
                            type='number' 
                            placeholder='Enter percentage (1-100) %' 
                            name='discount'
                            min="1" 
                            max="100"
                            onChange={handleDiscountPercentageChange}
                            value={discountPercentage}
                        />
                    </div>
                    <div className="discount--calendar">
                        <p className="discount--titles">Expiry date:</p>
                        <Calendar minDate={new Date()} onChange={onChange} value={date} />
                    </div>
                    <div className="discount--oldnewprice">
                        <div>
                            <p className="discount--titles">Current Price:</p>
                            <h3>{coursePrice.toFixed(2)} {currencyCode}</h3>
                        </div>
                        <div>
                            <p className="discount--titles">New Price:</p>
                            <h3>{discountPercentage ? discountPercentage >= 1 && discountPercentage <= 100 ? (coursePrice*((100-discountPercentage)/100)).toFixed(2) : coursePrice.toFixed(2) : coursePrice.toFixed(2)} {currencyCode}</h3>
                        </div>
                    </div>
                    <button className='discount--applybutton'>Apply</button>
                </div>
            </>
        )
        }
        </>
    )
}

export default DiscountPage;