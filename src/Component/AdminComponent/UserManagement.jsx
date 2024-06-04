import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './SideBar';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [userToDelete, setUserToDelete] = useState(null); 
    

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
            await axios.put(`http://localhost:8888/identity/users/${userId}/lock`, null, {
                params: { isLock },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("aaaa");
            // Update the local state immediately to reflect the change
            // setUsers(users.map(user => user.id === userId ? { ...user, lock } : user));
            fetchUsers(page, size);
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    };

    const handleLockChange = (user) => {
        toggleUserLock(user.id, !user.lock);
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
                        .table-bordered th, .table-bordered td {
                            border: 1px solid #dee2e6;
                        }
                        .table th, .table td {
                            vertical-align: middle;
                            text-align: center;
                        }
                        .form-switch {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding-left: 50px;
                            height: 100%;
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
                            <th>Created Date</th>
                            <th>Blocked</th>
                            <th>Activated</th>
                            <th>Role</th>
                            <th>Operation</th>
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
                                <td className="text-center align-middle">{user.startedDate}</td>
                                <td className="text-center align-middle">
                                    <div className="form-check form-switch">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            checked={user.lock} 
                                            onChange={() => handleLockChange(user)} />
                                    </div>
                                </td>
                                <td className="text-center align-middle">{user.activate ? 'x' : ''}</td>
                                <td className="text-center align-middle">{user.roles.map(role => role.name).join(', ')}</td>
                                <td className="text-center align-middle">
                                    <button className="btn btn-primary btn-sm me-2">Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(user)}>Delete</button>
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
        </div>
    );
};
export default UserManagement;