
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export const Sidebar = () => {
    const [UserMenu, setUserMenu] = useState(false);
    const [CateMenu, setCateMenu] = useState(false);
    const [ProductMenu, setProductMenu] = useState(false);
    const [InventoryMenu, setInventoryMenu] = useState(false);
    const [ItemOrderMenu, setItemOrderMenu] = useState(false);
    // const [email, setEmail] = useState('');
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

    const toggleInventMenu = () => {
        setInventoryMenu(!InventoryMenu);
    }

    const toggleItemOrderMenu = () => {
        setItemOrderMenu(!ItemOrderMenu);
    }

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
            }
        } catch (error) {
            // setError(error.response?.data?.message);
            
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
                console.log(response.data)
                if (response.data.code === 200) {
                    const userProfilePicture = response.data.data.profilePicture;
                    // const userEmail = response.data.data.email;
                    // const emailWithoutDomain = userEmail.split('@')[0];
                    // setEmail(emailWithoutDomain);
                    setProfilePicture(userProfilePicture);
                    setFullName(response.data.data.fullName)
                    setRoles(response.data.data.roles.map(role => role.name));
                }
            } catch (error) {
                console.error('An error occurred during logout', error);
                
                // console.error('Error fetching user email:', error);
            }
        };

        fetchUserEmail();
    }, []);

    const isAdmin = roles.includes('Admin');

    return (
        <div className="sidebar-container">
          <style>
                    {`
                        .sidebar-container {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 200px; 
                            height: 100vh;
                            overflow-y: auto;
                            z-index: 1000; 
                            background-color: #343a40; 
                        }
                        .content-container {
                            margin-left: 220px;
                            padding: 20px;
                        }
                    `}
        </style>  
        <div className="bg-dark text-white vh-100 d-flex flex-column justify-content-between">
            <div className="p-3">
                <h4 className="text-center">BOOKSTORE</h4>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        {/* {profilePicture && <img src={profilePicture} alt="Profile" className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />} */}
                        <a className="nav-link mb-1"><img src={profilePicture} alt="Profile" className="rounded-circle me-2" style={{ width: '25px', height: '25px' }}/><Link to="/administrators" className='text-white '>{fullName}</Link></a>
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
                    <li className="nav-item">
                        <a className="nav-link text-white d-flex justify-content-between align-items-center" href="#" onClick={toggleInventMenu}>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backpack" viewBox="0 0 16 16">
                            <path d="M4.04 7.43a4 4 0 0 1 7.92 0 .5.5 0 1 1-.99.14 3 3 0 0 0-5.94 0 .5.5 0 1 1-.99-.14M4 9.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm1 .5v3h6v-3h-1v.5a.5.5 0 0 1-1 0V10z"/>
                            <path d="M6 2.341V2a2 2 0 1 1 4 0v.341c2.33.824 4 3.047 4 5.659v5.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5V8a6 6 0 0 1 4-5.659M7 2v.083a6 6 0 0 1 2 0V2a1 1 0 0 0-2 0m1 1a5 5 0 0 0-5 5v5.5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5V8a5 5 0 0 0-5-5"/>
                            </svg> Inventory</span>
                            <span>{InventoryMenu ? <FaChevronUp /> : <FaChevronDown />}</span>
                        </a>
                        <div className={`collapse ${InventoryMenu ? 'show' : ''}`}>
                            <ul className="nav flex-column ms-3">
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/inventory">Inventory Management</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="#">Add Product</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white d-flex justify-content-between align-items-center" href="#" onClick={toggleItemOrderMenu}>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                            </svg> Item Order</span>
                            <span>{ItemOrderMenu ? <FaChevronUp /> : <FaChevronDown />}</span>
                        </a>
                        <div className={`collapse ${ItemOrderMenu ? 'show' : ''}`}>
                            <ul className="nav flex-column ms-3">
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/daftorder">Daft</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/ontheway">On The Way</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="#">Completed</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-link text-white d-flex align-items-center" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2"/>Logout
                    </li>
                </ul>
            </div>
            <div className="p-3">
                {/* <p className="mb-1">Hello, <Link to="/administrators">{email}</Link></p> */}
            </div>
        </div>
    </div>
    );
};


export default Sidebar;
