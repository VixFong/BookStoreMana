import React, { useEffect, useState } from 'react';
import {Modal, Spinner,Button, Table, Form, Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
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

    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [bookToDelete, setBookToDelete] = useState(null); 
    
    const [showLockModal, setShowLockModal] = useState(false); 
    const [bookToToggleLock, setBookToToggleLock] = useState(null); 

    
    const [showFlashSaleModal, setShowFlashSaleModal] = useState(false); 
    const [bookToToggleFlashSale, setBookToToggleFlashSale] = useState(null); 
    
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();
    useEffect(() => {
        fetchBooks(page, size, search);

    }, [page, size]);

    const fetchBooks = async(page, size, search) => {
        try {
            console.log(search);
            setShowModal(true);
            const response = await axios.get('/api/products/books/search',{
                params: {page, size, keyword:search},
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('search',response.data.data)
            const books = response.data.data.content;
            setProducts(books);
            setTotalPages(response.data.data.totalPages);
            const bookIds = books.map(book => book.bookId);
            fetchInventoryStatus(bookIds);
            setShowModal(false);


        } catch (error) {
            console.log(error);
            setShowModal(false);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
            
        }
    };

    const fetchInventoryStatus = async(bookIds)=>{
        try {
            // setShowModal(true);
            console.log('book id ', bookIds)
            const response = await axios.post('/api/inventory/status', 
                bookIds,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }    
            });

            console.log('status',response.data.data);
            
            const statusMap = response.data.data.reduce((acc, item) => {
                acc[item.bookId] = item.status;
                return acc;
            }, {});
            setProducts(prevProducts => prevProducts.map(product => ({
                ...product,
                status: statusMap[product.bookId] || 'Unknown'
            })));
            setShowModal(false);


        } catch (error) {
            console.log(error);
            setShowModal(false);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    }

    // const handleSearchInputChange = (event) => {
    //     const value = event.target.value;
    //     setSearch(value);
    // };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };


    const handleDeleteConfirm = async () => {
        try {
            setShowModal(true);
            const response = await axios.delete(`/api/products/books/${bookToDelete.bookId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowDeleteModal(false);
            if(response.data.data == "Can not delete"){
                setError("Can not delete. Because its received quantity greater than 0")
                setShowErrorModal(true);
                
            }

            fetchBooks(page, size, search);
            setShowModal(false);

        } catch (error) {
            setShowModal(false);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
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
            
            setShowErrorModal(true);
            
        }
   
    };

    const handleFlashSaleConfirm = async () => {
        try {
            await toggleFlashSale(bookToToggleFlashSale.bookId, !bookToToggleFlashSale.flashSale);
            setShowFlashSaleModal(false);
        } catch (error) {
            setError(error.response?.data?.message);  
            setShowErrorModal(true);

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
            setError(error.response.data.message);
            setShowErrorModal(true);
            
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

                    // .product-table{
                    //     width: 100%;
                    //     margin: 10px 0;
                    // }
                    .product-table th, .product-table td {
                        padding: 1rem;
                        vertical-align: middle;
                    }
                    .product-table th {
                        background-color:#B8B8B8;
                        // margin-left:50px;
                        padding-left: 30px;
                        padding-right: 30px;

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
                 
                    .page-link{
                        color: #000;
                    }

                    .active>.page-link, .page-link.active {
                         z-index: 3;
                        color: var(--bs-pagination-active-color);
                        background-color: #dc3545;
                        border-color: #dc3545;
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
                        // onChange={handleSearchInputChange}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                fetchBooks(page,size, search);
                            }
                        }}
                    />
            </div>
            <div className="table-responsive">
                <Table  bordered hover className="product-table w-100">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Flash Sale</th>
                            <th>Lock</th>
                            <th>Status</th>
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
                               
                                <td >{product.discount}%</td>
                                <td className='form-check-input'>
                                    <Form.Check
                                        // className='form-check-input'
                                        type="switch"
                                        // id={`flash-sale-${product.id}`}
                                        checked={product.flashSale}
                                        onChange={() => handleFlashSaleModalOpen(product)}
                                    />
                                </td>
                                <td>
                                    <Form.Check
                                        type="switch"
                                    
                                        checked={product.lock}
                                        onChange={() => handleLockModalOpen(product)}
                                    />
                                </td>
                                
                                <td className="text-danger fw-bolder">{product.status || 'Loading...'}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        className="me-2"
                                        
                                    >
                                        <Link to={`/editproduct/${product.bookId}`}><i className="fas fa-edit"></i></Link>
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteModalOpen(product)}
                                    >
                                        <i className="fas fa-trash-alt"></i>
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
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Body className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3">Loading, Please Wait...</p>
                    </Modal.Body>
                </Modal>
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