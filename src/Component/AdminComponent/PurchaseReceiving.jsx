import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PurchaseReceiving = ({ selectedOrders, onSave, onCancel }) => {
  const [receivingData, setReceivingData] = useState(
    selectedOrders.map(order => ({
      ...order,
      receivingItems: order.orderItems.map(item => ({
        ...item,
        receivingQty: item.purchaseQty,
      })),
    }))
  );

  const handleReceivingQtyChange = (orderId, itemId, value) => {
    setReceivingData(prevData =>
      prevData.map(order =>
        order.id === orderId
          ? {
              ...order,
              receivingItems: order.receivingItems.map(item =>
                item.id === itemId
                  ? { ...item, receivingQty: Number(value) }
                  : item
              ),
            }
          : order
      )
    );
  };

  const handleSave = () => {
    onSave(receivingData);
  };

  return (
    <Container className="mt-5">
      {receivingData.map(order => (
        <div key={order.id} className="order-container mb-4">
          <h5>Mã đơn đặt hàng: {order.orderCode}</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Order Qty</th>
                <th>Received Qty</th>
                <th>Amount received</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {order.receivingItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <strong>Name:</strong> {item.title} <br />
                    </div>
                  </td>
                  <td>{item.purchaseQty}</td>
                  <td>{item.receivedQty || 0}</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={item.receivingQty}
                      onChange={e =>
                        handleReceivingQtyChange(order.id, item.id, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Button variant="danger">
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
      <Row className="mt-3">
        <Col className="text-end">
          <Button variant="secondary" onClick={onCancel} className="me-2">
            Cancel
          </Button>
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PurchaseReceiving;

const styles = `
  .order-container {
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

// Inject the styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);