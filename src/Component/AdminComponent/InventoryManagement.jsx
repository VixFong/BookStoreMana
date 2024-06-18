import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

const inventoryItems = [
    { image: 'https://via.placeholder.com/150', name: 'Harry Potter', price: '5$', quantity: '20 Books' },
    { image: '/UnderAFireFly.jpg', name: 'Under A Fire Fly', price: '5$', quantity: '20 Books' },
    { image: '/TheLastSister.jpg', name: 'The Last Sister', price: '5$', quantity: '20 Books' },
    { image: '/ThinkLikeAMonk.jpg', name: 'Think Like A Monk', price: '5$', quantity: '20 Books' },
    { image: '/ZombieTheorem.jpg', name: 'Zombie Theorem', price: '5$', quantity: '20 Books' },
    { image: 'https://via.placeholder.com/150', name: 'Tony Tony', price: '5$', quantity: '20 Books' },
];

export const InventoryManagement = () => {
    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h3>Inventory</h3>
                </Col>
                <Col className="text-end">
                    <Button variant="primary">Create</Button>
                </Col>
            </Row>
            <Row>
                {inventoryItems.map((item, index) => (
                    <Col md={4} className="mb-4" key={index}>
                        <Card className="h-100">
                            <Card.Img variant="top" src={item.image} style={{ width: '150px', height: '150px', objectFit: 'cover', margin: '10px auto' }} />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>
                                    <strong>Price:</strong> {item.price}<br />
                                    <strong>On hand:</strong> {item.quantity}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default InventoryManagement;