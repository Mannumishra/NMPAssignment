import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import "./User.css"


const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/get-users", {
                    withCredentials: true,
                }
                );
                setUsers(response.data.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);


    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            const response = await axios.delete(`http://localhost:8000/api/v1/delete-user-record/${id}`, {
                withCredentials: true,
            }
            );

            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    'User has been deleted.',
                    'success'
                );
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
            } else {
                Swal.fire(
                    'Failed!',
                    'Failed to delete user: ' + response.data.message,
                    'error'
                );
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            Swal.fire(
                'Error!',
                err.response?.data?.message || 'An error occurred while trying to delete the user.',
                'error'
            );
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/api/v1/update-user/${selectedUser._id}`, selectedUser, {
                withCredentials: true,
            });

            if (response.data.success) {
                Swal.fire('Updated!', 'User has been updated successfully.', 'success');
                setUsers((prevUsers) => prevUsers.map(user => user._id === selectedUser._id ? selectedUser : user));
                setIsModalOpen(false);
            } else {
                Swal.fire('Failed!', 'Failed to update user: ' + response.data.message, 'error');
            }
        } catch (err) {
            console.error("Error updating user:", err);
            Swal.fire('Error!', err.response?.data?.message || 'An error occurred while trying to update the user.', 'error');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };


    return (
        <>
            <div className="bread">
                <div className="head">
                    <h4>All Users</h4>
                </div>
                <div className="links">
                </div>
            </div>

            <section className="d-table">
                <div className="table-responsive mt-4">
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Sr.No.</th>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Role</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="bt edit" onClick={() => handleEdit(user)}>
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="bt delete"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {isModalOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <h2>Edit User</h2>
                        {selectedUser && (
                            <form>
                                <label>
                                    First Name:
                                    <input
                                        type="text"
                                        value={selectedUser.firstName}
                                        onChange={(e) =>
                                            setSelectedUser({ ...selectedUser, firstName: e.target.value })
                                        }
                                    />
                                </label>
                                <label>
                                    Last Name:
                                    <input
                                        type="text"
                                        value={selectedUser.lastName}
                                        onChange={(e) =>
                                            setSelectedUser({ ...selectedUser, lastName: e.target.value })
                                        }
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        value={selectedUser.email}
                                        onChange={(e) =>
                                            setSelectedUser({ ...selectedUser, email: e.target.value })
                                        }
                                    />
                                </label>
                                <label>
                                    Role:
                                    <select
                                        value={selectedUser.role}
                                        onChange={(e) =>
                                            setSelectedUser({ ...selectedUser, role: e.target.value })
                                        }
                                        className='form-control'
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </label>

                                <div className="modal-buttons">
                                    <button type="button" onClick={handleUpdate}>
                                        Save Changes
                                    </button>
                                    <button type="button" onClick={closeModal}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AllUsers;
