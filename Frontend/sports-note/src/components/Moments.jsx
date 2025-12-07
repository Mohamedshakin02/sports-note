import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import moment1 from "../assets/moments/rcb.jpg";
import moment3 from "../assets/moments/india vs new zealand.jpg";
import moment4 from "../assets/moments/lakers win.jpg";
import noImage from "../assets/logos/moments-grey.png";

// Default static moments for non login user
const defaultMoments = [
    {
        image: moment1,
        sport: "Cricket",
        title: "RCB Won This Year IPL",
        description: "I was extremely happy when RCB finally won this year IPL. It was their first win and I still can’t believe it happened. The joy and excitement of watching the team lift the trophy was unforgettable and truly special for all the fans.",
        date: "2025-06-03"
    },
    {
        image: "",
        sport: "Football",
        title: "Argentina Won FIFA World Cup 2022",
        description: "I was overjoyed when Argentina won the 2022 FIFA World Cup. The match was thrilling and seeing the team lift the trophy felt surreal. I still can’t believe the incredible journey and the unforgettable moments of that tournament.",
        date: "2022-12-18"
    },
    {
        image: moment3,
        sport: "Cricket",
        title: "India vs New Zealand Heart Breaking Semi Final 2019",
        description: "Watching India play against New Zealand in the 2019 semi final was heartbreaking. I felt so proud of the team for giving their best, yet so sad when the match ended. It was a rollercoaster of emotions that I will never forget.",
        date: "2019-07-10"
    },
    {
        image: moment4,
        sport: "Basketball",
        title: "Lakers Win NBA Finals 2020",
        description: "I was thrilled when the Lakers clinched the 2020 NBA Finals. Witnessing the team's hard work pay off and seeing the championship celebration was unforgettable. The energy and excitement of the game made it a truly special moment.",
        date: "2020-10-11"
    },
    {
        image: "",
        sport: "Cricket",
        title: "England Won 2019 Cricket World Cup",
        description: "I could not stop cheering when England won the 2019 Cricket World Cup. The final was so intense and nerve-wracking, and I still remember the excitement when the match ended in a super over. It was an amazing experience to witness history.",
        date: "2019-07-14"
    },
];

