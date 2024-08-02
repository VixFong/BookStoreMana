import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTimes } from 'react-icons/fa';
import { Modal, Spinner,  Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
export const Cart = ({ show, onClose }) => {
    const [cart, setCart] = useState([]);
    // const [quantity, setShipFee] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [error, setError] = useState('');

    const token =  localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        // fetchCart();
        if (token ) {
            fetchCart();
        }
    
    }, [show, onClose, token]);

    useEffect(() => {
        const handleCartChange = () => {
            // fetchCart();
            if (token) {
                fetchCart();
            }
        };
        // console.log("even listener");
        window.addEventListener('updateCart', handleCartChange);
        return () => {
            window.removeEventListener('updateCart', handleCartChange);
        };
    }, []);


    const fetchCart = async() =>{
        setShowModal(true);
        try {
            const response = await axios.post('/api/identity/auth/introspect', { token });
            const isValid = response.data.data.valid;
            // console.log('valid', isValid);
            if(isValid){
                const response = await axios.get('/api/cart',{
                    headers: {
                        Authorization: `Bearer ${token}`
                    } 
                })
    
                const cartData = response.data.data;
    
                console.log('cart data ', cartData);
    
                 // Lấy ra toàn bộ bookId
                const bookIds = cartData.map(item => item.bookId);
                console.log('bookIds ', bookIds);
                
                // Gửi request đến backend để lấy thông tin sách
                const bookResponse = await axios.post('/api/products/books/cart', {
                    bookId: bookIds
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
    
                const bookData = bookResponse.data.data;
                console.log('book data ', bookData);
    
    
    
                const inventoryResponse = await axios.post(`/api/inventory/stock`,{
                    bookId: bookIds
                })
    
                const inventoryData = inventoryResponse.data.data;
                console.log('inventory data ', inventoryData);
    
    
    
                const updatedCart = cartData.map(cartItem => {
                    const bookItem = bookData.find(book => book.bookId === cartItem.bookId);
                    const inventoryItem = inventoryData.find(inventory => inventory.bookId === cartItem.bookId);
        
                    return {
                        itemId: cartItem.itemId,
                        bookId: cartItem.bookId,
                        title: bookItem ? bookItem.title : '',
                        quantity: cartItem.quantity,  // Assuming cartData has quantity field
                        price: bookItem ? bookItem.price : 0,
                        discount: bookItem ? bookItem.discount : 0,
                        image: bookItem ? bookItem.image : '',
                        priceDiscount: bookItem ? bookItem.priceDiscount : 0,
                        receivedQuantity: inventoryItem ? inventoryItem.receivedQuantity : 0
                    };
                });
    
    
                console.log('update cart ', updatedCart);
                setCart(updatedCart);
            }            


          
           
            setShowModal(false);



        } catch (error) {
            console.log(error);

            setShowModal(false);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    }

    // console.log('update cart ', cart);

    const handleRemoveItem = async(id) =>{
        console.log('id', id);
        try {
            await axios.delete(`/api/cart/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                } 
            })
            fetchCart();
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    }
    const setQuanityCartItem = (e, id) =>{
        const newQuantity = parseInt(e.target.value);
        setCart(prevCart =>
            prevCart.map(item =>
                item.itemId === id ? { ...item, quantity: newQuantity } : item
            )
        );
    }; 

    const handleQuantityChange = async(id, newQuantity, inStock)=>{
    
        if (newQuantity > inStock) {
            setError(`The maximum quantity available in stock is ${inStock}`);
            setShowErrorModal(true);
            return;
        }

        try {
            await axios.put(`/api/cart/${id}`, { 
                quantity: newQuantity 
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                } 
            })
    
            fetchCart();
        } catch (error) {
            console.log(error);
        }

    }

    const handleCheckout = () => {
        if(cart.length ){
        const checkoutData = {
            items: cart.map(item => ({
                id: item.itemId,
                bookId: item.bookId,
                image: item.image,
                title: item.title,
                price: item.priceDiscount > 0 ? item.priceDiscount : item.price,
                purchaseQty: item.quantity
            })),
            subtotal: cart.reduce((total, item) => {
                const itemPrice = item.priceDiscount > 0 ? item.priceDiscount : item.price;
                return total + itemPrice * item.quantity;
            }, 0)
        };
    
        // Store checkoutData in localStorage
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
        // Navigate to checkout page
        navigate('/checkout');
        }
        else {
            setError('Your cart is empty. Please add items to your cart before proceeding to checkout.');
            setShowErrorModal(true);
        }
    };  
    return (
        <div className={`offcanvas offcanvas-end ${show ? 'show' : ''}`} tabIndex="-1" style={{ visibility: show ? 'visible' : 'hidden' }}>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title">Your shopping bag ({cart.length})</h5>
                <button type="button" className="btn-close text-reset" onClick={onClose}></button>
            </div>
            <div className="offcanvas-body">
            {token ? (
                cart.map((item, index) => (
                    <div className="d-flex mb-3" key={index}>
                        <img src={item.image} className="img-thumbnail me-3" alt="Book" style={{ width: '200px', height: '200px' }} />
                        
                        {/* <Card.Img variant="top" src={item.image} style={{ width: '200px', height: '200px' }} /> */}
                        <div className='mx-2'>
                            <h5 className="mb-1">{item.title}</h5>
                            <div className="d-flex align-items-center mb-1">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    max={item.receivedQuantity}
                                    onChange={(e) => setQuanityCartItem(e, item.itemId)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleQuantityChange(item.itemId, item.quantity, item.receivedQuantity);
                                        }
                                    }}
                                    
                                    className="form-control me-2"
                                    style={{ width: '70px' }}
                                />
                                 x {item.priceDiscount > 0 ? (
                                    <div>
                                        <strong style={{ textDecoration: 'line-through' }}>{item.price}$</strong>
                                        <br />
                                        <strong style={{ color: 'red' }}>{item.priceDiscount.toFixed(2)}$</strong>
                                    </div>
                                ) : (
                                    <strong className="product-price">{item.price}$</strong>
                                )}
                            </div>
                          
                            <span >In Stock: {item.receivedQuantity}</span>  <br />
                         
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.itemId)}> <i className="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                ))
                ) : (
                    <div className="text-center">
                        <p>You need to log in first to view your cart.</p>
                    </div>
                )}
                {token && (
                    <div className="d-flex justify-content-between">
                        <h5>Subtotal:</h5>
                        {/* <h5>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h5> */}
                        <h5>
                            ${cart.reduce((total, item) => {
                                const itemPrice = item.priceDiscount > 0 ? item.priceDiscount : item.price;
                                return total + itemPrice * item.quantity;
                            }, 0).toFixed(2)}
                        </h5>
                    </div>
                )}
                {token && (
                    <button className="btn btn-success w-100" onClick={handleCheckout}>
                        <a className='text-light' href='/checkout'>Checkout</a>
                    </button>
                )}
                {/* <button className="btn btn-success w-100"><a className='text-light' href='/checkout'>Checkout</a></button> */}
            </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-3">Loading, Please Wait...</p>
                </Modal.Body>
            </Modal>
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Body className="text-center">
                    <div className="mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        </div>
                        <h4>Error</h4>
                        <p>{error}</p>
                        <Button variant="danger" onClick={() => setShowErrorModal(false)}>Close</Button>
                    </Modal.Body>
                </Modal>
        </div>
    );
};

export default Cart;