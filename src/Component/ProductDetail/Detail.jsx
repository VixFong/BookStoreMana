import React, { useState, useRef } from 'react';
import { Button, Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCartPlus } from 'react-icons/fa';

export const Detail = ({ addToCart }) => {
    const product = {
        title: 'Dark in Death: An Eve Dallas Novel (In Death, Book 46)',
        author: 'J. D. Robb',
        price: 14.20,
        images: [
            'https://via.placeholder.com/300x450',
            'https://via.placeholder.com/300x450?text=Second+Image',
            'https://via.placeholder.com/300x450?text=Third+Image'
        ],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat.'
    };

    const [quantity, setQuantity] = useState(1);
    const imgRef = useRef(null);

    const handleQuantityChange = (amount) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
    };

    const handleAddToCart = () => {
        const img = imgRef.current;
        if (img) {
            const clone = img.cloneNode(true);
            const rect = img.getBoundingClientRect();
            clone.style.position = 'absolute';
            clone.style.top = `${rect.top}px`;
            clone.style.left = `${rect.left}px`;
            clone.style.width = `${rect.width}px`;
            clone.style.transition = 'all 1s ease-in-out';
            document.body.appendChild(clone);

            setTimeout(() => {
                clone.style.top = '10px';
                clone.style.left = '90vw';
                clone.style.width = '50px';
                clone.style.height = '50px';
            }, 0);

            setTimeout(() => {
                document.body.removeChild(clone);
                addToCart(product, quantity);
            }, 1000);
        } else {
            addToCart(product, quantity);
        }
    };

    return (
        <div className="product-detail-container container mt-5">
            <style>
                {`
                .product-detail-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 100px;
                }
                .product-detail-image {
                    width: 300px;
                    height: 450px;
                }
                .product-detail-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 10px;
                }    
                .product-detail-info {
                    max-width: 700px;
                    margin-left: 50px;
                }
                .product-detail-title {
                    font-size: 40px;
                    font-weight: bold;
                }
                .product-detail-author {
                    font-size: 18px;
                    color: #888;
                }
                .product-detail-price {
                    font-size: 22px;
                    font-weight: bold;
                    color: #d9534f;
                    margin: 20px 0;
                }
                .product-detail-description {
                    margin-bottom: 20px;
                }
                .product-detail-quantity {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .product-detail-quantity button {
                    background: none;
                    border: 1px solid #ccc;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                .product-detail-quantity input {
                    width: 50px;
                    text-align: center;
                    border: 1px solid #ccc;
                    margin: 0 10px;
                }
                .product-detail-buttons {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                `}
            </style>
            <Carousel className="product-detail-image" controls={true} indicators={true} interval={null}>
                {product.images.map((image, index) => (
                    <Carousel.Item key={index}>
                        <img src={image} alt={`Slide ${index}`} ref={index === 0 ? imgRef : null} />
                    </Carousel.Item>
                ))}
            </Carousel>
            <div className="product-detail-info">
                <h2 className="product-detail-title">{product.title}</h2>
                <p className="product-detail-author">By (author) {product.author}</p>
                <p className="product-detail-price">${product.price}</p>
                <p className="product-detail-description">{product.description}</p>
                <div className="product-detail-quantity">
                    <button onClick={() => handleQuantityChange(-1)}>-</button>
                    <input type="text" value={quantity} readOnly />
                    <button onClick={() => handleQuantityChange(1)}>+</button>
                </div>
                <div className="product-detail-buttons">
                    <Button variant="dark" onClick={handleAddToCart}>
                        <FaCartPlus /> Add to cart
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Detail;