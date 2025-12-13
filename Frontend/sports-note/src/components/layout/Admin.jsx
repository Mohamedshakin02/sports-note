import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

function Admin() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [addForm, setAddForm] = useState({ username: "", email: "", password: "" });
    const [editForm, setEditForm] = useState({ username: "", email: "", password: "" });
    const [toast, setToast] = useState({ message: "" });
    const [loading, setLoading] = useState(false);
    const toastRef = useRef(null);
    const token = localStorage.getItem("token");

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchUsers = async () => {
            try {
                // const res = await axios.get("https://sports-note-backend.onrender.com/api/admin/users", { withCredentials: true });

                const res = await axios.get(
                    "https://sports-note-backend.onrender.com/api/admin/users",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setUsers(res.data);
            } catch (err) {
                logout();
                showToast("Unauthorized. Please login again.");
            }
            finally { setLoading(false); }
        };
        fetchUsers();
    }, []);

    const showToast = (message) => {
        setToast({ message });
        const toastElement = toastRef.current;
        if (!toastElement) return;

        const progress = toastElement.querySelector(".toast-progress");
        progress.style.animation = "none";
        progress.offsetHeight;
        progress.style.animation = "shrink 3s linear forwards";

        const bsToast = new window.bootstrap.Toast(toastElement, { delay: 3000 });
        bsToast.show();
    };

    const handleAddFormChange = (e) => {
        setAddForm({ ...addForm, [e.target.id.replace('add', '').toLowerCase()]: e.target.value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // const res = await axios.post("https://sports-note-backend.onrender.com/api/admin/users", addForm, { withCredentials: true });

            const res = await axios.post(
                "https://sports-note-backend.onrender.com/api/admin/users",
                addForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers([...users, res.data.user]);
            showToast(res.data.message || "User added successfully");
            setAddForm({ username: "", email: "", password: "" });
            window.bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
        } catch (err) {
            showToast(err.response?.data?.message || err.message);
        }
        finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        if (user.googleUser) {
            showToast("Cannot edit Google user");
            return;
        }
        setSelectedUser(user);
        setEditForm({ username: user.username, email: user.email, password: "" });
        new window.bootstrap.Modal(document.getElementById("editUserModal")).show();
    };

    const handleChangeEditForm = (e) => {
        setEditForm({ ...editForm, [e.target.id]: e.target.value });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // const res = await axios.put(
            //     `https://sports-note-backend.onrender.com/api/admin/users/${selectedUser._id}`,
            //     editForm,
            //     { withCredentials: true }
            // );

            const res = await axios.put(
                `https://sports-note-backend.onrender.com/api/admin/users/${selectedUser._id}`,
                editForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(users.map(u => u._id === selectedUser._id ? res.data.user : u));
            showToast(res.data.message || "User updated successfully");
            window.bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
        } catch (err) {

            showToast(err.response?.data?.message || err.message);
        }
        finally {
            setLoading(false);
        }
    };

    const handleDelete = async (user) => {
        setSelectedUser(user);
        new window.bootstrap.Modal(document.getElementById("deleteUserModal")).show();
    };

    const confirmDeleteUser = async () => {
        try {
            setLoading(true);
            // await axios.delete(`https://sports-note-backend.onrender.com/api/admin/users/${selectedUser._id}`, { withCredentials: true });

            await axios.delete(
                `https://sports-note-backend.onrender.com/api/admin/users/${selectedUser._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUsers(users.filter(u => u._id !== selectedUser._id));
            showToast("User deleted successfully");
            window.bootstrap.Modal.getInstance(document.getElementById("deleteUserModal")).hide();
        } catch (err) {
            showToast(err.response?.data?.message || err.message);
        }
        finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/admin-login");
    };

    return (
        <>
            {loading && (<div className="loading-overlay"><div className="spinner-border text-light" role="status"></div></div>)}

            <section className="admin-section container-md py-5">
                <div className="heading-container">
                    <h1 className="text-center mb-4">Admin Panel</h1>
                </div>

                <div className="add-container mb-4">
                    <button type="button" className="btn p-2" onClick={() => {
                        const modalEl = document.getElementById("addUserModal");
                        new window.bootstrap.Modal(modalEl).show();
                    }}>
                        <i className="bi bi-plus-lg me-2"></i>Add User
                    </button>
                </div>

                <div className="table-container m-0 p-0">
                    <table className="table">
                        <thead className="custom-thead">
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Google User</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr><td colSpan="5" className="text-center">No users found</td></tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user._id}>
                                        <th>{index + 1}.</th>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.googleUser ? "Yes" : "No"}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm m-1 me-2"
                                                onClick={() => handleEdit(user)}
                                                disabled={user.googleUser}
                                                title={user.googleUser ? "Cannot edit Google user" : "Edit user"}
                                            >
                                                <i className="bi bi-pencil-fill"></i>
                                            </button>
                                            <button className="btn btn-sm m-1" onClick={() => handleDelete(user)}>
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="admin-logout text-center mt-4">
                    <button className="btn btn-danger" onClick={handleLogout}>LOGOUT</button>
                </div>

                {/* Add User Modal */}
                <div className="modal fade" id="addUserModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="heading">
                                    <h1 className="modal-title fs-4 text-center">Add User</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>

                                <div className="form mt-3">
                                    <form className="row g-2 gx-3 py-2" onSubmit={handleAddUser}>
                                        <div className="mb-1 col-12">
                                            <label htmlFor="addUsername" className="form-label">Username:</label>
                                            <input type="text" className="form-control" id="addUsername" value={addForm.username} onChange={handleAddFormChange} placeholder="Enter username" required />
                                        </div>
                                        <div className="mb-1 col-12">
                                            <label htmlFor="addEmail" className="form-label">Email:</label>
                                            <input type="email" className="form-control" id="addEmail" value={addForm.email} onChange={handleAddFormChange} placeholder="Enter email address" required />
                                        </div>
                                        <div className="mb-3 col-12">
                                            <label htmlFor="addPassword" className="form-label">Password:</label>
                                            <input type="password" className="form-control" id="addPassword" value={addForm.password} onChange={handleAddFormChange} placeholder="Enter password" required />
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-success w-100">Add User</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Edit User Modal */}
                <div className="modal fade" id="editUserModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="heading">
                                    <h1 className="modal-title fs-4 text-center">Edit User</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>

                                <div className="form mt-3">
                                    <form className="row g-2 gx-3 py-2" onSubmit={handleUpdateUser}>
                                        <div className="mb-1 col-12">
                                            <label htmlFor="username" className="form-label">Username:</label>
                                            <input type="text" className="form-control" id="username" value={editForm.username} onChange={handleChangeEditForm} disabled={selectedUser?.googleUser} placeholder="Enter username" required />
                                        </div>
                                        <div className="mb-1 col-12">
                                            <label htmlFor="email" className="form-label">Email:</label>
                                            <input type="email" className="form-control" id="email" value={editForm.email} onChange={handleChangeEditForm} disabled={selectedUser?.googleUser} placeholder="Enter email address" required />
                                        </div>
                                        <div className="mb-3 col-12">
                                            <label htmlFor="password" className="form-label">Password:</label>
                                            <input type="password" className="form-control" id="password" value={editForm.password} onChange={handleChangeEditForm} placeholder="Leave empty to keep current password" disabled={selectedUser?.googleUser} />
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary w-100">Update User</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete User Modal */}
                <div className="modal fade" id="deleteUserModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete User</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">Are you sure you want to delete this user?</div>
                            <div className="modal-footer">
                                <button type="button" className="btn cancel" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="btn delete" onClick={confirmDeleteUser}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toast */}
                <div className="toast-container position-fixed p-3 bottom-0 end-0">
                    <div ref={toastRef} className="toast custom-toast text-dark border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body">{toast.message}</div>
                            <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
                        </div>
                        <div className="toast-progress-wrapper">
                            <div className="toast-progress"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Admin;