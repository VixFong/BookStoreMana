import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Admin = () => {
    const [admins, setAdmins] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAdmins = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get('http://localhost:8888/identity/users/admins', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAdmins(response.data.data);
            } catch (error) {
                setError(error.response?.data?.message || 'An error occurred');
            }
        };

        fetchAdmins();
    }, []);

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
                    {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td>{admin.fullName}</td>
                            <td>{admin.email}</td>
                            <td>{admin.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;