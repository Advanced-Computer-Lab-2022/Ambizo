import React from 'react';

function Wallet(props){
    return (
        <div className='wallet-container'>
            <i class="fa-solid fa-wallet"></i>
            <span className='wallet-content'>{`${props.money} ${props.currencyCode}`}</span>
        </div>
    );
}

export default Wallet;