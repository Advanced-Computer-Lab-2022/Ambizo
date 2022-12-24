import React from 'react';
import { useState, useEffect } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';

function CheckoutForm() {
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements();


    async function handleSubmit(event){
        event.preventDefault();
        if( !stripe || !elements ){
            return;
        }

        setIsProcessing(true);
        const { error , paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin,
            },
            redirect: 'if_required'
        });

        if(error){
            console.log(error.message);
        }
        if(paymentIntent.status === 'succeeded'){
            
        }
        setIsProcessing(false);
    }


    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button className='pay--button' disabled={isProcessing} >{isProcessing? 'Processing...': 'Complete Checkout'}</button>
        </form>
    );
}

export default CheckoutForm;