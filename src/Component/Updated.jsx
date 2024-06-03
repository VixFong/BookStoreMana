import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Modal } from 'react-bootstrap';

export const Updated = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            setShowErrorModal(true);
        } else {
            setShowSuccessModal(true);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handleCloseErrorModal = () => setShowErrorModal(false);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#B3D8E2', width: '100vw' }}>
            <div className="card shadow-sm p-4" style={{ width: '400px', borderRadius: '10px' }}>
                <h2 className="text-center mb-4">Update Password</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="confirmPassword" className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </Form.Group>
                    <Button type="submit" variant="danger" block>Submit</Button>
                </Form>

                <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                    <Modal.Body className="text-center">
                        <div className="mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.97 4.03a.75.75 0 0 1 1.08 1.05L7.477 10.27a.75.75 0 0 1-1.08 0L4.97 8.82a.75.75 0 0 1 1.08-1.05l1.72 1.725z"/>
                            </svg>
                        </div>
                        <h4>Successfully</h4>
                        <p>Your Password Have Updated</p>
                        <Button variant="primary" onClick={handleCloseSuccessModal}><a href='/' className='link-light'>Click Here To Return To Main Page</a></Button>
                    </Modal.Body>
                </Modal>

                <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
                    <Modal.Body className="text-center">
                        <div className="mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 1 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        <h4>Error</h4>
                        <p>{errorMessage}</p>
                        <Button variant="primary" onClick={handleCloseErrorModal}>OK</Button>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default Updated;