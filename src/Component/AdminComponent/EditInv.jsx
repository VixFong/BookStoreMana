import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal, Col, Row } from 'react-bootstrap';

export const EditInv = ({ show, onHide, onSave, item }) => {
    const [orderedQuantity, setOrderedQuantity] = useState(item.orderedQuantity);
    const [receivedQuantity, setReceivedQuantity] = useState(item.receivedQuantity);
    const [totalPrice, setTotalPrice] = useState(item.totalPrice);

    useEffect(() => {
        setOrderedQuantity(item.orderedQuantity);
        setReceivedQuantity(item.receivedQuantity);
        setTotalPrice(item.totalPrice);
   

    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();                
        onSave({ ...item, orderedQuantity, receivedQuantity, totalPrice });
        onHide();
    };

 
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Inventory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group> */}
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
                            required
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
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditInv;