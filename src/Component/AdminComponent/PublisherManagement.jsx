// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Table, Toast, ToastContainer } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
// import axios from 'axios';

// export const PublisherManagement = () => {
//     const [publishers, setPublishers] = useState([]);
//     const [error, setError] = useState('');

//     const [editingPublisherId, setEditingPublisherId] = useState(null);
//     const [editedName, setEditedName] = useState('');
//     const [showAddPublisher, setShowAddPublisher] = useState(false);
//     const [newPublisherName, setNewPublisherName] = useState('');
//     const [showToast, setShowToast] = useState(false);
//     const [showEditToast, setShowEditToast] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false); 
//     const [publisherIdToDelete, setPublisherIdToDelete] = useState(null);



//     const token =  localStorage.getItem('authToken');
//     useEffect(() => {   
//         fetchPublisher();
//     }, []);

//     const fetchPublisher = async () => {
//         try {
//             const response = await axios.get('/api/publishers', {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             setPublishers(response.data.data); 
//             console.log('publishers ',response.data.data)
//         } catch (error) {
//             // console.error('Error fetching categories:', error);
//             setError(error.response?.data?.message);
//             // setShowErrorModal(true);
//         }
//     };


//     const handleAddPublisher = () => {
//         const newPublisher = { id: publishers.length + 1, name: newPublisherName };
//         setPublishers([...publishers, newPublisher]);
//         setShowAddPublisher(false);
//         setNewPublisherName('');
//         setShowToast(true);
//     };

//     const handleEdit = (id, name) => {
//         setEditingPublisherId(id);
//         setEditedName(name);
//     };

//     const handleSaveEdit = (id) => {
//         const updatedPublishers = publishers.map(publisher =>
//             publisher.id === id ? { ...publisher, name: editedName } : publisher
//         );
//         setPublishers(updatedPublishers);
//         setEditingPublisherId(null);
//         setEditedName('');
//         setShowEditToast(true);
//     };

//     const handleDeleteClick = (id) => {
//         setPublisherIdToDelete(id);
//         setShowDeleteModal(true);
//     };

//     const handleDelete = () => {
//         const updatedPublishers = publishers.filter(publisher => publisher.id !== publisherIdToDelete);
//         setPublishers(updatedPublishers);
//         setShowDeleteModal(false);
//         setPublisherIdToDelete(null);
//     };

//     const handleCloseDeleteModal = () => {
//         setShowDeleteModal(false); 
//         setPublisherIdToDelete(null);
//     };

//     return (
//         <div className="container-fluid mt-5 publisher-management">
//             <style>
//                 {`
//                 .publisher-table th, .publisher-table td {
//                     padding: 1rem;
//                     vertical-align: middle;
//                 }
//                 .publisher-table th {
//                     background-color:#B8B8B8;
//                     color: black;
//                     text-align: center;
//                 }
//                 .publisher-table td {
//                     text-align: center;
//                 }
//                 .publisher-table td:first-child {
//                     text-align: center;
//                 }
//                 .publisher-table .btn {
//                     margin-right: 5px;
//                 }
//                 .publisher-management h4 {
//                     text-align: left;
//                     color: #000000;
//                     margin-bottom: 20px;
//                 }
//                 .publisher-management .btn-danger {
//                     background-color: #ff4d4f;
//                     border-color: #ff4d4f;
//                 }
//                 `}
//             </style>
//             <h4>Publisher</h4>
//             <div className="mb-3">
//                 <Button variant="danger" onClick={() => setShowAddPublisher(!showAddPublisher)}>
//                     Add Publisher +
//                 </Button>
//             </div>
//             {showAddPublisher && (
//                 <div className="mb-3">
//                     <h5>Publisher Name</h5>
//                     <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter publisher name..."
//                         value={newPublisherName}
//                         onChange={(e) => setNewPublisherName(e.target.value)}
//                     />
//                     <Button variant="danger" className="mt-2" onClick={handleAddPublisher}>
//                         Add
//                     </Button>
//                 </div>
//             )}
//             <div className="table-responsive">
//                 <Table bordered hover className="publisher-table w-100">
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Name</th>
//                             <th>Address</th>
//                             <th>Email</th>
//                             <th>Operation</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {publishers.map((publisher, index) => (
//                             <tr key={publisher.id}>
//                                 <td>{index + 1}</td>
//                                 <td>
//                                     {editingPublisherId === publisher.id ? (
//                                         <>
//                                             <input
//                                                 type="text"
//                                                 value={editedName}
//                                                 onChange={(e) => setEditedName(e.target.value)}
//                                             />

