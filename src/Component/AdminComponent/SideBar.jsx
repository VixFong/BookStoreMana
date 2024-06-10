
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export const Sidebar = () => {
    const [UserMenu, setUserMenu] = useState(false);
    const [CateMenu, setCateMenu] = useState(false);
    const [ProductMenu, setProductMenu] = useState(false);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');

    const [profilePicture, setProfilePicture] = useState('');
    const [roles, setRoles] = useState([]);


    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');



    const toggleUserMenu = () => {
        setUserMenu(!UserMenu);
    };

    const toggleCateMenu = () => {
        setCateMenu(!CateMenu);
    };

    const toggleProdMenu = () => {
        setProductMenu(!ProductMenu);
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
            // console.error('An error occurred during logout', error);
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
                
                // console.error('Error fetching user email:', error);
            }
        };

        fetchUserEmail();
    }, []);

    const isAdmin = roles.includes('Admin');

    return (
        <div className="sidebar-container">
        <div className="bg-dark text-white vh-100 d-flex flex-column justify-content-between">
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
                        <a className="nav-link text-white d-flex justify-content-between align-items-center" href="#" onClick={toggleCateMenu}>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ui-radios" viewBox="0 0 16 16">
                            <path d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zM0 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0m7-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M3 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6m0 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                            </svg> Category</span>
                            <span>{CateMenu ? <FaChevronUp /> : <FaChevronDown />}</span>
                        </a>
                        <div className={`collapse ${CateMenu ? 'show' : ''}`}>
                            <ul className="nav flex-column ms-3">
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/category">Category Management</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="#">Add Category</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white d-flex justify-content-between align-items-center" href="#" onClick={toggleProdMenu}>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book" viewBox="0 0 16 16">
                            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                            </svg> Product</span>
                            <span>{ProductMenu ? <FaChevronUp /> : <FaChevronDown />}</span>
                        </a>
                        <div className={`collapse ${ProductMenu ? 'show' : ''}`}>
                            <ul className="nav flex-column ms-3">
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/product">Product Management</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="#">Add Product</Link>
                                </li>
                            </ul>
                        </div>
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
    </div>
    );
};

export default Sidebar;
