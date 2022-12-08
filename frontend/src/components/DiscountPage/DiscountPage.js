import React from "react";
import Header from "../Header/Header";
import Calendar from "react-calendar";

function DiscountPage() {
    const [date, setDate] = React.useState(new Date());

    const onChange = date => {
        setDate(date);
    };

    return (
        <>
            <Header />
            <div className="definediscount--page">
                <p className="discount--goback">{"<"} Back to Course details</p>
                <h1 className="discountpage--header"><i className="fa-solid fa-tag"></i>&nbsp;&nbsp;Define a Promotion</h1>
                <p className="discount--titles">Course title:</p>
                <h3>Developing Effective Time Management Habits</h3>
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
                        // onChange={handleUpdatedEmailChange}
                        // value={updatedEmail}
                    />
                </div>
                <div className="discount--calendar">
                    <p className="discount--titles">Expiry date:</p>
                    <Calendar onChange={onChange} value={date} />
                </div>
                <div className="discount--oldnewprice">
                    <div>
                        <p className="discount--titles">Current Price:</p>
                        <h3>713.15 EGP</h3>
                    </div>
                    <div>
                        <p className="discount--titles">New Price:</p>
                        <h3>512.25 EGP</h3>
                    </div>
                </div>
                <button className='discount--applybutton'>Apply</button>
            </div>

        </>
    )
}

export default DiscountPage;