//                                             <input
//                                                 type="text"
//                                                 value={editedName}
//                                                 onChange={(e) => setEditedName(e.target.value)}
//                                             />
//                                         </>
//                                     ) : (
//                                         publisher.name
//                                         // publisher.address,
//                                         // publisher.email
//                                     )}
//                                 </td>
//                                 <td>
//                                     {editingPublisherId === publisher.id ? (
//                                     <Button 
//                                         variant="success" 
//                                         className="me-2" 
//                                         onClick={() => handleSaveEdit(publisher.id)}
//                                         >
//                                         <FaCheck />
//                                     </Button>
//                                     ):(
//                                     <Button
//                                         variant="warning"
//                                         className="me-2"
//                                         onClick={() => handleEdit(publisher.id, publisher.name)}
//                                     >
//                                         <i className="fas fa-edit"></i>

//                                         {/* <FaEdit /> */}
//                                     </Button>
//                                     )}
//                                     <Button
//                                         variant="danger"
//                                         onClick={() => handleDeleteClick(publisher.id)}
//                                     >
//                                         <i className="fas fa-trash-alt"></i>

//                                         {/* <FaTrashAlt /> */}
//                                     </Button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             </div>
//             <ToastContainer position="top-end" className="p-3">
//                 <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
//                     <Toast.Header>
//                         <strong className="me-auto">Notification</strong>
//                     </Toast.Header>
//                     <Toast.Body>Adding successfully</Toast.Body>
//                 </Toast>
//                 <Toast onClose={() => setShowEditToast(false)} show={showEditToast} delay={3000} autohide>
//                     <Toast.Header>
//                         <strong className="me-auto">Notification</strong>
//                     </Toast.Header>
//                     <Toast.Body>Edit successfully</Toast.Body>
//                 </Toast>
//             </ToastContainer>

//             <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Confirm Delete</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     Are you sure you want to delete this publisher?
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleCloseDeleteModal}>
//                         Cancel
//                     </Button>
//                     <Button variant="danger" onClick={handleDelete}>
//                         Delete
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default PublisherManagement;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Toast, ToastContainer } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
import axios from 'axios';

