import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckSquare, FaPencilAlt } from 'react-icons/fa';
import { Container, Row, Col, Form, Button, Dropdown, DropdownButton, Table, Card, ToastContainer } from 'react-bootstrap';

export const PurchaseOrder = () => {
  const [warehouse, setWarehouse] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Create Time');
  const [dateRange, setDateRange] = useState('All');
  const [searchType, setSearchType] = useState('Purchase No');
  const [searchValue, setSearchValue] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [openOrderId, setOpenOrderId] = useState(null);

  const handleSearch = () => {
    // Add search logic here
    console.log('Searching for', searchValue);
  };

  const books = [
    {
      title: "The Last Sister (Columbia River Book 1)",
      authors: "Conn Iggulden",
      formats: "HARDCOVER, KINDLE, PAPERBACK",
      price: "$29.59 – $59.95",
      imgSrc: "/TheLastSister.jpg"
    },
    {
      title: "Under a Firefly Moon (Firefly Lake Book 1)",
      authors: "Donna Kauffman",
      formats: "KINDLE",
      price: "$7.67",
      imgSrc: "/UnderAFireFly.jpg"
    },
    {
      title: "Some Other Book",
      authors: "Another Author",
      formats: "PAPERBACK",
      price: "$12.34",
      imgSrc: "/SomeOtherBook.jpg"
    },
    // Add more books as needed
  ];

  const purchaseOrders = [
    {
      id: 'PO3WF4022225',
      supplier: 'Kim Biên',
      paymentAmount: 'VND 80,000.00',
      trackingNo: '--',
      createTime: '24 Jun 2024 01:31',
      updateTime: '24 Jun 2024 01:31',
      books: books
    },
    {
      id: 'PO3WF4022226',
      supplier: 'Supplier 2',
      paymentAmount: 'VND 120,000.00',
      trackingNo: '--',
      createTime: '25 Jun 2024 02:31',
      updateTime: '25 Jun 2024 02:31',
      books: books
    }
  ];

  const toggleDetails = (orderId) => {
    setDetailsOpen(!detailsOpen);
    setOpenOrderId(orderId);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h4>Ordinary Purchase Order</h4>
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
            {purchaseOrders.map((order) => (
              <>
                <tr key={order.id}>
                  <td><Form.Check type="checkbox" /></td>
                  <td>{order.id}</td>
                  <td>{order.supplier}</td>
                  <td>{order.paymentAmount}</td>
                  <td>{order.trackingNo}</td>
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
                          {order.books.map((product, idx) => (
                            <Col lg={2} md={3} sm={4} xs={6} key={idx} className="mb-4">
                              <Card className="detail-card">
                                <Card.Img variant="top" src={product.imgSrc} />
                                <Card.Body>
                                  <Card.Title>Name: Books{idx + 1}</Card.Title>
                                  <Card.Text>
                                    {product.title} <br />
                                    Author: {product.authors} <br />
                                    Format: {product.formats} <br />
                                    Price: {product.price} <br />
                                    Purchase Qty: 1
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
          <span>1 - 1 of 1</span>
        </Col>
        <Col className="text-end">
          <Button variant="primary">Next</Button>
        </Col>
      </Row>
      <ToastContainer />
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