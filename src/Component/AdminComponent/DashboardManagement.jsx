import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const DashboardManagement = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [startMonthIndex, setStartMonthIndex] = useState(0);

  const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthsToShow = allMonths.slice(startMonthIndex, startMonthIndex + 6);

  const [spendingData, setSpendingData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const exampleSpendingData = [
      { month: 'January', amount: 2000 },
      { month: 'February', amount: 1500 },
      { month: 'March', amount: 1800 },
      { month: 'April', amount: 2200 },
      { month: 'May', amount: 2100 },
      { month: 'June', amount: 1900 },
      { month: 'July', amount: 2300 },
      { month: 'August', amount: 2400 },
      { month: 'September', amount: 2500 },
      { month: 'October', amount: 2600 },
      { month: 'November', amount: 2700 },
      { month: 'December', amount: 2800 },
    ];

    const exampleSalesData = [
      { month: 'January', amount: 3000 },
      { month: 'February', amount: 2500 },
      { month: 'March', amount: 2700 },
      { month: 'April', amount: 3200 },
      { month: 'May', amount: 3100 },
      { month: 'June', amount: 3000 },
      { month: 'July', amount: 3400 },
      { month: 'August', amount: 3500 },
      { month: 'September', amount: 3600 },
      { month: 'October', amount: 3700 },
      { month: 'November', amount: 3800 },
      { month: 'December', amount: 3900 },
    ];

    setSpendingData(exampleSpendingData);
    setSalesData(exampleSalesData);
  }, [year]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handlePrevClick = () => {
    if (startMonthIndex > 0) {
      setStartMonthIndex(startMonthIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (startMonthIndex < allMonths.length - 6) {
      setStartMonthIndex(startMonthIndex + 1);
    }
  };

  const spendingVsSalesData = {
    labels: monthsToShow,
    datasets: [
      {
        label: 'Amount Spent on Ordering',
        data: spendingData.slice(startMonthIndex, startMonthIndex + 6).map(item => item.amount),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Amount of Product Sold',
        data: salesData.slice(startMonthIndex, startMonthIndex + 6).map(item => item.amount),
        fill: false,
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
      },
    ],
  };

  const totalSalesData = {
    labels: monthsToShow,
    datasets: [
      {
        label: 'Total Sales',
        data: salesData.slice(startMonthIndex, startMonthIndex + 6).map(item => item.amount),
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Spending vs Sales',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Sales',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <StyledContainer>
      <h1 className="text-center mb-4">Dashboard Management</h1>
      <Row className="mb-4">
        <Col md={4}>
          <Form>
            <Form.Group controlId="yearSelect">
              <Form.Label>Select Year</Form.Label>
              <Form.Control as="select" value={year} onChange={handleYearChange}>
                {[...Array(10).keys()].map(i => (
                  <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
        <Col md={8} className="d-flex justify-content-end align-items-center">
          <Button variant="outline-primary" onClick={handlePrevClick} disabled={startMonthIndex === 0}>&lt;</Button>
          <span className="mx-2">Months</span>
          <Button variant="outline-primary" onClick={handleNextClick} disabled={startMonthIndex >= allMonths.length - 6}>&gt;</Button>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3>Spending vs Sales</h3>
              <StyledChartContainer>
                <Line data={spendingVsSalesData} options={options} />
              </StyledChartContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3>Total Sales</h3>
              <StyledChartContainer>
                <Bar data={totalSalesData} options={barOptions} />
              </StyledChartContainer>
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

const StyledChartContainer = styled.div`
  width: 100%;
  height: 400px;
  margin: 0 auto;
`;

export default DashboardManagement;
