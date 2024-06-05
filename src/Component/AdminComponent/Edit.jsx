import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Edit = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`http://localhost:8888/identity/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const userData = response.data.data;
                console.log('User data:', userData); // Debug logging
                setFullName(userData.fullName);
                setEmail(userData.email);
                setPhone(userData.phone);
                setCity(userData.city);
                setDistrict(userData.district);
                setWard(userData.ward);
                setAddress(userData.address);
                setRole(userData.role);
                setProfilePicture(userData.profilePicture);
            } catch (error) {
                console.error('Error fetching user details:', error); // Debug logging
                setError(error.response?.data?.message);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            await axios.put(`http://localhost:8888/identity/users/${userId}`, {
                fullName,
                email,
                phone,
                city,
                district,
                ward,
                address,
                role,
                profilePicture
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Updated Successfully', {
                onClose: () => navigate('/user-management')
            });
        } catch (error) {
            setError(error.response?.data?.message);
            toast.error('Failed to update user');
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="container">
            <h3 className="mt-4 text-center">Edit User</h3>
            <form onSubmit={handleSubmit} className="row mt-4 justify-content-center">
                <div className="col-md-3">
                    <div className="text-center">
                        <img
                            src={profilePicture || 'https://via.placeholder.com/150'}
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
                <div className="col-md-6">
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
                            <option>Customer</option>
                            <option>Admin</option>
                            <option>Employee</option>
                        </select>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-danger w-100">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default Edit;