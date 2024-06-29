import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Table, InputGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const OnTheWayEdit = () => {
    const [orderData, setOrderData] = useState({
        supplier: 'NXB Kim Đồng',
        trackingNo: '',
        arrivalTime: '',
        currency: 'USD',
        otherFee: 0,
        shipFee: 0,
        taxFee: 0,
        firstMileShipFee: 0,
        note: '',
        items: [
            { name: 'Green Alpine-13 Pro Max - 3 Lens', quantity: 5, unitPrice: 10, totalValue: 50, imgSrc: 'https://via.placeholder.com/50' },
            { name: 'CƯỜNG LỰC VIỀN DẺO-Series 7 45mm', quantity: 5, unitPrice: 15, totalValue: 75, imgSrc: 'https://via.placeholder.com/50' },
            { name: 'Green Alpine-13 Pro Max - 3 Lens', quantity: 5, unitPrice: 10, totalValue: 50, imgSrc: 'https://via.placeholder.com/50' },
            { name: 'CƯỜNG LỰC VIỀN DẺO-Series 7 45mm', quantity: 5, unitPrice: 15, totalValue: 75, imgSrc: 'https://via.placeholder.com/50' },
            { name: 'Green Alpine-13 Pro Max - 3 Lens', quantity: 5, unitPrice: 10, totalValue: 50, imgSrc: 'https://via.placeholder.com/50' },
            { name: 'CƯỜNG LỰC VIỀN DẺO-Series 7 45mm', quantity: 5, unitPrice: 15, totalValue: 75, imgSrc: 'https://via.placeholder.com/50' },
        ],
    });

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        calculateTotals();
    }, [orderData.items]);

    const calculateTotals = () => {
        const totalQty = orderData.items.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = orderData.items.reduce((acc, item) => acc + item.totalValue, 0);
        const itemQty = orderData.items.length;

        setOrderData(prevData => ({
            ...prevData,
            totalQty,
            totalPrice,
            itemQty
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData({ ...orderData, [name]: value });
    };

    const handleSave = () => {
        console.log('Order saved:', orderData);
    };

    const handleDiscardChanges = () => {
        setShowModal(true);
    };

    const confirmDiscardChanges = () => {
        setShowModal(false);
        navigate('/ontheway');
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <Button variant="link" onClick={handleDiscardChanges}>&larr; Edit Purchase Order</Button>
                </Col>
                <Col className="text-end">
                    <Button variant="secondary" onClick={handleDiscardChanges} className="me-2">Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>Supplier *</Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" readOnly defaultValue={orderData.supplier} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>Tracking No.</Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" name="trackingNo" value={orderData.trackingNo} onChange={handleInputChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>Estimated Arrival Time</Form.Label>
                            <Col sm={10}>
                                <Form.Control type="date" name="arrivalTime" value={orderData.arrivalTime} onChange={handleInputChange} />
                            </Col>
                        </Form.Group>
                        <h5>Fee Details</h5>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>Currency</Form.Label>
                            <Col sm={2}>
                                <Form.Control type="text" readOnly defaultValue={orderData.currency} />
                            </Col>
                            <Form.Label column sm={2}>Ship Fee</Form.Label>
                            <Col sm={2}>
                                <InputGroup>
                                    <Form.Control type="number" name="shipFee" value={orderData.shipFee} onChange={handleInputChange} />
                                    <InputGroup.Text>USD</InputGroup.Text>
                                </InputGroup>
                            </Col>
                            <Form.Label column sm={2}>Allocated by Weight</Form.Label>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>Other Fee</Form.Label>
                            <Col sm={2}>
                                <InputGroup>
                                    <Form.Control type="number" name="otherFee" value={orderData.otherFee} onChange={handleInputChange} />
                                    <InputGroup.Text>USD</InputGroup.Text>
                                </InputGroup>
                            </Col>
                            <Form.Label column sm={2}>Tax Fee</Form.Label>
                            <Col sm={2}>
                                <InputGroup>
                                    <Form.Control type="number" name="taxFee" value={orderData.taxFee} onChange={handleInputChange} />
                                    <InputGroup.Text>USD</InputGroup.Text>
                                </InputGroup>
                            </Col>
                            <Form.Label column sm={2}>Allocated by Price</Form.Label>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>First-mile Ship Fee</Form.Label>
                            <Col sm={2}>
                                <InputGroup>
                                    <Form.Control type="number" name="firstMileShipFee" value={orderData.firstMileShipFee} onChange={handleInputChange} />
                                    <InputGroup.Text>USD</InputGroup.Text>
                                </InputGroup>
                            </Col>
                            <Form.Label column sm={2}>Allocated by Quantity</Form.Label>
                        </Form.Group>
                        <h5>Other Information</h5>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={2}>Note</Form.Label>
                            <Col sm={10}>
                                <Form.Control as="textarea" name="note" value={orderData.note} onChange={handleInputChange} rows={3} maxLength={500} />
                                <Form.Text muted>{orderData.note.length} / 500</Form.Text>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row className="align-items-center">
                <Col>
                    <h5>Items Information</h5>
                </Col>
                <Col className="text-end">
                    <span>Item Qty: {orderData.itemQty} </span>
                    <span>Total Qty: {orderData.totalQty} </span>
                    <span>Total Price: {orderData.totalPrice} USD</span>
                </Col>
            </Row>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Volume & Weight</th>
                        <th>Purchase Qty</th>
                        <th>Unit Price</th>
                        <th>Value</th>
                        <th>Single Allocated Expense</th>
                        <th>Stock-in Cost Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orderData.items.map((item, index) => (
                        <tr key={index}>
                            <td className="d-flex align-items-center">
                                <img src={item.imgSrc} alt={item.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                <div>{item.name}</div>
                            </td>
                            <td>0.00m³ 0cm x 0cm x 0cm 100g</td>
                            <td>{item.quantity}</td>
                            <td>{item.unitPrice} USD</td>
                            <td>{item.totalValue} USD</td>
                            <td>0 USD</td>
                            <td>{item.unitPrice} USD</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Discard Changes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to discard changes?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>No</Button>
                    <Button variant="danger" onClick={confirmDiscardChanges}>Yes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OnTheWayEdit;