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
            name: "Ellie Thomson",
            title: "ROMANCE WRITER",
            description: "Our favorite author. Have a enormous passion and love for writing book...",
            imgSrc: "/Thomson.jpg",
        }
    ];

    return (
        <div style={{ backgroundColor: '#FFFFFF', padding: '50px 0' }}>
            <div className="container text-center">
                <div className="mb-4">
                    <h2 className="mt-2">Our Authors</h2>
                </div>
                <div className="row justify-content-center">
                    {authors.map((author, index) => (
                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
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
        </div>
    );
};

export default Authors;