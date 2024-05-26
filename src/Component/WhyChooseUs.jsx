import 'bootstrap/dist/css/bootstrap.min.css';

export const WhyChooseUs = () => {
    const features = [
        {
            icon: "🌁",
            title: "On The Market",
            description: "For 6 Years"
        },
        {
            icon: "🆓",
            title: "Free Return",
            description: "On Defective and Damaged Products"
        },
        {
            icon: "💵",
            title: "Best Price",
            description: "Selling The Best Price On The Market"
        },
        {
            icon: "🛡️",
            title: "Guaranteed",
            description: "Bringing The Best Quality Product"
        }
    ];

    const sectionStyle = {
        backgroundColor: '#f7f6f3',
        padding: '50px 0'
    };

    return (
        <div style={sectionStyle}>
        <div className="container">
            <div className="text-center mb-4">
                    <h3 className="text-danger">About Our BookStore</h3>
                    <h2>Why People Choose Us?</h2>  
            </div>
                <div className='row align-items-center'>                
                    <div className="col-md-6">
                        <img src="/WhyChooseUs.jpg" alt="Why???" className="img-fluid" />
                    </div>
                    <div className="col-md-6">
                    {features.map((feature, index) => (
                        <div className="d-flex align-items-start mb-3" key={index}>
                            <div className="me-3" style={{ fontSize: '2rem' }}>{feature.icon}</div>
                            <div>
                                <h4>{feature.title}</h4>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    );
};

export default WhyChooseUs;