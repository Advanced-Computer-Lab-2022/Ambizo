import React from "react";
import Header from "../Header/Header";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import countryToCurrency  from 'country-to-currency';
import InstructorService from "../../services/Instructor.service";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import DiscountImage from '../../images/DiscountImage.svg'

async function retrieveCourseDetails(id){
    return InstructorService.getCourseDetails(id)
    .then((result) => {
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
    }, [params.courseId, navigate]);

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

    const [message, setMessage] = React.useState(
        { text: "", type: ""}
    )

    const [confirmDiscountModal, setConfirmDiscountModal] = React.useState(false);

    const toggleConfirmationModal = () => {
        if (checkSubmit()) {
            setConfirmDiscountModal(prevModal => !prevModal);
        }
    };

    function checkSubmit() {
        if(!discountPercentage) {
            setMessage({ text: "Discount Percentage Field is Required", type: "form--errormessage" })
            return false;
        }
        else {
            if(discountPercentage < 1 || discountPercentage > 100) {
                setMessage({ text: "Discount Percentage Must Be Between 1 and 100", type: "form--errormessage" })
                return false;
            }
        }
        return true;
    }

    async function handleApplyDiscount(event) {
        event.preventDefault();
        return InstructorService.applyDiscount(params.courseId, discountPercentage, date)
            .then((result) => {
                navigate(`/coursedetails/${params.courseId}`)
            })
            .catch((error) => {
                setMessage({ text: error.response.data, type: "form--errormessage" })
                console.log(error)
            })
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
                <div className="definediscount--page">
                    <div className="definediscount--page--left">
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
                        <button className='discount--applybutton' onClick={toggleConfirmationModal}>Apply</button>
                        <p className={message.type}>{message.text}</p>
                        <ConfirmationModal confirmModal={confirmDiscountModal} toggleConfirmationModal={toggleConfirmationModal} 
                            confirmationMessage="Are you sure you want to apply this discount?" actionCannotBeUndone={false} 
                            discountDetails = {`Price after discount: ${discountPercentage ? discountPercentage >= 1 && discountPercentage <= 100 ? (coursePrice*((100-discountPercentage)/100)).toFixed(2) : coursePrice.toFixed(2) : coursePrice.toFixed(2)} ${currencyCode}, Expiry Date: ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`}
                            handleConfirm={handleApplyDiscount}/>
                    </div>
                    <div className='definediscount--rightcontainer'>
                        <img className="definediscount--discountimage" src={DiscountImage} alt='Attract Trainees' />
                        <h2 className="discount--statement">Applying discounts help you attract more trainees to your course!</h2>
                    </div>
                </div>
            </>
        )
        }
        </>
    )
}

export default DiscountPage;