import React, { useRef, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Login = ({ onClose }) => {
    const [email, setMail] = useState('');
    const [password, setPass] = useState('');
    const [error, setErr] = useState('');
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (email === 'admin@gmail.com' && password === '123456') {
            window.location.href = '/AdminPage';
        } else {
            setErr('Invalid email or password');
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <h6 className="text-center">Great to have you back!</h6>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email *</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="email" 
                                    value={email} 
                                    onChange={(e) => setMail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password *</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="password" 
                                    value={password} 
                                    onChange={(e) => setPass(e.target.value)} 
                                    required 
                                />
                            </div>
                            {error && <p className="text-danger">{error}</p>}
                            <div className="d-flex justify-content-between">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="remember" />
                                    <label className="form-check-label" htmlFor="remember">Remember</label>
                                </div>
                                <a href="#" className="link-secondary">Forgot Password?</a>
                            </div>
                            <div className="d-grid mt-3">
                                <button type="submit" className="btn btn-success">Sign in to your account</button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <span>Not a member? <a href="#" className="link-primary">Create an account</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;