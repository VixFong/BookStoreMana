import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import AddInv from './AddInv';

// const inventoryItems = [
//     { image: 'https://via.placeholder.com/150', name: 'Harry Potter', price: '5$', quantity: '20 Books' },
//     { image: '/UnderAFireFly.jpg', name: 'Under A Fire Fly', price: '5$', quantity: '20 Books' },
//     { image: '/TheLastSister.jpg', name: 'The Last Sister', price: '5$', quantity: '20 Books' },
//     { image: '/ThinkLikeAMonk.jpg', name: 'Think Like A Monk', price: '5$', quantity: '20 Books' },
//     { image: '/ZombieTheorem.jpg', name: 'Zombie Theorem', price: '5$', quantity: '20 Books' },
//     { image: 'https://via.placeholder.com/150', name: 'Tony Tony', price: '5$', quantity: '20 Books' },
// ];

export const InventoryManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddInventory = (newItem) => {
        setInventory([...inventory, newItem]);
    };
    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h3>Inventory</h3>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        Create
                    </Button>
                </Col>
            </Row>
            <Row>
                {inventory.map((item, index) => (
                    <Col lg={3} md={4} sm={6} xs={12}className="mb-4" key={index}>
                        <Card className="inventory-item">
                            {item.image && (
                                <Card.Img variant="top" src={URL.createObjectURL(item.image)} alt={`Product ${index}`} className="inventory-img" />
                            )}
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    <strong>Price:</strong> {item.price}<br />
                                    <strong>On hand:</strong> {item.onHand} {item.units}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <AddInv 
                show={showAddModal} 
                onHide={() => setShowAddModal(false)} 
                onAdd={handleAddInventory} 
            />
                 <style>{`
                .inventory-item {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                    overflow: hidden;
                    transition: transform 0.2s ease-in-out;
                }
                .inventory-item:hover {
                    transform: translateY(-5px);
                }
                .inventory-img {
                    max-width: 100%;
                    max-height: 200px;
                    object-fit: cover;
                }
                .card-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 10px 0;
                }
                .card-text {
                    font-size: 1rem;
                }
                .text-end {
                    text-align: right;
                }
            `}</style>
        </Container>
    );
};

export default InventoryManagement;