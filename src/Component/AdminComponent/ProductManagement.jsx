import React, { useEffect, useState } from 'react';
import {Modal, Button, Table, Form, Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ProductManagement = () => {
    const [products, setProducts] = useState([]);

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(4);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [bookToDelete, setBookToDelete] = useState(null); 
    
    const [showLockModal, setShowLockModal] = useState(false); 
    const [bookToToggleLock, setBookToToggleLock] = useState(null); 

    
    const [showFlashSaleModal, setShowFlashSaleModal] = useState(false); 
    const [bookToToggleFlashSale, setBookToToggleFlashSale] = useState(null); 
    
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();
    useEffect(() => {
        if(!token){
            navigate('/');
        }
        fetchBooks(page, size, search);

    }, [page, size, search]);


    const fetchBooks = async(page,size,keyword) => {
        try {
            const response = await axios.get('/api/products/books/search',{
                params: {page, size, keyword},
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data.data)
            setProducts(response.data.data.content);
            setTotalPages(response.data.data.totalPages);



        } catch (error) {
            setError(error.response?.data?.message);
            
        }
    };
    const handleSearchInputChange = (event) => {
        const value = event.target.value;
        setSearch(value);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    const handleEdit = (id) => {
        // Handle edit logic
        // console.log(`Edit product with ID: ${id}`);
    };

    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`/api/products/books/${bookToDelete.bookId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowDeleteModal(false);
            fetchBooks(page, size, search);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const handleDeleteModalOpen = (book) => {
        setBookToDelete(book);
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false); 
        setBookToDelete(null);
    };


    const toggleFlashSale = async(id, flashSale) => {
       
        try {
            const response = await axios.put(`/api/products/books/${id}/flashSale`,  null,{
                params:{ flashSale},
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            console.log(response.data);
            fetchBooks(page, size, search);
        } catch (error) {
            setError(error.response?.data?.message);
            
        }
   
    };

    const handleFlashSaleConfirm = async () => {
        try {
            await toggleFlashSale(bookToToggleFlashSale.bookId, !bookToToggleFlashSale.flashSale);
            setShowFlashSaleModal(false);
        } catch (error) {
            setError(error.response?.data?.message);           
        }
    };

    const handleFlashSaleModalOpen = (book) => {
        setBookToToggleFlashSale(book);
        setShowFlashSaleModal(true);
    };

    const handleFlashSaleModalClose = () => {
        setShowFlashSaleModal(false);
        setBookToToggleFlashSale(null);
    };

    const toggleUserLock = async (id, isLock) => {
       
        try {
            const response = await axios.put(`/api/products/books/${id}/lock`, null, {
                params: { isLock },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            fetchBooks(page, size, search);
            
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    };

   

    const handleLockConfirm = async () => {
        try {
            await toggleUserLock(bookToToggleLock.bookId, !bookToToggleLock.lock);
            setShowLockModal(false);
        } catch (error) {
            // console.error('Error toggling user lock:', error);
            setError(error.response?.data?.message);

           
        }
    };

    const handleLockModalOpen = (book) => {
        setBookToToggleLock(book);
        setShowLockModal(true);
    };
    
    const handleLockModalClose = () => {
        setShowLockModal(false);
        setBookToToggleLock(null);
    };

  

    const handleAddProduct = () => {
        setShowAddProduct(false);
        setNewProductName('');
        setShowToast(true);
    };

    return (
        <div className="container-fluid mt-5 product-management">
            <style>
                {`
                    .product-management {
                        background: #f9f9f9;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                    }
                    .product-table th, .product-table td {
                        padding: 1rem;
                        vertical-align: middle;
                    }
                    .product-table th {
                        background-color:#B8B8B8;
                        color: black;

                        text-align: center;
                    }
                    .product-table td {
                        text-align: center;
                    }
                    .product-table td:first-child {
                        text-align: center;
                    }
                    .product-table .btn {
                        margin-right: 5px;
                    }
                    .product-management h4 {
                        text-align: left;
                        color: #000000;
                        margin-bottom: 20px;
                    }
                    .product-management .btn-danger {
                        background-color: #ff4d4f;
                        border-color: #ff4d4f;
                    }
                    
                    .form-check-input:checked {
                            background-color: #dc3545;
                            border-color: #dc3545;
                        }
                        
                    .form-check-input {
                            width: 2.25em;  
                            height: 1.25em; 
                            margin-left: -1em; 
                        }
                 
                        
        
                        
                     
                `}
            </style>
            <h4>Product Management</h4>
            <div className="d-flex justify-content-between mb-3">
                <Button variant="danger" onClick={() => setShowAddProduct(!showAddProduct)}>
                    <Link to='/addproduct' className='text-light'>
                    Add New Product +
                    </Link>
                </Button>

                <input
                        type='text'
                        className='form-control w-25'
                        placeholder='Search book...'
                        value={search}
                        onChange={handleSearchInputChange}
                    />
            </div>
            <div className="table-responsive">
                <Table  bordered hover className="product-table w-100">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            {/* <th>Category</th> */}
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Flash Sale</th>
                            <th>Lock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.bookId}>
                                <td><img src={product.images[0]} alt={product.name} className="img-fluid"  style={{ width: '100px', height: '100px' }}/></td>
                                <td>{product.title}</td>
                        
                                <td>
                                    {product.flashSale ? (
                                        <div>
                                            <span style={{ textDecoration: 'line-through' }}>{product.price}</span>
                                            <br />
                                            <span style={{ color: 'red' }}>{product.priceDiscount.toFixed(2)}</span>
                                        </div>
                                    ) : (
                                        product.price
                                    )}
                                </td>
                                {/* <td>{product.author}</td> */}
                                <td >{product.discount}%</td>
                                <td className='form-check-input'>
                                    <Form.Check
                                        // className='form-check-input'
                                        type="switch"
                                        id={`flash-sale-${product.id}`}
                                        checked={product.flashSale}
                                        onChange={() => handleFlashSaleModalOpen(product)}
                                    />
                                </td>
                                <td>
                                    <Form.Check
                                        type="switch"
                                        id={`lock-${product.id}`}
                                        checked={product.lock}
                                        onChange={() => handleLockModalOpen(product)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        variant="warning"
                                        className="me-2"
                                        onClick={() => handleEdit(product.id)}
                                        
                                    >
                                        <Link to='/editproduct'><i className="fas fa-edit"></i></Link>
                                    {/* <FaEdit /> */}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteModalOpen(product)}
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    {/* <FaTrashAlt /> */}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className="d-flex justify-content-between align-items-center">
                    {/* <button className="btn btn-primary" onClick={handlePreviousPage} disabled={page === 0}>Previous</button> */}
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(index)}>{index + 1}</button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {/* <button className="btn btn-primary" onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button> */}
                </div>

                <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this book?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDeleteModalClose}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={showFlashSaleModal} onHide={handleFlashSaleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Flash Sale Status Change</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to {bookToToggleFlashSale && bookToToggleFlashSale.flashSale ? 'close' : 'open'} this book?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleFlashSaleModalClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleFlashSaleConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showLockModal} onHide={handleLockModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Lock Status Change</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to {bookToToggleLock && bookToToggleLock.lock ? 'unlock' : 'lock'} this book?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleLockModalClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleLockConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductManagement;