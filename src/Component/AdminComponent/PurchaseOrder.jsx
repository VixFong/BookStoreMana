import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckSquare, FaPencilAlt } from 'react-icons/fa';
import { Container, Row, Col, Form, Button, Dropdown, DropdownButton, Table, Card, ToastContainer, Toast } from 'react-bootstrap';
import AddPurchaseOrder from './AddPurchaseOrder';
import { useNavigate } from 'react-router-dom';

export const PurchaseOrder = () => {
  const [warehouse, setWarehouse] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Create Time');
  const [dateRange, setDateRange] = useState('All');
  const [searchType, setSearchType] = useState('Purchase No');
  const [searchValue, setSearchValue] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    console.log('Searching for', searchValue);
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
            <Form.Control as="select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option>Purchase No</option>
              <option>Supplier</option>
            </Form.Control>
          </Form.Group>
          <Form.Control
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Col>
        <Col className="d-flex align-items-end">
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
              <>
                <tr key={order.id}>
                  <td><Form.Check type="checkbox" /></td>
                  <td>{order.id}</td>
                  <td>{order.supplier}</td>
                  <td>USD {order.items.reduce((total, item) => total + (item.unitPrice * item.purchaseQty || 0), 0)}</td>
                  <td>{order.trackingNo || '--'}</td>
                  <td>
                    <div>Create Time: {order.createTime}</div>
                    <div>Update Time: {order.updateTime}</div>
                  </td>
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
                          {order.items.map((product, idx) => (
                            <Col lg={2} md={3} sm={4} xs={6} key={idx} className="mb-4">
                              <Card className="detail-card">
                                <Card.Img variant="top" src={product.imgSrc} />
                                <Card.Body>
                                  <Card.Title>Name: {product.name}</Card.Title>
                                  <Card.Text>
                                    {product.title} <br />
                                    Author: {product.authors} <br />
                                    Format: {product.formats} <br />
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
        <Col>
          <Button variant="primary">Previous</Button>
        </Col>
        <Col className="text-center">
          <span>1 - {orders.length} of {orders.length}</span>
        </Col>
        <Col className="text-end">
          <Button variant="primary">Next</Button>
        </Col>
      </Row>
      {detailsOpen && <AddPurchaseOrder onSave={handleSaveOrder} />}
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
`;

// Inject the styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);