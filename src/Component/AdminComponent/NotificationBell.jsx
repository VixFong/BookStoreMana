import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('All');
    const dropdownRef = useRef(null);
    const token = localStorage.getItem('authToken');

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
        try {
            const response = await axios.get('/api/notifications/latest', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNotifications(response.data.data);
        } catch (error) {
            console.error('Error fetching latest notifications', error);
        }
    };

    const fetchAllNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNotifications(response.data.data);
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
        const parts = message.split(', ');
        const orderInfo = parts[0].split(': ')[1];
        const orderEvent = parts[0].split(': ')[0];
        const numItems = parts[1];
        const dateCreated = new Date(parts[2]).toLocaleString();
        return `${orderEvent}: ${orderInfo} with ${numItems} item(s) created on ${dateCreated}`;
    };

    const notificationCount = notifications.length > 99 ? '99+' : notifications.length;

    return (
        <NotificationContainer>
            <NotificationButton onClick={() => setShowDropdown(!showDropdown)}>
                <FaBell />
                {notifications.length > 0 && <NotificationCount>{notificationCount}</NotificationCount>}
            </NotificationButton>
            {showDropdown && (
                <NotificationDropdown ref={dropdownRef}>
                    <NotificationList>
                        {notifications.map((notification, index) => (
                            <NotificationItem key={index}>
                                <NotificationTitle>{notification.title}</NotificationTitle>
                                <NotificationMessage>{formatMessage(notification.message)}</NotificationMessage>
                                <NotificationTimestamp>{new Date(notification.timestamp).toLocaleString()}</NotificationTimestamp>
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
        </NotificationContainer>
    );
};

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
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    position: relative;
    animation: ${bounce} 2s infinite;
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

export default NotificationBell;
