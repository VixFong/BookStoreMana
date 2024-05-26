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

    return (
        <div className="container my-5">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <img src="/WhyChooseUs.jpg" alt="Why Choose Us" className="img-fluid" />
                </div>
                <div className="col-md-6">
                    <h3 className="text-success">About Our BookStore</h3>
                    <h2>WHY PEOPLE CHOOSE US</h2>
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
    );
};

export default WhyChooseUs;