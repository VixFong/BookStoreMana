import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Table, Button, InputGroup, Dropdown, DropdownButton, Pagination, Modal } from 'react-bootstrap';

export const OnTheWayList = () => {
    const [searchType, setSearchType] = useState('Purchase No');
    const [searchValue, setSearchValue] = useState('');
    const [timeFilter, setTimeFilter] = useState('Create Time');
    const [dateRange, setDateRange] = useState('All');
    const [page, setPage] = useState(1);
    const totalPages = 1;
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [openOrderId, setOpenOrderId] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [orders, setOrders] = useState([
        {
            id: 'PO3WF4022385',
            supplier: 'Supplier Name',
            paymentAmount: 'VND 4,095,000.00',
            trackingNo: '--',
            createTime: '29 Jun 2024 13:55',
            submitTime: '29 Jun 2024 23:20',
            items: [
                { name: 'Green Alpine-13 Pro Max - 3 Lens', quantity: 5, imgSrc: 'https://via.placeholder.com/50' },
                { name: 'CƯỜNG LỰC VIỀN DẺO-Series 7 45mm', quantity: 5, imgSrc: 'https://via.placeholder.com/50' },
            ],
        },
        {
            id: 'PO3WF4022386',
            supplier: 'Another Supplier',
            paymentAmount: 'VND 3,000,000.00',
            trackingNo: '--',
            createTime: '28 Jun 2024 10:00',
            submitTime: '28 Jun 2024 18:00',
            items: [
                { name: 'iPhone 12 Case', quantity: 10, imgSrc: 'https://via.placeholder.com/50' },
                { name: 'Samsung Galaxy Screen Protector', quantity: 20, imgSrc: 'https://via.placeholder.com/50' },
            ],
        },
    ]);

    const handleSearch = () => {
        console.log('Searching for:', searchType, searchValue);
    };

    const toggleDetails = (orderId) => {
        setOpenOrderId(orderId);
        setDetailsOpen(!detailsOpen);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(orders.map(order => order.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };


    const handleCancel = (orderId) => {
        setOrderToCancel(orderId);
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        setOrders(orders.filter(order => order.id !== orderToCancel));
        setShowCancelModal(false);
        setOrderToCancel(null);
    };

    return (
        <Container className="mt-5">
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group controlId="timeFilter">
                        <Form.Label>Select Time</Form.Label>
                        <DropdownButton id="dropdown-basic-button" title={timeFilter}>
                            <Dropdown.Item onClick={() => setTimeFilter('Create Time')}>Create Time</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTimeFilter('Update Time')}>Update Time</Dropdown.Item>
                        </DropdownButton>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="dateRange">
                        <Form.Label>Date Range</Form.Label>
                        <DropdownButton id="dropdown-basic-button" title={dateRange}>
                            <Dropdown.Item onClick={() => setDateRange('All')}>All</Dropdown.Item>
                            <Dropdown.Item onClick={() => setDateRange('Today')}>Today</Dropdown.Item>
                            <Dropdown.Item onClick={() => setDateRange('Yesterday')}>Yesterday</Dropdown.Item>
                            <Dropdown.Item onClick={() => setDateRange('Last 7 days')}>Last 7 days</Dropdown.Item>
                            <Dropdown.Item onClick={() => setDateRange('Last 30 days')}>Last 30 days</Dropdown.Item>
                            <Dropdown.Item onClick={() => setDateRange('Custom Dates')}>Custom Dates</Dropdown.Item>
                        </DropdownButton>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="searchType">
                        <Form.Label>Search</Form.Label>
                        <InputGroup>
                            <Form.Control as="select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                                <option>Purchase No</option>
                                <option>Supplier</option>
                            </Form.Control>
                            <Form.Control
                                type="text"
                                placeholder="Search"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <Button variant="primary" onClick={handleSearch}>Search</Button>
                        </InputGroup>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col className="d-flex justify-content-end">
                    <Button variant="success" className="ms-2">Purchase Receiving</Button>
                </Col>
            </Row>
            <Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <Form.Check 
                                    type="checkbox" 
                                    checked={selectAll} 
                                    onChange={handleSelectAll} 
                                    label="Select All" 
                                />
                            </th>
                            <th>Purchase No</th>
                            <th>Supplier</th>
                            <th>Payment Amount</th>
                            <th>Tracking No.</th>
                            <th>Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <React.Fragment key={order.id}>
                                <tr>
                                    <td>
                                        <Form.Check 
                                            type="checkbox" 
                                            checked={selectedItems.includes(order.id)} 
                                            onChange={() => handleSelectItem(order.id)} 
                                        />
                                    </td>
                                    <td>{order.id}</td>
                                    <td>{order.supplier}</td>
                                    <td>{order.paymentAmount}</td>
                                    <td>{order.trackingNo}</td>
                                    <td>
                                        <div>Create Time: {order.createTime}</div>
                                        <div>Submit Time: {order.submitTime}</div>
                                    </td>
                                    <td>
                                        <Button variant="light" onClick={() => toggleDetails(order.id)}>
                                            {detailsOpen && openOrderId === order.id ? 'Hide Details' : 'Details'}
                                        </Button>
                                        <Button variant="warning" href='onthewayedit' className="mx-1">
                                            Edit
                                        </Button>
                                        <Button variant="danger" onClick={() => handleCancel(order.id)}>
                                            Cancel
                                        </Button>
                                    </td>
                                </tr>
                                {detailsOpen && openOrderId === order.id && (
                                    <tr>
                                        <td colSpan="7">
                                            <Row>
                                                {order.items.map((item, idx) => (
                                                    <Col md={3} key={idx} className="mb-3">
                                                        <div className="d-flex align-items-start p-2 border rounded" style={{ borderColor: '#ccc', minHeight: '100px' }}>
                                                            <img src={item.imgSrc} alt={item.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                                            <div style={{ fontSize: '0.8rem' }}>
                                                                {item.name} <br />
                                                                <strong>Purchase Qty:</strong> {item.quantity}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            </Row>
            <Row className="d-flex justify-content-between align-items-center">
                <Col>
                    <Button variant="primary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                </Col>
                <Col className="text-center">
                    <Pagination>
                        <Pagination.Item active>{page}</Pagination.Item>
                    </Pagination>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </Col>
            </Row>

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
        </Container>
    );
};

export default OnTheWayList;