export const PublisherManagement = () => {
    const [publishers, setPublishers] = useState([]);
    const [error, setError] = useState('');

    const [editingPublisherId, setEditingPublisherId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedAddress, setEditedAddress] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [showAddPublisher, setShowAddPublisher] = useState(false);
    const [newPublisherName, setNewPublisherName] = useState('');
    const [newPublisherAddress, setNewPublisherAddress] = useState('');
    const [newPublisherEmail, setNewPublisherEmail] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showEditToast, setShowEditToast] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [publisherIdToDelete, setPublisherIdToDelete] = useState(null);

    const token = localStorage.getItem('authToken');
    
    useEffect(() => {   
        fetchPublishers();
    }, []);

    const fetchPublishers = async () => {
        try {
            const response = await axios.get('/api/products/publishers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPublishers(response.data.data); 
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const handleAddPublisher = async () => {
        try {
            const response = await axios.post('/api/products/publishers', {
                name: newPublisherName,
                address: newPublisherAddress,
                email: newPublisherEmail
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPublishers([...publishers, response.data.data]);
            setShowAddPublisher(false);
            setNewPublisherName('');
            setNewPublisherAddress('');
            setNewPublisherEmail('');
            setShowToast(true);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const handleEdit = (id, name, address, email) => {
        setEditingPublisherId(id);
        setEditedName(name);
        setEditedAddress(address);
        setEditedEmail(email);
    };

    const handleSaveEdit = async (id) => {
        try {
            const response = await axios.put(`/api/products/publishers/${id}`, {
                name: editedName,
                address: editedAddress,
                email: editedEmail
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedPublishers = publishers.map(publisher =>
                publisher.id === id ? response.data.data : publisher
            );
            setPublishers(updatedPublishers);
            setEditingPublisherId(null);
            setEditedName('');
            setEditedAddress('');
            setEditedEmail('');
            setShowEditToast(true);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const handleDeleteClick = (id) => {
        setPublisherIdToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/publishers/${publisherIdToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedPublishers = publishers.filter(publisher => publisher.id !== publisherIdToDelete);
            setPublishers(updatedPublishers);
            setShowDeleteModal(false);
            setPublisherIdToDelete(null);
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false); 
        setPublisherIdToDelete(null);
    };

    return (
        <div className="container-fluid mt-5 publisher-management">
            <style>
                {`
                .publisher-table th, .publisher-table td {
                    padding: 1rem;
                    vertical-align: middle;
                }
                .publisher-table th {
                    background-color:#B8B8B8;
                    color: black;
                    text-align: center;
                }
                .publisher-table td {
                    text-align: center;
                }
                .publisher-table td:first-child {
                    text-align: center;
                }
                .publisher-table .btn {
                    margin-right: 5px;
                }
                .publisher-management h4 {
                    text-align: left;
                    color: #000000;
                    margin-bottom: 20px;
                }
                .publisher-management .btn-danger {
                    background-color: #ff4d4f;
                    border-color: #ff4d4f;
                }
                `}
            </style>
            <h4>Publisher</h4>
            <div className="mb-3">
                <Button variant="danger" onClick={() => setShowAddPublisher(!showAddPublisher)}>
                    Add Publisher +
                </Button>
            </div>
            {showAddPublisher && (
                <div className="mb-3">
                    <h5>Publisher Name</h5>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter publisher name..."
                        value={newPublisherName}
                        onChange={(e) => setNewPublisherName(e.target.value)}
                    />
                    <h5>Address</h5>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter publisher address..."
                        value={newPublisherAddress}
                        onChange={(e) => setNewPublisherAddress(e.target.value)}
                    />
                    <h5>Email</h5>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter publisher email..."
                        value={newPublisherEmail}
                        onChange={(e) => setNewPublisherEmail(e.target.value)}
                    />
                    <Button variant="danger" className="mt-2" onClick={handleAddPublisher}>
                        Add
                    </Button>
                </div>
            )}
            <div className="table-responsive">
                <Table bordered hover className="publisher-table w-100">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Email</th>
                            <th>Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {publishers.map((publisher, index) => (
                            <tr key={publisher.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {editingPublisherId === publisher.id ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                        />
                                    ) : (
                                        publisher.name
                                    )}
                                </td>
                                <td>
                                    {editingPublisherId === publisher.id ? (
                                        <input
                                            type="text"
                                            value={editedAddress}
                                            onChange={(e) => setEditedAddress(e.target.value)}
                                        />
                                    ) : (
                                        publisher.address
                                    )}
                                </td>
                                <td>
                                    {editingPublisherId === publisher.id ? (
                                        <input
                                            type="text"
                                            value={editedEmail}
                                            onChange={(e) => setEditedEmail(e.target.value)}
                                        />
                                    ) : (
                                        publisher.email
                                    )}
                                </td>
                                <td>
                                    {editingPublisherId === publisher.id ? (
                                        <Button 
                                            variant="success" 
                                            className="me-2" 
                                            onClick={() => handleSaveEdit(publisher.id)}
                                        >
                                            <FaCheck />
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant="warning"
                                                className="me-2"
                                                onClick={() => handleEdit(publisher.id, publisher.name, publisher.address, publisher.email)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteClick(publisher.id)}
                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>Added successfully</Toast.Body>
                </Toast>
                <Toast onClose={() => setShowEditToast(false)} show={showEditToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>Edited successfully</Toast.Body>
                </Toast>
            </ToastContainer>

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this publisher?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PublisherManagement;
