import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Tab } from 'react-bootstrap';

const product = {
    category: 'Thriller',
    author: 'J. D. Robb',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat.',
    formats: 'Hardcover, Kindle, Paperback',
    publisher: 'ABC',
};

export const ProductTabs = () => {
    const [key, setKey] = useState('description');

    return (
        <div className="product-tabs-container container mt-5">
            <style>
                {`
                .product-tabs-container {
                    display: flex;
                }
                .nav-tabs {
                    width: 200px; 
                    background-color: white;
                    border-right: 1px solid #ddd;
                }
                .nav-link {
                    border: none;
                    padding: 10px 15px;
                    color: #6c757d;
                    cursor: pointer;
                }
                .nav-link:hover {
                    color: #0056b3;
                    text-decoration: none;
                }
                .nav-link.active {
                    color: #000;
                    font-weight: bold;
                    border: none;
                    background-color: #fff;
                    position: relative;
                }
                .nav-link.active::after {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 2px;
                    background-color: #000;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }
                .tab-content {
                    padding: 20px;
                    margin-left: 20px;
                    width: calc(100% - 240px); 
                }
                .detail-item {
                    padding: 10px 0;
                    transition: background-color 0.3s ease;
                }
                .detail-item:hover {
                    background-color: #f8f9fa;
                }
                `}
            </style>
            <Tab.Container id="left-tabs-example" activeKey={key} onSelect={(k) => setKey(k)}>
                <Nav variant="pills" className="flex-column nav-tabs">
                    <Nav.Item>
                        <Nav.Link eventKey="description">Description</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="details">Product Details</Nav.Link>
                    </Nav.Item>
                </Nav>
                <div className="tab-content">
                    <Tab.Content>
                        <Tab.Pane eventKey="description">
                            <p>{product.description}</p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="details">
                            <div className="detail-item"><strong>Category:</strong> {product.category}</div>
                            <div className="detail-item"><strong>Author:</strong> {product.author}</div>
                            <div className="detail-item"><strong>Publisher:</strong> {product.publisher}</div>
                            <div className="detail-item"><strong>Book format:</strong> {product.formats}</div>
                        </Tab.Pane>
                    </Tab.Content>
                </div>
            </Tab.Container>
        </div>
    );
};

export default ProductTabs;