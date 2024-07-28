import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { Container, Row, Col, Modal, Spinner, Form, Button, Dropdown, DropdownButton, Table, Card, ToastContainer, Toast } from 'react-bootstrap';
import OrderDetail from './OrderDetail';
import axios from 'axios';
export const CusOrderManagement = () => {
  // Example const array of orders
  const exampleOrders = [
    {
      id: '66169b628e65af14ebcf87c2',
      customerName: 'Trần Công Minh',
      orderDate: '21:00:02 10-04-2024',
      status: 'Confirmed'
    },
    {
      id: '6614f93cabeb1b46bc356f83',
      customerName: 'Đặng Thị Thanh Huyền',
      orderDate: '15:15:56 09-04-2024',
      status: 'Delivered'
    },
    {
      id: '6613f2723d21a0a7e38ee5ca',
      customerName: 'Phạm Ngọc Cường',
      orderDate: '20:34:42 08-04-2024',
      status: 'Delivered'
    },
    {
      id: '6613a97f295f8143636fd896',
      customerName: 'Trần Công Minh',
      orderDate: '15:23:27 08-04-2024',
      status: 'Delivered'
    },
    {
      id: '6613a1d60939e84333b82627',
      customerName: 'Đặng Thị Thanh Huyền',
      orderDate: '14:50:46 08-04-2024',
      status: 'Delivered'
    },
    {
      id: '66134170f82edd56ecfcb891',
      customerName: 'Mai Lê Quel',
      orderDate: '07:59:28 08-04-2024',
      status: 'Delivered'
    },
    {
      id: '66133bc0f82edd56ecfcb04b',
      customerName: 'Trần Công Minh',
      orderDate: '07:35:12 08-04-2024',
      status: 'Delivered'
    },
    {
      id: '660fbc5b67ca5d0207961e4f',
      customerName: 'Đặng Thị Thanh Huyền',
      orderDate: '15:54:51 05-03-2024',
      status: 'Delivered'
    },
    {
      id: '6610fa15e6b895944c7f6dd6',
      customerName: 'Trần Công Minh',
      orderDate: '14:30:29 06-02-2024',
      status: 'Delivered'
    }
  ];

  // State to hold orders
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const [totalPages, setTotalPages] = useState(0);

  const token =  localStorage.getItem('authToken');

  useEffect(() => {
    // Simulate fetching orders
    fetchOrders(page,size, search)
    // setOrders(exampleOrders);
  }, [search]);

  const fetchOrders = async(page, size, search) => {
    try {
        // console.log(search);
        // console.log('status ' , status);
        // setShowModal(true);
        const response = await axios.get('/api/orders/search_cus',{
            params: {
              keyword:search, 
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
      <h4>Quản Lý Đơn Hàng</h4>
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

export default CusOrderManagement;