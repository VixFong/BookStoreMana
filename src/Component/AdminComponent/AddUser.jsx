
// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// export const AddUser = () => {
//     const [fullName, setFullName] = useState('');
//     const [email, setEmail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [city, setCity] = useState('');
//     const [district, setDistrict] = useState('');
//     const [ward, setWard] = useState('');
//     const [address, setAddress] = useState('');
//     const [role, setRole] = useState('');
//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const updateAddress = `${address}, ${ward}, ${district}, ${city}`;

//         const createUserRequest = new FormData();
//         createUserRequest.append('fullName', fullName);
//         createUserRequest.append('email', email);
//         createUserRequest.append('phone', phone);
//         createUserRequest.append('address', updateAddress);
//         createUserRequest.append('role', role);
//         if (file) {
//             createUserRequest.append('file', file);
//         }

//         const addUser = async () => {
//             setLoading(true);
//             const token = localStorage.getItem('authToken');

//             try {
//                 const response = await axios.post(
//                     `http://localhost:8888/identity/users`,
//                     createUserRequest,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             'Content-Type': 'multipart/form-data'
//                         }
//                     }
//                 );
//                 console.log(response.data);
//                 toast.success('Add Successfully', {
//                     onClose: () => navigate('/UserManagement')
//                 });
//             } catch (err) {
//                 setError('Failed to add user');
//                 toast.error('Failed to add user');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         addUser();
//     };

//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             setFile(e.target.files[0]);
//         }
//     };

//     return (
//         <div className="container">
//             <ToastContainer />
//             <h3 className="mt-4">Add New User</h3>
//             {loading && <div className="alert alert-info" role="alert">Loading...</div>}
//             <form onSubmit={handleSubmit} className="row mt-4">
//                 <div className="col-md-4">
//                     <div className="text-center">
//                         <img
//                             src={file ? URL.createObjectURL(file) : 'https://via.placeholder.com/150'}
//                             alt="Profile"
//                             className="img-thumbnail mb-3"
//                             style={{ width: '200px', height: '200px' }}
//                         />
//                         <input
//                             type="file"
//                             className="form-control"
//                             onChange={handleImageChange}
//                         />
//                     </div>
//                 </div>
//                 <div className="col-md-8">
//                     <div className="mb-3">
//                         <label htmlFor="fullName" className="form-label">Full Name *</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="fullName"
//                             value={fullName}
//                             onChange={(e) => setFullName(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="email" className="form-label">Email *</label>
//                         <input
//                             type="email"
//                             className="form-control"
//                             id="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="phone" className="form-label">Phone Number</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="phone"
//                             value={phone}
//                             onChange={(e) => setPhone(e.target.value)}
//                         />
//                     </div>
//                     <div className="row">
//                         <div className="col-md-4 mb-3">
//                             <label htmlFor="city" className="form-label">Select province / city</label>
//                             <select
//                                 className="form-select"
//                                 id="city"
//                                 value={city}
//                                 onChange={(e) => setCity(e.target.value)}
//                             >
//                                 <option>Select province / city</option>
//                                 <option>TP.Hồ Chí Minh</option>
//                                 {/* Add more options as needed */}
//                             </select>
//                         </div>
//                         <div className="col-md-4 mb-3">
//                             <label htmlFor="district" className="form-label">District</label>
//                             <select
//                                 className="form-select"
//                                 id="district"
//                                 value={district}
//                                 onChange={(e) => setDistrict(e.target.value)}
//                             >
//                                 <option>Select District</option>
//                                 <option>Quận 1</option>
//                                 <option>Quận 2</option>
//                                 <option>Quận 3</option>
//                                 <option>Quận 4</option>
//                                 <option>Quận 5</option>
//                                 <option>Quận 6</option>
//                                 <option>Quận 7</option>
//                                 <option>Quận 8</option>
//                                 {/* Add more options as needed */}
//                             </select>
//                         </div>
//                         <div className="col-md-4 mb-3">
//                             <label htmlFor="ward" className="form-label">Ward</label>
//                             <select
//                                 className="form-select"
//                                 id="ward"
//                                 value={ward}
//                                 onChange={(e) => setWard(e.target.value)}
//                             >
//                                 <option>Select Ward</option>
//                                 <option>Phường 1</option>
//                                 <option>Phường 2</option>
//                                 <option>Phường 3</option>
//                                 <option>Phường 4</option>
//                                 <option>Phường 5</option>
//                                 <option>Phường 6</option>
//                                 <option>Phường 7</option>
//                                 {/* Add more options as needed */}
//                             </select>
//                         </div>
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="address" className="form-label">Address Detail</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             id="address"
//                             value={address}
//                             onChange={(e) => setAddress(e.target.value)}
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="role" className="form-label">Authorization</label>
//                         <select
//                             className="form-select"
//                             id="role"
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                         >
//                             <option>Customer</option>
//                             <option>Admin</option>
//                             <option>Employee</option>
//                         </select>
//                     </div>
//                     <button type="submit" className="btn btn-danger">Add User</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddUser;
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Spinner, Button } from 'react-bootstrap';

import axios from 'axios';

export const AddUser = () => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModal(true);  // Show the loading modal
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
            // setLoading(true);
            const token = localStorage.getItem('authToken');

            try {
                const response = await axios.post(
                    `http://localhost:8888/identity/users`,
                    createUserRequest,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                if (response.data.code == 200) {
                    setTimeout(() => {
                        setShowModal(false);
                        setShowSuccessModal(true);
                    }, 5000);
                }
                console.log(response.data);
                toast.success('Add User Successfully', {
                    onClose: () => navigate('/UserManagement')
                });
            } catch (error) {
                setShowModal(false);
                setError(error.response?.data?.message || 'An error occurred');
                toast.error('Failed to add user');
                setShowErrorModal(true);
            } 
            // finally {
            //     setLoading(false);
            // }
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
        navigate('/'); 
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <ToastContainer />
            <h3 className="mt-4">Add New User</h3>
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
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label htmlFor="city" className="form-label">Select province / city</label>
                            <select
                                className="form-select"
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            >
                                <option>Select province / city</option>
                                <option>TP.Hồ Chí Minh</option>
                               
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
                                <option>Quận 1</option>
                                <option>Quận 2</option>
                                <option>Quận 3</option>
                                <option>Quận 4</option>
                                <option>Quận 5</option>
                                <option>Quận 6</option>
                                <option>Quận 7</option>
                                <option>Quận 8</option>
                               
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
                            <option>Select Role</option>
                            <option>Customer</option>
                            <option>Admin</option>
                            <option>Employee</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-danger">Add User</button>
                </div>
            </form>

            {/* <Modal show={loading} backdrop="static" keyboard={false}>
                <Modal.Body className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <div className="mt-3">Please wait...</div>
                </Modal.Body>
            </Modal> */}
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
    );
};

export default AddUser;
