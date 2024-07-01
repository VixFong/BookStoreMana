import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { FaCheckSquare, FaPencilAlt } from 'react-icons/fa';
import { Container, Row, Col, Modal, Spinner, Form, Button, Dropdown, DropdownButton, Table, Card, ToastContainer, Toast } from 'react-bootstrap';
import AddPurchaseOrder from './AddPurchaseOrder';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const PurchaseOrder = () => {
  const [warehouse, setWarehouse] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Create Time');
  const [dateRange, setDateRange] = useState('All');
  const [searchType, setSearchType] = useState('Purchase No');
  const [searchValue, setSearchValue] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('PENDING');
  

  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const token =  localStorage.getItem('authToken');


  useEffect(() => {
    fetchOrders(page, size, search);

}, [page]);

  const fetchOrders = async(page, size, search) => {
    try {
        console.log(search);
        setShowModal(true);
        const response = await axios.get('/api/orders/search',{
            params: {keyword:search, status, page, size},
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('search',response.data.data)
        setOrders(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
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
    console.log('Searching for', searchValue);

    fetchOrders(page, size, searchValue);
  };

  const handleSaveOrder = (newOrder) => {
    console.log('New order received:', newOrder);
    setOrders([...orders, newOrder]);
    setShowToast(true);
    setShowAddOrderModal(false); 
    setTimeout(() => {
      navigate('/draftorder');
    }, 2000);
  };

  const toggleDetails = (orderId) => {
    setDetailsOpen(!detailsOpen);
    setOpenOrderId(orderId);
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
      <Row>
        <Col>
          <h4>Purchase Order</h4>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="timeFilter">
            <Form.Label>Select Time</Form.Label>
            <DropdownButton id="dropdown-basic-button" title={timeFilter}>
              <Dropdown.Item onClick={() => setTimeFilter('Create Time')}>Create Time</Dropdown.Item>
              <Dropdown.Item onClick={() => setTimeFilter('Update Time')}>Update Time</Dropdown.Item>
            </DropdownButton>
          </Form.Group>
        </Col>
        <Col>
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
        <Col>
          <Form.Group controlId="searchType">
            <Form.Label>Search</Form.Label>
            {/* <Form.Control as="select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option>Purchase No</option>
              <option>Supplier</option>
            </Form.Control> */}
          </Form.Group>
          <Form.Control
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Col>
        <Col className="d-flex align-items-end">
          {/* <Button variant="primary" onClick={handleSearch}> */}
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button variant="primary">Submit</Button>
          <Button variant="danger" className="ms-2">Delete</Button>
        </Col>
        <Col className="text-end">
          <Button variant="secondary" className="me-2">Import & Export</Button>
          <Button variant="success" href='/addpurchase'>+ Add Purchase Order</Button>
        </Col>
      </Row>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th><Form.Check type="checkbox" /></th>
              <th>Code</th>
              <th>Supplier</th>
              <th>Payment Amount</th>
              {/* <th>Tracking No.</th> */}
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <>
                <tr key={order.id}>
                  <td><Form.Check type="checkbox" /></td>
                  {/* <td>{index + 1}</td> */}
                  <td>{order.orderCode}</td>
                  <td>{order.publisher}</td>
                  <td>{order.orderItems.reduce((total, item) => total + ((item.price  * order.taxFee / 100).toFixed(2) * item.purchaseQty + order.shipFee  +(order.otherFee ? order.otherFee : 0) || 0), 0)}$</td>
                  {/* <td>{order.trackingNumber}</td> */}
                  <td>
                    <div>Create Time: {formatDate(order.dateCreated)}</div>
                    <div>Update Time: {formatDate(order.dateUpdated)}</div>
                  </td>
                  <td className="text-danger fw-bolder" >{order.status}</td>
                  <td>
                    <Button variant="light" onClick={() => toggleDetails(order.id)}>Details</Button>
                    <FaCheckSquare className="ms-2" />
                    <FaPencilAlt className="ms-2" />
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
          </tbody>
        </Table>
      </Row>
      

      <Row className="d-flex justify-content-between align-items-center">
        {/* <Col>
          <Button variant="primary">Previous</Button>
        </Col>
        <Col className="text-center">
          <span>1 - {orders.length} of {orders.length}</span>
        </Col>
        <Col className="text-end">
          <Button variant="primary">Next</Button>
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
        {/* <span>1 - {orders.length} of {orders.length}</span> */}
      </Row>
      {detailsOpen && <AddPurchaseOrder onSave={handleSaveOrder} />}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Body className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3">Loading, Please Wait...</p>
                    </Modal.Body>
                </Modal>
        
            {/* <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                    <Modal.Body className="text-center">
                        <div className="mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        <h4>Error</h4>
                        <p>{error}</p>
                        <Button variant="danger" onClick={() => setShowErrorModal(false)}>Close</Button>
                    </Modal.Body> */}
    </Container>
  );
};



export default PurchaseOrder;

const styles = `
      .purchase-order-table {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .detail-card {
        border: 1px solid #eaeaea;
        border-radius: 4px;
        overflow: hidden;
        text-align: center;
      }
      .detail-card img {
        height: 150px;
        width: 150px;
        object-fit: cover;
      }
      .detail-card .card-body {
        padding: 10px;
      }
      .detail-card .card-title {
        font-size: 0.9rem;
        font-weight: 600;
      }
      .detail-card .card-text {
        font-size: 0.8rem;
        line-height: 1.2;
      }
      .page-link{
        color: #000;
      }

      .active>.page-link, .page-link.active {
        z-index: 3;
        color: var(--bs-pagination-active-color);
        background-color: #dc3545;
        border-color: #dc3545;
      } 
`;

// Inject the styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);