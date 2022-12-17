import React from "react";
import Header from '../Header/Header';
import CoursesPage from '../CoursesPage/CoursesPage';
import SetPromotionImage from '../../images/SetPromotionImage.png'
import Calendar from "react-calendar";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import AdministratorService from "../../services/Administrator.service";
import { useNavigate } from "react-router-dom";

function AdminSetPromotion() {

    const navigate = useNavigate();

    const [coursesToBeDiscounted, setCoursesToBeDiscounted] = React.useState([])
    
    function handleCoursesToBeDiscountedSelected(checkboxVal, courseId) {
        if(checkboxVal) {
            if(!coursesToBeDiscounted.includes(courseId)) {
                setCoursesToBeDiscounted(current => [...current, courseId])
            }
        }
        else {
          if(coursesToBeDiscounted.includes(courseId)) {
            setCoursesToBeDiscounted(current => current.filter(arrayCourseId => arrayCourseId !== courseId))
          }
        }
        setMessage({ text: "", type: "" })
    }

    const [discountPercentage, setDiscountPercentage] = React.useState();

    function handleDiscountPercentageChange(event) {
        const{ value } = event.target
        setDiscountPercentage(value);
        setMessage({ text: "", type: "" })
    }

    const [date, setDate] = React.useState(new Date());

    const onChange = date => {
        setDate(date);
    };

    const [message, setMessage] = React.useState(
        { text: "", type: ""}
    )

    const [confirmDiscountModal, setConfirmDiscountModal] = React.useState(false);

    const toggleDiscountConfirmationModal = () => {
        if (checkSubmit()) {
            setConfirmDiscountModal(prevModal => !prevModal);
        }
    };

    function checkSubmit() {
        if(coursesToBeDiscounted.length === 0) {
            setMessage({ text: "You Must Select Atleast 1 Course", type: "form--errormessage" })
            return false;
        }
        else if(!discountPercentage) {
                setMessage({ text: "Discount Percentage Field is Required", type: "form--errormessage" })
                return false;
        }
        else if(discountPercentage < 1 || discountPercentage > 100) {
            setMessage({ text: "Discount Percentage Must Be Between 1 and 100", type: "form--errormessage" })
                return false;
        }
        return true;
    }


    async function handleApplyDiscount(event) {
        event.preventDefault();
        return AdministratorService.applyDiscount(coursesToBeDiscounted, discountPercentage, date)
            .then((result) => {
                navigate(0)
            })
            .catch((error) => {
                setMessage({ text: error.response.data, type: "form--errormessage" })
                console.log(error)
            })
    }

    const [coursesToRemoveDiscount, setCoursesToRemoveDiscount] = React.useState([])
    
    function handleCoursesToRemoveDiscountSelected(checkboxVal, courseId) {
        if(checkboxVal) {
            if(!coursesToRemoveDiscount.includes(courseId)) {
                setCoursesToRemoveDiscount(current => [...current, courseId])
            }
        }
        else {
          if(coursesToRemoveDiscount.includes(courseId)) {
            setCoursesToRemoveDiscount(current => current.filter(arrayCourseId => arrayCourseId !== courseId))
          }
        }
        setMessage({ text: "", type: "" })
    }

    const [removeDiscountModal, setRemoveDiscountModal] = React.useState(false);

    const toggleRemoveDiscountModal = () => {
        if(coursesToRemoveDiscount.length === 0) {
            setMessage({ text: "You Must Select Atleast 1 Course", type: "form--errormessage" })
        }
        else {
            setRemoveDiscountModal(prev => !prev)
        }
    };

    async function handleRemoveDiscount(event) {
        event.preventDefault();
        return AdministratorService.applyDiscount(coursesToRemoveDiscount, 0, new Date("2000-01-01"))
            .then((result) => {
                setRemoveDiscountModal(prev => !prev)
                navigate(0)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <Header />
            <div className="adminpromo--headerdiv">
                <h1 className="adminpromotions--header">Courses' Prices and Discounts</h1>
                <img className="adminpromotions--pricesimage" src={SetPromotionImage} alt='Prices' />
            </div>
            <CoursesPage sectionNotPage={true} setPromoTitle="Select course(s) and set a discount" adminNotDiscountedCourses={true} handleCoursesToBeDiscountedSelected={handleCoursesToBeDiscountedSelected} />
            <div className="adminpromotions--discount">
                <div className="adminpromotions-discountdetails">
                <p className="adminpromotions--discountheader"><i className="fa-solid fa-tag"></i>&nbsp;&nbsp;Define a Discount for Selected Courses</p>
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
                <div className="adminpromotionsdiscount--calendar">
                    <p className="discount--titles">Expiry date:</p>
                    <Calendar minDate={new Date()} onChange={onChange} value={date} />
                </div>
                    <button className='adminpromotionsdiscount--applybutton' onClick={toggleDiscountConfirmationModal}>Apply</button>
                    <p className={message.type}>{message.text}</p>
                    <ConfirmationModal confirmModal={confirmDiscountModal} toggleConfirmationModal={toggleDiscountConfirmationModal} 
                        confirmationMessage="Are you sure you want to apply this discount?" actionCannotBeUndone={false} 
                        discountDetails = {`Number of courses: ${coursesToBeDiscounted.length}, Expiry Date: ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`}
                        handleConfirm={handleApplyDiscount}/>
                </div>
            </div>
            <CoursesPage sectionNotPage={true} setPromoTitle="Select course(s) and remove discount" adminDiscountedCourses={true} handleCoursesToRemoveDiscountSelected={handleCoursesToRemoveDiscountSelected} />
            <div className="adminpromotions--removediscount">
                <p className="adminpromotions--removediscountheader"><i className="fa-solid fa-tag"></i>&nbsp;&nbsp;Remove Discount for Selected Courses</p>
                <button className='adminpromotionsdiscount--removebutton' onClick={toggleRemoveDiscountModal}><i className="fa-solid fa-trash"></i>&nbsp;&nbsp;&nbsp;Remove</button>
                <p className={message.type}>{message.text}</p>
                <ConfirmationModal confirmModal={removeDiscountModal} toggleConfirmationModal={toggleRemoveDiscountModal} 
                    confirmationMessage="Are you sure you want to remove the discount?" actionCannotBeUndone={false} 
                    discountDetails = {`Number of courses: ${coursesToRemoveDiscount.length}`} handleConfirm={handleRemoveDiscount} />
            </div>
        </>
    )
}

export default AdminSetPromotion;