function Moments() {
    const { user } = useContext(AuthContext); // gets logged-in user
    const [momentsList, setMomentsList] = useState(defaultMoments); // initial static moments
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const menuRefs = useRef([]);


    // Toast state
    const toastRef = useRef(null);
    const [toast, setToast] = useState({ message: "" });

    const [loading, setLoading] = useState(false);

    // Form states for Add and Edit
    const [form, setForm] = useState({ title: "", sport: "", image: null, date: "", description: "" });
    const [editForm, setEditForm] = useState({ id: null, title: "", sport: "", image: null, date: "", description: "", imageUrl: "" });

    const toggleMenu = (index) => {
        setOpenMenuIndex((prev) => (prev === index ? null : index));
    };

    // Show toast function
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openMenuIndex !== null &&
                menuRefs.current[openMenuIndex] &&
                !menuRefs.current[openMenuIndex].contains(event.target)
            ) {
                setOpenMenuIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuIndex]);

    // Fetch moments from MongoDB if user is logged in
    useEffect(() => {
        const fetchMoments = async () => {
            if (!user) {
                // User logged out → show default moments immediately
                setMomentsList(defaultMoments);
                return;
            }

            try {
                const res = await axios.get("http://localhost:5000/api/moments", { withCredentials: true });
                setMomentsList(res.data); // replace static moments with DB data
            }

            catch (err) {
                console.error("Failed to fetch moments:", err);
                showToast("Failed to load your moments from server.");
            }
        };

        fetchMoments();
    }, [user]);

    const handleChange = (e, edit = false) => {

        const map = { "moment-title": "title", "moment-type": "sport", "moment-image": "image", "moment-date": "date", "moment-desc": "description" };
        const { id, value, files } = e.target;
        const key = map[id];

        if (edit) setEditForm(prev => ({ ...prev, [key]: files ? files[0] : value }));
        else setForm(prev => ({ ...prev, [key]: files ? files[0] : value }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let imageUrl = "";
        if (form.image) {
            const formData = new FormData();
            formData.append("file", form.image);
            formData.append("upload_preset", "moments_preset");
            try {
                const res = await axios.post("https://api.cloudinary.com/v1_1/dy3pvt29a/image/upload", formData); imageUrl = res.data.secure_url;
            }

            catch {
                const modalEl = document.getElementById("addMomentModal");
                window.bootstrap.Modal.getInstance(modalEl).hide();
                showToast("Failed to upload image.");
                setLoading(false); return;
            }
        }

        try {
            const res = await axios.post("http://localhost:5000/api/moments", { ...form, imageUrl }, { withCredentials: true });
            setMomentsList(prev => [res.data, ...prev]);
            setForm({ title: "", sport: "", image: null, date: "", description: "" });
            const modalEl = document.getElementById("addMomentModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Moment added successfully!");
        }
        catch {
            const modalEl = document.getElementById("addMomentModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Failed to save moment.");
        }

        finally { setLoading(false); }
    };

    const handleEdit = (moment) => {
        setEditForm({ id: moment._id || moment.id, ...moment, date: moment.date ? formatDate2(moment.date) : "", image: null });
        const modalEl = document.getElementById("editMomentModal");
        new window.bootstrap.Modal(modalEl).show();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let imageUrl = editForm.image ? await (async () => {
            const formData = new FormData();
            formData.append("file", editForm.image);
            formData.append("upload_preset", "moments_preset");
            try {
                const res = await axios.post("https://api.cloudinary.com/v1_1/dy3pvt29a/image/upload", formData); return res.data.secure_url;
            }

            catch {
                const modalEl = document.getElementById("editMomentModal");
                window.bootstrap.Modal.getInstance(modalEl).hide();
                showToast("Failed to upload image."); setLoading(false); return null;
            }

        })() : editForm.imageUrl || "";

        if (imageUrl === null) return;

        try {
            const res = await axios.put(`http://localhost:5000/api/moments/${editForm.id}`, { ...editForm, imageUrl }, { withCredentials: true });
            setMomentsList(prev => prev.map(m => (m._id === editForm.id || m.id === editForm.id ? res.data : m)));
            const modalEl = document.getElementById("editMomentModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Moment updated successfully!");
        }
        catch {
            const modalEl = document.getElementById("editMomentModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Failed to update moment.");
        }

        finally { setLoading(false); }
    };

    const [deleteId, setDeleteId] = useState(null);

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            setLoading(true);
            await axios.delete(`http://localhost:5000/api/moments/${deleteId}`, { withCredentials: true });

            setMomentsList(prev =>
                prev.filter(m => (m._id || m.id) !== deleteId)
            );

            const modalEl = document.getElementById("deleteMomentModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Moment deleted successfully!");

        }

        catch (err) {
            console.error("Delete error", err);
            const modalEl = document.getElementById("deleteMomentModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Failed to delete moment.");
        }

        finally { setLoading(false); }
    };

    const formatDate = (dateString) => {

        if (!dateString) return "N/A";
        const options = { year: "numeric", month: "long", day: "numeric" };

        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const formatDate2 = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return ""; // if invalid
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
    };

    const isLoggedIn = !!user;

    const showLoginToast = () => {
        showToast("Please login to continue");
    };

    return (
        <>
            {loading && (<div className="loading-overlay"><div className="spinner-border text-light" role="status"><span className="visually-hidden">Loading...</span></div></div>)}

            <section className="moments-section container-md py-5 pt-3 pt-md-5 mb-5 mt-3 mt-md-2 px-3 px-md-2">
                <div className="heading-container mb-5">
                    <div className="text"><h1 className="m-0 p-0 mb-3">Moments</h1><p className="m-0 p-0 fs-4">Keep and enjoy your best sports moments. Remember the exciting games and achievements that made you proud.</p></div>
                    <div className="button">
                        <button type="button" className="btn p-2" onClick={() => {
                            if (!isLoggedIn) return showLoginToast();
                            const modalEl = document.getElementById("addMomentModal");
                            new window.bootstrap.Modal(modalEl).show();
                        }}>
                            <i className="bi bi-plus-lg me-2"></i>Add Moment
                        </button>
                    </div>
                </div>

                <div className="grid-container">
                    {momentsList.map((moment, index) => (
                        <div className="moment-box" key={index}>
                            <div className={`moment-image mb-3 position-relative ${!(moment.image || moment.imageUrl) ? "no-image-wrapper" : ""}`}>
                                <span className="sport-badge">{moment.sport}</span>
                                <div className="menu-wrapper" ref={(el) => (menuRefs.current[index] = el)} onClick={() => toggleMenu(index)}>
                                    <i className="bi bi-three-dots-vertical menu-icon"></i>
                                    {openMenuIndex === index && (
                                        <div className="menu-dropdown">
                                            <button type="button" onClick={() => { if (!isLoggedIn) return showLoginToast(); handleEdit(moment) }}>Edit</button>
                                            <button type="button" onClick={() => {
                                                if (!isLoggedIn) return showLoginToast();
                                                setDeleteId(moment._id || moment.id);
                                                const modalEl = document.getElementById("deleteMomentModal");
                                                new window.bootstrap.Modal(modalEl).show();
                                            }}>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {moment.image || moment.imageUrl ? <img className="img-fluid" src={moment.image || moment.imageUrl} alt={moment.title} /> : <div className="no-image-inner"><img src={noImage} alt="No image" /></div>}
                            </div>
                            <div className="moment-content pb-3 px-3 pt-0">
                                <div className="top-container">
                                    <h2 className="m-0 p-0 mb-3 fs-3 text-capitalize">{moment.title}</h2>
                                    <p className="m-0 p-0 mb-4">{moment.description}</p>
                                </div>
                                <div className="bottom-container">
                                    <p className="m-0 p-0 text-dark fs-6"><span><i className="bi bi-calendar me-2"></i></span>{formatDate(moment.date)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Moment Modal */}
                <div className="modal fade" id="addMomentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addMomentLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="heading">
                                    <h1 className="modal-title fs-4">Add Moment</h1>
                                    <p className="m-0 mt-2 fs-6 text-center">Add your sports moment and keep your favourite memories saved.</p>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="form mt-3">
                                    <form className="row g-2 py-2 mt-3" onSubmit={handleAddSubmit}>
                                        <div className="mb-1 col-12">
                                            <label htmlFor="moment-title" className="form-label">Title:</label>
                                            <input type="text" id="moment-title" className="form-control" value={form.title} onChange={handleChange} placeholder="Enter a short title for your sports moment" required />
                                        </div>
                                        <div className="mb-1 col-12">
                                            <label htmlFor="moment-type" className="form-label">Sport:</label>
                                            <select id="moment-type" className="form-select" value={form.sport} onChange={handleChange} required>
                                                <option value="" disabled>Select a sport</option>
                                                <option value="Football">Football</option>
                                                <option value="Basketball">Basketball</option>
                                                <option value="Cricket">Cricket</option>
                                                <option value="Tennis">Tennis</option>
                                                <option value="Badminton">Badminton</option>
                                                <option value="Volleyball">Volleyball</option>
                                                <option value="Swimming">Swimming</option>
                                                <option value="Running">Running</option>
                                                <option value="Boxing">Boxing</option>
                                                <option value="Table Tennis">Table Tennis</option>
                                                <option value="Kabbadi">Kabaddi</option>
                                                <option value="Hockey">Hockey</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="mb-2 col-12">
                                            <label htmlFor="moment-image" className="form-label">Image  <span>(Optional)</span>:</label>
                                            <input className="form-control form-control-sm" id="moment-image" type="file" accept=".jpg, .jpeg, .png, .webp" onChange={handleChange} />
                                        </div>
                                        <div className="mb-2 col-12">
                                            <label htmlFor="moment-date" className="form-label">Date <span>(Optional)</span>:</label>
                                            <input type="date" id="moment-date" className="form-control" value={form.date} onChange={handleChange} />
                                        </div>
                                        <div className="mb-4 col-12">
                                            <label htmlFor="moment-desc" className="form-label">Description:</label>
                                            <textarea id="moment-desc" className="form-control" value={form.description} onChange={handleChange} placeholder="Describe what happened in this moment" required />
                                        </div>
                                        <div className="col-12"><button type="submit" className="btn btn-primary w-100">Save Moment</button></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Moment Modal */}
                <div className="modal fade" id="editMomentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="editMomentLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="heading">
                                    <h1 className="modal-title fs-4">Edit Moment</h1>
                                    <p className="m-0 mt-2 fs-6 text-center">Edit your sports moment details.</p>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="form mt-3">
                                    <form className="row g-2 py-2 mt-3" onSubmit={handleEditSubmit}>
                                        <div className="mb-1 col-12">
                                            <label htmlFor="moment-title" className="form-label">Title:</label>
                                            <input type="text" id="moment-title" className="form-control" value={editForm.title} onChange={(e) => handleChange(e, true)} required />
                                        </div>
                                        <div className="mb-1 col-12">
                                            <label htmlFor="moment-type" className="form-label">Sport:</label>
                                            <select id="moment-type" className="form-select" value={editForm.sport} onChange={(e) => handleChange(e, true)} required>
                                                <option value="" disabled>Select a sport</option>
                                                <option value="Football">Football</option>
                                                <option value="Basketball">Basketball</option>
                                                <option value="Cricket">Cricket</option>
                                                <option value="Tennis">Tennis</option>
                                                <option value="Badminton">Badminton</option>
                                                <option value="Volleyball">Volleyball</option>
                                                <option value="Swimming">Swimming</option>
                                                <option value="Running">Running</option>
                                                <option value="Boxing">Boxing</option>
                                                <option value="Table Tennis">Table Tennis</option>
                                                <option value="Kabbadi">Kabaddi</option>
                                                <option value="Hockey">Hockey</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="mb-2 col-12 position-relative">
                                            <label htmlFor="moment-image" className="form-label">
                                                Image <span>(Optional)</span>:
                                            </label>
                                            <input
                                                className="form-control form-control-sm"
                                                id="moment-image"
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={(e) => handleChange(e, true)}
                                            />
                                            {editForm.imageUrl && !editForm.image && (
                                                <span
                                                    className="existing-file translate-middle-y ps-2 text-truncate"
                                                >
                                                    {editForm.imageUrl.split("/").pop()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mb-2 col-12">
                                            <label htmlFor="moment-date" className="form-label">Date <span>(Optional)</span>:</label>
                                            <input type="date" id="moment-date" className="form-control" value={editForm.date || ""} onChange={(e) => handleChange(e, true)} />
                                        </div>
                                        <div className="mb-4 col-12">
                                            <label htmlFor="moment-desc" className="form-label">Description:</label>
                                            <textarea id="moment-desc" className="form-control" value={editForm.description} onChange={(e) => handleChange(e, true)} required />
                                        </div>
                                        <div className="col-12"><button type="submit" className="btn btn-primary w-100">Update Moment</button></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirm Modal */}
                <div
                    className="modal fade"
                    id="deleteMomentModal"
                    tabIndex="-1"
                    aria-labelledby="deleteModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title" id="deleteModalLabel">Delete Moment</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>

                            <div className="modal-body">
                                Are you sure you want to delete this moment?
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn cancel"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn delete"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    </div>
                </div>


            </section>


            <div className="toast-container position-fixed p-3">
                <div ref={toastRef} className="toast custom-toast text-dark border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">{toast.message}</div>
                        <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-progress-wrapper">
                        <div className="toast-progress"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Moments;