import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './SideBar';
import axios from 'axios';
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from 'react-bootstrap';

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [userToDelete, setUserToDelete] = useState(null); 
    
    const [showLockModal, setShowLockModal] = useState(false); 
    const [userToToggleLock, setUserToToggleLock] = useState(null); 

    useEffect(() => {
        fetchUsers(page, size);
    }, [page, size]);

    const fetchUsers = async (page, size) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://localhost:8888/identity/users', {
                params: { page, size },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const toggleUserLock = async (userId, isLock) => {
        console.log(userId, isLock)
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.put(`http://localhost:8888/identity/users/${userId}/lock`, null, {
                params: { isLock },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data.code === 200){
                console.log("aaaa");
                fetchUsers(page, size);

            }
            
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    };

    const handleLockChange = (user) => {
        toggleUserLock(user.id, !user.lock);
    };

    const handleLockModalOpen = (user) => {
        setUserToToggleLock(user);
        setShowLockModal(true);
    };
    
    const handleLockModalClose = () => {
        setShowLockModal(false);
        setUserToToggleLock(null);
    };
    
    const handleLockConfirm = async () => {
        try {
            await toggleUserLock(userToToggleLock.id, !userToToggleLock.lock);
            setShowLockModal(false);
        } catch (error) {
            console.error('Error toggling user lock:', error);
            // Handle error
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleSearchInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        fetchUsers(0, size);
    };

    const filterUsers = users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`http://localhost:8888/identity/users/${userToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowDeleteModal(false);
            fetchUsers(page, size);
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false); 
        setUserToDelete(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-3">
                <h4 className="mb-3">User Management</h4>
                <div className='d-flex justify-content-between mb-3'>
                    <button className="btn btn-danger mb-3">
                        <Link to="/add" className='text-light'>Add New User +</Link>
                    </button>
                    <input
                        type='text'
                        className='form-control w-25'
                        placeholder='Search users...'
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <style>
                    {`
                        body {
                            font-family: 'Roboto', sans-serif;
                        }

                        // .table-bordered th, .table-bordered td {
                        //     border: 1px solid #dee2e6;
                        // }
                        // .table th, .table td {
                        //     vertical-align: middle;
                        //     text-align: center;
                        // }

                        .table {
                            width: 100%;
                            margin: 10px 0;
                        }
                
                        .table td, .table th {
                            vertical-align: middle;
                            padding: 10px;
                        }
                        .table img {
                            width: 70px;
                            height: 70px;
                            object-fit: cover;
                        }

                        .btn {
                            font-weight: 500;
                            border-radius: 20px; 
                        }
                
                        .btn-primary {
                            background-color: #0d6efd;
                            border-color: #0d6efd;
                        }
                
                        .btn-danger {
                            background-color: #dc3545;
                            border-color: #dc3545;
                        }

                        // .form-switch {
                        //     display: flex;
                        //     align-items: center;
                        //     justify-content: center;
                        //     padding-left: 50px;
                        //     height: 100%;
                        // }

                        .form-check-input:checked {
                            background-color: #dc3545;
                            border-color: #dc3545;
                        }
                        
                        .form-check-input {
                            width: 2.25em;  
                            height: 1.25em; 
                            margin-left: -1em; 
                            
                           
                        }
                        
                        .form-check {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            
                        }
                    `}
                </style>
                {error && <p className="text-danger">{error}</p>}
                <table className="table table-striped table-bordered" border={1}>
                    <thead>
                        <tr className='text-center align-middle'>
                            <th>Pic</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Started Date</th>
                            <th>Lock</th>
                            <th>Activated</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="text-center align-middle">
                                    <img src={user.profilePicture} alt={user.fullName} className="rounded-circle" style={{ width: '70px', height: '70px' }} />
                                </td>
                                <td className="text-center align-middle">{user.fullName}</td>
                                <td className="text-center align-middle">{user.email}</td>
                                <td className="text-center align-middle">{formatDate(user.startedDate)}</td>
                                <td className="text-center align-middle">
                                    <div className="form-check form-switch">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            checked={user.lock} 
                                            // onChange={() => handleLockChange(user)}
                                            onChange={() => handleLockModalOpen(user)}
                                        />
                                    </div>
                                </td>

                                <td className="text-center align-middle">
                                    {/* {user.activate ? 'x' : ''} */}
                                    {user.activate ? <i className="fas fa-check-circle text-success fa-2x"></i> : <i className="fas fa-times-circle text-danger fa-2x"></i>}
                                </td>
                                <td className="text-center align-middle">{user.roles.map(role => role.name).join(', ')}</td>
                                <td className="text-center align-middle">
                                   <Link to={`/edit/${user.id}`} className='btn btn-warning btn-sm me-2'><i className="fas fa-edit"></i></Link>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(user)}><i className="fas fa-trash-alt"></i></button>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn btn-primary" onClick={handlePreviousPage} disabled={page === 0}>Previous</button>
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(index)}>{index + 1}</button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <button className="btn btn-primary" onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button>
                </div>
            </div>
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* Lock Modal */}
            
            <Modal show={showLockModal} onHide={handleLockModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Lock Status Change</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to {userToToggleLock && userToToggleLock.lock ? 'unlock' : 'lock'} this user?
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
export default UserManagement;