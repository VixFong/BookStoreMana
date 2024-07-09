import React from 'react'
import OrderSummary from '../Component/OrderSummary'

export const OrderReceived = () => {
  return (
    <div className='container'>
        <OrderSummary/>
    </div>
  )
}

const styles = `
  .container {
    padding: 10px;
    margin-left: 80px;
  }

`;

// Inject the styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
