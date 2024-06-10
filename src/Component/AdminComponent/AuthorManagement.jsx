import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
import axios from 'axios';

export const AuthorManagement = () => {
    const [authors, setAuthors] = useState([]);
    const [editingAuthorId, setEditingAuthorId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showAddAuthor, setShowAddAuthor] = useState(false);
    const [newAuthorName, setNewAuthorName] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showEditToast, setShowEditToast] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [authorIdToDelete, setAuthorIdToDelete] = useState(null);
    
    const token =  localStorage.getItem('authToken');

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await axios.get('/api/products/authors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.data)
            setAuthors(response.data.data);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleAddAuthor = async () => {
        try {
            const newAuthor = { authorName: newAuthorName };
            await axios.post('/api/products/authors', newAuthor, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
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

    const handleEdit = (id, name) => {
        setEditingAuthorId(id);
        setEditedName(name);
    };

    const handleSaveEdit = async (id) => {
        try {
            await axios.put(`/api/products/authors/${id}`, { authorName: editedName }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchAuthors();
            setEditingAuthorId(null);
            setEditedName('');
            setShowEditToast(true);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleDeleteClick = (id) => {
        setAuthorIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/products/authors/${authorIdToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchAuthors();
            setShowDeleteModal(false);
        } catch (error) {
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false); 
        setAuthorIdToDelete(null);
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="container-fluid mt-5 author-management">
            <style>
                {`
                .author-table th, .author-table td {
                    padding: 1rem;
                    vertical-align: middle;
                }
                .author-table th {
                    background-color: #007bff;
                    color: white;
                    text-align: center;
                }
                .author-table td {
                    text-align: center;
                }
                .author-table td:first-child {
                    text-align: center;
                }
                .author-table .btn {
                    margin-right: 5px;
                }
                .author-management h4 {
                    text-align: left;
                    color: #000000;
                    margin-bottom: 20px;
                }
                .author-management .btn-danger {
                    background-color: #ff4d4f;
                    border-color: #ff4d4f;
                }
                `}
            </style>
            <h4>Author Management</h4>
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
                <Table striped bordered hover className="author-table w-100">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Book Published</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authors.map((author, index) => (
                            <tr key={author.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {editingAuthorId === author.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                            />
                                            <Button 
                                                variant="success" 
                                                className="ms-2" 
                                                onClick={() => handleSaveEdit(author.id)}
                                            >
                                                <FaCheck />
                                            </Button>
                                        </>
                                    ) : (
                                        author.authorName
                                    )}
                                </td>
                                <td>{author.booksPublished}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={() => handleEdit(author.id, author.authorName)}
                                    >
                                        <FaEdit />
                                    </Button>
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
            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>Adding successfully</Toast.Body>
                </Toast>
                <Toast onClose={() => setShowEditToast(false)} show={showEditToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>Edit successfully</Toast.Body>
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
                    Are you sure you want to delete this author?
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

export default AuthorManagement;