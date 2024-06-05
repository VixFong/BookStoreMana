import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Spinner, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Admin = () => {
    const [admins, setAdmins] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [file, setFile] = useState(null);


    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    
    const [error, setError] = useState('');

    useEffect(() => {
        
        const fetchAdmins = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get('http://localhost:8888/identity/users/info', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.data.code === 200){
                    console.log(response.data)
                    setAdmins(response.data.data);

                    const userData = response.data.data;
                    console.log('User data:', userData); 
    
                    let extractAddress; 
                    if(userData.address){
                        extractAddress = userData.address.split(",");
                        if (extractAddress.length >= 4) {
                            setCity(extractAddress[3]);
                        }
                        if (extractAddress.length >= 3) {
                            setDistrict(extractAddress[2]);
                        }
                        if (extractAddress.length >= 2) {
                            setWard(extractAddress[1]);
                        }
                        if (extractAddress.length >= 1) {
                            setAddress(extractAddress[0]);
                        }
    
                        console.log(extractAddress[3])
                        console.log(extractAddress[2])
                        console.log(extractAddress[1])
                    }
                    if(userData.phone){
                        setPhone(userData.phone)
                    }
                    
                    setFullName(userData.fullName);
                    setEmail(userData.email);
    
                    const userRoles = userData.roles.map(role => role.name);
                    setRole(userRoles.join(', '))
                    setProfilePicture(userData.profilePicture);
    
                    
    
                }
            } catch (error) {
                setError(error.response?.data?.message || 'An error occurred');
            }
        };

        fetchAdmins();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowModal(true);
        const token = localStorage.getItem('authToken');


        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', `${address},${ward},${district},${city}`);
        formData.append('role', role);
        if (file) {
            formData.append('file', file);
        }
        try {
            const response = await axios.put(`http://localhost:8888/identity/users/info`,
                formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'

                    }
                });
               
            if(response.data.code == 200){

                setShowModal(false); 
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 1000);
                // setTimeout(() => {
                // toast.success('Updated Successfully', {
                //     onClose: () => navigate('/UserManagement')
                // });
            }
            
        } catch (error) {
            setShowModal(false);
            setError(error.response?.data?.message);
            // toast.error('Failed to update user');
            setShowErrorModal(true);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        // navigate('/'); 
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="container mt-4" style={{ marginLeft: '375px', marginBottom: '300px' }}>
            <h3 className="text-center mb-4">Administrators</h3>
            <p className='text-center'>Contact one of the administrators on this list for system support</p>
            {error && <p className="text-danger">{error}</p>}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td>{admin.fullName}</td>
                            <td>{admin.email}</td>
                            <td>{admin.phone}</td>
                        </tr>
                    ))} */}
                </tbody>
            </table>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Body className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3">Updating, Please Wait...</p>
                    </Modal.Body>
                </Modal>

                <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                    <Modal.Body className="text-center">
                        <div className="mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.97 4.03a.75.75 0 0 1 1.08 1.05L7.477 10.27a.75.75 0 0 1-1.08 0L4.97 8.82a.75.75 0 0 1 1.08-1.05l1.72 1.725z"/>
                            </svg>
                        </div>
                        <h4>Update Successfully</h4>
                        {/* <p>Please Check Your Email To Change The Password</p>
                        <Button variant="primary" onClick={handleCloseSuccessModal}>OK</Button> */}
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

export default Admin;