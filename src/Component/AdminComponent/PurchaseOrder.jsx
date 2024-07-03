import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import { FaCheckSquare, FaPencilAlt } from 'react-icons/fa';
import { Container, Row, Col, Modal, Spinner, Form, Button, Dropdown, DropdownButton, Table, Card, ToastContainer, Toast } from 'react-bootstrap';
import AddPurchaseOrder from './AddPurchaseOrder';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const PurchaseOrder = () => {
  const [timeFilter, setTimeFilter] = useState('Create Time');
  // const [statusFilter, setTimeFilter] = useState('Create Time');

  const [dateRange, setDateRange] = useState('All');
  const [searchValue, setSearchValue] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [allSelected, setAllSelected] = useState(false);
  
  const [status, setStatus] = useState('PENDING');
  const [file, setFile] = useState(null);


  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const navigate = useNavigate();
  const token =  localStorage.getItem('authToken');


  useEffect(() => {
    fetchOrders(page, size, search);

}, [page, dateRange, status]);

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
    console.log('Searching for', searchValue);

    fetchOrders(page, size, searchValue);
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrderIds(prevSelectedOrderIds => 
      prevSelectedOrderIds.includes(orderId) 
        ? prevSelectedOrderIds.filter(id => id !== orderId) 
        : [...prevSelectedOrderIds, orderId]
    );
  };

  const handleExportSelected = async() => {
    // Send selectedOrderIds to the backend
    console.log(selectedOrderIds.length);
    if(!selectedOrderIds.length){
      
      setError("Please select order");
      setShowErrorModal(true);
      return;
    }
    try {
      
      setShowModal(true);
      
      console.log('Export selected orders:', selectedOrderIds);
      const response = await axios.post('/api/orders/export',
        selectedOrderIds
      ,{
          headers: {
              Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json'
          },
          // responseType: 'arraybuffer'
              responseType: 'blob'
      });
      setShowModal(false);
      console.log(response.data)
      setSelectedOrderIds([]);
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'orders.xlsx'); // Filename for the downloaded file
      document.body.appendChild(link);
      link.click();

      // Clean up the temporary link element
      link.parentNode.removeChild(link);
    } catch (error) {
      setShowModal(false);
      console.log(error);
      setError(error.response?.data?.message);
      setShowErrorModal(true);
    }


    // Add your export logic here (e.g., make an API call to the backend)
  };



  // const handleSaveOrder = (newOrder) => {
  //   console.log('New order received:', newOrder);
  //   setOrders([...orders, newOrder]);
  //   setShowToast(true);
  //   setShowAddOrderModal(false); 
  //   setTimeout(() => {
  //     navigate('/draftorder');
  //   }, 2000);
  // };

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

