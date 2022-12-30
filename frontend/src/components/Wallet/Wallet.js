import React from 'react';

function Wallet(props){
    return (
        <div className='wallet-container'>
            <i class="fa-solid fa-wallet"></i>
            <span className='wallet-content'>{`${parseFloat((props.money).toFixed(2))} ${props.currencyCode}`}</span>
        </div>
    );
}

export default Wallet;