import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Col, Container, Row, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddInv from './AddInv';
import EditInv from './EditInv';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

export const InventoryManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [publishers, setPublishers] = useState([]);

    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const token =  localStorage.getItem('authToken');

    useEffect(()=>{
        fetchInventory();
        fetchPublishers();
    },[])


    const fetchInventory = async () => {
        try {
            const response = await axios.get('/api/inventory', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const inventoryData = response.data.data;
            console.log(inventoryData)

            // Fetch book details for each inventory item
            const updatedInventory = await Promise.all(
                inventoryData.map(async (item) => {
                    const bookResponse = await axios.get(`/api/products/books/${item.bookId}/bookData`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    return { ...item, ...bookResponse.data.data };
                })
            );

            setInventory(updatedInventory);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };


    const fetchPublishers = async () => {
        try {
            const response = await axios.get('/api/products/publishers/publisherData', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPublishers(response.data.data);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    console.log(inventory);
    console.log(publishers);

    const getPublisherName = (publisherIds) => {
        
        return publisherIds.map(publisherId => {
            const publisher = publishers.find(pub => pub.id === publisherId);
            return publisher ? publisher.name : 'Unknown Publisher';
        })
        .join(', ');
    };


    // const handleDeleteConfirm = async () => {
     
    // };

    const handleAddInventory = (newItem) => {
        setInventory([...inventory, newItem]);
    };

    const handleEditInventory = (updatedItem) => {
        // const updatedInventory = inventory.map(item =>
        //     item === currentItem ? updatedItem : item
        // );
        // setInventory(updatedInventory);
        // toast.success('Edit successfully');
        const updatedInventory = inventory.map(item =>
            item.id === updatedItem.id ? updatedItem : item
        );
        setInventory(updatedInventory);
        toast.success('Edit successfully');
    };

    const handleCardClick = (item) => {
        setCurrentItem(item);
        console.log('current item', item)
        setShowEditModal(true);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        if (item.receivedQuantity > 0) {
            toast.error(`The ${item.title} inventory is greater than 0`);
        } else {
            setShowDeleteModal(true);
        }
    };

    const handleConfirmDelete = async() => {
        try {
            await axios.delete(`/api/inventory/${itemToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setShowDeleteModal(false);
            fetchInventory();
            toast.success('Item deleted successfully');
        } catch (error) {
            setError(error.response?.data?.message);
        }
        
    };

    const formatDate = (dateString) => {
        if(dateString != null){
            
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
    
            const hour = String(date.getHours());
            const minute = String(date.getMinutes());
    
            return `${day}-${month}-${year}  ${hour}:${minute}` ;
        }
        return;
    };
    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h3>Inventory</h3>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        Create
                    </Button>
                </Col>
            </Row>
            <Row>
                {inventory.map((item, index) => (
                    <Col lg={3} md={4} sm={6} xs={12}className="mb-4" key={index}>
                        <Card className="inventory-item h-100">
                            <FaTimes 
                                className="delete-icon" 
                                onClick={() => handleDeleteClick(item)} 
                            />
                            {item.image && (
                                <Card.Img 
                                    variant="top" 
                                    src={URL.createObjectURL(item.image)}
                                    alt={`Product ${index}`} 
                                    className="inventory-img"
                                />
                            )}
                            <Card.Body onClick={() => handleCardClick(item)}>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>
                                    <strong>Price:</strong> {item.totalPrice}<br />
                                    <strong>Quantity:</strong> {item.receivedQuantity} / {item.orderedQuantity} <br />
                                    <strong>Publisher:</strong> {getPublisherName(item.publishers)}<br />
                                    <strong>Date Created:</strong> {formatDate(item.dateCreated)}<br />
                                    <strong>Date Updated:</strong> {formatDate(item.dateUpdated)}<br />

                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <AddInv 
                show={showAddModal} 
                onHide={() => setShowAddModal(false)} 
                onAdd={handleAddInventory} 
            />
            {currentItem && (
                <EditInv 
                    show={showEditModal} 
                    onHide={() => setShowEditModal(false)} 
                    onSave={handleEditInventory} 
                    item={currentItem} 
                />
            )}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Body className="text-center">
                    <p>Are you sure you want to delete this item?</p>
                    <Button variant="danger" onClick={handleConfirmDelete}>Yes</Button>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                </Modal.Body>
            </Modal>
            <ToastContainer />
                 <style>{`
                .inventory-item {
                    position: relative;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                    overflow: hidden;
                    transition: transform 0.2s ease-in-out;
                    cursor: pointer;

                }
                .inventory-item:hover {
                    transform: translateY(-5px);
                }
                .inventory-img {
                    max-width: 100%;
                    max-height: 400px;
                    object-fit: cover;
                }
                .card-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 10px 0;
                }
                .card-text {
                    font-size: 1rem;
                }
                .text-end {
                    text-align: right;
                }
                .delete-icon {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    color: red;
                    cursor: pointer;
                    z-index: 10;
                }
            `}</style>
        </Container>
    );
};

export default InventoryManagement;