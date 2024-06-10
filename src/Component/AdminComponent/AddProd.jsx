import React, { useState, useEffect } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

import Select from 'react-select';
export const AddProd = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [discount, setDiscount] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [variants, setVariants] = useState([{ color: '', size: '', quantity: '' }]);
    const [description, setDescription] = useState('');

    const [categoryOptions, setCategoryOptions] = useState([]);

    const token =  localStorage.getItem('authToken');
    useEffect(() => {
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
                console.error('There was an error fetching the categories!', error);
            }
        };

        fetchCategories();
    }, []);    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({
            title,
            price,
            category,
            discount,
            images,
            variants,
            description,
        });
        const formData = new FormData();
        formData.append('title', title);
        formData.append('categories', category);
        formData.append('price', price);
        formData.append('discount', discount);
        formData.append('description', description);
        images.forEach((image) => {
            formData.append('files', image);
        });
        try {
            const response = await axios.post('api/products/books', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log('Book added successfully:', response.data);
        } catch (error) {
            console.error('There was an error adding the book!', error);
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
                        <Button type="submit" className="btn btn-primary">Thêm</Button>
                        <Button type="button" variant="secondary">Hủy</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AddProd;
// import React, { useState, useEffect } from 'react';
// import { Button, Form, Col, Row } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { FaTimes } from 'react-icons/fa';
// import axios from 'axios';
// import Select from 'react-select';

// export const AddProd = () => {
//     const [productName, setProductName] = useState('');
//     const [price, setPrice] = useState('');
//     const [category, setCategory] = useState([]);
//     const [discount, setDiscount] = useState('');
//     const [images, setImages] = useState([]);
//     const [imagePreviews, setImagePreviews] = useState([]);
//     const [variants, setVariants] = useState([{ color: '', size: '', quantity: '' }]);
//     const [description, setDescription] = useState('');
//     const [categoryOptions, setCategoryOptions] = useState([]);

//     const [selectedCategories, setSelectedCategories] = useState([]);

//     const token =  localStorage.getItem('authToken');
//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await axios.get('/api/products/categories', {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 const options = response.data.data.map(category => ({
//                     value: category.id,
//                     label: category.category,
//                 }));
//                 setCategoryOptions(options);
//             } catch (error) {
//                 console.error('There was an error fetching the categories!', error);
//             }
//         };

//         fetchCategories();
//     }, []);

//     const handleCategorySelect = (categoryId) => {
//         setSelectedCategories((prevSelected) =>
//             prevSelected.includes(categoryId)
//                 ? prevSelected.filter((id) => id !== categoryId)
//                 : [...prevSelected, categoryId]
//         );
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log({
//             productName,
//             price,
//             category,
//             discount,
//             images,
//             variants,
//             description,
//         });
//     };
    

//     const handleImageChange = (e) => {
//         if (e.target.files) {
//             const files = Array.from(e.target.files).slice(0, 8);
//             const newImages = [...images, ...files];
//             setImages(newImages);
//             const filePreviews = newImages.map(file => URL.createObjectURL(file));
//             setImagePreviews(filePreviews);
//         }
//     };

//     const handleDeleteImage = (index) => {
//         const newImages = images.filter((_, i) => i !== index);
//         const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
//         setImages(newImages);
//         setImagePreviews(newImagePreviews);
//     };

//     const handleVariantChange = (index, field, value) => {
//         const newVariants = [...variants];
//         newVariants[index][field] = value;
//         setVariants(newVariants);
//     };

//     const handleAddVariant = () => {
//         setVariants([...variants, { color: '', size: '', quantity: '' }]);
//     };

//     const handleDeleteVariant = (index) => {
//         const newVariants = variants.filter((_, i) => i !== index);
//         setVariants(newVariants);
//     };

//     return (
//         <div className="container mt-5">
//             <style>
//                 {`
//                 .add-product-container {
//                     max-width: 1000px;
//                     background: #f7f7f7;
//                     margin-left: 400px;
//                     padding: 30px;
//                     border-radius: 10px;
//                     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//                 }
//                 .add-product-title {
//                     text-align: center;
//                     margin-bottom: 20px;
//                     color: #333;
//                 }
//                 .btn-primary, .btn-secondary {
//                     width: 100px;
//                     margin-right: 10px;
//                 }
//                 .image-preview {
//                     display: flex;
//                     gap: 10px;
//                     margin-top: 10px;
//                     flex-wrap: wrap;
//                 }
//                 .image-preview img {
//                     width: 100px;
//                     height: 100px;
//                     object-fit: cover;
//                     border: 1px solid #ddd;
//                     border-radius: 5px;
//                     position: relative;
//                 }
//                 .image-preview .delete-button {
//                     position: absolute;
//                     top: -5px;
//                     right: -5px;
//                     background: rgba(255, 255, 255, 0.7);
//                     border: none;
//                     cursor: pointer;
//                     border-radius: 50%;
//                     width: 20px;
//                     height: 20px;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     padding: 0;
//                 }
//                 .delete-button svg {
//                     width: 12px;
//                     height: 12px;
//                 }
//                 .delete-button {
//                     margin-top: 32px;
//                     margin-left: 10px;
//                 }

//                  .category-tag {
//                     display: inline-block;
//                     padding: 5px 10px;
//                     margin: 5px;
//                     border: 1px solid #ddd;
//                     border-radius: 5px;
//                     cursor: pointer;
//                     background-color: #f7f7f7;
//                 }
//                 .category-tag.selected {
//                     background-color: #007bff;
//                     color: #fff;
//                 }
//                 `}
//             </style>
//             <div className="add-product-container">
//                 <h4 className="add-product-title">Add New Product</h4>
//                 <Form onSubmit={handleSubmit}>
//                     <Row>
//                         <Col md={6}>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Product Name</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     value={productName}
//                                     onChange={(e) => setProductName(e.target.value)}
//                                     required
//                                 />
//                             </Form.Group>
//                         </Col>
//                         <Col md={6}>
//                             {/* <Form.Group className="mb-3">
//                                 <Form.Label>Category</Form.Label>
//                                 <Select
//                                     options={categoryOptions}
//                                     isMulti
//                                     onChange={(selectedOptions) => setCategory(selectedOptions.map(option => option.value))}
//                                 />
//                             </Form.Group> */}
//                               <Form.Group className="mb-3">
//                                 <Form.Label>Category</Form.Label>
//                                 <div>
//                                     {category.map((cat) => (
//                                         <div
//                                             key={cat.id}
//                                             className={`category-tag ${
//                                                 selectedCategories.includes(cat.id) ? 'selected' : ''
//                                             }`}
//                                             onClick={() => handleCategorySelect(cat.id)}
//                                         >
//                                             {cat.category}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </Form.Group>
//                         </Col>
//                     </Row>
//                     <Row>
//                         <Col md={6}>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Price</Form.Label>
//                                 <Form.Control
//                                     type="number"
//                                     value={price}
//                                     onChange={(e) => setPrice(e.target.value)}
//                                     required
//                                 />
//                             </Form.Group>
//                         </Col>
//                         <Col md={6}>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Sales</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     value={discount}
//                                     onChange={(e) => setDiscount(e.target.value)}
//                                 />
//                             </Form.Group>
//                         </Col>
//                     </Row>
//                     <Row>
//                         <Col md={6}>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Picture</Form.Label>
//                                 <Form.Control
//                                     type="file"
//                                     onChange={handleImageChange}
//                                     multiple
//                                 />
//                                 <div className="image-preview">
//                                     {imagePreviews.map((src, index) => (
//                                         <div key={index} className="position-relative">
//                                             <img src={src} alt={`Preview ${index + 1}`} />
//                                             <button
//                                                 type="button"
//                                                 className="delete-button"
//                                                 onClick={() => handleDeleteImage(index)}
//                                             >
//                                                 <FaTimes />
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </Form.Group>
//                         </Col>
//                         <Col md={6}>
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Tùy Chọn Sản Phẩm</Form.Label>
//                                 <Form.Control as="select">
//                                     <option>Chọn</option>
//                                     <option value="Option 1">Option 1</option>
//                                     <option value="Option 2">Option 2</option>
//                                     <option value="Option 3">Option 3</option>
//                                 </Form.Control>
//                             </Form.Group>
//                         </Col>
//                     </Row>
//                     {variants.map((variant, index) => (
//                         <Row key={index}>
//                             <Col md={4}>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Book Format</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         value={variant.color}
//                                         onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
//                                     />
//                                 </Form.Group>
//                             </Col>
//                             <Col md={3}>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>In-Stock</Form.Label>
//                                     <Form.Control
//                                         type="number"
//                                         value={variant.quantity}
//                                         onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
//                                     />
//                                 </Form.Group>
//                             </Col>
//                             <Col md={1} className="d-flex align-items-center">
//                                 <Button
//                                     variant="danger"
//                                     className="delete-button"
//                                     onClick={() => handleDeleteVariant(index)}
//                                 >
//                                     <FaTimes />
//                                 </Button>
//                             </Col>
//                         </Row>
//                     ))}
//                     <Button variant="danger" className="mb-3" onClick={handleAddVariant}>
//                         More +
//                     </Button>
//                     <Form.Group className="mb-3">
//                         <Form.Label>Description</Form.Label>
//                         <Form.Control
//                             as="textarea"
//                             rows={3}
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                         />
//                     </Form.Group>
//                     <div className="d-flex justify-content-center">
//                         <Button type="submit" className="btn btn-primary">Thêm</Button>
//                         <Button type="button" variant="secondary">Hủy</Button>
//                     </div>
//                 </Form>
//             </div>
//         </div>
//     );
// };

// export default AddProd;
