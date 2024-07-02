import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Row, Col, Modal, Spinner, Form, Button, Dropdown, DropdownButton, Table, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const CompletePurchaseOrder = () => {
  const [timeFilter, setTimeFilter] = useState('Receiving Time');
  const [dateRange, setDateRange] = useState('All');
  const [searchType, setSearchType] = useState('Purchase No');
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [allSelected, setAllSelected] = useState(false);
  const [status, setStatus] = useState('PENDING');
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders(page, size, searchValue);
  }, [page, dateRange]);

  const fetchOrders = async (page, size, search) => {
    try {
      setShowModal(true);
      const response = await axios.get('/api/orders/search', {
        params: {
          keyword: search,
          status,
          page,
          size,
          timeFilter,
          dateRange
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
      setTotalElements(response.data.data.totalElements);
      setShowModal(false);
    } catch (error) {
      setShowModal(false);
      setError(error.response?.data?.message);
      setShowErrorModal(true);
    }
  };

  const handleSearch = () => {
    fetchOrders(page, size, searchValue);
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrderIds(prevSelectedOrderIds =>
      prevSelectedOrderIds.includes(orderId)
        ? prevSelectedOrderIds.filter(id => id !== orderId)
        : [...prevSelectedOrderIds, orderId]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map(order => order.id));
    }
    setAllSelected(!allSelected);
  };


  const formatDate = (dateString) => {
    if (dateString != null) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year}  ${hour}:${minute}`;
    }
    return;
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h4>Complete Orders</h4>
        </Col>
      </Row>
      <div className="header-container">
        <Row className="align-items-center">
          <Col md={3}>
            <Form.Group controlId="timeFilter">
              <Form.Label>Select Time</Form.Label>
              <DropdownButton id="dropdown-basic-button" title={timeFilter}>
                <Dropdown.Item onClick={() => setTimeFilter('Receiving Time')}>Receiving Time</Dropdown.Item>
                <Dropdown.Item onClick={() => setTimeFilter('Create Time')}>Create Time</Dropdown.Item>
              </DropdownButton>
            </Form.Group>
          </Col>
          <Col md={3}>
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
          <Col md={3}>
            <Form.Group controlId="searchType">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Button variant="primary" onClick={handleSearch} className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </Button>
          </Col>
        </Row>
      </div>
      <Col className='mt-3'>
        <span>Showing all {totalElements} results</span>
      </Col>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <Form.Check
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
              />
              <th>Code</th>
              <th>Supplier</th>
              <th>Payment Amount</th>
              <th>Receive Qty</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
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
                <td>{order.orderItems.reduce((total, item) => total + ((item.price * order.taxFee / 100).toFixed(2) * item.purchaseQty + order.shipFee + (order.otherFee ? order.otherFee : 0) || 0), 0)}$</td>
                <td>{order.receivedQuantity} 6/6</td>
                <td>
                  <div>Create Time: {formatDate(order.dateCreated)}</div>
                  <div>Receiving Time: {formatDate(order.dateUpdated)}</div>
                </td>
                <td>
                  <Button variant="danger" href='/detailcompleteorder'>Detail</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <Row className="d-flex justify-content-between align-items-center">
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading, Please Wait...</p>
        </Modal.Body>
      </Modal>
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Body className="text-center">
          <div className="mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>
          <h4>Error</h4>
          <p>{error}</p>
          <Button variant="danger" onClick={() => setShowErrorModal(false)}>Close</Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CompletePurchaseOrder;

// CSS Styles
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
  .page-link {
    color: #000;
  }
  .active>.page-link,
  .page-link.active {
    z-index: 3;
    color: var(--bs-pagination-active-color);
    background-color: #dc3545;
    border-color: #dc3545;
  }
  .header-container {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .form-group {
    margin-bottom: 0;
  }
  .dropdown-button {
    width: 100%;
  }
  .search-button {
    width: 25%;
    margin-top: 30px;
  }
`;

// Inject the styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);