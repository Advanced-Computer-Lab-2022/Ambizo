import React from 'react';
import countryToCurrency from 'country-to-currency';


function CheckoutSummary(props){
    let currencyCode = countryToCurrency[localStorage.getItem("countryCode")] || "USD"
    return (
        <>
            <h2>Order Summary</h2>
            <div className='list-amount-summary'>
                <span className='price--label'>Original Price:</span>
                <span>{`${props.courseOriginalPrice} ${currencyCode}`}</span>
            </div>
            
            {props.discountAmount !== 0 &&(
                <>
                    <br />
                    <div className='list-amount-summary'>
                        <span className='price--label'>Discount:</span>
                        <span>{`${props.discountAmount} ${currencyCode}`}</span>
                    </div>
                    <br />
                </>
            )}
            
            {props.amountPaidFromWallet !== 0 &&(
                <>
                    <div className='list-amount-summary'>
                        <span className='price--label'>Wallet Contribution:</span>
                        <span>{`${props.amountPaidFromWallet} ${currencyCode}`}</span>
                    </div>
                    <br />
                </>
            )}
            
            <hr />
            <div className='total-amount-summary'>
                <span className='price--label'>Total:</span>
                <span>{`${props.amountToBePaid} ${currencyCode}`}</span>
            </div>
        </>
    );
}

export default CheckoutSummary;