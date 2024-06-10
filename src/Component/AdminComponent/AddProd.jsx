import React, { useState, useEffect } from 'react';
import {Modal, Spinner, Button, Form, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import Select from 'react-select';
export const AddProd = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    // const [author, setAuthor] = useState('');

    const [discount, setDiscount] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [variants, setVariants] = useState([{ color: '', size: '', quantity: '' }]);
    const [description, setDescription] = useState('');

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [publisherOptions, setPublisherOptions] = useState([])
    const [authorOptions, setAuthorOptions] = useState([]);

    const [selectedCategories, setSelectedCategories] = useState([]); 
    const [selectedPublishers, setSelectedPublishers] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [error, setError] = useState('');

    const token =  localStorage.getItem('authToken');

    const navigate = useNavigate();
    useEffect(() => {
        if(!token){
            navigate('/');
        }


        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/products/categories', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const options = response.data.data.map(category => ({
                    value: category.id,
                    label: category.category
                }));
                console.log(response.data.data)
                setCategoryOptions(options);
            } catch (error) {
                // console.error('There was an error fetching the categories!', error);
                // setShowModal(false);
                setError(error.response?.data?.message || 'An error occurred');
                setShowErrorModal(true);
            }
        };

        const fetchPublishers = async () => {
            try {
                const response = await axios.get('/api/products/publishers', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const options = response.data.data.map(publisher => ({
                    value: publisher.id,
                    label: publisher.name
                }));
                setPublisherOptions(options); // Set publisher options
            } catch (error) {
                console.error('There was an error fetching the publishers!', error);
            }
        };

        const fetchAuthors = async () => {
            try {
                const response = await axios.get('/api/products/authors', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const options = response.data.data.map(author => ({
                    value: author.id,
                    label: author.authorName
                }));
                setAuthorOptions(options); // Set author options
            } catch (error) {
                console.error('There was an error fetching the authors!', error);
            }
        };

        fetchCategories();
        fetchPublishers();
        fetchAuthors();
    }, []);  
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log({
        //     title,
        //     price,
        //     category,
        //     discount,
        //     images,
        //     variants,
        //     description,
        // });
        const formData = new FormData();
        formData.append('title', title);
        formData.append('categories', category);
        formData.append('publishers', selectedPublishers);
        formData.append('authors', selectedAuthors);
        formData.append('price', price);
        formData.append('discount', discount);
        formData.append('description', description);
        images.forEach((image) => {
            formData.append('files', image);
        });
        try {
            setShowModal(true); 
            const response = await axios.post('api/products/books', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            setShowModal(false); 
            setShowSuccessModal(true);
            setTimeout(() => {
            setShowSuccessModal(false);
            }, 1000);
            console.log('Book added successfully:', response.data);
        } catch (error) {
            setShowModal(false);
            setError(error.response?.data?.message || 'An error occurred');
            setShowErrorModal(true);
        }



    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 8);
            const newImages = [...images, ...files];
            setImages(newImages);
            const filePreviews = newImages.map(file => URL.createObjectURL(file));
            setImagePreviews(filePreviews);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        // navigate('/'); 
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const handleCancel = () => {
        navigate('/product');
    };

    const handleDeleteImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newImagePreviews);
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleAddVariant = () => {
        setVariants([...variants, { color: '', size: '', quantity: '' }]);
    };

    const handleDeleteVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    return (
        <div className="container mt-5">
            <style>
                {`
                .add-product-container {
                    max-width: 1000px;
                    background: #f7f7f7;
                    margin-left: 400px;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .add-product-title {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                }
                .btn-primary, .btn-secondary {
                    width: 100px;
                    margin-right: 10px;
                }
                .image-preview {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                    flex-wrap: wrap;
                }
                .image-preview img {
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    position: relative;
                }
                .image-preview .delete-button {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    // background: rgba(255, 255, 255, 0.7);
                    background-color: red; /* Màu đỏ */
                    border: none;
                    cursor: pointer;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    
                }

                // .delete-button {
                //    position: absolute;
                //     top: 0;
                //     right: 0;
                //     background-color: red; /* Màu đỏ */
                //     border: none;
                //     cursor: pointer;
                //     border-radius: 50%;
                //     width: 20px;
                //     height: 20px;
                //     display: flex;
                //     align-items: center;
                //     justify-content: center;
                //     padding: 0;
                //     z-index: 4; 
                // }
                .delete-button svg {
                    width: 12px;
                    height: 12px;
                     
                }
                .delete-button {
                    // margin-top: 32px;
                    // margin-left: 10px;
                }
                `}
            </style>
            <div className="add-product-container">
                <h4 className="add-product-title">Add New Product</h4>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            {/* <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />
                            </Form.Group> */}
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Select
                                    options={categoryOptions}
                                    isMulti
                                    onChange={(selectedOptions) => setCategory(selectedOptions.map(option => option.label))}
                                    required
                                
                                />
                            </Form.Group>
                        
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Publisher</Form.Label>
                                <Select
                                    options={publisherOptions}
                                    isMulti
                                    onChange={(selectedOptions) => setSelectedPublishers(selectedOptions.map(option => option.value))}
                                    // required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Author</Form.Label>
                                <Select
                                    options={authorOptions}
                                    isMulti
                                    onChange={(selectedOptions) => setSelectedAuthors(selectedOptions.map(option => option.value))}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Discount</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Picture</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                    multiple
                                />
                                <div className="image-preview">
                                    {imagePreviews.map((src, index) => (
                                        <div key={index} className="position-relative">
                                            <img src={src} alt={`Preview ${index + 1}`} />
                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() => handleDeleteImage(index)}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tùy Chọn Sản Phẩm</Form.Label>
                                <Form.Control as="select">
                                    <option>Chọn</option>
                                    <option value="Option 1">Option 1</option>
                                    <option value="Option 2">Option 2</option>
                                    <option value="Option 3">Option 3</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    {variants.map((variant, index) => (
                        <Row key={index}>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Book Format</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={variant.color}
                                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>In-Stock</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={variant.quantity}
                                        onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={1} className="d-flex align-items-center">
                                <Button
                                    variant="danger"
                                    className="delete-button"
                                    onClick={() => handleDeleteVariant(index)}
                                >
                                    <FaTimes />
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    <Button variant="danger" className="mb-3" onClick={handleAddVariant}>
                        More +
                    </Button>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button type="submit" className="btn btn-danger">Add</Button>
                        <Button type="button" variant="secondary"  onClick={handleCancel}>Cancel</Button>
                    </div>
                </Form>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Body className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3">Loading, Please Wait...</p>
                    </Modal.Body>
                </Modal>
                <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                    <Modal.Body className="text-center">
                        <div className="mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.97 4.03a.75.75 0 0 1 1.08 1.05L7.477 10.27a.75.75 0 0 1-1.08 0L4.97 8.82a.75.75 0 0 1 1.08-1.05l1.72 1.725z"/>
                            </svg>
                        </div>
                        <h4>Add Successfully</h4>
                        {/* <p>Please Check Your Email To Change The Password</p> */}
                        <Button variant="primary" onClick={handleCloseSuccessModal}>OK</Button>
                    </Modal.Body>
                </Modal>
                <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
                    <Modal.Body className="text-center">
                        <div className="mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        <h4>Error</h4>
                        <p>{error}</p>
                        <Button variant="danger" onClick={handleCloseErrorModal}>Close</Button>
                    </Modal.Body>
                </Modal>
        </div>
    );
};

export default AddProd;
