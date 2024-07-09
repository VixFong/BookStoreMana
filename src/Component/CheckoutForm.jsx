import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card, Table } from 'react-bootstrap';
import styled from 'styled-components';

export const CheckoutForm = () => {
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'United States (US)',
    address: '',
    address2: '',
    city: '',
    phone: '',
    email: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('');

  const [cartTotal, setCartTotal] = useState(15.99);
  const [usTax, setUsTax] = useState(3.10);
  const [shipping, setShipping] = useState(15.00);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.id);
  };

  const calculateTotal = () => {
    return (cartTotal + usTax + shipping).toFixed(2);
  };

  return (
    <StyledContainer>
      <Row>
        <Col md={8}>
          <h2>Billing details</h2>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="First name"
                name="firstName"
                value={billingDetails.firstName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last name"
                name="lastName"
                value={billingDetails.lastName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCompanyName">
              <Form.Label>Company name (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Company name"
                name="companyName"
                value={billingDetails.companyName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCountry">
              <Form.Label>Country / Region *</Form.Label>
              <Form.Control as="select" name="country" value={billingDetails.country} onChange={handleInputChange}>
                <option>United States (US)</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Street address *</Form.Label>
              <Form.Control
                type="text"
                placeholder="House number and street name"
                name="address"
                value={billingDetails.address}
                onChange={handleInputChange}
              />
              <Form.Control
                type="text"
                placeholder="Apartment, suite, unit, etc. (optional)"
                name="address2"
                value={billingDetails.address2}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>Town / City *</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                name="city"
                value={billingDetails.city}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Phone"
                name="phone"
                value={billingDetails.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address *</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={billingDetails.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDifferentAddress">
              <Form.Check
                type="checkbox"
                label="Ship to a different address?"
              />
            </Form.Group>
            <Form.Group controlId="formOrderNotes">
              <Form.Label>Order notes (optional)</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Notes about your order, e.g. special notes for delivery." />
            </Form.Group>
          </Form>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h3>Your Order</h3>
              <Table bordered>
                <tbody>
                  <tr>
                    <td>Blindside (Michael Bennett Book 12) × 1</td>
                    <td>${cartTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Cart Totals</td>
                    <td>${cartTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>US</td>
                    <td>${usTax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td>Flat rate: ${shipping.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td>${calculateTotal()}</td>
                  </tr>
                </tbody>
              </Table>
              <h3>Payment</h3>
              <PaymentSection>
                <Form.Group>
                  <Form.Check
                    type="radio"
                    label="Direct bank transfer"
                    name="paymentMethod"
                    id="directBankTransfer"
                    onChange={handlePaymentChange}
                  />
                  {paymentMethod === 'directBankTransfer' && (
                    <Form.Text className="text-muted">
                      Make your payment directly into our bank account. Please use your Order ID as the payment reference.
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="radio"
                    label="Check payments"
                    name="paymentMethod"
                    id="checkPayments"
                    onChange={handlePaymentChange}
                  />
                  {paymentMethod === 'checkPayments' && (
                    <Form.Text className="text-muted">
                      Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="radio"
                    label="Cash on delivery"
                    name="paymentMethod"
                    id="cashOnDelivery"
                    onChange={handlePaymentChange}
                  />
                  {paymentMethod === 'cashOnDelivery' && (
                    <Form.Text className="text-muted">
                      Pay with cash upon delivery.
                    </Form.Text>
                  )}
                </Form.Group>
              </PaymentSection>
              <Button variant="primary" className="w-100 mt-3">Place order</Button>
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
  max-width: 2000px;
`;

const PaymentSection = styled.div`
  min-height: 120px;
`;

export default CheckoutForm;
