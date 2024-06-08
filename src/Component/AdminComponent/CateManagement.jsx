import React, { useState } from 'react';
import { Button, Table, Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

export const CategoryManagement = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Science', productsCount: 0 },
        { id: 2, name: 'Romance', productsCount: 0 },
        { id: 3, name: 'Business & Money', productsCount: 5 },
        { id: 4, name: 'Biography', productsCount: 9 },
    ]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleAddCategory = () => {
        const newCategory = {
            id: categories.length + 1,
            name: newCategoryName,
            productsCount: 0,
        };
        setCategories([...categories, newCategory]);
        setShowAddCategory(false);
        setNewCategoryName('');
        setShowToast(true);
    };

    const handleEdit = (id) => {
        console.log(`Edit category with ID: ${id}`);
    };

    const handleDelete = (id) => {
        console.log(`Delete category with ID: ${id}`);
    };

    return (
        <div className="container-fluid mt-5 category-management">
            <style>
                {`
                .category-table th, .category-table td {
                    padding: 1rem;
                    vertical-align: middle;
                }
                .category-table th {
                    background-color: #007bff;
                    color: white;
                    text-align: center;
                }
                .category-table td {
                    text-align: center;
                }
                .category-table td:first-child {
                    text-align: center;
                }
                .category-table .btn {
                    margin-right: 5px;
                }
                .category-management h4 {
                    text-align: left;
                    color: #000000;
                    margin-bottom: 20px;
                }
                .category-management .btn-danger {
                    background-color: #ff4d4f;
                    border-color: #ff4d4f;
                }
                `}
            </style>
            <h4>Category Management</h4>
            <div className="mb-3">
                <Button variant="danger" onClick={() => setShowAddCategory(!showAddCategory)}>
                    Add Category +
                </Button>
            </div>
            {showAddCategory && (
                <div className="mb-3">
                    <h5>Category Name</h5>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Science, Romance, Sports..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button variant="danger" className="mt-2" onClick={handleAddCategory}>
                        Add
                    </Button>
                </div>
            )}
            <div className="table-responsive">
                <Table striped bordered hover className="category-table w-100">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Books</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={category.id}>
                                <td>{index + 1}</td>
                                <td>{category.name}</td>
                                <td>{category.productsCount}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={() => handleEdit(category.id)}
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        <FaTrashAlt />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>Adding successfully</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default CategoryManagement;