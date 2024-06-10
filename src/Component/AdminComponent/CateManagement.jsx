import React, { useState, useEffect } from 'react';
import {Modal ,Button, Table, Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
import axios from 'axios';

export const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showToast, setShowToast] = useState(false);


    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState(''); 

    const token =  localStorage.getItem('authToken');
    useEffect(() => {   
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/products/categories', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategories(response.data.data); 
            console.log(response.data.data)
        } catch (error) {
            // console.error('Error fetching categories:', error);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };


    const handleAddCategory = async() => {
        try{
            const newCategory = {
                
                category: newCategoryName,
                // productsCount: 0,
            };
            const response = await axios.post("/api/products/categories", newCategory,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        

            fetchCategories();
            setShowAddCategory(false);
            setNewCategoryName('');
            setShowToast(true);
            

            // setCategories([...categories, newCategory]);
            // setShowAddCategory(false);
            // setNewCategoryName('');
            // setShowToast(true);
        }
        catch(error){
            // console.error('Error adding category:', error);
            setError(error.response?.data?.message)
            setShowErrorModal(true);
        }
    };

    const handleEdit = (id, name) => {
        setEditCategoryId(id);
        setEditCategoryName(name);
    };

    const handleSaveEdit = async (id) => {
        try {
            const updatedCategory = { category: editCategoryName };
            const response = await axios.put(`/api/products/categories/${id}`, updatedCategory, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchCategories();
            setEditCategoryId(null);
            setShowToast(true);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    
    const handleDelete = async() => {
        try {
            const response =await axios.delete(`/api/products/categories/${categoryIdToDelete}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
                
            fetchCategories();
            setShowDeleteModal(false);
            // handleCloseDeleteModal();

            
        } catch (error) {
            // console.error('Error deleting category:', error);
            setError(error.response?.data?.message)
            setShowErrorModal(true);
        }
    };

    const handleDeleteClick = (id) => {
        setCategoryIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false); 
        setUserToDelete(null);
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="container-fluid mt-5 category-management">
            <style>
                {`
                .category-table th, .category-table td {
                    padding: 1rem;
                    vertical-align: middle;
                }
                .category-table th {
                    background-color: #B8B8B8;
                    color: black;
                    text-align: center;
                }
                .category-table td {
                    text-align: center;
                }
                .category-table td:first-child {
                    text-align: center;
                }
                .category-table .btn {
                    margin-right: 5px;
                }
                .category-management h4 {
                    text-align: left;
                    color: #000000;
                    margin-bottom: 20px;
                }
                .category-management .btn-danger {
                    background-color: #ff4d4f;
                    border-color: #ff4d4f;
                }
                `}
            </style>
            <h4>Category</h4>
            <div className="mb-3">
                <Button variant="danger" onClick={() => setShowAddCategory(!showAddCategory)}>
                    Add Category +
                </Button>
            </div>
            {showAddCategory && (
                <div className="mb-3">
                    <h5>Category Name</h5>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Science, Romance, Sports..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button variant="danger" className="mt-2" onClick={handleAddCategory}>
                        Add
                    </Button>
                </div>
            )}
            <div className="table-responsive">
                <Table bordered hover className="category-table w-100">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Books</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={category.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {editCategoryId === category.id ? (
                                        <input
                                            type="text"
                                            value={editCategoryName}
                                            onChange={(e) => setEditCategoryName(e.target.value)}
                                        />
                                        ) : (
                                            category.category
                                    )}
                                </td>
                                <td>{category.bookCount}</td>
                                <td>
                                    {editCategoryId === category.id ? ( // Conditional rendering for save button
                                        <Button
                                            variant="success"
                                            className="me-2"
                                            onClick={() => handleSaveEdit(category.id)}
                                        >
                                            <FaCheck />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="warning"
                                            className="me-2"
                                            onClick={() => handleEdit(category.id, category.category)}
                                        >
                                        <i className="fas fa-edit"></i>

                                            {/* <FaEdit /> */}
                                        </Button>
                                    )}
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteClick(category.id)}
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
            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>{editCategoryId === null ? 'Edit successfully' : 'Edit successfully'}</Toast.Body>
                </Toast>
            </ToastContainer>

            <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
                    <Modal.Body className="text-center">
                        <div className="mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        <h4>Error</h4>
                        <p>{error}</p>
                        <Button variant="danger" onClick={handleCloseErrorModal}>Close</Button>
                    </Modal.Body>
                </Modal>


            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this category?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CategoryManagement;