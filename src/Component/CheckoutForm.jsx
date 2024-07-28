import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner, Container, Row, Col, Form, Button, Card, Table } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export const CheckoutForm = () => {
  // const [billingDetails, setBillingDetails] = useState({
  //   firstName: '',
  //   lastName: '',
  //   companyName: '',
  //   country: 'United States (US)',
  //   address: '',
  //   address2: '',
  //   city: '',
  //   phone: '',
  //   email: '',
  // });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [user, setUser] = useState('');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);


  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const [shipping, setShipping] = useState(15.00);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [error, setError] = useState('');

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve checkoutData from localStorage
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));

    // Update state with checkoutData
    if (checkoutData) {
      setCartItems(checkoutData.items || []);
      setCartTotal(checkoutData.subtotal || 0);
      calculateTotal(cartTotal);
      console.log('items ',cartItems);

    }
  }, [cartTotal]);

  useEffect(() => {
    const fetchAdmins = async () => {
        try {
            const response = await axios.get('/api/identity/users/info', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data.code === 200){
                // console.log(response.data)
                setUser(response.data.data);

                const userData = response.data.data;
                console.log('User data:', userData); 

                let extractAddress; 
                if(userData.address){
                    extractAddress = userData.address.split(",");
                    if (extractAddress.length >= 4) {
                        setCity(extractAddress[3]);
                    }
                    if (extractAddress.length >= 3) {
                        setDistrict(extractAddress[2]);
                    }
                    if (extractAddress.length >= 2) {
                        setWard(extractAddress[1]);
                    }
                    if (extractAddress.length >= 1) {
                        setAddress(extractAddress[0]);
                    }

                    console.log(extractAddress[3])
                    console.log(extractAddress[2])
                    console.log(extractAddress[1])
                }
                if(userData.phone){
                    setPhone(userData.phone)
                }
                
                setFullName(userData.fullName);
                setEmail(userData.email);


            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    fetchAdmins();
}, []);

  console.log('user ', user);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails({ ...billingDetails, [name]: value });
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.id);
  };

  const calculateTotal = (cartTotal) => {
    const totalPrice = (cartTotal + shipping).toFixed(2);
    console.log('total price ', totalPrice);
    setTotalPrice(totalPrice);
    return totalPrice;
  };

  const checkValidation = async()=>{

      // console.log("city", city);
      // console.log("ward", ward);
      // console.log("district", district);
      // console.log("address", address);
      // console.log('cart item ', cartItems);
      if(city == '' || ward == '' || district == '' || address == ''){
        setError("Please complete all information");
        setShowErrorModal(true);
         
      }
      else{
        try {
          setShowLoadingModal(true);
          console.log('price ', totalPrice);
          const response = await axios.post('api/orders/customer', {
             
              address,
              numItems: cartItems.length,
              shipFee: shipping,
              totalPrice,
              note,
              orderItems: cartItems
          }, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });
          console.log('item ',cartItems);
          await Promise.all(cartItems.map(async (item) => {
              await handleRemoveItem(item.id);
          }));
          setShowLoadingModal(false);
          setShowSuccessModal(true);
          
          setTimeout(() => {
              setShowSuccessModal(false);
          }, 1000);

          // navigate('/orderreceived');
      } catch (error) {
          console.log(error);
          setShowLoadingModal(false);
          setError(error.response?.data?.message || 'An error occurred');
          setShowErrorModal(true);
      }
      }
      
  };
  const handleRemoveItem = async(id) =>{
    console.log('id', id);
    try {
        await axios.delete(`/api/cart/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`
            } 
        })
        // fetchCart();
    } catch (error) {
        console.log(error);
        setError(error.response?.data?.message);
        setShowErrorModal(true);
    }
}
  return (
    <StyledContainer>
      <Row>
        <Col md={8}>
          <h2>Billing details</h2>
          <Form>
            <Form.Group controlId="formFullName">
              <Form.Label>Full name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full name"
                name="FullName"
                // value={billingDetails.firstName}
                value= {fullName}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* <Form.Group controlId="formLastName">
              <Form.Label>Last name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last name"
                name="lastName"
                value={billingDetails.lastName}
                onChange={handleInputChange}
              />
            </Form.Group> */}
            {/* <Form.Group controlId="formCompanyName">
              <Form.Label>Company name (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Company name"
                name="companyName"
                value={billingDetails.companyName}
                onChange={handleInputChange}
              />
            </Form.Group> */}
            {/* <Form.Group controlId="formCountry">
              <Form.Label>Country / Region *</Form.Label>
              <Form.Control as="select" name="country" value={billingDetails.country} onChange={handleInputChange}>
                <option>United States (US)</option>
              </Form.Control>
            </Form.Group> */}
            <Form.Group controlId="formAddress">
              <Form.Label>Street address *</Form.Label>
              <Form.Control
                type="text"
                placeholder="House number and street name"
                name="address"
                // value={billingDetails.address}
                value={address}
                onChange={handleInputChange}
              />
              {/* <Form.Control
                type="text"
                placeholder="Apartment, suite, unit, etc. (optional)"
                name="address2"
                value={billingDetails.address2}
                onChange={handleInputChange}
              /> */}
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>Town / City *</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                name="city"
                // value={billingDetails.city}
                value={city}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formWard">
              <Form.Label>Ward *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ward"
                name="ward"
                // value={billingDetails.city}
                value={ward}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDistrict">
              <Form.Label>District *</Form.Label>
              <Form.Control
                type="text"
                placeholder="District"
                name="distric"
                // value={billingDetails.city}
                value={district}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Phone"
                name="phone"
                value={phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address *</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={email}
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
                {cartItems.map((item, index) => (
                  <tr>
                    <td>{item.title} × {item.purchaseQty}</td>
                    <td>${(item.price * item.purchaseQty).toFixed(2)}</td>
                  </tr>
                ))}
                  <tr>
                    <td><strong>Cart total </strong></td>
                    <td>${cartTotal.toFixed(2)}</td>
                  </tr>
              
                  <tr>
                    <td><strong>Shipping</strong> </td>
                    <td>Flat rate: ${shipping.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td><strong>Total </strong></td>
                    <td>${totalPrice}</td>
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
              <Button variant="primary" className="w-100 mt-3" onClick={checkValidation}><a className='text-light'>Place order</a></Button>
              {/* <Button variant="primary" className="w-100 mt-3" onClick={checkValidation}><a className='text-light'href='orderreceived'>Place order</a></Button> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
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

                <Modal show={showLoadingModal} onHide={() => setShowLoadingModal(false)} centered>
                <Modal.Body className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-3">Loading, Please Wait...</p>
                </Modal.Body>
            </Modal>
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Body className="text-center">
                    <div className="mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.97 4.03a.75.75 0 0 1 1.08 1.05L7.477 10.27a.75.75 0 0 1-1.08 0L4.97 8.82a.75.75 0 0 1 1.08-1.05l1.72 1.725z"/>
                        </svg>
                    </div>
                    <h4>Add Successfully</h4>
                    <Button variant="primary" onClick={() => setShowSuccessModal(false)}>OK</Button>
                </Modal.Body>
            </Modal>
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
