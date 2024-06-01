import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export const AddUser = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            fullName,
            email,
            password,
            phone,
            city,
            district,
            ward,
            address,
            role,
            profilePicture
        });

        const addUser = async () => {
            try {
                toast.success('Add Successfully', {
                    onClose: () => navigate('/UserManagement')
                });
            } catch (err) {
                setError('Failed to add user');
            }
        };

        addUser();
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePicture(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="container">
            <ToastContainer />
            <h3 className="mt-4">Add New User</h3>
            <form onSubmit={handleSubmit} className="row mt-4">
                <div className="col-md-4">
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
                        <label htmlFor="password" className="form-label">Password *</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <button type="submit" className="btn btn-danger">Add User</button>
                </div>
            </form>
        </div>
    );
};

export default AddUser;