import React from 'react';
import Rating from '@mui/material/Rating';
import countryToCurrency  from 'country-to-currency';
import HourIcon from '../../images/HourIcon.png'
import PriceIcon from '../../images/PriceIcon.png'

function Course(props) {
    let currencyCode = countryToCurrency[ localStorage.getItem("countryCode") ] || "USD";

    return (
        <>
            { props.isLoading ?
            (
                <>
                    <div className='course'>
                        <div className='course--image product-loading-1 background-masker'></div>
                        <div className='course--image product-loading-2 background-masker'></div>
                        <div className='course--image product-loading-3 background-masker'></div>
                        <div className='course--image product-loading-4 background-masker'></div>
                    </div>
                </>
            )
            :
            (
                <>
                    <div className='course'>
                        <img src={props.ImgURL} alt='Course' className='course--image'/>
                        <h3 className='course--title'>{props.Title.length > 60 ? props.Title.substring(0, 57) + "..." : props.Title}</h3>
                        <div className='course--hours'>
                            <img src={HourIcon} alt='Hour Icon' className='hour--icon'/>
                            <span className='hours--count'>{props.TotalHours} Hours</span>
                        </div>
                        <div>
                            <Rating className='course--rating' name="half-rating-read" defaultValue={props.Rating} precision={0.1} readOnly />
                            <span className='number--reviews'>({props.NumberOfReviews})</span>
                        </div>
                        <div className='course--price'>
                            <img src={PriceIcon} alt='Price Icon' className='price--icon'/>
                            {props.PriceInUSD === 0 && <span className='price'>FREE</span>}
                            {props.PriceInUSD !== 0 && props.Discount>0 && <span className='price'>{(props.PriceInUSD*((100-props.Discount)/100)).toFixed(2)} {currencyCode}</span>}
                            {props.PriceInUSD !== 0 && props.Discount>0 && <span className='old--price'>{props.PriceInUSD} {currencyCode}</span>}
                            {props.PriceInUSD !== 0 && props.Discount===0 && <span className='price'>{props.PriceInUSD} {currencyCode}</span>}
                        </div>
                    </div>
                </>
            )
            }
        </>
        

    )
}

export default Course;