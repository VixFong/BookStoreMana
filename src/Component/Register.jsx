import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const passwordReq = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (password !== repeatPassword) {
            setError("Passwords do not match");
            return;
        }
        if(!passwordReq.test(password)){
            setError("Password must be at least 6 characters and include at least one uppercase letter and number")
        }
        setSuccess(true);
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#B3D8E2',  width: '100vw' }}>
            <div className="card shadow-sm p-4" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">CREATE AN ACCOUNT</h2>
                {success && <div className="alert alert-success text-center">Registered Successfully You Will Be Direct Back To Home Page</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Your Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Your Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="repeatPassword" className="form-label">Repeat your password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="repeatPassword" 
                            value={repeatPassword} 
                            onChange={(e) => setRepeatPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-success">REGISTER</button>
                    </div>
                </form>
                <div className="text-center mt-3">
                    <span>Have already an account? <a href="/" className="link-primary">Login here</a></span>
                </div>
            </div>
        </div>
    );
};

export default Register;