
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export const Sidebar = () => {
    const [UserMenu, setUserMenu] = useState(false);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');

    const [profilePicture, setProfilePicture] = useState('');
    const [roles, setRoles] = useState([]);


    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');



    const toggleUserMenu = () => {
        setUserMenu(!UserMenu);
    };

    const handleLogout = async () => {
        try {
            // Call the backend logout API
            const response = await axios.post('/api/identity/auth/logout', {
               token
            });

            if (response.status === 200) {
                // Clear token from localStorage
                localStorage.removeItem('authToken');

                // Redirect to login page
                navigate('/');
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('An error occurred during logout', error);
        }
    };


    useEffect(() => {
        const fetchUserEmail = async () => {
       
            try {
                const response = await axios.get('/api/identity/users/info', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.code === 200) {
                    const userProfilePicture = response.data.data.profilePicture;
                    const userEmail = response.data.data.email;
                    const emailWithoutDomain = userEmail.split('@')[0];
                    setEmail(emailWithoutDomain);
                    setProfilePicture(userProfilePicture);
                    setFullName(response.data.data.fullName)
                    setRoles(response.data.data.roles.map(role => role.name));
                }
            } catch (error) {
                console.error('Error fetching user email:', error);
            }
        };

        fetchUserEmail();
    }, []);

    const isAdmin = roles.includes('Admin');

    return (
        <div className="bg-dark text-white vh-100">
            <div className="p-3">
                <h4 className="text-center">BOOKSTORE</h4>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        {/* {profilePicture && <img src={profilePicture} alt="Profile" className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />} */}
                        <p className="mb-1"><img src={profilePicture} alt="Profile" className="rounded-circle me-2" style={{ width: '25px', height: '25px' }}/><Link to="/administrators">{fullName}</Link></p>
                        <a className="nav-link text-white" href="#">Main Page</a>

                    </li>

                    {isAdmin && (    
                    <li className="nav-item">
                        <a className="nav-link text-white d-flex justify-content-between align-items-center" href="#" onClick={toggleUserMenu}>
                            <span><FaUser /> User</span>
                            <span>{UserMenu ? <FaChevronUp /> : <FaChevronDown />}</span>
                        </a>
                        <div className={`collapse ${UserMenu ? 'show' : ''}`}>
                            <ul className="nav flex-column ms-3">
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/UserManagement">User Management</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/add">Add New User</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/administrators">Administrators</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                      )}
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Category</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Product</a>
                    </li>
                </ul>
            </div>
            <div className="p-3">
                {/* <p className="mb-1">Hello, <Link to="/administrators">{email}</Link></p> */}
                <a className="nav-link text-white d-flex align-items-center" onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Log Out
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
