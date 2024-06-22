import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal, Col, Row } from 'react-bootstrap';

export const EditInv = ({ show, onHide, onSave, item }) => {
    const [name, setName] = useState(item.name);
    const [onHand, setOnHand] = useState(item.onHand);
    const [price, setPrice] = useState(item.price);
    const [image, setImage] = useState(item.image);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        setName(item.name);
        setOnHand(item.onHand);
        setPrice(item.price);
        setImage(item.image);
        setImagePreview(item.image ? URL.createObjectURL(item.image) : null);
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...item, name, onHand, price, image });
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
                <Modal.Title>Edit Inventory</Modal.Title>
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
                            onChange={(e) => setOnHand(e.target.value)}
                            required
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
                        />
                        {image && (
                            <div className="mt-3">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Inventory"
                                    className="img-thumbnail"
                                    style={{ maxHeight: '200px' }}
                                />
                            </div>
                        )}
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