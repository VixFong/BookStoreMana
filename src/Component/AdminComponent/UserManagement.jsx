import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './SideBar';

const users = [
    { id: 1, name: 'Admin', email: 'admin@gmail.com', date: '29-05-2024', role: 'Quản Trị Viên', locked: false, imgSrc: '/Henry.jpg' }
];

export const UserManagement = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-3">
                <h4 className="mb-3">Quản Lý Người Dùng</h4>
                <button className="btn btn-danger mb-3">Thêm Người Dùng Mới +</button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Pic</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created Date</th>
                            <th>Blocked</th>
                            <th>Authorization</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={user.imgSrc} alt={user.name} style={{ width: '50px', height: '50px' }} />
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.date}</td>
                                <td>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" checked={user.locked} onChange={() => {}} />
                                    </div>
                                </td>
                                <td>{user.role}</td>
                                <td>
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