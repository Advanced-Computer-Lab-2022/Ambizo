import React from "react";
import Header from '../Header/Header';
import CoursesPage from '../CoursesPage/CoursesPage';
import SetPromotionImage from '../../images/SetPromotionImage.png'
import Calendar from "react-calendar";

function AdminSetPromotion() {
    const [date, setDate] = React.useState(new Date());

    const onChange = date => {
        setDate(date);
    };

    return (
        <>
            <Header />
            <div className="adminpromo--headerdiv">
                <h1 className="adminpromotions--header">Courses' Prices and Discounts</h1>
                <img className="adminpromotions--pricesimage" src={SetPromotionImage} alt='Prices' />
            </div>
            <CoursesPage sectionNotPage={true} setPromoTitle="Select course(s) and set a discount" adminNotDiscountedCourses={true} />
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
                        // onChange={handleDiscountPercentageChange}
                        // value={discountPercentage}
                    />
                </div>
                <div className="adminpromotionsdiscount--calendar">
                    <p className="discount--titles">Expiry date:</p>
                    <Calendar minDate={new Date()} onChange={onChange} value={date} />
                </div>
                <button className='adminpromotionsdiscount--applybutton' >Apply</button>
                </div>
            </div>
            <CoursesPage sectionNotPage={true} setPromoTitle="Select course(s) and remove discount" adminDiscountedCourses={true} />
        </>
    )
}

export default AdminSetPromotion;