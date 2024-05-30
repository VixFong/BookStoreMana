import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';
import {Link} from "react-router-dom";

export const Sidebar = () => {
    const [UserMenu, setUserMenu] = useState(false);

    const toggleUserMenu = () => {
        setUserMenu(!UserMenu);
    };
    return (
        <div className="bg-dark text-white vh-100">
            <div className="p-3">
                <h4 className="text-center">BOOKSTORE</h4>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Main Page</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white d-flex justify-content-between align-items-center" href="#" onClick={toggleUserMenu}>
                            <span><FaUser /> User</span>
                            <span>{UserMenu ? <FaChevronUp /> : <FaChevronDown />}</span>
                        </a>
                        <div className={`collapse ${UserMenu ? 'show' : ''}`}>
                            <ul className="nav flex-column ms-3">
                                <li className="nav-item">
                                    <a className="nav-link text-white"><Link to ="/UserManagement">User Management</Link></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white"><Link to ="/add">Add New User</Link></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="#">Administrators</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Category</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Product</a>
                    </li>
                </ul>
            </div>
            <div className="p-3">
                <a className="nav-link text-white d-flex align-items-center" href="/">
                    <FaSignOutAlt className="me-2" /> Log Out
                </a>
            </div>
        </div>
    );
};

export default Sidebar;