import React from 'react'
import CheckoutForm from '../Component/CheckoutForm'

export const Checkout = () => {
  return (
    <div className='container'>
        <CheckoutForm/>
    </div>
  )
}

const styles = `
  .container {
    padding: 50px;
    margin-left: 75px;
    flex-grow:1;
    }
`;


// Inject the styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
