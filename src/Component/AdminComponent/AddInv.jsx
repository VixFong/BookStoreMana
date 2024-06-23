import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';

const AddInv = ({ show, onHide, onAdd }) => {
    const [book, setBook] = useState('');
    const [orderedQuantity, setOrderedQuantity] = useState();
    const [receivedQuantity, setReceivedQuantity] = useState();
    const [totalPrice, setTotalPrice] = useState();

    // const [onHand] = useState(0);  // On hand is always 0 and read-only
    // const [units] = useState('books');  // Units is always 'books' and read-only
    // const [price, setPrice] = useState('');
    // const [image, setImage] = useState(null);
    // const [imagePreview, setImagePreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = { book, orderedQuantity, receivedQuantity, totalPrice };
        onAdd(newItem);
        setBook('');
        setOrderedQuantity();
        setReceivedQuantity();
        setTotalPrice();
       
        onHide();
    };


    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Inventory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Book</Form.Label>
                        <Form.Control
                            type="text"
                            value={book}
                            onChange={(e) => setBook(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Ordered Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            value={orderedQuantity}
                            onChange={(e) => setOrderedQuantity(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Received Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            value={receivedQuantity}
                            onChange={(e) => setReceivedQuantity(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="text"
                            value={totalPrice}
                            onChange={(e) => setTotalPrice(e.target.value)}
                            required
                        />
                    </Form.Group>
                
                    <Button variant="primary" type="submit">
                        Add Inventory
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddInv;