// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Modal, Spinner, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// export const Forgot = () => {
//     const [email, setEmail] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [showSuccessModal, setShowSuccessModal] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post(`http://localhost:8888/identity/users/forgot-password`, 
//                 email
//             );
//             if(response.data.code = 200){
//                 setShowModal(true);

//                 setTimeout(() => {
//                     setShowModal(false);
//                     setShowSuccessModal(true);
//                 }, 5000);
//            }
//         } catch (error) {
//             setError(error.response?.data?.message);
//         }
    
//     };

//     const handleCloseSuccessModal = () => {
//         setShowSuccessModal(false);
//         navigate('/'); 
//     };

//     return (
//         <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#B3D8E2', width: '100vw' }}>
//             <div className="card shadow-sm p-4" style={{ width: '400px', borderRadius: '10px' }}>
//                 <h2 className="text-center mb-4">Forgot Password</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label htmlFor="email" className="form-label">Email</label>
//                         <input 
//                             type="email" 
//                             className="form-control" 
//                             id="email" 
//                             value={email} 
//                             onChange={(e) => setEmail(e.target.value)} 
//                             required 
//                         />
//                     </div>
//                     <div className="d-grid mt-3">
//                         <Button type="submit" variant="danger" block>Submit</Button>
//                     </div>
//                 </form>

//                 <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//                     <Modal.Body className="text-center">
//                         <Spinner animation="border" role="status">
//                             <span className="visually-hidden">Loading...</span>
//                         </Spinner>
//                         <p className="mt-3">Sending Email, Please Wait...</p>
//                     </Modal.Body>
//                 </Modal>

//                 <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
//                     <Modal.Body className="text-center">
//                         <div className="mb-3">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
//                                 <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.97 4.03a.75.75 0 0 1 1.08 1.05L7.477 10.27a.75.75 0 0 1-1.08 0L4.97 8.82a.75.75 0 0 1 1.08-1.05l1.72 1.725z"/>
//                             </svg>
//                         </div>
//                         <h4>Sending Successfully</h4>
//                         <p>Please Check Your Password To Change The Password</p>
//                         <Button variant="primary" onClick={handleCloseSuccessModal}>OK</Button>
//                     </Modal.Body>
//                 </Modal>
//             </div>
//         </div>
//     );
// };

// export default Forgot;

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Forgot = () => {
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowModal(true);  // Show the loading modal

        try {
            const response = await axios.post(`http://localhost:8888/identity/auth/forgot-password`, 
                { email }
            );
            console.log(response)
            if (response.data.code == 200) {
                setShowModal(false);
                setShowSuccessModal(true);
                // setTimeout(() => {
                // }, 5000);
            }
        } catch(error){
            setShowModal(false);
            // console.log(error.response.data.message)
            // setError(error.response.data.message);
            setError(error.response?.data?.message || 'An error occurred');
            setShowErrorModal(true);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        // navigate('/'); 
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#B3D8E2', width: '100vw' }}>
            <div className="card shadow-sm p-4" style={{ width: '400px', borderRadius: '10px' }}>
                <h2 className="text-center mb-4">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="d-grid mt-3">
                        <Button type="submit" variant="danger" block>Submit</Button>
                    </div>
                    <div className="d-grid mt-3">
                        <Button type="button" variant="secondary" block onClick={handleCancel}>Cancel</Button>
                    </div>
                </form>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Body className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        <p className="mt-3">Sending Email, Please Wait...</p>
                    </Modal.Body>
                </Modal>

                <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                    <Modal.Body className="text-center">
                        <div className="mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.97 4.03a.75.75 0 0 1 1.08 1.05L7.477 10.27a.75.75 0 0 1-1.08 0L4.97 8.82a.75.75 0 0 1 1.08-1.05l1.72 1.725z"/>
                            </svg>
                        </div>
                        <h4>Sending Successfully</h4>
                        <p>Please Check Your Email To Change The Password</p>
                        <Button variant="primary" onClick={handleCloseSuccessModal}>OK</Button>
                    </Modal.Body>
                </Modal>

                <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
                    <Modal.Body className="text-center">
                        <div className="mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zM4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </div>
                        <h4>Error</h4>
                        <p>{error}</p>
                        <Button variant="danger" onClick={handleCloseErrorModal}>Close</Button>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default Forgot;
