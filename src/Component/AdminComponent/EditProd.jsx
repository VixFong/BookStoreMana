import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Button, Form, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTimes } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

export const EditProd = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [customFields, setCustomFields] = useState([{ key: '', value: '' }]);
    
    const [description, setDescription] = useState('');

    const [categoryOptions, setCategoryOptions] = useState([]);
    const [publisherOptions, setPublisherOptions] = useState([]);
    const [authorOptions, setAuthorOptions] = useState([]);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPublishers, setSelectedPublishers] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState(null);

    const [info, setInfo] = useState({});


    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [error, setError] = useState('');

    const token = localStorage.getItem('authToken');
    const { bookId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
       
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/products/categories', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const options = response.data.data.map((category) => ({
                    value: category.id,
                    label: category.category
                }));
                return options;
                // setCategoryOptions(options);
            } catch (error) {
                setError(error.response?.data?.message || 'An error occurred');
                setShowErrorModal(true);
                return [];
            }
        };

        const fetchPublishers = async () => {
            try {
                const response = await axios.get('/api/products/publishers', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const options = response.data.data.map((publisher) => ({
                    value: publisher.id,
                    label: publisher.name
                }));
                return options;
                // setPublisherOptions(options);
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
                const options = response.data.data.map((author) => ({
                    value: author.id,
                    label: author.authorName
                }));
                return options;
                // setAuthorOptions(options);
            } catch (error) {
                console.error('There was an error fetching the authors!', error);
                return [];
            }
        };


        const fetchProduct = async () => {
            try {
                
                const response = await axios.get(`/api/products/books/${bookId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                return response.data.data;
                
                // setImages(product.images || []);
                // setImagePreviews(product.images ? product.images.map((image) => image) : []);
                
               
                // setSelectedPublishers(product.publishers.map((publisher) => ({ value: publisher.id, label: publisher.name })));
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || 'An error occurred');
                setShowErrorModal(true);
                return null;
            }
        };

        const fetchData = async () => {
            const [categories, publishers, authors, product] = await Promise.all([
                fetchCategories(),
                fetchPublishers(),
                fetchAuthors(),
                fetchProduct()
            ]);
            console.log(product)
            if (product) {
                setTitle(product.title);
                setPrice(product.price);
                setDiscount(product.discount);
                setDescription(product.description);
          
                setImages(product.images);
                setImagePreviews(product.images ? product.images.map((image) => image) : []);

                setCategoryOptions(categories);
                setPublisherOptions(publishers);
                setAuthorOptions(authors);

                setSelectedCategories(product.categories.map(categoryId => 
                    categories.find(category => category.value === categoryId)
                ));
                setSelectedPublishers(product.publishers.map(publisherId => 
                    publishers.find(publisherOption => publisherOption.value === publisherId)
                ));
                setSelectedAuthors(authors.find(author => author.value === product.author))
                setInfo(product.info || {});

                setCustomFields(Object.entries(product.info).map(([key, value]) => ({ key, value })));
            
            }

        };
            fetchData();
    
    }, [bookId, token]);


    // console.log('info',info)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);

        const categoryValues = selectedCategories.map(category => category.value).join(',');
        formData.append('categories', categoryValues);


        const publishersValues = selectedPublishers.map(publisher => publisher.value).join(',');
        formData.append('publishers', publishersValues);
        formData.append('author', selectedAuthors.value);
        formData.append('price', price);
        formData.append('discount', discount);
        formData.append('description', description);

        // console.log(selectedCategories.value);
        // console.log(selectedAuthors);
        
        // images.forEach((image) => {
        //     formData.append('files', image);
        // });

         // Thêm các URL hình ảnh hiện có vào formData
        imagePreviews.forEach((url, index) => {
            if (url.startsWith('http')) { // Kiểm tra xem đây có phải là URL hiện có hay không
                formData.append('imageUrls', url);
            }
        });

          // Thêm các tệp hình ảnh mới vào formData
        images.forEach((image) => {
            if (image instanceof File) {
                formData.append('files', image);
            }
        });

        const customFieldsObject = customFields.reduce((acc, field) => {
            if (field.key && field.value) {
                acc[field.key] = field.value;
            }
            return acc;
        }, {});
        formData.append('info', JSON.stringify(customFieldsObject));
        // for (let [key, value] of formData.entries()) {
        //     console.log(key, value);
        //   }
        // console.log(formData)

        try {
            setShowModal(true);
            const response = await axios.put(`/api/products/books/${bookId}`, formData, {
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
            console.log('Book updated successfully:', response.data);
        } catch (error) {
            setShowModal(false);
            console.log(error)
            setError(error.response?.data?.message || 'An error occurred');
            setShowErrorModal(true);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 8);
            const newImages = [...images, ...files];
            setImages(newImages);
            const filePreviews = newImages.map(file => { 
                // URL.createObjectURL(file)
                return file instanceof File ? URL.createObjectURL(file) : file;
               });
            setImagePreviews(filePreviews);
        }
    };


    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/product');
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

    // const handleCustomFieldChange = (index, field, value) => {
    //     const newCustomFields = [...customFields];
    //     newCustomFields[index][field] = value;
    //     setCustomFields(newCustomFields);
    // };

    const handleAddCustomField = () => {
        setCustomFields([...customFields, { key: '', value: '' }]);
    };

    const handleDeleteCustomField = (index) => {
        const newCustomFields = customFields.filter((_, i) => i !== index);
        setCustomFields(newCustomFields);
    };

    const handleCustomFieldChange = (index, field, value) => {
        const newCustomFields = [...customFields];
        newCustomFields[index][field] = value;
        setCustomFields(newCustomFields);
    };
    
    // Thêm hàm để xác định loại thay đổi và gọi hàm handleCustomFieldChange
    // const handleFieldChange = (index, type) => (e) => {
    //     console.log('index', index)
    //     console.log('key', type)
    //     // console.log('value', value)
        
    //     const { value } = e.target;

    //     if (type === 'key') {
    //         setEditingFieldKey(value); // Cập nhật giá trị cho key
    //         handleCustomFieldChange(index, 'key', value);
    //     } else {
    //         setEditingFieldValue(value); // Cập nhật giá trị cho value
    //         handleCustomFieldChange(index, 'value', value);
    //     }
    //     // const field = type === 'key' ? 'key' : 'value';
    //     // console.log(field)
    //     // handleCustomFieldChange(index, field, value);
    // };
   
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
                    background-color: red;
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
                .delete-button svg {
                    width: 12px;
                    height: 12px;
                }
                `}
            </style>
            <div className="add-product-container">
                <h4 className="add-product-title">Edit Product</h4>
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
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Select
                                    options={categoryOptions}
                                    value={selectedCategories}
                                    onChange={(selectedOptions) => setSelectedCategories(selectedOptions)}
                                    // onChange={(selectedOptions) => setCategory(selectedOptions.map(option => option.value))}
                                    
                                    isLoading={!categoryOptions.length}
                                    isMulti
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
                                    value={selectedPublishers}
                                    onChange={(selectedOptions) => setSelectedPublishers(selectedOptions)}
                                    
                                    isLoading={!publisherOptions.length}
                                    isMulti
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Author</Form.Label>
                                <Select
                                    options={authorOptions}
                              
                                    value={selectedAuthors}
                                    onChange={(selectedOptions) => setSelectedAuthors(selectedOptions)}
                                    isLoading={!authorOptions.length}
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
                        {/* <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tùy Chọn Sản Phẩm</Form.Label>
                                <Form.Control as="select">
                                    <option>Chọn</option>
                                    <option value="Option 1">Option 1</option>
                                    <option value="Option 2">Option 2</option>
                                    <option value="Option 3">Option 3</option>
                                </Form.Control>
                            </Form.Group>
                        </Col> */}
                    </Row>
                    <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Custom Fields</Form.Label>
                            {customFields.map((field, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <Row>
                                        <Col md={5}>
                                            <Form.Control
                                          
                                                type="text"
                                                placeholder="Key"
                                                value={field.key}
                                                onChange={(e) =>handleCustomFieldChange(index, 'key',  e.target.value)}
                                            />
                                        </Col>
                                        <Col md={5}>
                                            <Form.Control
                                        
                                                type="text"
                                                placeholder="Value"
                                                value={field.value}
                                                onChange={(e) =>handleCustomFieldChange(index, 'value', e.target.value)}
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Button variant="danger" onClick={() => handleDeleteCustomField(index)}>
                                            <i className="fas fa-trash-alt"></i>

                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={handleAddCustomField}>
                                More
                            </Button>
                        </Form.Group>
                    </Col>
                    </Row>
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
                        <Button type="submit" className="btn btn-danger">Update</Button>
                        <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
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
                    <h4>Update Successfully</h4>
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

export default EditProd;