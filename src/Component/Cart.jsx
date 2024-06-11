import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTimes } from 'react-icons/fa';

export const Cart = ({ show, onClose, cartItems, handleRemove, handleQuantityChange }) => {
    return (
        <div className={`offcanvas offcanvas-end ${show ? 'show' : ''}`} tabIndex="-1" style={{ visibility: show ? 'visible' : 'hidden' }}>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title">Your shopping bag ({cartItems.length})</h5>
                <button type="button" className="btn-close text-reset" onClick={onClose}></button>
            </div>
            <div className="offcanvas-body">
                {cartItems.map((item, index) => (
                    <div className="d-flex mb-3" key={index}>
                        <img src={item.image} className="img-thumbnail me-3" alt="Book" />
                        <div>
                            <p className="mb-1">{item.category}</p>
                            <h5 className="mb-1">{item.title}</h5>
                            <p className="mb-1">{item.author}</p>
                            <div className="d-flex align-items-center mb-1">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    className="form-control me-2"
                                    style={{ width: '70px' }}
                                />
                                × ${item.price}
                            </div>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemove(index)}>Remove<FaTimes /></button>
                        </div>
                    </div>
                ))}
                <div className="d-flex justify-content-between">
                    <h5>Subtotal:</h5>
                    <h5>${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h5>
                </div>
                <button className="btn btn-success w-100">Checkout</button>
            </div>
        </div>
    );
};

export default Cart;