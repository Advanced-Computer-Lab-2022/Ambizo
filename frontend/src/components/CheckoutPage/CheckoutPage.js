import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import Header from '../Header/Header';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import CheckoutSummary from '../CheckoutSummary/CheckoutSummary';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import TraineeService from "../../services/Trainee.service";
import countryToCurrency from 'country-to-currency';
import OrderDetails from '../OrderDetails/OrderDetails';

function CheckoutPage() {

    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [stripePromise, setStripePromise] = useState(null);
    const [checkoutDetails, setCheckoutDetails] = useState(null);
    
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {

        const checkoutInformation = {
            courseId: params.courseId,
            currency: countryToCurrency[localStorage.getItem("countryCode")] || "USD"
        }

        TraineeService.getPaymentKey().then(res => {
            console.log(res.data.paymentKey);
            setStripePromise(loadStripe(res.data.paymentKey));
            TraineeService.checkoutDetails(checkoutInformation).then(
                response => {
                    if (response.status === 200) {
                        console.log(response.data)
                        setCheckoutDetails(response.data);
                        setClientSecret(response.data.clientSecret);
                    } else {
                        console.log(response.status);
                        console.log(response.data);
                    }
                    setIsLoading(false);
                }
            ).catch(error => {
                setIsLoading(false);
                console.log(error);
            });
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            <Header />
            <div className={"loader-container" + (!isLoading ? " hidden" : "")}>
                <div className="spinner"> </div>
            </div>
            {!isLoading && stripePromise && clientSecret &&
                (
                    <div className='checkout--container'>
                        <div className='checkout--leftcontainer'>
                            <OrderDetails courseDetails={checkoutDetails.courseDetails}/>
                            <h1>Checkout</h1>
                            <Elements stripe={stripePromise} options={ { clientSecret } }>
                                <CheckoutForm />
                            </Elements>
                        </div>
                        <div className='checkout--rightcontainer'>
                            <CheckoutSummary 
                                courseOriginalPrice={checkoutDetails.courseOriginalPrice}
                                discountAmount={checkoutDetails.discountAmount}
                                amountPaidFromWallet={checkoutDetails.amountPaidFromWallet}
                                amountToBePaid={checkoutDetails.amountToBePaid}
                            />
                        </div>
                    </div>    
                )
            }
        </>
    );
}

export default CheckoutPage;