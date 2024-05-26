import 'bootstrap/dist/css/bootstrap.min.css';

export const Banner = () => {
    const bannerStyle = {
        backgroundColor: '#6bad0d',
        color: '#ffffff',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center', 
        padding: '20px 0',
        width: '100%',
        position: 'relative'
    };

    return (
        <div style={bannerStyle}>
            UP TO 70% OFF THE ENTIRE STORE!!!
        </div>
    );
};

export default Banner;