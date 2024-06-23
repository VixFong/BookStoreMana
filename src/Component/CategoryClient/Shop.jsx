import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Dropdown, Form, Button, Accordion } from 'react-bootstrap';
import axios from 'axios'

const filters = {
    categories: ['Arts & Photography', 'Baby', 'Biographies & Memoirs', 'Biography', 'Business & Money', 'BWafts', 'Children', 'Christian Books & Bibles'],
    authors: [
        { name: 'Anna Banks', count: 5 },
        { name: 'James Patterson', count: 3 },
        { name: 'John Grisham', count: 4 }
    ],
    formats: [
        { name: 'Hardcover', count: 10 },
        { name: 'Kindle', count: 12 },
        { name: 'Paperback', count: 12 }
    ],
    products: [
        {
            title: 'All You Can Ever Know: A Memoir',
            author: 'Anna Banks',
            price: '$29.95 - $59.95',
            image: 'https://via.placeholder.com/150',
            format: 'HARDCOVER, KINDLE, PAPERBACK'
        },
        {
            title: 'Blindside (Michael Bennett Book 12)',
            author: 'James Patterson',
            price: '$15.99',
            image: 'https://via.placeholder.com/150',
            format: 'KINDLE'
        },
        {
            title: 'Camino Winds',
            author: 'John Grisham',
            price: '$12.99',
            image: 'https://via.placeholder.com/150',
            format: 'PAPERBACK'
        },
        {
            title: 'Dark Matter: A Mind-Blowing Twisted Thriller',
            author: 'Blake Crouch',
            price: '$13.30',
            image: 'https://via.placeholder.com/150',
            format: 'PAPERBACK'
        }
    ]
};

export const Shop = () => {

    const [products, setProducts] = useState([]);


    const [page, setPage] = useState(0);
    const [size, setSize] = useState(4);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const [category, setCategory] = useState([])
    const [publisher, setPubliser] = useState([])
    const [author, setAuthor] = useState([])

    const [sortOption, setSortOption] = useState('Default sorting');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [priceRange, setPriceRange] = useState(70);


    // const token = localStorage.getItem("authToken");
    useEffect(() => {

        fetchBooks(page, size, search);

    }, [page, size, search, token]);

    


    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
        );
    };

    const handleAuthorChange = (author) => {
        setSelectedAuthors((prev) =>
            prev.includes(author)
                ? prev.filter((auth) => auth !== author)
                : [...prev, author]
        );
    };

    const handleFormatChange = (format) => {
        setSelectedFormats((prev) =>
            prev.includes(format)
                ? prev.filter((fmt) => fmt !== format)
                : [...prev, format]
        );
    };

    const handlePriceChange = (e) => {
        setPriceRange(e.target.value);
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={3}>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Categories</Accordion.Header>
                            <Accordion.Body>
                                {filters.categories.map((category, index) => (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        label={category}
                                        onChange={() => handleCategoryChange(category)}
                                    />
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Author</Accordion.Header>
                            <Accordion.Body>
                                {filters.authors.map((author, index) => (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        label={`${author.name} (${author.count})`}
                                        onChange={() => handleAuthorChange(author.name)}
                                    />
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Format</Accordion.Header>
                            <Accordion.Body>
                                {filters.formats.map((format, index) => (
                                    <Form.Check
                                        key={index}
                                        type="checkbox"
                                        label={`${format.name} (${format.count})`}
                                        onChange={() => handleFormatChange(format.name)}
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
                                    <Button variant="danger">Filter</Button>
                                    <span>Price: ${0} — ${priceRange}</span>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
                <Col md={9}>
                    <Row className="mb-3">
                        <Col>
                            <span>Showing all 20 results</span>
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
                        {filters.products.map((product, index) => (
                            <Col md={3} className="mb-4" key={index}>
                                <Card className="h-100">
                                    <Card.Img variant="top" src={product.image} />
                                    <Card.Body>
                                        <Card.Title>{product.title}</Card.Title>
                                        <Card.Text>
                                            <strong className="product-format">{product.format}</strong><br />
                                            {product.author}<br />
                                            <strong className="product-price">{product.price}</strong>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
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
            `}</style>
        </Container>
    );
};

export default Shop;