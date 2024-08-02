{/* NOTIFICATION */}

    import React, { useEffect, useState, useRef } from 'react';
    import { FaBell } from 'react-icons/fa';
{/* NOTIFICATION */}
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './SideBar';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Modal, Button } from 'react-bootstrap';
import NotificationBell from './NotificationBell';

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

    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();
{/* NOTIFICATION */}

    const [notifications, setNotifications] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
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
    const fetchLatestNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications/latest',{
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
            const response = await axios.get('/api/notifications',{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNotifications(response.data.data);
        } catch (error) {
            console.error('Error fetching all notifications', error);
        }
    };
    console.log(notifications);
    // const latestNotifications = notifications.slice(0, 4);


    const formatMessage = (message) => {
        const parts = message.split(', ');
        const orderInfo = parts[0].split(': ')[1];
        const orderEvent = parts[0].split(': ')[0];
        const numItems = parts[1];
        const dateCreated = new Date(parts[2]).toLocaleString();
        return `${orderEvent}: ${orderInfo} with ${numItems} item(s) created on ${dateCreated}`;
    };


    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };
    useEffect(() => {
        if(!token){
            navigate('/');
        }
        fetchUsers(page, size, searchTerm);
    }, [page, size, searchTerm]);

    const fetchUsers = async (page, size, keyword) => {
        // console.log(keyword)
        try {
            const response = await axios.get('/api/identity/users/search', {
                params: { page, size, keyword },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // console.log(response.data.data)
            setUsers(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const toggleUserLock = async (userId, isLock) => {
       
        try {
            const response = await axios.put(`/api/identity/users/${userId}/lock`, null, {
                params: { isLock },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data.code === 200){
                fetchUsers(page, size, searchTerm);
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    };

   

    const handleLockConfirm = async () => {
        try {
            await toggleUserLock(userToToggleLock.id, !userToToggleLock.lock);
            setShowLockModal(false);
        } catch (error) {
            // console.error('Error toggling user lock:', error);
            setError(error.response?.data?.message);

           
        }
    };

    const handleLockModalOpen = (user) => {
        setUserToToggleLock(user);
        setShowLockModal(true);
    };
    
    const handleLockModalClose = () => {
        setShowLockModal(false);
        setUserToToggleLock(null);
    };
    

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // const handleNextPage = () => {
    //     if (page < totalPages - 1) {
    //         setPage(page + 1);
    //     }
    // };

    // const handlePreviousPage = () => {
    //     if (page > 0) {
    //         setPage(page - 1);
    //     }
    // };

    const handleSearchInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        
        try {
            await axios.delete(`/api/identity/users/${userToDelete.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShowDeleteModal(false);
            fetchUsers(page, size, searchTerm);
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
        <div className="d-flex container-fluid mt-5 user-management">
            <Sidebar />
            <NotificationBell/>
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
                            // font-family: 'Roboto', sans-serif;
                            margin-left: 220px;
                        }

                        .user-management {
                            margin-left: 100px; 
                            background: #f0f0f0;
                            padding: 20px;
                            border-radius: 8px;
                        }

                        .table {
                            width: 100%;
                            margin: 10px 0;
                           
                        }
                
                        .table td, .table th {
                            vertical-align: middle;
                            padding: 10px;
                        }

                        .table th{
                            background-color:#B8B8B8;
                            color: black;
                            text-align: center;
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
                
                        // .btn-primary {
                        //     // background-color: #0d6efd;
                        //     border-color: #0d6efd;
                        // }
                        .page-link{
                            color: #000;
                        }

                        .active>.page-link, .page-link.active {
                            z-index: 3;
                            color: var(--bs-pagination-active-color);
                            background-color: #dc3545;
                            border-color: #dc3545;
                        }
                        .btn-danger {
                            background-color: #dc3545;
                            border-color: #dc3545;
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
                        {users.map((user) => (
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
                                            onChange={() => handleLockModalOpen(user)}
                                        />
                                    </div>
                                </td>

                                <td className="text-center align-middle">
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
                    {/* <button className="btn btn-primary" onClick={handlePreviousPage} disabled={page === 0}>Previous</button> */}
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                                    <button className="page-link background-color:  " onClick={() => handlePageChange(index)}>{index + 1}</button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {/* <button className="btn btn-primary" onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button> */}
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
