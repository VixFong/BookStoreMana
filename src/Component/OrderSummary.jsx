import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import styled from 'styled-components';

export const OrderSummary = () => {
  const orderDetails = {
    orderNumber: '6871',
    date: 'July 9, 2024',
    email: 'viphong1909@gmail.com',
    total: '$34.09',
    paymentMethod: 'Direct bank transfer',
    items: [
      {
        name: 'Blindside (Michael Bennett Book 12)',
        quantity: 1,
        price: '$15.99',
      },
    ],
    subtotal: '$15.99',
    shipping: '$15.00 via Flat rate',
    us: '$3.10',
    billingAddress: {
      name: 'Phong Phan',
      address1: '123123',
      address2: '123123',
      city: 'Hồ Chí Minh, CA 90001',
      phone: '0839636281',
      email: 'viphong1909@gmail.com',
    },
    shippingAddress: {
      name: 'Phong Phan',
      address1: '123123',
      address2: '123123',
      city: 'Hồ Chí Minh, CA 90001',
      phone: '0839636281',
      email: 'viphong1909@gmail.com',
    },
  };

  return (
    <StyledContainer>
      <h1 className="text-center">Order received</h1>
      <Card className="mb-3">
        <Card.Body>
          <h5>Thank you. Your order has been received.</h5>
          <Row>
            <Col md={3}><strong>Order number:</strong> {orderDetails.orderNumber}</Col>
            <Col md={3}><strong>Date:</strong> {orderDetails.date}</Col>
            <Col md={3}><strong>Email:</strong> {orderDetails.email}</Col>
            <Col md={3}><strong>Total:</strong> {orderDetails.total}</Col>
            <Col md={3}><strong>Payment method:</strong> {orderDetails.paymentMethod}</Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5>Order details</h5>
          <Table bordered>
            <tbody>
              {orderDetails.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name} × {item.quantity}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Table bordered>
            <tbody>
              <tr>
                <td>Subtotal:</td>
                <td>{orderDetails.subtotal}</td>
              </tr>
              <tr>
                <td>Shipping:</td>
                <td>{orderDetails.shipping}</td>
              </tr>
              <tr>
                <td>US:</td>
                <td>{orderDetails.us}</td>
              </tr>
              <tr>
                <td>Payment method:</td>
                <td>{orderDetails.paymentMethod}</td>
              </tr>
              <tr>
                <td>Total:</td>
                <td>{orderDetails.total}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <h5>Billing address</h5>
              <p>{orderDetails.billingAddress.name}</p>
              <p>{orderDetails.billingAddress.address1}</p>
              <p>{orderDetails.billingAddress.address2}</p>
              <p>{orderDetails.billingAddress.city}</p>
              <p>{orderDetails.billingAddress.phone}</p>
              <p>{orderDetails.billingAddress.email}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <h5>Shipping address</h5>
              <p>{orderDetails.shippingAddress.name}</p>
              <p>{orderDetails.shippingAddress.address1}</p>
              <p>{orderDetails.shippingAddress.address2}</p>
              <p>{orderDetails.shippingAddress.city}</p>
              <p>{orderDetails.shippingAddress.phone}</p>
              <p>{orderDetails.shippingAddress.email}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </StyledContainer>
  );
};

const StyledContainer = styled(Container)`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default OrderSummary;