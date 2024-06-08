import React, { useState } from 'react';
import { Button, Table, Form, Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const ProductManagement = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            image: 'https://via.placeholder.com/50',
            author: 'Henry',
            name: 'TheLastSister',
            type: 'Romance',
            originalPrice: '249,000đ',
            discount: '23$',
            flashSale: false,
        },
        {
            id: 1,
            image: 'https://via.placeholder.com/50',
            author: 'Henry',
            name: 'TheLastSister',
            type: 'Romance',
            originalPrice: '23$',
            discount: '15%',
            flashSale: false,
        },
    ]);

    const handleEdit = (id) => {
        // Handle edit logic
        console.log(`Edit product with ID: ${id}`);
    };

    const handleDelete = (id) => {
        // Handle delete logic
        console.log(`Delete product with ID: ${id}`);
    };

    const handleFlashSaleToggle = (id) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, flashSale: !product.flashSale } : product
        ));
    };

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleAddProduct = () => {
        setShowAddProduct(false);
        setNewProductName('');
        setShowToast(true);
    };

    return (
        <div className="container-fluid mt-5 product-management">
            <style>
                {`
                .product-management {
                    background: #f9f9f9;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }
                .product-table th, .product-table td {
                    padding: 1rem;
                    vertical-align: middle;
                }
                .product-table th {
                    background-color: #007bff;
                    color: white;
                    text-align: center;
                }
                .product-table td {
                    text-align: center;
                }
                .product-table td:first-child {
                    text-align: center;
                }
                .product-table .btn {
                    margin-right: 5px;
                }
                .product-management h4 {
                    text-align: left;
                    color: #000000;
                    margin-bottom: 20px;
                }
                .product-management .btn-danger {
                    background-color: #ff4d4f;
                    border-color: #ff4d4f;
                }
                `}
            </style>
            <h4>Product Management</h4>
            <div className="mb-3">
                <Button variant="danger" onClick={() => setShowAddProduct(!showAddProduct)}>
                    <Link to='/addproduct' className='text-light'>
                    Add New Product +
                    </Link>
                </Button>
            </div>
            <div className="table-responsive">
                <Table striped bordered hover className="product-table w-100">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Author</th>
                            <th>Books Name</th>
                            <th>Category</th>
                            <th>Original Price</th>
                            <th>Sales</th>
                            <th>Flash Sale</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.id}>
                                <td><img src={product.image} alt={product.name} className="img-fluid" /></td>
                                <td>{product.author}</td>
                                <td>{product.name}</td>
                                <td>{product.type}</td>
                                <td>{product.originalPrice}</td>
                                <td>{product.discount}</td>
                                <td>
                                    <Form.Check
                                        type="switch"
                                        id={`flash-sale-${product.id}`}
                                        checked={product.flashSale}
                                        onChange={() => handleFlashSaleToggle(product.id)}
                                    />
                                </td>
                                <td>
                                    <Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={() => handleEdit(product.id)}
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <FaTrashAlt />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default ProductManagement;