
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Spinner, Button } from 'react-bootstrap';

import axios from 'axios';

export const Add = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const [file, setFile] = useState(null);
    // const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');
    useEffect(() => {
        if(!token){
            navigate('/');
        }

    })

    const handleSubmit = (e) => {
        e.preventDefault();
        // setShowModal(true);  // Show the loading modal
        const updateAddress = `${address}, ${ward}, ${district}, ${city}`;
        
        const createUserRequest = new FormData();
        createUserRequest.append('fullName', fullName);
        createUserRequest.append('email', email);
        createUserRequest.append('phone', phone);
        createUserRequest.append('address', updateAddress);
        createUserRequest.append('role', role);
        if (file) {
            createUserRequest.append('file', file);
        }

        const addUser = async () => {
            setShowModal(true); 
            const token = localStorage.getItem('authToken');

            try {
                const response = await axios.post(
                    `/api/identity/users`,
                    createUserRequest,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                if (response.data.code === 200) {
                    setShowModal(false); 
                    setShowSuccessModal(true);
                    setTimeout(() => {
                        setShowSuccessModal(false);
                    }, 1000);
                }
                console.log(response.data);
                toast.success('Add User Successfully');
            } catch (error) {
                setShowModal(false);
                setError(error.response?.data?.message || 'An error occurred');
                setShowErrorModal(true);
            } 
            
        };

        addUser();
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        // navigate('/'); 
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const handleCancel = () => {
        navigate('/UserManagement');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <style>
                {`
                .add-user-container {
                    max-width: 1000px;
                    background: #f7f7f7;
                    margin-left: 400px;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .add-user-title {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                }
                .img-thumbnail {
                    border: 1px solid #ddd;
                    padding: 5px;
                }
                .btn-danger, .btn-secondary {
                    width: 100px;
                    margin-right: 10px;
                }
                `}
            </style>
            <ToastContainer />
            <div className="add-user-container">
                <h3 className="add-user-title">Add New User</h3>
                <form onSubmit={handleSubmit} className="row mt-4">
                    <div className="col-md-4">
                        <div className="text-center">
                            <img
                                src={file ? URL.createObjectURL(file) : 'https://via.placeholder.com/150'}
                                alt="Profile"
                                className="img-thumbnail mb-3"
                                style={{ width: '200px', height: '200px' }}
                            />
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Full Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email *</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                pattern="[0-9]*"
                                inputMode="numeric"
                            />
                        </div>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="city" className="form-label">Select city</label>
                                <select
                                    className="form-select"
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                >
                                    <option>Select city</option>
                                    <option value="TP.Hồ Chí Minh">TP.Hồ Chí Minh</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="district" className="form-label">District</label>
                                <select
                                    className="form-select"
                                    id="district"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                >
                                    <option>Select District</option>
                                    <option value="Quận 1">Quận 1</option>
                                    <option value="Quận 2">Quận 2</option>
                                    <option value="Quận 3">Quận 3</option>
                                    <option value="Quận 4">Quận 4</option>
                                    <option value="Quận 5">Quận 5</option>
                                    <option value="Quận 6">Quận 6</option>
                                    <option value="Quận 7">Quận 7</option>
                                    <option value="Quận 8">Quận 8</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="ward" className="form-label">Ward</label>
                                <select
                                    className="form-select"
                                    id="ward"
                                    value={ward}
                                    onChange={(e) => setWard(e.target.value)}
                                >
                                    <option>Select Ward</option>
                                    <option>Phường 1</option>
                                    <option>Phường 2</option>
                                    <option>Phường 3</option>
                                    <option>Phường 4</option>
                                    <option>Phường 5</option>
                                    <option>Phường 6</option>
                                    <option>Phường 7</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address Detail</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Authorization</label>
                            <select
                                className="form-select"
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option>Admin</option>
                                <option>Customer</option>
                                <option>Employee</option>
                                <option>Publisher</option>

                            </select>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-danger">Add User</button>
                            <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                        </div>
                    </div>
                </form>
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Body className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3">Sending Email, Please Wait...</p>
                    </Modal.Body>
                </Modal>
                <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                    <Modal.Body className="text-center">
                        <div className="mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.97 4.03a.75.75 0 0 1 1.08 1.05L7.477 10.27a.75.75 0 0 1-1.08 0L4.97 8.82a.75.75 0 0 1 1.08-1.05l1.72 1.725z"/>
                            </svg>
                        </div>
                        <h4>Sending Successfully</h4>
                        <p>Please Check Your Email To Change The Password</p>
                        <Button variant="primary" onClick={handleCloseSuccessModal}>OK</Button>
                    </Modal.Body>
                </Modal>
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
            </div>
        </div>
    );
};

export default Add;
