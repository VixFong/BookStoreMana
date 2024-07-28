import React, {useState,useEffect} from 'react';
import { Container, Row, Col, Modal, Spinner, Form, Button, Dropdown, DropdownButton, Table, Card, ToastContainer, Toast } from 'react-bootstrap';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
export const OrderDetail = ({ order }) => {
  const exampleOrderItems = [
    {
      image: 'https://via.placeholder.com/50',
      name: 'Áo sơ mi có nơ cà vạt dài tay',
      price: '149,000đ',
      quantity: 2,
      total: '298,000đ'
    },
    {
      image: 'https://via.placeholder.com/50',
      name: 'Áo Polo xơ dừa có phối kẻ C9POL504M',
      price: '211,650đ',
      quantity: 6,
      total: '1,269,900đ'
    },
  ];
  console.log('order ', order);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const token =  localStorage.getItem('authToken');
  useEffect(() => {
    fetchCustomer();

  }, []);

  const fetchCustomer = async() => {
    try {
        // console.log(search);
        // console.log('status ' , status);
        // setShowModal(true);
        console.log('email ', order.email);
        console.log('token ', token);
        const email = order.email;
        const response = await axios.get(`/api/identity/users/customer/${email}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('user', response.data.data)
        const user = response.data.data;
        setFullName(user.fullName);
        setPhone(user.phone);
        

        // const bookIds = books.map(book => book.bookId);
        // fetchInventoryStatus(bookIds);
        // setShowModal(false);


    } catch (error) {
        console.log(error);
        // setShowModal(false);
        // setError(error.response?.data?.message);
        // setShowErrorModal(true);
        
    }
  };
  const exportPDF = () => {
    const input = document.getElementById('order-detail');
    const statusDropdown = document.getElementById('status-dropdown');
    const buttonContainer = document.getElementById('button-container');

    // Hide the elements that should not be included in the PDF
    statusDropdown.style.display = 'none';
    buttonContainer.style.display = 'none';

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.setFontSize(22);
      pdf.text('Order Invoice', imgWidth / 2, 15, null, null, 'center');
      
      pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);
      pdf.save(`${order.id}_order_detail.pdf`);

      statusDropdown.style.display = 'block';
      buttonContainer.style.display = 'block';
    });
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
    <>
      <StyledContainer id="order-detail">
        <CustomerInfo>
          <p><strong>Customer information</strong></p>
          <p>{fullName}</p>
          <p></p>
          <p>{order.email}</p>
          <p>{phone}</p>
        </CustomerInfo>

        <OrderInfo>
          <p><strong>Payment method</strong></p>
          <p>COD</p>
          <p><strong>Shipping method</strong></p>
          <p>Giao Hàng Tiết Kiệm</p>
          <p><strong>Order Date</strong></p>
          <p>{formatDate(order.dateCreated)}</p>
        </OrderInfo>

        <StatusDropdown id="status-dropdown">
          <label><strong>Change Order Status </strong></label>
          <select defaultValue={order.status}>
            <option value="Confirmed">Confirmed</option>
            <option value="Delivered">Delivered</option>
          </select>
        </StatusDropdown>

        <h5>Product Information</h5>
        <StyledTable striped bordered hover>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, index) => (
              <tr key={index}>
                <td><img src={item.image} alt={item.title} /></td>
                <td>{item.title}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.purchaseQty}</td>
                <td>${item.price.toFixed(2) * item.purchaseQty}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>

        <TotalPrice>
          <p><strong>Total Price: ${order.totalPrice}</strong></p>
        </TotalPrice>
      </StyledContainer>

      <ButtonContainer id="button-container">
        <Button variant="primary">Export Excel</Button>
        <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
      </ButtonContainer>
    </>
  );
};

const StyledContainer = styled.div`
  padding: 20px;
  position: relative;
`;

const CustomerInfo = styled.div`
  margin-bottom: 20px;
`;

const OrderInfo = styled.div`
  margin-bottom: 20px;
`;

const StyledTable = styled(Table)`
  img {
    width: 50px;
    height: 50px;
  }
`;

const TotalPrice = styled.div`
  margin-top: 20px;
  text-align: right;
`;

const StatusDropdown = styled.div`
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  text-align: right;
  button {
    margin-left: 10px;
  }
`;

export default OrderDetail;
