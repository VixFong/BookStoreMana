import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner, Container, Row, Col, Card, Dropdown, Form, Button, Accordion } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';

export const Shop = ({ searchKeyword }) => {

    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [error, setError] = useState('');
    const [keyword, setKeyword] = useState('');

    const [categories, setCategories] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [authors, setAuthors] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    
    const [sortOption, setSortOption] = useState('Default sorting');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedPublishers, setSelectedPublishers] = useState([]);

    const [priceRange, setPriceRange] = useState(70);

    const location = useLocation();

    useEffect(() => {
        fetchCategories();
        fetchAuthors();
        fetchPublishers();
    }, []);

    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchKeyword = queryParams.get('keyword');
        if (searchKeyword) {
            setKeyword(searchKeyword);
        }
    }, [location.search]);

    useEffect(() => {
        fetchBooks(sortOption);
    }, [page, selectedCategories, selectedAuthors, selectedPublishers, sortOption, keyword]);

    const fetchCategories = async () => {
        try {
            setShowModal(true);
            const response = await axios.get('/api/products/categories', {});
            setCategories(response.data.data); 
            setShowModal(false);
        } catch (error) {
            setShowModal(false);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const fetchAuthors = async () => {
        try {
            setShowModal(true);
            const response = await axios.get('/api/products/authors', {});
            setAuthors(response.data.data); 
            setShowModal(false);
        } catch (error) {
            setShowModal(false);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const fetchPublishers = async () => {
        try {
            setShowModal(true);

            const response = await axios.get('/api/products/publishers/publisherData', {});
            // console.log(response);
            setPublishers(response.data.data); 
            setShowModal(false);
        } catch (error) {
            setShowModal(false);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

    const fetchBooks = async (sortOption) => {
        let sortField = "title";
        let sortDirection = "asc";
        if (sortOption === "Sort by price: low to high") {
            sortField = "price";
            sortDirection = "asc";
        } else if (sortOption === "Sort by price: high to low") {
            sortField = "price";
            sortDirection = "desc";
        }
        // console.log('price ',priceRange);
        // console.log('key ',searchKeyword);
        
        try {
            setShowModal(true);
            const response = await axios.get('/api/products/books/search_client', {
                params: {
                    keyword: searchKeyword,
                    page, 
                    size,
                    sortField, 
                    sortDirection,
                    categories: selectedCategories.length > 0 ? selectedCategories : null,
                    authors: selectedAuthors.length > 0 ? selectedAuthors : null,
                    publishers: selectedPublishers.length > 0 ? selectedPublishers : null,
                    maxPrice: priceRange
                },
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: 'repeat' });
                }
            });

            
            const productData = response.data.data.content;
            // console.log('product data ', productData);

          
            const bookIds = productData.map(item => item.bookId);
            // console.log('bookIds ', bookIds);

            const inventoryResponse = await axios.post(`/api/inventory/stock`,{
                bookId: bookIds
            })

            const inventoryData = inventoryResponse.data.data;
            // console.log('inventory data ', inventoryData);

            const updatedProduct = productData.map(item => {
                const inventoryItem = inventoryData.find(inventory => inventory.bookId === item.bookId);
    
                return {
                    bookId: item.bookId,
                    title: item ? item.title : '',
                    price: item ? item.price : 0,
                    discount: item ? item.discount : 0,
                    image: item ? item.image : '',
                    priceDiscount: item ? item.priceDiscount : 0,
                    receivedQuantity: inventoryItem ? inventoryItem.receivedQuantity : 0
                };
            });
         

            // setProducts(response.data.data.content);
            setProducts(updatedProduct);
            setTotalPages(response.data.data.totalPages);
            setTotalElements(response.data.data.totalElements);
            setShowModal(false);
        } catch (error) {
            setShowModal(false);
            setError(error.response?.data?.message);
            setShowErrorModal(true);
        }
    };

   


    const handleSortChange = (eventKey) => {
        setSortOption(eventKey);
        fetchBooks(eventKey);
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((cat) => cat !== categoryId)
                : [...prev, categoryId]    
        );
    };

    const handleAuthorChange = (author) => {
        setSelectedAuthors((prev) =>
            prev.includes(author)
                ? prev.filter((auth) => auth !== author)
                : [...prev, author]
        );
    };

    const handlePublisherChange = (publisher) => {
        setSelectedPublishers((prev) =>
            prev.includes(publisher)
                ? prev.filter((pub) => pub !== publisher)
                : [...prev, publisher]
        );
    };

    const handlePriceChange = (e) => {
        setPriceRange(e.target.value);
    };

    const handleFilterClick = () => {
        fetchBooks(sortOption);
    };

    const handleAddItemToCart = async(bookId, image, title, price) =>{
        setShowModal(true);
        const token =  localStorage.getItem('authToken');
        if(token == null){
            setShowModal(false); 
            // console.log(error);
            setError('Login first!!!');
            setShowErrorModal(true);
        }
        try {

            const response = await axios.post('/api/identity/auth/introspect', { token });
            const isValid = response.data.data.valid;
            console.log('valid', isValid);
            if(isValid){
                await axios.post('/api/cart/items',{
                    bookId,
                    image,
                    title,
                    price
                },{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const event = new CustomEvent('updateCart');
                window.dispatchEvent(event);
                // console.log(response.data);
            }
            else{
                setShowModal(false);
                setError("Login first!");
                setShowErrorModal(true);
                
            }
            setShowModal(false);
            
        } catch (error) {
            // setError(error.response?.data?.message || 'An error occurred');
            setShowModal(false); 
            console.log(error);
            setError(error);
            setShowErrorModal(true);

        }
        // try {
        //     const response = await axios.post('/api/cart/item',{
        //         image,
        //         title,
        //         price
        //     },{
        //         headers: {
        //             Authorization: `Bearer ${token}`
        //         }
        //     })
        //     console.log(response.data.data);
        // } catch (error) {
        //     console.log(error);
        // }
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col md={3}>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Categories</Accordion.Header>
                            <Accordion.Body>
                                {categories.map((category, index) => (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        label={category.category}
                                        onChange={() => handleCategoryChange(category.id)}
                                    />
                                ))} 
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Author</Accordion.Header>
                            <Accordion.Body>
                                {authors.map((author, index) => (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        label={author.authorName}
                                        onChange={() => handleAuthorChange(author.id)}
                                    />
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Publisher</Accordion.Header>
                            <Accordion.Body>
                                {publishers.map((publisher, index) => (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        label={publisher.name}
                                        onChange={() => handlePublisherChange(publisher.id)}
                                    />
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Filter by price</Accordion.Header>
                            <Accordion.Body>
                                <Form.Range
                                    min={0}
                                    max={70}
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                />
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <Button variant="danger" onClick={handleFilterClick} >Filter</Button>
                                    <span>Price: ${0} — ${priceRange}</span>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
                <Col md={9}>
                    <Row className="mb-3">
                        <Col>
                            <span>Showing all {totalElements} results</span>
                        </Col>
                        <Col className="text-end">
                            <Dropdown onSelect={handleSortChange}>
                                <Dropdown.Toggle variant="light" id="dropdown-basic">
                                    {sortOption}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="Default sorting">Default sorting</Dropdown.Item>
                                    <Dropdown.Item eventKey="Sort by price: low to high">Sort by price: low to high</Dropdown.Item>
                                    <Dropdown.Item eventKey="Sort by price: high to low">Sort by price: high to low</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Row>
                        {products.map((product, index) => (
                            <Col md={3} className="mb-4" key={index}>
                                <Card className="h-100">
                                    <div className="position-relative">
                                        <Card.Img variant="top" src={product.image} />
                                        {product.discount > 0 && (
                                            <div className="sale-tag position-absolute top-0 end-0 bg-danger text-white p-1">
                                                {product.discount}%
                                            </div>
                                        )}
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{product.title}</Card.Title>
                                        <Card.Text>
                                            {product.priceDiscount > 0 ? (
                                                <div>
                                                    <strong style={{ textDecoration: 'line-through' }}>{product.price}$</strong>
                                                    <br />
                                                    <strong style={{ color: 'red' }}>{product.priceDiscount.toFixed(2)}$</strong>
                                                </div>
                                            ) : (
                                                <strong className="product-price">{product.price}$</strong>
                                            )}

                                        </Card.Text>
                                          {product.receivedQuantity > 0 && <Button variant="success" onClick={()=>handleAddItemToCart(product.bookId, product.image, product.title, product.priceDiscount > 0? product.priceDiscount: product.price)}>Add to Cart</Button>}  
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <div className="d-flex justify-content-between align-items-center">
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <li key={index} className={`page-item ${index === page ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(index)}>{index + 1}</button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </Col>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-3">Loading, Please Wait...</p>
                </Modal.Body>
            </Modal>
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Body className="text-center">
                    <div className="mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                        </div>
                        <h4>Error</h4>
                        <p>Something went wrong!</p>
                        <Button variant="danger" onClick={() => setShowErrorModal(false)}>Close</Button>
                    </Modal.Body>
                </Modal>
            <style>{`
                .card {
                    border: 0.5px solid transparent;
                    box-shadow: 0 0 15px rgba(0,0,0,0.1);
                    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
                }
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0 20px rgba(0,0,0,0.2);
                    border-color:black
                }
                .card-title {
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                }
                .card-text {
                    color: #999;
                }
                .product-format {
                    color: red;
                }
                .product-price {
                    color: black;
                }
                .image-container {
                    height: 250px; 
                    overflow: hidden;
                }
                .card-img-top {
                    height: 200px;
                    object-fit: cover;
                }
                .accordion-button:not(.collapsed) {
                    color: #000;
                    background-color: #fff;
                }
                .accordion-button {
                    padding: 0.75rem 1.25rem;
                }
                .accordion-header {
                    font-size: 1.1rem;
                }
                .btn-danger {
                    background-color: #ff4d4f;
                    border-color: #ff4d4f;
                }
                .btn-link {
                    color: #ff4d4f;
                }
                .page-link{
                    color: #000;
                }
                .active>.page-link, .page-link.active {
                    z-index: 3;
                    color: var(--bs-pagination-active-color);
                    background-color: #dc3545;
                    border-color: #dc3545;
                }
                .sale-tag {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background-color: #dc3545;
                    color: #fff;
                    padding: 0.25rem 0.5rem;
                    font-size: 0.9rem;
                    font-weight: bold;
                    border-radius: 0 0 0 5px;
                }
            `}</style>
        </Container>
    );
};

export default Shop;
