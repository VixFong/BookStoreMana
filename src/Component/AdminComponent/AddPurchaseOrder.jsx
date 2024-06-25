import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, InputGroup, Modal, Table, Alert } from 'react-bootstrap';

export const AddPurchaseOrder = ({ onSave }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [supplier, setSupplier] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const items = [
        {
            name: 'Item 1',
            available: 10,
            unitPrice: 5,
            imgSrc: 'https://via.placeholder.com/50'
        },
        {
            name: 'Item 2',
            available: 5,
            unitPrice: 3,
            imgSrc: 'https://via.placeholder.com/50'
        },
        {
            name: 'Item 3',
            available: 8,
            unitPrice: 2,
            imgSrc: 'https://via.placeholder.com/50'
        },
        {
            name: 'Item 4',
            available: 3,
            unitPrice: 7,
            imgSrc: 'https://via.placeholder.com/50'
        }
    ];

    const handleSelectItem = (item) => {
        if (!selectedItems.find(selectedItem => selectedItem.name === item.name)) {
            setSelectedItems([...selectedItems, { ...item, purchaseQty: 0 }]);
        }
    };

    const handleRemoveItem = (item) => {
        setSelectedItems(selectedItems.filter(selectedItem => selectedItem.name !== item.name));
    };

    const handleQtyChange = (index, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].purchaseQty = value;
        setSelectedItems(updatedItems);
    };

    const handleSave = () => {
        if (!supplier) {
            setShowAlert(true);
            return;
        }
        const newOrder = {
            id: `PO${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            supplier,
            items: selectedItems,
            createTime: new Date().toLocaleString(),
            updateTime: new Date().toLocaleString(),
        };
        onSave(newOrder);
        setSelectedItems([]);
        setSupplier('');
        setShowAlert(false);
    };

    return (
        <Container className="mt-5">
            <h4>Add Purchase Order</h4>
            {showAlert && <Alert variant="danger">Please select a supplier.</Alert>}
            <Form>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="supplier">
                            <Form.Label>Supplier *</Form.Label>
                            <Form.Control as="select" value={supplier} onChange={(e) => setSupplier(e.target.value)}>
                                <option value="">-- Please select --</option>
                                <option value="Supplier 1">Supplier 1</option>
                                <option value="Supplier 2">Supplier 2</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="trackingNo">
                            <Form.Label>Tracking No.</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="estimatedArrivalTime">
                            <Form.Label>Estimated Arrival Time</Form.Label>
                            <Form.Control type="date" />
                        </Form.Group>
                    </Col>
                </Row>
                <h5>Fee Details</h5>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="currency">
                            <Form.Label>Currency</Form.Label>
                            <Form.Control as="select">
                                <option>USD</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="shipFee">
                            <Form.Label>Ship Fee</Form.Label>
                            <InputGroup>
                                <Form.Control type="number" />
                                <Form.Control as="select">
                                    <option>USD</option>
                                </Form.Control>
                                <Form.Control as="select" style={{ width: '180px' }}>
                                    <option>Allocated by Weight</option>
                                </Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="taxFee">
                            <Form.Label>Tax Fee</Form.Label>
                            <InputGroup>
                                <Form.Control type="number" />
                                <Form.Control as="select">
                                    <option>USD</option>
                                </Form.Control>
                                <Form.Control as="select" style={{ width: '180px' }}>
                                    <option>Allocated by Price</option>
                                </Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="otherFee">
                            <Form.Label>Other Fee</Form.Label>
                            <InputGroup>
                                <Form.Control type="number" />
                                <Form.Control as="select">
                                    <option>USD</option>
                                </Form.Control>
                                <Form.Control as="select" style={{ width: '180px' }}>
                                    <option>Allocated by Quantity</option>
                                </Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <h5>Other Information</h5>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="note">
                            <Form.Label>Note</Form.Label>
                            <Form.Control as="textarea" rows={3} maxLength={500} />
                            <Form.Text muted>0 / 500</Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <span>Item Qty: {selectedItems.length}</span>
                    </div>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </div>
                <div className="text-center">
                    <p>{selectedItems.length > 0 ? `${selectedItems.length} items selected` : 'There is no item'}</p>
                    <Button variant="secondary" onClick={() => setShowModal(true)}>+ Select Item</Button>
                </div>
                {selectedItems.length > 0 && (
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>Item Information</th>
                                <th>Purchase Qty *</th>
                                <th>Unit Price</th>
                                <th>Value</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItems.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img src={item.imgSrc} alt={item.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                            <div>
                                                {item.name} <br />
                                                <small>Available: {item.available}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={item.purchaseQty}
                                            onChange={(e) => handleQtyChange(index, parseInt(e.target.value))}
                                            min="0"
                                        />
                                    </td>
                                    <td>USD {item.unitPrice}</td>
                                    <td>USD {item.unitPrice * item.purchaseQty}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleRemoveItem(item)}>Remove</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Form>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Select Items</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="search">
                            <InputGroup>
                                <Form.Control type="text" placeholder="Search" />
                                <Button variant="outline-secondary">Search</Button>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                    <Row className="mt-3">
                        {items.map((item, index) => (
                            <Col md={6} key={index} className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label={
                                        <div className="d-flex align-items-center">
                                            <img src={item.imgSrc} alt={item.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                            <div>
                                                {item.name} <br />
                                                <small>Available: {item.available}</small>
                                            </div>
                                        </div>
                                    }
                                    onChange={() => handleSelectItem(item)}
                                />
                            </Col>
                        ))}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setShowModal(false)}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AddPurchaseOrder;