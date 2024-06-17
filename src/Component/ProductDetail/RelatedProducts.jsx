import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHeart, FaExchangeAlt } from 'react-icons/fa';

const relatedProducts = [
    {
        image: 'https://via.placeholder.com/150',
        category: 'KINDLE',
        title: 'Zombie Theorem: Dark Times Book Five',
        author: 'James Wallace',
        price: '$2.68',
    },
    {
        image: 'https://via.placeholder.com/150',
        category: 'KINDLE',
        title: 'Blindside (Michael Bennett Book 12)',
        author: 'James Patterson',
        price: '$15.99',
    },
    {
        image: 'https://via.placeholder.com/150',
        category: 'HARDCOVER, KINDLE, PAPERBACK',
        title: 'Verity',
        author: 'Colleen Hoover',
        price: '$29.95 - $59.95',
    },
    {
        image: 'https://via.placeholder.com/150',
        category: 'HARDCOVER',
        title: 'All You Can Ever Know: A Memoir',
        author: 'J. D. Robb',
        price: '$14.20',
    },
    {
        image: 'https://via.placeholder.com/150',
        category: 'HARDCOVER, KINDLE, PAPERBACK',
        title: 'The Lost Colony (The Long Winter Trilogy Book 3)',
        author: 'A G Riddle',
        price: '$29.95 - $59.95',
    },
    {
        image: 'https://via.placeholder.com/150',
        category: 'KINDLE',
        title: 'New Book Title',
        author: 'New Author',
        price: '$19.99',
    },
];

const RelatedProducts = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    return (
        <div className="related-products-wrapper">
            <div className="related-products-container">
                <style>
                    {`
                    .related-products-wrapper {
                        display: flex;
                        justify-content: center;
                        margin-left: 150px;
                        margin-top: 50px;
                        padding-bottom: 60px;
                    }

                    .related-products-container {
                        width: 90%;
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    .related-product-card {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        padding: 10px;
                        text-align: center;
                        box-sizing: border-box;
                        transition: transform 0.3s, box-shadow 0.3s;
                    }

                    .related-product-card:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                    }

                    .related-product-card img {
                        max-width: 100%;
                        max-height: 150px;
                        object-fit: cover;
                        border-radius: 5px;
                        margin-bottom: 10px;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .related-product-card .card-body {
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        height: 100%;
                    }

                    .related-product-card .btn {
                        display: inline-block;
                        margin-top: 10px;
                    }

                    .related-product-card .fa-heart, .related-product-card .fa-exchange-alt {
                        cursor: pointer;
                    }
                    `}
                </style>
                <h3>Related products</h3>
                <Slider {...settings}>
                    {relatedProducts.map((product, index) => (
                        <div className="related-product-card card" key={index}>
                            <img src={product.image} alt={`Product ${index}`} />
                            <div className="card-body">
                                <p className="text-danger mb-3">{product.category}</p>
                                <h5 className="card-title">{product.title}</h5>
                                <p className="text-muted">{product.author}</p>
                                <p className="card-text">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: 'block', background: 'black' }}
            onClick={onClick}
        />
    );
}

const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: 'block', background: 'black' }}
            onClick={onClick}
        />
    );
}

export default RelatedProducts;