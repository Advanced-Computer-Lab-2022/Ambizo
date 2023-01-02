import React from 'react';
import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import swal from 'sweetalert';

function CheckoutForm(props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const stripe = useStripe();
    const elements = useElements();


    async function handleSubmit(event){
        event.preventDefault();
        if( !stripe || !elements ){
            return;
        }

        setIsProcessing(true);
        if( props.amountToBePaid ){
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
            if(paymentIntent?.status === 'succeeded'){
                props.completePayment();
            }else{
                swal({
                    icon: 'error',
                    title: 'Payment Failed',
                    text: `Payment didn\'t go through, ${error?.message}`,
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    dangerMode: true,
                    button: "OK",
                });
                console.log(paymentIntent?.status);
            }
        }else{
            props.completePayment();
        }

        setIsProcessing(false);
    }


    return (
        <form onSubmit={handleSubmit}>
            {props.amountToBePaid? (<PaymentElement />) : <></>}
            <button className='pay--button' disabled={isProcessing} >{isProcessing? 'Processing...': 'Complete Checkout'}</button>
        </form>
    );
}

export default CheckoutForm;