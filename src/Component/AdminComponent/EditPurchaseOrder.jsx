import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, InputGroup, Modal, Spinner, Table, Alert, ToastContainer, Toast, Pagination } from 'react-bootstrap';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export const EditPurchaseOrder = () => {
    const [inventory, setInventory] = useState([]);
    const [publisherOptions, setPublisherOptions] = useState([]);
    const [shipFee, setShipFee] = useState('');
    const [taxFee, setTaxFee] = useState('');
    const [otherFee, setOtherFee] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [selectedPublishers, setSelectedPublishers] = useState('');
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showBulkEditQtyModal, setShowBulkEditQtyModal] = useState(false);
    const [showBulkEditPriceModal, setShowBulkEditPriceModal] = useState(false);
    const [bulkEditQty, setBulkEditQty] = useState('');
    const [bulkEditPrice, setBulkEditPrice] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchPublishers();
        fetchOrderDetails(id);
    }, [id]);

    const fetchPublishers = async () => {
        try {
            const response = await axios.get('/api/products/publishers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const options = response.data.data.map(publisher => ({
                value: publisher.id,
                label: publisher.name
            }));
            setPublisherOptions(options);
        } catch (error) {
            setError('There was an error fetching the publishers!');
        }
    };

    const fetchOrderDetails = async (id) => {
        console.log('id', id);
        try {
            const response = await axios.get(`/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const order = response.data.data;
            setDate(order.estimatedArrivalDate);
            setSelectedPublishers(order.publisher);
            setShipFee(order.shipFee);
            setTaxFee(order.taxFee);
            setOtherFee(order.otherFee);
            setNote(order.note);
            setSelectedItems(order.orderItems);
        } catch (error) {
            setError('There was an error fetching the order details!');
        }
    };

    const searchInventory = async (keyword) => {
        try {
            setShowLoadingModal(true);
            const response = await axios.get(`/api/inventory/search-order`, {
                params: { keyword },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const inventoryData = response.data.data;
            const updatedInventory = await Promise.all(
                inventoryData.map(async (item) => {
                    const bookResponse = await axios.get(`/api/products/books/bookData_Order/${item.bookId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    return { ...item, ...bookResponse.data.data };
                })
            );
            setShowLoadingModal(false);
            setInventory(updatedInventory);
        } catch (error) {
            setShowLoadingModal(false);
            setError(error.response?.data?.message);
        }
    };

    const handleSearch = () => {
        searchInventory(search);
    };

    const handleSelectItem = (item) => {
        if (!selectedItems.find(selectedItem => selectedItem.bookId === item.bookId)) {
            setSelectedItems([...selectedItems, { ...item, purchaseQty: 0 }]);
        } else {
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem.bookId !== item.bookId));
        }
    };

    const handleSelectAll = () => {
        if (!allSelected) {
            setSelectedItems([...selectedItems, ...inventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(item => ({ ...item, purchaseQty: 0 }))]);
        } else {
            setSelectedItems(selectedItems.filter(selectedItem => !inventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).some(item => item.bookId === selectedItem.bookId)));
        }
        setAllSelected(!allSelected);
    };

    const handleRemoveItem = (item) => {
        setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
    };

    const handleQtyChange = (index, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].purchaseQty = value;
        setSelectedItems(updatedItems);
    };

    const handleUnitPriceChange = (index, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].price = value;
        setSelectedItems(updatedItems);
    };

    const handleSave = async () => {
        if (selectedPublishers === '') {
            setError("Please select publisher");
            setShowAlert(true);
            return;
        }
        if (selectedItems.length === 0) {
            setError("Please select item");
            setShowAlert(true);
            return;
        }
        try {
            setShowLoadingModal(true);
            const orderItems = selectedItems.map(item => ({
                image: item.image,
                price: item.price,
                purchaseQty: item.purchaseQty,
                title: item.title
            }));
            console.log("order item " , orderItems);
            const response = await axios.put(`/api/orders/${id}`, {
                estimatedArrivalDate: date,
                publisher: selectedPublishers,
                numItems: selectedItems.length,
                shipFee,
                taxFee,
                otherFee,
                note: note,
                orderItems: orderItems
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data.data);
            setShowLoadingModal(false);
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/daftorder');
            }, 1000);
            setSelectedItems([]);
        } catch (error) {
            console.log(error);
            setShowLoadingModal(false);
            setError(error.response?.data?.message || 'An error occurred');
            setShowErrorModal(true);
        }
    };
    console.log("order item: ", selectedItems);
    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        setShowCancelModal(false);
        navigate('/daftorder');
    };

    const handleBulkEditQty = () => {
        const updatedItems = selectedItems.map(item => ({
            ...item,
            purchaseQty: bulkEditQty
        }));
        setSelectedItems(updatedItems);
        setShowBulkEditQtyModal(false);
    };

    const handleBulkEditPrice = () => {
        const updatedItems = selectedItems.map(item => ({
            ...item,
            price: bulkEditPrice
        }));
        setSelectedItems(updatedItems);
        setShowBulkEditPriceModal(false);
    };

    const paginatedInventory = inventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <Container className="add-purchase-order-container mt-5">
            <h4>Edit Purchase Order</h4>
            {showAlert && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="supplier">
                            <Form.Label>Supplier *</Form.Label>
                            <Select
                                options={publisherOptions}
                                value={publisherOptions.find(option => option.label === selectedPublishers)}
                                onChange={(selectedOptions) => setSelectedPublishers(selectedOptions.label)}
                                isLoading={!publisherOptions.length}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="estimatedArrivalDate">
                            <Form.Label>Estimated Arrival Date</Form.Label>
                            <Form.Control 
                                type="date"
                                value={date} 
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <h5>Fee Details</h5>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="shipFee">
                            <Form.Label>Ship Fee</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    type="number" 
                                    value={shipFee}
                                    onChange={(e) => setShipFee(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="taxFee">
                            <Form.Label>Tax Fee (VAT)</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    type="number" 
                                    value={taxFee}
                                    onChange={(e) => setTaxFee(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group controlId="otherFee">
                            <Form.Label>Other Fee</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    type="number" 
                                    value={otherFee}
                                    onChange={(e) => setOtherFee(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <h5>Other Information</h5>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="note">
                            <Form.Label>Note</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                maxLength={500} 
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            {/* {note.length} */}
                            <Form.Text muted> {note != null ? note.length : 0}/ 500</Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <span>Item Qty: {selectedItems.length}</span>
                    </div>
                    <div className="d-flex">
                        <Button variant="danger" onClick={handleSave} className="me-2">Save</Button>
                        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                    </div>
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
                                <th>
                                    Purchase Qty *
                                    <span className="text-primary bulk-edit" onClick={() => setShowBulkEditQtyModal(true)}>Bulk Edit</span>
                                </th>
                                <th>
                                    Unit Price
                                    <span className="text-primary bulk-edit" onClick={() => setShowBulkEditPriceModal(true)}>Bulk Edit</span>
                                </th>
                                <th>Value</th>
                                <th>Stock-in Cost Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItems.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                            <div>
                                                {item.title} <br />
                                                <small>Available: {item.receivedQuantity}</small>
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
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={item.price}
                                            onChange={(e) => handleUnitPriceChange(index, parseFloat(e.target.value))}
                                            min="0"
                                        />
                                    </td>
                                    <td>{(item.price * item.purchaseQty).toFixed(2)}$</td>
                                    <td>{item.price}$</td>

                                    <td>
                                        <Button variant="danger" onClick={() => handleRemoveItem(item)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Form>
            <Modal show={showLoadingModal} onHide={() => setShowLoadingModal(false)} centered>
                <Modal.Body className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-3">Loading, Please Wait...</p>
                </Modal.Body>
            </Modal>
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Body className="text-center">
                    <div className="mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.97 4.03a.75.75 0 0 1 1.08 1.05L7.477 10.27a.75.75 0 0 1-1.08 0L4.97 8.82a.75.75 0 0 1 1.08-1.05l1.72 1.725z"/>
                        </svg>
                    </div>
                    <h4>Update Successfully</h4>
                    <Button variant="primary" onClick={() => setShowSuccessModal(false)}>OK</Button>
                </Modal.Body>
            </Modal>
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Body className="text-center">
                    <div className="mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </div>
                    <h4>Error</h4>
                    <p>{error}</p>
                    <Button variant="danger" onClick={() => setShowErrorModal(false)}>Close</Button>
                </Modal.Body>
            </Modal>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Select Items</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="search">
                            <InputGroup>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Search" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            searchInventory(search);
                                        }
                                    }}
                                />
                                <Button variant="outline-secondary" onClick={handleSearch}>Search</Button>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                    <Form.Check
                        type="checkbox"
                        label="Select All"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="mt-3 mb-3"
                    />
                    <Row className="mt-3">
                        {paginatedInventory.map((item, index) => (
                            <Col md={6} key={index} className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label={
                                        <div className="d-flex align-items-center">
                                            <img src={item.image} alt={item.title} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                                            <div>
                                                {item.title} <br />
                                                <small>Available: {item.receivedQuantity}</small><br />
                                                <small className="text-danger fw-bolder">{item.status} </small>
                                            </div>
                                        </div>
                                    }
                                    checked={selectedItems.some(selectedItem => selectedItem.bookId === item.bookId)}
                                    onChange={() => handleSelectItem(item)}
                                />
                            </Col>
                        ))}
                    </Row>
                    <Pagination className="justify-content-center mt-3">
                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(Math.ceil(inventory.length / itemsPerPage)).keys()].map(page => (
                            <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => setCurrentPage(page + 1)}>
                                {page + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(inventory.length / itemsPerPage)} />
                        <Pagination.Last onClick={() => setCurrentPage(Math.ceil(inventory.length / itemsPerPage))} disabled={currentPage === Math.ceil(inventory.length / itemsPerPage)} />
                    </Pagination>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={() => setShowModal(false)}>Confirm</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body>Purchase Order updated successfully!</Toast.Body>
                </Toast>
            </ToastContainer>
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Cancellation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to cancel the order?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>No</Button>
                    <Button variant="danger" onClick={confirmCancel}>Yes</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showBulkEditQtyModal} onHide={() => setShowBulkEditQtyModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Edit Purchase Qty</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="bulkEditQty">
                        <Form.Label>Purchase Qty</Form.Label>
                        <Form.Control 
                            type="number" 
                            value={bulkEditQty}
                            onChange={(e) => setBulkEditQty(parseInt(e.target.value))}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBulkEditQtyModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleBulkEditQty}>Save</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showBulkEditPriceModal} onHide={() => setShowBulkEditPriceModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Edit Unit Price</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="bulkEditPrice">
                        <Form.Label>Unit Price</Form.Label>
                        <Form.Control 
                            type="number" 
                            value={bulkEditPrice}
                            onChange={(e) => setBulkEditPrice(parseFloat(e.target.value))}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBulkEditPriceModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleBulkEditPrice}>Save</Button>
                </Modal.Footer>
            </Modal>
            <style jsx>{`
                .add-purchase-order-container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    max-width: 900px;
                    margin: 0 auto;
                    outline: 2px solid #007bff;
                }
                .item-img, .modal-item-img {
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                    object-fit: cover;
                    border-radius: 4px;
                }
                h4, h5 {
                    text-align: center;
                }
                .d-flex {
                    display: flex;
                }
                .justify-content-between {
                    justify-content: space-between;
                }
                .me-2 {
                    margin-right: 8px;
                }
                .mt-5{
                    margin-left:350px;
                }
                .text-center {
                    text-align: left;
                }
                .text-danger {
                    color: #dc3545;
                }
                .fw-bolder {
                    font-weight: bolder;
                }
                .p-3 {
                    padding: 1rem;
                }
                .bulk-edit {
                    margin-left: 5px;
                    cursor: pointer;
                }
            `}</style>
        </Container>
    );
};

export default EditPurchaseOrder;
