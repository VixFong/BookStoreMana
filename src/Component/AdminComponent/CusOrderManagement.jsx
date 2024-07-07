import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import OrderDetail from './OrderDetail';

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

  useEffect(() => {
    // Simulate fetching orders
    setOrders(exampleOrders);
  }, []);

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <StyledContainer className="mt-5">
      <h4>Quản Lý Đơn Hàng</h4>
      <StyledTable striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Customer</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.orderDate}</td>
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