import 'bootstrap/dist/css/bootstrap.min.css';

export const Authors = () => {
    const authors = [
        {
            name: "Lucy",
            title: "THRILLER WRITER",
            description: "Our favorite author. Have a enormous passion and love for writing book...",
            imgSrc: "/Lucy.jpg",
        },
        {
            name: "Janet",
            title: "FINANCIAL ANALYST",
            description: "Our favorite author. Have a enormous passion and love for writing book...",
            imgSrc: "/Bellis.jpg",
        },
        {
            name: "Janet",
            title: "FINANCIAL ANALYST",
            description: "Our favorite author. Have a enormous passion and love for writing book...",
            imgSrc: "/Bellis.jpg",
        },
        {
            name: "Janet",
            title: "FINANCIAL ANALYST",
            description: "Our favorite author. Have a enormous passion and love for writing book...",
            imgSrc: "/Bellis.jpg",
        },
        {
            name: "Janet",
            title: "FINANCIAL ANALYST",
            description: "Our favorite author. Have a enormous passion and love for writing book...",
            imgSrc: "/Bellis.jpg",
        },
        {
            name: "Ellie Thomson",
            title: "ROMANCE WRITER",
            description: "Our favorite author. Have a enormous passion and love for writing book...",
            imgSrc: "/Thomson.jpg",
        }
    ];

    const Array = (array, size) =>{
        const a = [];
        for (let i = 0; i < array.length; i += size){
            a.push(array.slice(i, i + size));
        }
        return a;
    };

    const authorsArray = Array (authors, 3);

    const arrowStyle = {
        filter: 'invert(0.5)',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: '20%',
        width: '30px',
        height: '30px',
    };

    return (
        <div style={{ backgroundColor: '#FFFFFF', padding: '50px 0' }}>
            <div className="container text-center">
                <div className="mb-4">
                    <h2 className="mt-2">Our Authors</h2>
                </div>
                <div id = "Carousel" className='carousel slide' data-bs-ride ="carousel">
                    <div className='carousel-inner'>
                        {authorsArray.map((chunk, index) => (
                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                <div className="row justify-content-center">
                                    {chunk.map((author, idx) => (
                                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={idx}>
                                            <div className="card h-100 border-0 shadow-sm">
                                                <div className="card-body">
                                                    <div className="mb-3">
                                                        <img src={author.imgSrc} alt={author.name} className="rounded-circle" style={{ width: '100px', height: '100px' }} />
                                                    </div>
                                                    <h4>{author.name}</h4>
                                                    <h6 className="text-muted">{author.title}</h6>
                                                    <p>{author.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                     ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#Carousel" data-bs-slide="prev" style={arrowStyle}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#Carousel" data-bs-slide="next" style={arrowStyle}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>                            
    );
};

export default Authors;