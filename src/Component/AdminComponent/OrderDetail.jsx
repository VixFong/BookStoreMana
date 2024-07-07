import React from 'react';
import { Table, Button } from 'react-bootstrap';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  return (
    <>
      <StyledContainer id="order-detail">
        <CustomerInfo>
          <p><strong>Customer information</strong></p>
          <p>{order.customerName}</p>
          <p>128 Phùng Hưng, Phường Phúc La, Quận Hà Đông, Thành phố Hà Nội</p>
          <p>minhtcps30359@fpt.edu.vn</p>
          <p>0943263274</p>
        </CustomerInfo>

        <OrderInfo>
          <p><strong>Payment method</strong></p>
          <p>COD</p>
          <p><strong>Shipping method</strong></p>
          <p>Giao Hàng Tiết Kiệm</p>
          <p><strong>Order Date</strong></p>
          <p>{order.orderDate}</p>
        </OrderInfo>

        <StatusDropdown id="status-dropdown">
          <label><strong>Change Order Status </strong></label>
          <select defaultValue={order.status}>
            <option value="Confirmed">Confirmed</option>
            <option value="Delivered">Delivered</option>
          </select>
        </StatusDropdown>

        <h5>Thông Tin Sản Phẩm</h5>
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
            {exampleOrderItems.map((item, index) => (
              <tr key={index}>
                <td><img src={item.image} alt={item.name} /></td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>

        <TotalPrice>
          <p><strong>Total Price: 1,792,000đ</strong></p>
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
