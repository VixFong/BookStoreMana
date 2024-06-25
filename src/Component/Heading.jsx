import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Login } from './Login';
import { Cart } from './Cart';

export const Heading = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([
        {
            image: 'https://via.placeholder.com/100',
            category: 'MYSTERY, THRILLER & SUSPENSE',
            title: 'Dark in Death: An Eve Dallas Novel (In Death, Book 46)',
            author: 'J. D. Robb',
            price: 14.20,
            quantity: 2
        },
        {
            image: 'https://via.placeholder.com/100',
            category: 'MYSTERY, THRILLER & SUSPENSE',
            title: 'Dark in Death: An Eve Dallas Novel (In Death, Book 46)',
            author: 'J. D. Robb',
            price: 14.20,
            quantity: 2
        },
        {
            image: 'https://via.placeholder.com/100',
            category: 'MYSTERY, THRILLER & SUSPENSE',
            title: 'Dark in Death: An Eve Dallas Novel (In Death, Book 46)',
            author: 'J. D. Robb',
            price: 14.20,
            quantity: 2
        },
        {
            image: 'https://via.placeholder.com/100',
            category: 'The Last Sister',
            title: 'Dark in Death: An Eve Dallas Novel (In Death, Book 46)',
            author: 'J. D. Robb',
            price: 14.20,
            quantity: 1
        }
    ]);

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleCloseLogin = () => {
        setShowLogin(false);
    };

    const toggleCart = () => {
        setShowCart(!showCart);
    };

    const handleRemove = (index) => {
        setCartItems(cartItems.filter((_, i) => i !== index));
    };

    const handleQuantityChange = (index, quantity) => {
        const updatedCartItems = cartItems.map((item, i) =>
            i === index ? { ...item, quantity: parseInt(quantity, 10) } : item
        );
        setCartItems(updatedCartItems);
    };

    useEffect(() => {
        document.body.style.paddingTop = '70px';
        return () => {
            document.body.style.paddingTop = '0px';
        };
    }, []);

    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
                        </svg>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="mynavbar">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/categoryclient">Category</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="javascript:void(0)">Service</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="javascript:void(0)">About Us</a>
                            </li>
                        </ul>

                        <form className="d-flex mx-auto w-50 pe-3 ms-3">
                            <input className="form-control me-2" type="text" placeholder="Search"/>
                            <button className="btn btn-primary" type="button">Search</button>
                        </form>
                        <button className="btn btn-outline-light ms-2 me-2" onClick={handleLoginClick}>Login</button>
                        <p className="text-white mt-3" onClick={toggleCart} style={{cursor: 'pointer'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                            </svg>
                            <span className="position-fixed w-10  translate-middle badge rounded-pill bg-danger" style={{ top: '20px', left: '99%', transform: 'translate(-50%, -50%)' }}>
                                {cartItems.length}
                            </span>
                        </p>
                    </div>
                </div>
            </nav>
            {showLogin && <Login onClose={handleCloseLogin} />}
            <Cart show={showCart} onClose={toggleCart} cartItems={cartItems} handleRemove={handleRemove} handleQuantityChange={handleQuantityChange}/>
        </div>
    );
};

export default Heading;