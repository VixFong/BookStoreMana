
// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Sidebar from './SideBar';
// import axios from 'axios';
// import { Link } from "react-router-dom";

// export const UserManagement = () => {
//     const [users, setUsers] = useState([]);
//     const [page, setPage] = useState(0);
//     const [size, setSize] = useState(5);
//     const [totalPages, setTotalPages] = useState(0);
   

//     const [error, setError] = useState('');
//     const [searchTerm, setSearchTerm] = useState('')

//     useEffect(() => {
//         fetchUsers(page, size);
//     }, [page, size]);

//     const fetchUsers = async (page, size) => {
//         const token = localStorage.getItem('authToken'); // Lấy token từ local storage
//         try {
//             const response = await axios.get('http://localhost:8888/identity/users', {
//                 params: { page, size}, 
//                 headers: {
//                     Authorization: `Bearer ${token}` // Thêm token vào header
//                 }
//             });
//             setUsers(response.data.data.content); // Đảm bảo lấy dữ liệu thực tế từ phản hồi
//             setTotalPages(response.data.data.totalPages); // Lấy tổng số trang từ phản hồi
//         } catch (error) {
//             setError(error.response?.data?.message);
//         }
//     };

//     // const searchUser = async() =>{
//     //     try {
//     //         const response = await axios.get('http://localhost:8888/search', {
//     //             params: { keyword: searchTerm },
//     //             headers: {
//     //                 Authorization: `Bearer ${token}`
//     //             }
//     //         });
//     //         setUsers(response.data.data); // Assuming response.data is directly the list of users
//     //     } catch (error) {
//     //         setError(error.response?.data?.message);
//     //     }
//     // }

//     const filterUsers = users.filter(user => 
//         user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     )

