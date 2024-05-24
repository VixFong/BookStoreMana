import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';

const featuredBooks = [
    {
        title: "All You Can Ever Know: A Memoir",
        authors: "Conn Iggulden",
        formats: "HARDCOVER, KINDLE, PAPERBACK",
        price: "$29.59 – $59.95",
        imgSrc: "/TheLastSister.jpg"
    },
    {
        title: "All You Can Ever Know: A Memoir",
        authors: "J. D. Robb",
        formats: "HARDCOVER",
        price: "$14.20",
        imgSrc: "/ForeMan.jpg"
    },
    {
        title: "Ask Again, Yes: A Novel",
        authors: "Mary Beth Keane",
        formats: "PAPERBACK",
        price: "$11.51",
        imgSrc: "/ThinkLikeAMonk.jpg"
    },
    {
        title: "All You Can Ever Know: A Memoir",
        authors: "Conn Iggulden",
        formats: "HARDCOVER, KINDLE, PAPERBACK",
        price: "$29.59 – $59.95",
        imgSrc: "/TheLastSister.jpg"
    },
    {
        title: "All You Can Ever Know: A Memoir",
        authors: "J. D. Robb",
        formats: "HARDCOVER",
        price: "$14.20",
        imgSrc: "/ForeMan.jpg"
    },
    {
        title: "Ask Again, Yes: A Novel",
        authors: "Mary Beth Keane",
        formats: "PAPERBACK",
        price: "$11.51",
        imgSrc: "/ThinkLikeAMonk.jpg"
    },
    {
        title: "Broken Faith: Inside the Word of Faith...",
        authors: "Edward Lee",
        formats: "PAPERBACK",
        price: "$10.29",
        imgSrc: "/UnderAFireFly.jpg"
    }
];

const onSaleBooks = [
    {
        title: "Dark in Death: An Eve Dallas Novel (In Death...",
        authors: "J. D. Robb",
        formats: "HARDCOVER",
        price: "$14.20",
        imgSrc: "ZombieTheorem.jpg"
    },
    {
        title: "Eternity Springs: The McBrides of Texas Eve...",
        authors: "Emily March",
        formats: "PAPERBACK",
        price: "$6.99",
        imgSrc: "/TheLastSister.jpg"
    },
    {
        title: "Jesus: The God Who Knows Your Name",
        authors: "Max Lucado",
        formats: "HARDCOVER",
        price: "$16.59",
        imgSrc: "/ForeMan.jpg"
    },
    {
        title: "Next Level Basic: The Definitive Basic Bitch...",
        authors: "Stassi Schroeder",
        formats: "KINDLE",
        price: "$4.72",
        imgSrc: "/ThinkLikeAMonk.jpg"
    }
];

const mostViewedBooks = [
    {
        title: "The Rural Diaries: Love, Livestock, and Big Lif...",
        authors: "Hilarie Burton",
        formats: "HARDCOVER",
        price: "$14.82",
        imgSrc: "/UnderAFireFly.jpg"
    },
    {
        title: "The Stellenbosch Mafia: Inside the...",
        authors: "Pieter du Toit",
        formats: "HARDCOVER, KINDLE, PAPERBACK",
        price: "$29.95 – $59.95",
        imgSrc: "ZombieTheorem.jpg"
    },
    {
        title: "Think Like a Monk: Train Your Mind for Peace...",
        authors: "Anna Burns",
        formats: "KINDLE EDITION",
        price: "$56.00",
        imgSrc: "/TheLastSister.jpg"
    },
    {
        title: "Until the End of Time: Mind, Matter, and Our...",
        authors: "Brian Greene",
        formats: "HARDCOVER",
        price: "$12.99",
        imgSrc: "/ForeMan.jpg"
    }
];

export const FeaturedBooks = () => {
    const [activeTab, setActiveTab] = useState('Featured');

    const tabs = ['Featured', 'On Sale', 'Most Viewed'];

    const getBooks = () => {
        if (activeTab === 'Featured') return featuredBooks;
        if (activeTab === 'On Sale') return onSaleBooks;
        return mostViewedBooks;
    };

    // Styles for the card and hover effect
    const cardStyle = {
        transition: 'border 0.3s ease',
        border: '1px solid transparent'
    };

    const cardHoverStyle = {
        border: '1px solid black'
    };

    return (
        <div className="container my-5">
            <h2 className="text-center">Featured Books</h2>
            <ul className="nav nav-tabs justify-content-center my-4">
                {tabs.map(tab => (
                    <li className="nav-item" key={tab}>
                        <button 
                            className={`nav-link ${activeTab === tab ? 'active' : ''}`} 
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="row">
                {getBooks().map((book, idx) => (
                    <div className="col-12 col-md-6 col-lg-2 mb-4" key={idx}>
                        <a href="#" className="text-decoration-none">
                            <div 
                                className="card h-100"
                                style={cardStyle}
                                onMouseEnter={e => e.currentTarget.style.border = cardHoverStyle.border}
                                onMouseLeave={e => e.currentTarget.style.border = cardStyle.border}
                            >
                                <img src={book.imgSrc} className="card-img-top" alt={book.title} style={{ height: '250px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <p className="card-text text-danger" style={{ fontSize: '12px' }}>{book.formats}</p>
                                    <h5 className="card-title" style={{ fontSize: '14px', height: '40px' }}>{book.title}</h5>
                                    <p className="card-text text-muted" style={{ fontSize: '12px' }}>{book.authors}</p>
                                    <p className="card-text" style={{ fontSize: '12px' }}>{book.price}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedBooks;