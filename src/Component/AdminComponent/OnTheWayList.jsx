import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Table, Button, InputGroup, Dropdown, DropdownButton, Pagination, Modal } from 'react-bootstrap';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const OnTheWayList = () => {
    const [searchType, setSearchType] = useState('Purchase No');
    const [searchValue, setSearchValue] = useState('');
    const [timeFilter, setTimeFilter] = useState('Create Time');
    const [dateRange, setDateRange] = useState('All');
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [status, setStatus] = useState('DELIVERING');

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [openOrderId, setOpenOrderId] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);


    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [orders, setOrders] = useState([]);
    const token =  localStorage.getItem('authToken');
    

    useEffect(() => {
        fetchOrders(page, size, searchValue);
    
    }, [page,dateRange]);

    const fetchOrders = async(page, size, search) => {
        try {
            // console.log(search);
            // console.log('status ' , status);
            setShowModal(true);
            const response = await axios.get('/api/orders/search',{
                params: {
                  keyword:search, 
                  status: status, 
                  page, 
                  size,
                  timeFilter,
                  dateRange
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('search',response.data.data)
            setOrders(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
            setTotalElements(response.data.data.totalElements);
    
            // const bookIds = books.map(book => book.bookId);
            // fetchInventoryStatus(bookIds);
            setShowModal(false);
    
    
        } catch (error) {
            console.log(error);
            setShowModal(false);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
            
        }
      };

    const handleSearch = () => {
        console.log('Searching for:', searchValue); 
        fetchOrders(page, size, searchValue);
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

    const handleCheckboxChange = (orderId) => {
        // if (selectedItems.includes(id)) {
        //     setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        // } else {
        //     setSelectedItems([...selectedItems, id]);
        // }
        setSelectedOrderIds(prevSelectedOrderIds => 
            prevSelectedOrderIds.includes(orderId) 
              ? prevSelectedOrderIds.filter(id => id !== orderId) 
              : [...prevSelectedOrderIds, orderId]
        );
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

    const formatDate = (dateString) => {
        if(dateString != null){
            
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
    
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');
    
            return `${day}-${month}-${year}  ${hour}:${minute}` ;
        }
        return;
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
                                    // label="Select All" 
                                />
                            </th>
                            <th>Code</th>
                            <th>Supplier</th>
                            <th>Payment Amount</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <>
                                <tr key={order.id}>
                                <td>
                                    <Form.Check 
                                    type="checkbox" 
                                    checked={selectedOrderIds.includes(order.id)}
                                    onChange={() => handleCheckboxChange(order.id)}
                                    />
                                </td>
                                <td>{order.orderCode}</td>
                                <td>{order.publisher}</td>
                                <td>{order.orderItems.reduce((total, item) => total + ((item.price  * order.taxFee / 100).toFixed(2) * item.purchaseQty + order.shipFee  +(order.otherFee ? order.otherFee : 0) || 0), 0)}$</td>
                        
                                <td>
                                    <div>Create Time: {formatDate(order.dateCreated)}</div>
                                    <div>Update Time: {formatDate(order.dateUpdated)}</div>
                                </td>
                                <td className="text-danger fw-bolder" >{order.status}</td>
                                <td>
                                    <Button variant="secondary" onClick={() => toggleDetails(order.id)}><i class="fa-solid fa-circle-info"></i></Button>
                                    <Button 
                                    variant="warning" 
                                    // href='editpurchaseorder' 
                                    className="mx-1"
                                    >
                                        <Link to={`/editpurchaseorder/${order.id}`}><i className="fas fa-edit"></i></Link>
                                        
                                    </Button>
                                    <Button variant="warning" href='onthewayedit' className="mx-1">
                                            Edit
                                        </Button>
                                    <Button 
                                    variant="danger" 
                                    onClick={() => handleCancelClick(order.id)}
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </Button>
                                </td>
                                </tr>
                                {detailsOpen && openOrderId === order.id && (
                                <tr>
                                    <td colSpan="8">
                                    <Container>
                                        <Row>
                                        {order.orderItems.map((product, idx) => (
                                            <Col lg={2} md={3} sm={4} xs={6} key={idx} className="mb-4">
                                            <Card className="detail-card">
                                                <Card.Img variant="top" src={product.image} />
                                                <Card.Body>
                                                <Card.Title>{product.title}</Card.Title>
                                                <Card.Text>
                                                    {product.title} <br />
                                                    {/* Author: {product.authors} <br /> */}
                                                    {/* Format: {product.formats} <br /> */}
                                                    Price: {product.price} <br />
                                                    Purchase Qty: {product.purchaseQty}
                                                </Card.Text>
                                                </Card.Body>
                                            </Card>
                                            </Col>
                                        ))}
                                        </Row>
                                    </Container>
                                    </td>
                                </tr>
                                )}
                            </>
                            ))}
                        {/* {orders.map((order) => (
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
                        ))} */}
                    </tbody>
                </Table>
            </Row>
            <Row className="d-flex justify-content-between align-items-center">
                {/* <Col>
                    <Button variant="primary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                </Col>
                <Col className="text-center">
                    <Pagination>
                        <Pagination.Item active>{page}</Pagination.Item>
                    </Pagination>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </Col> */}
                 <nav>
                    <ul className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(index)}>{index + 1}</button>
                        </li>
                        ))}
                    </ul>
                </nav>
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