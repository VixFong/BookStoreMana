import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './SideBar';
import {Link} from "react-router-dom";

const users = [
    { id: 1, name: 'Admin', email: 'admin@gmail.com', date: '29-05-2024', role: 'Quản Trị Viên', locked: false, imgSrc: '/Henry.jpg' }
];

export const UserManagement = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-3">
                <h4 className="mb-3">User Management</h4>
                <button className="btn btn-danger mb-3"><Link to ="/add"><a className='text-light'>Add New User +</a></Link> </button>
                <style>
                    {`
                        .table-bordered th, .table-bordered td{
                            border: 1px solid #dee2e6
                        }
                        .table th, .table td{
                            vertical-align: middle;
                            text-align: center;
                        }
                        .form-switch {
                            display: flex,
                            align-items: center;
                            justify-content: center;
                            padding-left: 50px;
                            height: 100%;
                        }
                    `}
                </style>
                <table className="table table-striped table-bordered" border={1} >
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
                                    <img src={user.imgSrc} alt={user.name} className="rounded-circle"style={{ width: '100px', height: '100px' }} />
                                </td>
                                <td className="text-center align-middle">{user.name}</td>
                                <td className="text-center align-middle">{user.email}</td>
                                <td className="text-center align-middle">{user.date}</td>
                                <td className="text-center align-middle">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" checked={user.locked} onChange={() => {}} />
                                    </div>
                                </td>
                                <td className="text-center align-middle">{user.activated ? '' : 'x'}</td>
                                <td className="text-center align-middle">{user.role}</td>
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