const handleUpload = async () => {
  if (!file) {
      setError('Choose file excel');

      setShowErrorModal(true);
  //   return;
  }

  setShowModal(true); 
  const formData = new FormData();
  formData.append('file', file);
  console.log(file)
  try {
      const response = await axios.post('api/orders/import', formData, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
          },
      });
      // setShowModal(false); 
      // setShowSuccessModal(true);
      // setTimeout(() => {
      //     setShowSuccessModal(false);
      // }, 1000);
    setShowModal(false);
    fetchOrders(page, size, searchValue);


    console.log('Response:', response.data);
  } catch (error) {
      setShowModal(false);
      setError(error.response?.data?.message || 'An error occurred');
      setShowErrorModal(true);
  }
};
    const handleImportClick = () => {
      setShowImportModal(true);
    };

    const handleImportConfirm = () => {
      setShowImportModal(false);
      handleUpload();
    };

    const handleSelectAll = () => {
      if (allSelected) {
        setSelectedOrderIds([]);
      } else {
        setSelectedOrderIds(orders.map(order => order.id));
      }
      setAllSelected(!allSelected);
    };

    const handleCancelClick = (orderId) => {
      setOrderToDelete(orderId);
      setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
      if (orderToDelete) {
        setShowModal(true);
        try {
          await axios.delete(`/api/orders/${orderToDelete}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setShowModal(false);
          setShowCancelModal(false);
          setOrderToDelete(null);
          fetchOrders(page, size, searchValue);
        } catch (error) {
          setShowModal(false);
          setError(error.response?.data?.message || 'An error occurred');
          setShowErrorModal(true);
        }
      }
    };

    const handleSubmit = async() =>{
      selectedOrderIds

      console.log(selectedOrderIds.length);
      if(!selectedOrderIds.length){
        
        setError("Please select order");
        setShowErrorModal(true);
        return;
      }
      try {
        
        setShowModal(true);
        
        console.log('Export selected orders:', selectedOrderIds);
        const response = await axios.put('/api/orders/edit/status',
          selectedOrderIds
        ,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setShowModal(false);
        fetchOrders(page, size, searchValue);
        console.log(response.data)
        setSelectedOrderIds([]);
       
  
       
      } catch (error) {
        setShowModal(false);
        console.log(error);
        setError(error.response?.data?.message);
        setShowErrorModal(true);
      }
    };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h4>Purchase Order</h4>
        </Col>
      </Row>
      <div className="header-container">
      <Row className="align-items-center">
        <Col md={2}>
          <Form.Group  controlId="timeFilter" >
            <Form.Label>Select Time</Form.Label>
            <DropdownButton id="dropdown-basic-button" title={timeFilter}>
              <Dropdown.Item onClick={() => setTimeFilter('Create Time')} >Create Time</Dropdown.Item>
              <Dropdown.Item onClick={() => setTimeFilter('Update Time')} >Update Time</Dropdown.Item>
            </DropdownButton>
          </Form.Group>
        </Col>

        <Col md={2} className='date-range'>
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
          <Form.Group controlId="status">
            <Form.Label>Select Status</Form.Label>
            <DropdownButton id="dropdown-basic-button" title={status}>
              <Dropdown.Item onClick={() => setStatus('PENDING')}>Pending</Dropdown.Item>
              <Dropdown.Item onClick={() => setStatus('Delivering')}>Delivering</Dropdown.Item>
            </DropdownButton>
          </Form.Group>
        </Col>
        <Col md={3} className='search'>
          <Form.Group controlId="searchType" >
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                  fetchOrders(page,size,searchValue);
              }
          }}
            
          />
        </Col>
        {/* <Col md={3}>
          <Button variant="default" onClick={handleSearch} className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </Button>
        </Col> */}
      </Row>
      {status === 'PENDING' ? (
      <Row className="align-items-center mt-3">
        <Col md={6}>
          <Button variant="success" onClick={handleSubmit}>Submit</Button>
        </Col>
        <Col md={6} className="d-flex">
          <DropdownButton id="dropdown-basic-button" title="Import & Export" variant="secondary" className="me-2"> 
              <Dropdown.Item onClick={handleImportClick}>Import Purchase Orders</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleExportSelected}>Export Selected</Dropdown.Item>
              <Dropdown.Item onClick={handleExportSelected}>Export All</Dropdown.Item>
          </DropdownButton>
          <Button variant="success"  href='/addpurchase'>+ Add Order</Button>
        </Col>
      </Row>
      ) : null}

      {status === 'Delivering' ? (

        <Row className="align-items-center mt-3">
          {/* <Col className="d-flex justify-content-end"> */}
          <Col md={3} className="d-flex">

            <Button variant="success" >Purchase Receiving</Button>
          </Col>
        </Row>
        ) : null}
      </div>

      <Col className='mt-3'>
        <span>Showing all {totalElements} results</span>
      </Col>
      <Row>
        <Table striped bordered hover className={totalElements === 0 ? 'no-orders' : ''}>
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
                  {/* <td>{index + 1}</td> */}
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
                    {status === 'PENDING' ? (
                      <Button 
                        variant="warning" 
                        className="mx-1"
                      >
                        <Link to={`/editpurchaseorder/${order.id}`}><i className="fas fa-edit"></i></Link>
                          
                      </Button>
                    ) : null}

                    {status === 'Delivering' ? (
                      <Button 
                        variant="warning" 
                        // href='onthewayedit' 
                        className="mx-1">
                        <Link to={`/onthewayedit/${order.id}`}><i class="fa-solid fa-list-check"></i></Link>

                        
                      </Button>
                    ) : null}
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
      {detailsOpen}

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
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        <h4>Error</h4>
                        <p>{error}</p>
                        <Button variant="danger" onClick={() => setShowErrorModal(false)}>Close</Button>
                    </Modal.Body>
                </Modal>

              <Modal show={showImportModal} onHide={() => setShowImportModal(false)} centered> {/* Added Import Modal */}
        <Modal.Header closeButton>
          <Modal.Title>Import Purchase Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="fileUpload">
              <Form.Label>Upload File</Form.Label>
              <Form.Control 
                type="file" 
                accept=".xlsx, .xls, .csv"
                onChange={(e)=> setFile(e.target.files[0])}
              />
              <Form.Text className="text-muted">
                Download a <a href="#">Template</a> to see the format required. Up to 5,000 lines each file.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleImportConfirm}>Confirm</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the order?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmCancel}>Delete</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};



export default PurchaseOrder;

const styles = `
  .btn-primary{
  background-color: #6c757d;
  color: white !important;
}

// .custom-dropdown-item-create {
//   background-color: red !important;
//   color: black !important;
// }

// .custom-dropdown-item-update {
//   background-color: lightcoral !important;
//   color: white !important;
// }


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
    margin-bottom: 20px;
  }
  .form-group {
    margin-bottom: 0;
  }
  .dropdown-button {
    width: 100%;
  }
  .edit-link {
    color: inherit;
    text-decoration: none;
  }
  .no-orders {
    text-align: center;
    color: grey;
  }
  .date-range{
    margin-left: 50px;
  }
  .search {
    margin-top: 5px;
  }
`;

// Inject the styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);