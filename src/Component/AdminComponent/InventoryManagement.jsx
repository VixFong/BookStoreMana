import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Col, Container, Row, Modal,Spinner } from 'react-bootstrap';
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
    const [search, setSearch] = useState('');

    const [page, setPage] = useState();
    const [size, setSize] = useState(12);
    const [totalPages, setTotalPages] = useState(0);


    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const token =  localStorage.getItem('authToken');

    useEffect(()=>{
        fetchInventory(page, size);
        fetchPublishers();
    },[page, size])


    const fetchInventory = async (page, size, keyword=null) => {
        try {
            let response ;
            if(keyword === null || keyword.trim() === ''){
                setShowModal(true);

                response = await axios.get('/api/inventory/inventories', {
                    params: {page, size},
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            else{
                setShowModal(true);

                // const bookIds = await axios.get('/api/products/books/bookIds',{
                //     params: {keyword: search},
                //     headers: {
                //         Authorization: `Bearer ${token}`
                //     }
                // });
                response = await axios.get(`/api/inventory/search`, {
                    params:{keyword, page, size},
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                
                
                console.log("aaaaa", response.data.data);
            } 
            const inventoryData = response.data.data.content;
            setTotalPages(response.data.data.totalPages);
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
            setShowModal(false); 
        } catch (error) {
            setShowModal(false);
            setError(error.response?.data?.message);
            showErrorModal(true)
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
            showErrorModal(true)
        
        }
    };

 

    // console.log(inventory);
    // console.log(publishers);

    const getPublisherName = (publisherIds) => {
        
        return publisherIds.map(publisherId => {
            const publisher = publishers.find(pub => pub.id === publisherId);
            return publisher ? publisher.name : 'Unknown Publisher';
        })
        .join(', ');
    };


    const handleAddInventory = async(newItem) => {
        // try {
        //     const response = await axios.post(`/api/products/books/${newItem.book}`,
        //         createUserRequest,
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //                 'Content-Type': 'multipart/form-data'
        //             }
        //         }
        //     );
          
        //     console.log(response.data);
        //     toast.success('Add User Successfully');
        // } catch (error) {
       
        //     setError(error.response?.data?.message || 'An error occurred');
        //     setShowErrorModal(true);
        // } 

        // setInventory([...inventory, newItem]);
    };

    const handleEditInventory = async(updatedItem) => {
        if(updatedItem.receivedQuantity > updatedItem.orderedQuantity){
            console.log('quantity', updatedItem.receivedQuantity)
            setError("Received quantity can not greater than ordered quantity");
            setShowErrorModal(true);
            
        }
        else{

            try {
                await axios.put(`/api/inventory/${updatedItem.id}`, updatedItem, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const updatedInventory = inventory.map(item =>
                    item.id === updatedItem.id ? updatedItem : item
                );
                setInventory(updatedInventory);
                fetchInventory(page,size);
    
                toast.success('Item updated successfully');
            } catch (error) {
                setError(error.response?.data?.message);
                setShowErrorModal(true);
    
            }
        }
        
    };

    const handleCardClick = (item) => {
        setCurrentItem(item);
        console.log('current item', item);
        setShowEditModal(true);
    };

    // const handleDeleteClick = (item) => {
    //     setItemToDelete(item);
    //     if (item.receivedQuantity > 0) {
    //         toast.error(`The ${item.title} inventory is greater than 0`);
    //     } else {
    //         setShowDeleteModal(true);
    //     }
    // };

    // const handleConfirmDelete = async() => {
    //     try {
    //         await axios.delete(`/api/inventory/${itemToDelete.id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
            
    //         setShowDeleteModal(false);
    //         fetchInventory(page);
    //         toast.success('Item deleted successfully');
    //     } catch (error) {
    //         setError(error.response?.data?.message);
    //         setShowErrorModal(true);

    //     }
        
    // };



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
                <div className="d-flex justify-content-end">
                        <input
                            type='text'
                            className='form-control w-50'
                            placeholder='Search book...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    fetchInventory(page, size, search);
                                }
                            }}
                        />
                        {/* <Button variant="primary" onClick={() => fetchInventory(page, size, search)}>
                            Search
                        </Button> */}
                    </div>
                </Col>
            </Row>
            <Row>
                {inventory.map((item, index) => (
                    <Col lg={3} md={4} sm={6} xs={12}className="mb-4" key={index}>
                        <Card className="inventory-item h-100">
                            {/* <FaTimes 
                                className="delete-icon" 
                                onClick={() => handleDeleteClick(item)} 
                            /> */}
                      
                        
                            <Card.Img 
                                variant="top" 
                                src={item.image } 
                                alt={`Product ${index}`} 
                                className="inventory-img"
                            />

                           
                            <Card.Body onClick={() => handleCardClick(item)}>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>
                                    <strong>Total Price:</strong> {item.totalPrice}$<br />
                                    <strong>Quantity:</strong> {item.receivedQuantity} /{item.orderedQuantity} <br />
                                    <strong>Publisher:</strong> {getPublisherName(item.publishers)}<br />
                                    <strong>Date Created:</strong> {formatDate(item.dateCreated)}<br />
                                    <strong>Date Updated:</strong> {formatDate(item.dateUpdated)}<br />
                                    <strong>Status:</strong><span className="text-danger fw-bolder"> {item.status}</span>
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

                <div className="d-flex justify-content-between align-items-center">
                    {/* <button className="btn btn-primary" onClick={handlePreviousPage} disabled={page === 0}>Previous</button> */}
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(index)}>{index + 1}</button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {/* <button className="btn btn-primary" onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button> */}
                </div>
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Body className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3">Loading, Please Wait...</p>
                    </Modal.Body>
                </Modal>
            {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Body className="text-center">
                    <p>Are you sure you want to delete this item?</p>
                    <Button variant="danger" onClick={handleConfirmDelete}>Yes</Button>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                </Modal.Body>
            </Modal> */}
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
            <ToastContainer />
                 <style>{`
                        .inventory-item {
                            // position: relative;
                            // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            // border-radius: 5px;
                            // overflow: hidden;
                            // transition: transform 0.2s ease-in-out;
                            // cursor: pointer;
                            // height: 350px;
                            // width: 100%;
                            // max-width: 350px;
                            // margin: auto;

                            position: relative;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            border-radius: 5px;
                            overflow: hidden;
                            transition: transform 0.2s ease-in-out;
                            cursor: pointer;
                            height: 200px;
                            width: 100%;
                            max-width: 350px;
                            margin: auto;
                        }
                        .inventory-item:hover {
                            // transform: translateY(-5px);
                            border: 1px solid black;
                        }
            

                        
                        .inventory-img {
                            width: 100%;
                            height: 300px;
                            object-fit: cover;
                            // text-align:center
                            
                        }  
                        .card-title {
                            font-size: 1rem;
                            font-weight: 600;
                            margin: 10px 0;
                        }
                        .card-text {
                            font-size: 0.9rem;
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
                        .status.in-stock {
                            color: #ffffff;
                        }

                        .page-link{
                            color: #000;
                        }

                        .active>.page-link, .page-link.active {
                            z-index: 3;
                            color: var(--bs-pagination-active-color);
                            background-color: #dc3545;
                            border-color: #dc3545;
                        }
            `}</style>
        </Container>
    );
};

export default InventoryManagement;