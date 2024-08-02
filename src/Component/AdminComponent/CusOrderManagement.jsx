import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import styled from 'styled-components';
import { Container, Row, Col, Modal, Spinner, Form, Button, Dropdown, DropdownButton, Table, Card, ToastContainer, Toast } from 'react-bootstrap';
import OrderDetail from './OrderDetail';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { FaBell } from 'react-icons/fa';
export const CusOrderManagement = () => {
  
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [status, setStatus] = useState("PROCESSING");
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState('All');

  // const [totalPages, setTotalPages] = useState(0);

  const dropdownRef = useRef(null);
  const token =  localStorage.getItem('authToken');


  useEffect(() => {
    if (showAll) {
        fetchAllNotifications();
    } else {
        fetchLatestNotifications();

       
    }
  }, [showAll]);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);

  useEffect(() => {
    filterNotifications(filter);
  }, [filter, notifications]);


  const fetchLatestNotifications = async () => {
    console.log('token',token);
    try {

        const response = await axios.get('/api/notifications/customers/latest', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        setNotifications(response.data.data);
        // console.log("noti ", response.data.data);
    } catch (error) {
        console.error(error);
    }
};

  const fetchAllNotifications = async () => {
      try {
          const response = await axios.get('/api/notifications/customers', {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          setNotifications(response.data.data);
          console.log(response.data.data);
      } catch (error) {
          console.error('Error fetching all notifications', error);
      }
  };

  const filterNotifications = (filter) => {
    const now = new Date();
    let filtered = notifications;

    if (filter === 'Today') {
        filtered = notifications.filter(notification => {
            const notificationDate = new Date(notification.timestamp);
            return notificationDate.toDateString() === now.toDateString();
        });
    } else if (filter === '3 Days Ago') {
        const threeDaysAgo = new Date(now);
        threeDaysAgo.setDate(now.getDate() - 3);
        filtered = notifications.filter(notification => {
            const notificationDate = new Date(notification.timestamp);
            return notificationDate >= threeDaysAgo;
        });
    } else if (filter === '7 Days Ago') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        filtered = notifications.filter(notification => {
            const notificationDate = new Date(notification.timestamp);
            return notificationDate >= sevenDaysAgo;
        });
    }

    setFilteredNotifications(filtered);
  };
  const formatMessage = (message) => {
    // console.log("message ", message);
    const parts = message.split(', ');
    const orderInfo = parts[0].split(': ')[1];
    const orderEvent = parts[0].split(': ')[0];
    const numItems = parts[1];
    const dateCreated = new Date(parts[2]).toLocaleString();
    return `${orderEvent}: ${orderInfo} with ${numItems} item(s) created on ${dateCreated}`;
  };

  const markAsRead = async (notificationId) => {
    console.log('id', notificationId)
    try {
        const response = await axios.put(`/api/notifications/customers/mark-as-read/${notificationId}`,{}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response.data.data)
        // Sau khi đánh dấu đã đọc thành công, cập nhật lại danh sách thông báo
        if (showAll) {
            fetchAllNotifications();
        } else {
            fetchLatestNotifications();
        }
    } catch (error) {
        console.error('Error marking notification as read', error);
    }
  };

  console.log('nottifi ', notifications);
  const notificationCount = notifications.filter(notification => notification.status === 'UNREAD').length > 99 ? '99+' : notifications.filter(notification => notification.status === 'UNREAD').length;


  useEffect(() => {
    // Simulate fetching orders
    fetchOrders(page,size, search)
    // setOrders(exampleOrders);
  }, [search, page,status]);

  const fetchOrders = async(page, size, search) => {
    try {
        console.log(search);
        // console.log('status ' , status);
        // setShowModal(true);
        const response = await axios.get('/api/orders/search_cus',{
            params: {
              keyword: search,
              status, 
              page, 
              size
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
        // setShowModal(false);


    } catch (error) {
        console.log(error);
        // setShowModal(false);
        setError(error.response?.data?.message);
        // setShowErrorModal(true);
        
    }
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
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

    <StyledContainer className="mt-5">

      <NotificationButton onClick={() => setShowDropdown(!showDropdown)}>
                <FaBell />
                {notificationCount > 0 && <NotificationCount>{notificationCount}</NotificationCount>}
              
            </NotificationButton>
            {showDropdown && (
                <NotificationDropdown ref={dropdownRef}>
                    <NotificationList>
                        {notifications.map((notification, index) => (
                            <NotificationItem key={index}>
                                <NotificationTitle>{notification.title}</NotificationTitle>
                                <NotificationMessage>{formatMessage(notification.message)}</NotificationMessage>
                                <NotificationTimestamp>{new Date(notification.timestamp).toLocaleString()}</NotificationTimestamp>
                            
                                {notification.status === 'UNREAD' && (
                                    <MarkAsReadButton onClick={() => markAsRead(notification.id)}>Mark as Read</MarkAsReadButton>
                                )}
                            </NotificationItem>
                        ))}
                    </NotificationList>
                    {!showAll && (
                        <ShowAllButton onClick={() => setShowModal(true)}>
                            Show All Notifications
                        </ShowAllButton>
                    )}
                </NotificationDropdown>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>All Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="notificationFilter">
                        <Form.Label>Filter Notifications</Form.Label>
                        <Form.Control as="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="All">All</option>
                            <option value="Today">Today</option>
                            <option value="3 Days Ago">3 Days Ago</option>
                            <option value="7 Days Ago">7 Days Ago</option>
                        </Form.Control>
                    </Form.Group>
                    <NotificationList>
                        {filteredNotifications.map((notification, index) => (
                            <NotificationItem key={index}>
                                <NotificationTitle>{notification.title}</NotificationTitle>
                                <NotificationMessage>{formatMessage(notification.message)}</NotificationMessage>
                                <NotificationTimestamp>{new Date(notification.timestamp).toLocaleString()}</NotificationTimestamp>
                                {notification.status === 'UNREAD' && (
                                    <MarkAsReadButton onClick={() => markAsRead(notification.id)}>Mark as Read</MarkAsReadButton>
                                )}
                            </NotificationItem>
                        ))}
                    </NotificationList>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
      <h4>Order Customer</h4>

      <Row className="align-items-center">
      <Col md={3} className='search'>
          <Form.Group controlId="searchType" >
            <Form.Label></Form.Label>
            {/* <Form.Control as="select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option>Purchase No</option>
              <option>Supplier</option>
            </Form.Control> */}
          </Form.Group>
          <Form.Control
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                  fetchOrders(page,size,search);
              }
          }}
            
          />
        </Col>

        <Col md={3}>
          <Form.Group controlId="status">
            <Form.Label>Select Status</Form.Label>
            <DropdownButton id="dropdown-basic-button" variant="secondary"  title={status}>
              <Dropdown.Item onClick={() => setStatus('PROCESSING')}>Processing</Dropdown.Item>
              <Dropdown.Item onClick={() => setStatus('CONFIRM')}>Confirm</Dropdown.Item>
              <Dropdown.Item onClick={() => setStatus('DELIVERING')}>Delivering</Dropdown.Item>
              <Dropdown.Item onClick={() => setStatus('COMPLETE')}>Complete</Dropdown.Item>
            </DropdownButton>
          </Form.Group>
        </Col>
        </Row>
      <StyledTable striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Order Code</th>
            <th>Customer</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.orderCode}</td>
              <td>{order.email}</td>
              <td>
                <div>Create Time: {formatDate(order.dateCreated)}</div>
                <div>Update Time: {formatDate(order.dateUpdated)}</div>
              </td>
              <td>
                <StyledButton 
                  variant={order.status === 'Confirmed' ? 'primary' : 'success'}
                  disabled
                >
                  {order.status}
                </StyledButton>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleViewClick(order)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
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
      </StyledTable>
      {selectedOrder && (
        <Modal show={showModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Order Detail</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <OrderDetail order={selectedOrder} />
          </Modal.Body>
        </Modal>
      )}

    
    </StyledContainer>

    
  );
};

const StyledContainer = styled(Container)`
  margin-top: 20px;
`;

const StyledTable = styled(Table)`
  th, td {
    vertical-align: middle;
    text-align: center;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const bounce = keyframes`

    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
`;

const NotificationContainer = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
`;

const NotificationButton = styled.button`
   
    background-color: #808080;
    border: none;
    font-size: 24px;
    cursor: pointer;
    position: relative;
    animation: ${bounce} 2s infinite;
   
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
`;

const NotificationCount = styled.span`
    position: absolute;
    top: -1px;
    right: -1px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 5px 10px;
    font-size: 12px;
    font-weight: bold;
`;

const NotificationDropdown = styled.div`
    position: absolute;
    right: 0;
    top: 40px;
    width: 300px;
    border: 1px solid #ccc;
    background-color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    z-index: 1;
    max-height: 400px;
    overflow-y: auto;
`;

const NotificationList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

const NotificationItem = styled.li`
    border-bottom: 1px solid #ccc;
    padding: 10px;
`;

const NotificationTitle = styled.div`
    font-weight: bold;
`;

const NotificationMessage = styled.div`
    margin: 5px 0;
`;

const NotificationTimestamp = styled.div`
    color: #999;
    font-size: 0.9em;
`;

const MarkAsReadButton = styled.button`
    background: red;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    margin-top: 10px;
`;
const ShowAllButton = styled.button`
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0;
    cursor: pointer;
    text-align: center;

    &:hover {
        background-color: #0056b3;
    }
`;

export default CusOrderManagement;