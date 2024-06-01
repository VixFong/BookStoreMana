// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Sidebar from './SideBar';
// import {Link} from "react-router-dom";

// const users = [
//     { id: 1, name: 'Admin', email: 'admin@gmail.com', date: '29-05-2024', role: 'Quản Trị Viên', locked: false, imgSrc: '/Henry.jpg' }
// ];

// export const UserManagement = () => {
//     return (
//         <div className="d-flex">
//             <Sidebar />
//             <div className="flex-grow-1 p-3">
//                 <h4 className="mb-3">User Management</h4>
//                 <button className="btn btn-danger mb-3"><Link to ="/add"><a className='text-light'>Add New User +</a></Link> </button>
//                 <style>
//                     {`
//                         .table-bordered th, .table-bordered td{
//                             border: 1px solid #dee2e6
//                         }
//                         .table th, .table td{
//                             vertical-align: middle;
//                             text-align: center;
//                         }
//                         .form-switch {
//                             display: flex,
//                             align-items: center;
//                             justify-content: center;
//                             padding-left: 50px;
//                             height: 100%;
//                         }
//                     `}
//                 </style>
//                 <table className="table table-striped table-bordered" border={1} >
//                     <thead>
//                         <tr className='text-center align-middle'>
//                             <th>Pic</th>
//                             <th>Name</th>
//                             <th>Email</th>
//                             <th>Created Date</th>
//                             <th>Blocked</th>
//                             <th>Activated</th>
//                             <th>Role</th>
//                             <th>Operation</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map((user, index) => (
//                             <tr key={user.id}>
//                                 <td className="text-center align-middle">
//                                     <img src={user.imgSrc} alt={user.name} className="rounded-circle"style={{ width: '100px', height: '100px' }} />
//                                 </td>
//                                 <td className="text-center align-middle">{user.name}</td>
//                                 <td className="text-center align-middle">{user.email}</td>
//                                 <td className="text-center align-middle">{user.date}</td>
//                                 <td className="text-center align-middle">
//                                     <div className="form-check form-switch">
//                                         <input className="form-check-input" type="checkbox" checked={user.locked} onChange={() => {}} />
//                                     </div>
//                                 </td>
//                                 <td className="text-center align-middle">{user.activated ? '' : 'x'}</td>
//                                 <td className="text-center align-middle">{user.role}</td>
//                                 <td className="text-center align-middle">
//                                     <button className="btn btn-primary btn-sm me-2">Sửa</button>
//                                     <button className="btn btn-danger btn-sm">Xoá</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default UserManagement;
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './SideBar';
import axios from 'axios';
import { Link } from "react-router-dom";

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('authToken'); // Lấy token từ local storage
            // console.log(token)
            try {
                const response = await axios.get('http://localhost:8888/identity/users', {
                    headers: {
                        Authorization: `Bearer ${token}` // Thêm token vào header
                    }
                });
                
                setUsers(response.data.data); // Đảm bảo lấy dữ liệu thực tế từ phản hồi
            } catch (error) {
                setError(error.response?.data?.message );
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-3">
                <h4 className="mb-3">User Management</h4>
                <button className="btn btn-danger mb-3">
                    <Link to="/add" className='text-light'>Add New User +</Link>
                </button>
                <style>
                    {`
                        .table-bordered th, .table-bordered td {
                            border: 1px solid #dee2e6;
                        }
                        .table th, .table td {
                            vertical-align: middle;
                            text-align: center;
                        }
                        .form-switch {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding-left: 50px;
                            height: 100%;
                        }
                    `}
                </style>
                {error && <p className="text-danger">{error}</p>}
                <table className="table table-striped table-bordered" border={1}>
                    <thead>
                        <tr className='text-center align-middle'>
                            <th>Pic</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created Date</th>
                            <th>Blocked</th>
                            <th>Activated</th>
                            <th>Role</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td className="text-center align-middle">
                                    <img src={user.profilePicture} alt={user.fullName} className="rounded-circle" style={{ width: '100px', height: '100px' }} />
                                </td>
                                <td className="text-center align-middle">{user.fullName}</td>
                                <td className="text-center align-middle">{user.email}</td>
                                <td className="text-center align-middle">{user.startedDate}</td>
                                <td className="text-center align-middle">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" checked={user.isLock} onChange={() => {}} />
                                    </div>
                                </td>
                                <td className="text-center align-middle">{user.activate ? '' : 'x'}</td>
                                <td className="text-center align-middle">{user.roles.map(role => role.name).join(', ')}</td>
                                <td className="text-center align-middle">
                                    <button className="btn btn-primary btn-sm me-2">Sửa</button>
                                    <button className="btn btn-danger btn-sm">Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
