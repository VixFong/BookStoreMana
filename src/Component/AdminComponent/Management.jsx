import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Toast, ToastContainer, Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
import axios from 'axios';

export const Management = () => {
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showEditToast, setShowEditToast] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentTab, setCurrentTab] = useState('categories');
    const [itemIdToDelete, setItemIdToDelete] = useState(null);
    
    // For Category
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    
    // For Author
    const [showAddAuthor, setShowAddAuthor] = useState(false);
    const [newAuthorName, setNewAuthorName] = useState('');
    const [editAuthorId, setEditAuthorId] = useState(null);
    const [editAuthorName, setEditAuthorName] = useState('');
    
    // For Publisher
    const [showAddPublisher, setShowAddPublisher] = useState(false);
    const [newPublisherName, setNewPublisherName] = useState('');
    const [newPublisherAddress, setNewPublisherAddress] = useState('');
    const [newPublisherEmail, setNewPublisherEmail] = useState('');
    const [editPublisherId, setEditPublisherId] = useState(null);
    const [editPublisherName, setEditPublisherName] = useState('');
    const [editPublisherAddress, setEditPublisherAddress] = useState('');
    const [editPublisherEmail, setEditPublisherEmail] = useState('');

    const token = localStorage.getItem('authToken');
    
    useEffect(() => {   
        fetchCategories();
        fetchAuthors();
        fetchPublishers();
    }, []);
    
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/products/categories', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data.data);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const fetchAuthors = async () => {
        try {
            const response = await axios.get('/api/products/authors', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAuthors(response.data.data);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const fetchPublishers = async () => {
        try {
            const response = await axios.get('/api/products/publishers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPublishers(response.data.data);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleAddCategory = async () => {
        try {
            const newCategory = { category: newCategoryName };
            await axios.post('/api/products/categories', newCategory, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCategories();
            setShowAddCategory(false);
            setNewCategoryName('');
            setShowToast(true);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleEditCategory = (id, name) => {
        setEditCategoryId(id);
        setEditCategoryName(name);
    };

    const handleSaveEditCategory = async (id) => {
        try {
            const updatedCategory = { category: editCategoryName };
            await axios.put(`/api/products/categories/${id}`, updatedCategory, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCategories();
            setEditCategoryId(null);
            setShowEditToast(true);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`/api/products/categories/${itemIdToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCategories();
            setShowDeleteModal(false);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleAddAuthor = async () => {
        try {
            const newAuthor = { authorName: newAuthorName };
            await axios.post('/api/products/authors', newAuthor, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAuthors();
            setShowAddAuthor(false);
            setNewAuthorName('');
            setShowToast(true);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleEditAuthor = (id, name) => {
        setEditAuthorId(id);
        setEditAuthorName(name);
    };

    const handleSaveEditAuthor = async (id) => {
        try {
            await axios.put(`/api/products/authors/${id}`, { authorName: editAuthorName }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAuthors();
            setEditAuthorId(null);
            setShowEditToast(true);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleDeleteAuthor = async () => {
        try {
            await axios.delete(`/api/products/authors/${itemIdToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAuthors();
            setShowDeleteModal(false);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleAddPublisher = async () => {
        try {
            const newPublisher = {
                name: newPublisherName,
                address: newPublisherAddress,
                email: newPublisherEmail
            };
            await axios.post('/api/products/publishers', newPublisher, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPublishers();
            setShowAddPublisher(false);
            setNewPublisherName('');
            setNewPublisherAddress('');
            setNewPublisherEmail('');
            setShowToast(true);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleEditPublisher = (id, name, address, email) => {
        setEditPublisherId(id);
        setEditPublisherName(name);
        setEditPublisherAddress(address);
        setEditPublisherEmail(email);
    };

    const handleSaveEditPublisher = async (id) => {
        try {
            const updatedPublisher = {
                name: editPublisherName,
                address: editPublisherAddress,
                email: editPublisherEmail
            };
            await axios.put(`/api/products/publishers/${id}`, updatedPublisher, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPublishers();
            setEditPublisherId(null);
            setShowEditToast(true);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleDeletePublisher = async () => {
        try {
            await axios.delete(`/api/products/publishers/${itemIdToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPublishers();
            setShowDeleteModal(false);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleDeleteClick = (id) => {
        setItemIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="container-fluid mt-5 management">
            <style>
                {`
                    .management {
                        background: #f0f0f0;
                        padding: 20px;
                        border-radius: 8px;
                    }
                    .management-table th, .management-table td {
                        padding: 1rem;
                        vertical-align: middle;
                    }
                    .management-table th {
                        background-color:#B8B8B8;
                        color: black;
                        text-align: center;
                    }
                    .management-table td {
                        text-align: center;
                    }
                    .management-table .btn {
                        margin-right: 5px;
                    }
                    .management h4 {
                        text-align: left;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .management .btn-danger {
                        background-color: #ff4d4f;
                        border-color: #ff4d4f;
                    }
                    .management .btn-warning {
                        background-color: #ffc107;
                        border-color: #ffc107;
                    }
                    .management .btn-success {
                        background-color: #28a745;
                        border-color: #28a745;
                    }
                `}
            </style>
            <Tabs activeKey={currentTab} onSelect={(k) => setCurrentTab(k)}>
                <Tab eventKey="categories" title="Category">
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
                        <Table bordered hover className="management-table w-100">
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
                                            {editCategoryId === category.id ? (
                                                <Button
                                                    variant="success"
                                                    className="me-2"
                                                    onClick={() => handleSaveEditCategory(category.id)}
                                                >
                                                    <FaCheck />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="warning"
                                                    className="me-2"
                                                    onClick={() => handleEditCategory(category.id, category.category)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                            )}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteClick(category.id)}
                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Tab>
                <Tab eventKey="authors" title="Author">
                    <h4>Author</h4>
                    <div className="mb-3">
                        <Button variant="danger" onClick={() => setShowAddAuthor(!showAddAuthor)}>
                            Add Author +
                        </Button>
                    </div>
                    {showAddAuthor && (
                        <div className="mb-3">
                            <h5>Author Name</h5>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter author name..."
                                value={newAuthorName}
                                onChange={(e) => setNewAuthorName(e.target.value)}
                            />
                            <Button variant="danger" className="mt-2" onClick={handleAddAuthor}>
                                Add
                            </Button>
                        </div>
                    )}
                    <div className="table-responsive">
                        <Table bordered hover className="management-table w-100">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Books Published</th>
                                    <th>Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {authors.map((author, index) => (
                                    <tr key={author.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {editAuthorId === author.id ? (
                                                <input
                                                    type="text"
                                                    value={editAuthorName}
                                                    onChange={(e) => setEditAuthorName(e.target.value)}
                                                />
                                            ) : (
                                                author.authorName
                                            )}
                                        </td>
                                        <td>{author.booksPublished}</td>
                                        <td>
                                            {editAuthorId === author.id ? (
                                                <Button
                                                    variant="success"
                                                    className="me-2"
                                                    onClick={() => handleSaveEditAuthor(author.id)}
                                                >
                                                    <FaCheck />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="warning"
                                                    className="me-2"
                                                    onClick={() => handleEditAuthor(author.id, author.authorName)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                            )}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteClick(author.id)}
                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Tab>
                <Tab eventKey="publishers" title="Publisher">
                    <h4>Publisher</h4>
                    <div className="mb-3">
                        <Button variant="danger" onClick={() => setShowAddPublisher(!showAddPublisher)}>
                            Add Publisher +
                        </Button>
                    </div>
                    {showAddPublisher && (
                        <div className="mb-3">
                            <h5>Publisher Name</h5>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter publisher name..."
                                value={newPublisherName}
                                onChange={(e) => setNewPublisherName(e.target.value)}
                            />
                            <h5>Address</h5>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter publisher address..."
                                value={newPublisherAddress}
                                onChange={(e) => setNewPublisherAddress(e.target.value)}
                            />
                            <h5>Email</h5>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter publisher email..."
                                value={newPublisherEmail}
                                onChange={(e) => setNewPublisherEmail(e.target.value)}
                            />
                            <Button variant="danger" className="mt-2" onClick={handleAddPublisher}>
                                Add
                            </Button>
                        </div>
                    )}
                    <div className="table-responsive">
                        <Table bordered hover className="management-table w-100">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Email</th>
                                    <th>Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {publishers.map((publisher, index) => (
                                    <tr key={publisher.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {editPublisherId === publisher.id ? (
                                                <input
                                                    type="text"
                                                    value={editPublisherName}
                                                    onChange={(e) => setEditPublisherName(e.target.value)}
                                                />
                                            ) : (
                                                publisher.name
                                            )}
                                        </td>
                                        <td>
                                            {editPublisherId === publisher.id ? (
                                                <input
                                                    type="text"
                                                    value={editPublisherAddress}
                                                    onChange={(e) => setEditPublisherAddress(e.target.value)}
                                                />
                                            ) : (
                                                publisher.address
                                            )}
                                        </td>
                                        <td>
                                            {editPublisherId === publisher.id ? (
                                                <input
                                                    type="text"
                                                    value={editPublisherEmail}
                                                    onChange={(e) => setEditPublisherEmail(e.target.value)}
                                                />
                                            ) : (
                                                publisher.email
                                            )}
                                        </td>
                                        <td>
                                            {editPublisherId === publisher.id ? (
                                                <Button
                                                    variant="success"
                                                    className="me-2"
                                                    onClick={() => handleSaveEditPublisher(publisher.id)}
                                                >
                                                    <FaCheck />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="warning"
                                                    className="me-2"
                                                    onClick={() => handleEditPublisher(publisher.id, publisher.name, publisher.address, publisher.email)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                            )}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteClick(publisher.id)}
                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Tab>
            </Tabs>

            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>Added successfully</Toast.Body>
                </Toast>
                <Toast onClose={() => setShowEditToast(false)} show={showEditToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>Edited successfully</Toast.Body>
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
                    Are you sure you want to delete this item?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={currentTab === 'categories' ? handleDeleteCategory : currentTab === 'authors' ? handleDeleteAuthor : handleDeletePublisher}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Management;
