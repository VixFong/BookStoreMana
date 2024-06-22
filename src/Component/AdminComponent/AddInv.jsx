import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';

const AddInv = ({ show, onHide, onAdd }) => {
    const [name, setName] = useState('');
    const [onHand] = useState(0);
    const [units] = useState('books');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = { name, onHand, units, price, image };
        onAdd(newItem);
        setName('');
        setPrice('');
        setImage(null);
        setImagePreview(null);
        onHide();
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Inventory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>On Hand</Form.Label>
                        <Form.Control
                            type="number"
                            value={onHand}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Units</Form.Label>
                        <Form.Control
                            type="text"
                            value={units}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleImageChange}
                            required
                        />
                        {imagePreview && (
                            <div className="mt-3">
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                            </div>
                        )}
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