//     const toggleUserLock = async (userId, isLock) => {
//         const token = localStorage.getItem('authToken');
//         try {
//             const res = await axios.put(`http://localhost:8888/identity/users/${userId}/lock`, null, {
//                 params: { isLock },
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             if (res.data) {
//                 setUsers(users.map(user => user.id === userId ? { ...user, lock } : user));
//             }

//             // fetchUsers(page, size); // Refresh the user list
//         } catch (error) {
//             setError(error.response?.data?.message);
//         }
//     };
//     const handleLockChange = (user) => {
//         console.log(user.lock)
//         toggleUserLock(user.id, !user.lock);
//     };

//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     const handleNextPage = () => {
//         if (page < totalPages - 1) {
//             setPage(page + 1);
//         }
//     };

//     const handlePreviousPage = () => {
//         if (page > 0) {
//             setPage(page - 1);
//         }
//     };
//      // Xử lý sự kiện thay đổi nội dung của ô tìm kiếm
//     const handleSearchInputChange = (event) => {
//         const value = event.target.value;
//         setSearchTerm(value);
//         // Tự động tải lại dữ liệu người dùng khi người dùng nhập vào ô tìm kiếm
//         fetchUsers(0, size);
//     };


//     return (
//         <div className="d-flex">
//             <Sidebar />
//             <div className="flex-grow-1 p-3">
//                 <h4 className="mb-3">User Management</h4>
//                 <div className='d-flex justify-content-between mb-3'>
//                     <button className="btn btn-danger mb-3">
//                         <Link to="/add" className='text-light'>Add New User +</Link>
//                     </button>
//                     <input
//                         type='text'
//                         className='form-control w-25'
//                         placeholder='Search users...'
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>
//                 <style>
//                     {`
//                         .table-bordered th, .table-bordered td {
//                             border: 1px solid #dee2e6;
//                         }
//                         .table th, .table td {
//                             vertical-align: middle;
//                             text-align: center;
//                         }
//                         .form-switch {
//                             display: flex;
//                             align-items: center;
//                             justify-content: center;
//                             padding-left: 50px;
//                             height: 100%;
//                         }
//                     `}
//                 </style>
//                 {error && <p className="text-danger">{error}</p>}
//                 <table className="table table-striped table-bordered" border={1}>
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
//                         {/* {users.map((user) => ( */}
//                             {filterUsers.map((user) => (
//                             <tr key={user.id}>
//                                 <td className="text-center align-middle">
//                                     <img src={user.profilePicture} alt={user.fullName} className="rounded-circle" style={{ width: '100px', height: '100px' }} />
//                                 </td>
//                                 <td className="text-center align-middle">{user.fullName}</td>
//                                 <td className="text-center align-middle">{user.email}</td>
//                                 <td className="text-center align-middle">{user.startedDate}</td>
//                                 <td className="text-center align-middle">
//                                     <div className="form-check form-switch">
//                                         <input 
//                                             className="form-check-input" 
//                                             type="checkbox" 
//                                             checked={user.lock} 
//                                             onChange={() => handleLockChange(user)} />
//                                     </div>
//                                 </td>
//                                 <td className="text-center align-middle">{user.activate ? '' : 'x'}</td>
//                                 <td className="text-center align-middle">{user.roles.map(role => role.name).join(', ')}</td>
//                                 <td className="text-center align-middle">
//                                     <button className="btn btn-primary btn-sm me-2">Sửa</button>
//                                     <button className="btn btn-danger btn-sm">Xoá</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 <div className="d-flex justify-content-between align-items-center">
//                     <button className="btn btn-primary" onClick={handlePreviousPage} disabled={page === 0}>Previous</button>
//                     <nav>
//                         <ul className="pagination">
//                             {Array.from({ length: totalPages }, (_, index) => (
//                                 <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
//                                     <button className="page-link" onClick={() => handlePageChange(index)}>{index + 1}</button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </nav>
//                     <button className="btn btn-primary" onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button>
//                 </div>

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
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers(page, size);
    }, [page, size]);

    const fetchUsers = async (page, size) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://localhost:8888/identity/users', {
                params: { page, size },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const toggleUserLock = async (userId, isLock) => {
        console.log(userId, isLock)
        const token = localStorage.getItem('authToken');
        try {
            await axios.put(`http://localhost:8888/identity/users/${userId}/lock`, null, {
                params: { isLock },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("aaaa");
            // Update the local state immediately to reflect the change
            // setUsers(users.map(user => user.id === userId ? { ...user, lock } : user));
            fetchUsers(page, size);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const handleLockChange = (user) => {
        toggleUserLock(user.id, !user.lock);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleSearchInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        fetchUsers(0, size);
    };

    const filterUsers = users.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-3">
                <h4 className="mb-3">User Management</h4>
                <div className='d-flex justify-content-between mb-3'>
                    <button className="btn btn-danger mb-3">
                        <Link to="/add" className='text-light'>Add New User +</Link>
                    </button>
                    <input
                        type='text'
                        className='form-control w-25'
                        placeholder='Search users...'
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                    />
                </div>
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
                        {filterUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="text-center align-middle">
                                    <img src={user.profilePicture} alt={user.fullName} className="rounded-circle" style={{ width: '70px', height: '70px' }} />
                                </td>
                                <td className="text-center align-middle">{user.fullName}</td>
                                <td className="text-center align-middle">{user.email}</td>
                                <td className="text-center align-middle">{user.startedDate}</td>
                                <td className="text-center align-middle">
                                    <div className="form-check form-switch">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            checked={user.lock} 
                                            onChange={() => handleLockChange(user)} />
                                    </div>
                                </td>
                                <td className="text-center align-middle">{user.activate ? 'x' : ''}</td>
                                <td className="text-center align-middle">{user.roles.map(role => role.name).join(', ')}</td>
                                <td className="text-center align-middle">
                                    <button className="btn btn-primary btn-sm me-2">Edit</button>
                                    <button className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-between align-items-center">
                    <button className="btn btn-primary" onClick={handlePreviousPage} disabled={page === 0}>Previous</button>
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(index)}>{index + 1}</button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <button className="btn btn-primary" onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button>
                </div>
            </div>
        </div>
    );
};
export default UserManagement;
