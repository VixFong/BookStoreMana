import 'bootstrap/dist/css/bootstrap.min.css';

const books = [
    {
      title: "The Last Sister (Columbia River Book 1)",
      authors: "Conn Iggulden",
      formats: "HARDCOVER, KINDLE, PAPERBACK",
      price: "$29.59 – $59.95",
      imgSrc: "/TheLastSister.jpg"
    },
    {
      title: "ForeMan",
      authors: "George",
      formats: "HARDCOVER",
      price: "$16.59",
      imgSrc: "/ForeMan.jpg"
    },
    {
      title: "Think Like a Monk: Train Your Mind for Peace and...",
      authors: "Luanne Rice",
      formats: "KINDLE",
      price: "$1.75",
      imgSrc: "/ThinkLikeAMonk.jpg"
    },
    {
      title: "Under a Firefly Moon (Firefly Lake Book 1)",
      authors: "Donna Kauffman",
      formats: "KINDLE",
      price: "$7.67",
      imgSrc: "/UnderAFireFly.jpg"
    },
    {
      title: "Zombie Theorem: Dark Times Book Five",
      authors: "James Wallace",
      formats: "KINDLE",
      price: "$2.68",
      imgSrc: "ZombieTheorem.jpg"
    }
];

export const BestSelling = () => {
    const chunkSize = 4;
    const bookChunks = [];
  
    for (let i = 0; i < books.length; i += chunkSize) {
      bookChunks.push(books.slice(i, i + chunkSize));
    }

    const controlStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50%',
        width: '50px',
        height: '50px'
      };
    
      const carouselControlPrevNextStyle = {
        width: '5%'
      };
    
      const cardHoverStyle = {
        transition: 'transform 0.5s ease',
      };
    
      return (
        <div className="container my-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Bestselling Books</h2>
            <a href="#" className="text-decoration-none">View All</a>
          </div>
          <div id="carouselExampleControls" className="carousel slide"   data-bs-ride="carousel">
            <div className="carousel-inner">
              {bookChunks.map((chunk, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <div className="row">
                    {chunk.map((book, idx) => (
                      <div className="col-12 col-md-6 col-lg-3 mb-4" key={idx}>
                        <a href='#'className="link-offset-2 link-underline link-underline-opacity-0">
                        <div className="card h-100" style={cardHoverStyle}>
                          <img src={book.imgSrc} className="card-img-top" alt={book.title}  style={{ height: '250px', objectFit: 'cover' }}  />
                          <div className="card-body">
                            <p className="card-text text-danger" style={{ fontSize: '12px' }}>{book.formats}</p>
                            <h5 className="card-title" style={{ fontSize: '14px', height: '40px' }}>{book.title}</h5>
                            <p className="card-text text-muted"style={{ fontSize: '12px' }}>{book.authors}</p>
                            <p className="card-text"style={{ fontSize: '12px' }}>{book.price}</p>
                          </div>
                        </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev" style={carouselControlPrevNextStyle}>
              <span className="carousel-control-prev-icon" aria-hidden="true" style={controlStyle}></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next" style={carouselControlPrevNextStyle}>
              <span className="carousel-control-next-icon" aria-hidden="true" style={controlStyle}></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      );
    };
export default BestSelling;