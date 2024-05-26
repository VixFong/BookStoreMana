import 'bootstrap/dist/css/bootstrap.min.css';

export const Banner = () => {
    const bannerStyle = {
        backgroundColor: '#FFD700',
        color: '#003366',
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center', 
        padding: '20px 0',
        width: '100%',
        position: 'relative'
    };

    return (
        <div style={bannerStyle}>
            Sales Up To 70%
        </div>
    );
};

export default Banner;