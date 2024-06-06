// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { FaUser, FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';
// import {Link} from "react-router-dom";

// export const Sidebar = () => {
//     const [UserMenu, setUserMenu] = useState(false);

//     const toggleUserMenu = () => {
//         setUserMenu(!UserMenu);
//     };
//     return (
//         <div className="bg-dark text-white vh-100">
//             <div className="p-3">
//                 <h4 className="text-center">BOOKSTORE</h4>
//                 <ul className="nav flex-column">
//                     <li className="nav-item">
//                         <a className="nav-link text-white" href="#">Main Page</a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link text-white d-flex justify-content-between align-items-center" href="#" onClick={toggleUserMenu}>
//                             <span><FaUser /> User</span>
//                             <span>{UserMenu ? <FaChevronUp /> : <FaChevronDown />}</span>
//                         </a>
//                         <div className={`collapse ${UserMenu ? 'show' : ''}`}>
//                             <ul className="nav flex-column ms-3">
//                                 <li className="nav-item">
//                                     <a className="nav-link text-white"><Link to ="/UserManagement">User Management</Link></a>
//                                 </li>
//                                 <li className="nav-item">
//                                     <a className="nav-link text-white"><Link to ="/add">Add New User</Link></a>
//                                 </li>
//                                 <li className="nav-item">
//                                     <a className="nav-link text-white"><Link to ="/administrators">Administrators</Link></a>
//                                 </li>
//                             </ul>
//                         </div>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link text-white" href="#">Category</a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link text-white" href="#">Product</a>
//                     </li>
//                 </ul>
//             </div>
//             <div className="p-3">
//                 <a className="nav-link text-white d-flex align-items-center" href="/">
//                     <FaSignOutAlt className="me-2" /> Log Out
//                 </a>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaChevronDown, FaChevronUp, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export const Sidebar = () => {
    const [UserMenu, setUserMenu] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const toggleUserMenu = () => {
        setUserMenu(!UserMenu);
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('authToken');
        try {
            // Call the backend logout API
            const response = await axios.post('http://localhost:8888/identity/auth/logout', {
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
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get('http://localhost:8888/identity/users/info', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.code === 200) {
                    const userEmail = response.data.data.email;
                    const emailWithoutDomain = userEmail.split('@')[0];
                    setEmail(emailWithoutDomain);
                }
            } catch (error) {
                console.error('Error fetching user email:', error);
            }
        };

        fetchUserEmail();
    }, []);

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
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Category</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-white" href="#">Product</a>
                    </li>
                </ul>
            </div>
            <div className="p-3">
                <p className="mb-1">Hello, <Link to="/administrators">{email}</Link></p>
                <a className="nav-link text-white d-flex align-items-center"  onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Log Out
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
