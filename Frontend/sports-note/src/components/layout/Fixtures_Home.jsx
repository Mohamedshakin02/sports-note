import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

function Fixtures_Home() {
    const { user } = useContext(AuthContext); // get logged-in user
    const token = localStorage.getItem("token");
    const [fixturesList, setFixturesList] = useState([]);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const menuRefs = useRef([]);
    const swiperRef = useRef(null);


    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({ team1: "", team2: "", sport: "", date: "", time: "" });
    const [editForm, setEditForm] = useState({ id: null, team1: "", team2: "", sport: "", date: "", time: "" });
    const [deleteId, setDeleteId] = useState(null);

    const toastRef = useRef(null);
    const [toast, setToast] = useState({ message: "" });

    const defaultFixtures = [
        { date: "2024-11-19", team1: "INDIA", team2: "PAK", time: "9:30", sport: "Cricket" },
        { date: "2024-11-20", team1: "AUSTRALIA", team2: "ENG", time: "14:00", sport: "Cricket" },
        { date: "2024-11-22", team1: "BARCELONA", team2: "REAL MADRID", time: "20:45", sport: "Football" },
        { date: "2024-11-23", team1: "MAN UNITED", team2: "ARSENAL", time: "", sport: "Football" },
        { date: "2024-11-25", team1: "BULLS", team2: "CELTICS", time: "", sport: "Basketball" }
    ];

    const isLoggedIn = !!user;

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

    const showLoginToast = () => showToast("Please login to continue");

    // Fetch fixtures from backend
    useEffect(() => {
        if (!user || !token) {
            setFixturesList(defaultFixtures);
            return;
        }
        const fetchFixtures = async () => {
            try {
                setLoading(true);
                // const res = await axios.get("https://sports-note-backend.onrender.com/api/fixtures", { withCredentials: true });

                const res = await axios.get("https://sports-note-backend.onrender.com/api/fixtures", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setFixturesList(res.data);
            } catch (err) {
                setFixturesList([]);
                console.error("Failed to fetch fixtures:", err);
                showToast("Failed to load fixtures");
            }
            finally { setLoading(false); }
        };
        fetchFixtures();
    }, [user]);

    const toggleMenu = (index) => {
        setOpenMenuIndex(prev => (prev === index ? null : index));
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                openMenuIndex !== null &&
                menuRefs.current[openMenuIndex] &&
                !menuRefs.current[openMenuIndex].contains(e.target)
            ) {
                setOpenMenuIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuIndex]);

    const handleChange = (e, edit = false) => {
        const { id, value } = e.target;
        const keyMap = {
            "fixture-team-1": "team1",
            "fixture-team-2": "team2",
            "fixture-type": "sport",
            "fixture-date": "date",
            "fixture-time": "time",
            "fixture-team1": "team1",
            "fixture-team2": "team2",
        };
        const key = keyMap[id] || id;

        if (edit) setEditForm(prev => ({ ...prev, [key]: value }));
        else setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) return showLoginToast();
        setLoading(true);
        try {
            // const res = await axios.post("https://sports-note-backend.onrender.com/api/fixtures", form, { withCredentials: true });

            const res = await axios.post(
                "https://sports-note-backend.onrender.com/api/fixtures",
                form,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setFixturesList(prev => [res.data, ...prev]);
            setForm({ team1: "", team2: "", sport: "", date: "", time: "" });
            const modalEl = document.getElementById("addFixtureModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Fixture added successfully!");
        } catch {
            const modalEl = document.getElementById("addFixtureModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Failed to add fixture.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (fixture) => {
        const formattedDate = fixture.date ? fixture.date.split('T')[0] : '';
        setEditForm({ id: fixture._id, ...fixture, date: formattedDate });
        const modalEl = document.getElementById("editFixtureModal");
        new window.bootstrap.Modal(modalEl).show();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // const res = await axios.put(`https://sports-note-backend.onrender.com/api/fixtures/${editForm.id}`, editForm, { withCredentials: true });

            const res = await axios.put(
                `https://sports-note-backend.onrender.com/api/fixtures/${editForm.id}`,
                editForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFixturesList(prev => prev.map(fixture => (fixture._id === editForm.id ? res.data : fixture)));
            const modalEl = document.getElementById("editFixtureModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Fixture updated successfully!");
        } catch {
            const modalEl = document.getElementById("editFixtureModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Failed to update fixture.");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            // await axios.delete(`https://sports-note-backend.onrender.com/api/fixtures/${deleteId}`, { withCredentials: true });

            await axios.delete(
                `https://sports-note-backend.onrender.com/api/fixtures/${deleteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFixturesList(prev => prev.filter(fixture => fixture._id !== deleteId));
            const modalEl = document.getElementById("deleteFixtureModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Fixture deleted successfully!");
        } catch {
            const modalEl = document.getElementById("deleteFixtureModal");
            window.bootstrap.Modal.getInstance(modalEl).hide();
            showToast("Failed to delete fixture.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();
    };

    const sortFixtures = (fixtures) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return fixtures.slice().sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            dateA.setHours(0, 0, 0, 0);
            dateB.setHours(0, 0, 0, 0);

            const isAUpcoming = dateA >= today;
            const isBUpcoming = dateB >= today;

            // Upcoming fixtures first
            if (isAUpcoming && !isBUpcoming) return -1;
            if (!isAUpcoming && isBUpcoming) return 1;

            // Both upcoming - ascending order
            if (isAUpcoming && isBUpcoming) return dateA - dateB;

            // Both past - descending order
            if (!isAUpcoming && !isBUpcoming) return dateB - dateA;

            return 0;
        });
    };

    return (
        <>
            {loading && (<div className="loading-overlay"><div className="spinner-border text-light" role="status"></div></div>)}

            {fixturesList && fixturesList.length > 0 && (
                <section className="fixtures-section py-5 mt-2">
                    <div className="fixtures-container container-md px-3 px-md-2">
                        <div className="heading-container mb-5">
                            <div className="text">
                                <h1 className="m-0 p-0 mb-3">Fixtures</h1>
                                <p className="m-0 p-0 fs-4">
                                    See all the upcoming matches you want to watch. Keep track of dates and times so you never miss any game.
                                </p>
                            </div>
                            <div className="button">
                                <button type="button" className="btn p-2" onClick={() => {
                                    if (!isLoggedIn) return showLoginToast();
                                    const modalEl = document.getElementById("addFixtureModal");
                                    new window.bootstrap.Modal(modalEl).show();
                                }}>
                                    <i className="bi bi-plus-lg me-2"></i>Add Fixture
                                </button>
                            </div>
                        </div>

                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true, dynamicBullets: true }}
                            spaceBetween={25}
                            breakpoints={{
                                320: { slidesPerView: 1.2, spaceBetween: 15, centeredSlides: true },
                                576: { slidesPerView: 2, spaceBetween: 15, centeredSlides: false },
                                992: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },
                                1400: { slidesPerView: 4, spaceBetween: 20, centeredSlides: false },
                            }}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            className="fixtures-slider"
                        >
                            {sortFixtures(fixturesList).map((fixture, index) => (
                                <SwiperSlide key={index} className="fixture-slide">
                                    <div className="fixture-box pt-0 text-center">
                                        <div className="top-container p-2 py-3 d-flex flex-column justify-content-center align-items-center">
                                            <h2 className="m-0 fs-3">{formatDate(fixture.date)}</h2>

                                            <div
                                                className="menu-wrapper"
                                                ref={(el) => (menuRefs.current[index] = el)}
                                                onClick={() => toggleMenu(index)}
                                            >
                                                <i className="bi bi-three-dots-vertical menu-icon" title="Actions"></i>

                                                {openMenuIndex === index && (
                                                    <div className="menu-dropdown">
                                                        <button onClick={() => { if (!isLoggedIn) return showLoginToast(); handleEdit(fixture); }}>Edit</button>
                                                        <button onClick={() => { if (!isLoggedIn) return showLoginToast(); setDeleteId(fixture._id); new window.bootstrap.Modal(document.getElementById("deleteFixtureModal")).show(); }}>Delete</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bottom-container p-4">
                                            <p className="sport-badge m-0 p-0 mt-2 rounded-pill">{fixture.sport}</p>
                                            <p className="m-0 p-0 my-2 mt-3 fs-4 fw-bolder">{fixture.team1} VS {fixture.team2}</p>
                                            <p className="m-0 p-0 fs-6"><i className="bi bi-clock me-2"></i>{fixture.time || "N/A"}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="explore mt-4">
                            <Link to="/fixtures" className="text-decoration-none">
                                <button type="button" className="btn p-3 p-lg-3 fs-6 fs-lg-5">EXPLORE MORE</button>
                            </Link>
                        </div>
                    </div>

                    {/* Add Fixture Modal */}
                    <div className="modal fade"
                        id="addFixtureModal"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="addFixtureLabel"
                        aria-hidden="true">

                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">

                                <div className="modal-body">
                                    <div className="heading">
                                        <h1 className="modal-title fs-4" id="staticBackdropLabel">Add Fixture</h1>
                                        <p className="m-0 mt-2 fs-6 text-center">
                                            Add an upcoming match to your fixtures list.
                                        </p>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>

                                    <div className="form mt-3">
                                        <form className="row g-2 gx-3 py-2" onSubmit={handleAddSubmit}>
                                            <div className="mb-1 col-6">
                                                <label htmlFor="fixture-team-1" className="form-label">Team 1:</label>
                                                <input type="text" className="form-control" id="fixture-team-1" placeholder="Enter Team 1" value={form.team1} onChange={(e) => handleChange(e)} required />
                                            </div>

                                            <div className="mb-1 col-6">
                                                <label htmlFor="fixture-team-2" className="form-label">Team 2:</label>
                                                <input type="text" className="form-control" id="fixture-team-2" placeholder="Enter Team 2" value={form.team2} onChange={(e) => handleChange(e)} required />
                                            </div>

                                            <div className="mb-1 col-12">
                                                <label htmlFor="fixture-type" className="form-label">Sport:</label>
                                                <select className="form-control form-select py-1" aria-label="Sport select" id="fixture-type" value={form.sport} onChange={(e) => handleChange(e)} required>
                                                    <option value="" disabled>Select a sport</option>
                                                    <option value="Football">Football</option>
                                                    <option value="Basketball">Basketball</option>
                                                    <option value="Cricket">Cricket</option>
                                                    <option value="Tennis">Tennis</option>
                                                    <option value="Badminton">Badminton</option>
                                                    <option value="Volleyball">Volleyball</option>
                                                    <option value="Boxing">Boxing</option>
                                                    <option value="Table Tennis">Table Tennis</option>
                                                    <option value="Kabbadi">Kabaddi</option>
                                                    <option value="Hockey">Hockey</option>
                                                    <option value="Racing">Racing</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            <div className="mb-2 col-12">
                                                <label htmlFor="fixture-date" className="form-label">Date:</label>
                                                <input type="date" className="form-control" id="fixture-date" value={form.date} onChange={(e) => handleChange(e)} required />
                                            </div>

                                            <div className="mb-3 col-12">
                                                <label htmlFor="fixture-time" className="form-label">Time <span>(Optional)</span>:</label>
                                                <input type="time" className="form-control" id="fixture-time" value={form.time} onChange={(e) => handleChange(e)} />
                                            </div>


                                            <div className="col-12">
                                                <button type="submit" className="btn btn-primary fs-6 w-100">Save Fixture</button>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Fixture Modal */}
                    <div className="modal fade"
                        id="editFixtureModal"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="editFixtureLabel"
                        aria-hidden="true">

                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">

                                <div className="modal-body">
                                    <div className="heading">
                                        <h1 className="modal-title fs-4" id="editFixtureLabel">Edit Fixture</h1>
                                        <p className="m-0 mt-2 fs-6 text-center">
                                            Update fixture details below.
                                        </p>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>

                                    <div className="form mt-3">
                                        <form className="row g-2 gx-3 py-2" onSubmit={handleEditSubmit}>
                                            <div className="mb-1 col-6">
                                                <label htmlFor="fixture-team1" className="form-label">Team 1:</label>
                                                <input type="text" className="form-control" id="fixture-team1"
                                                    value={editForm.team1} onChange={(e) => handleChange(e, true)} required />
                                            </div>

                                            <div className="mb-1 col-6">
                                                <label htmlFor="fixture-team2" className="form-label">Team 2:</label>
                                                <input type="text" className="form-control" id="fixture-team2"
                                                    value={editForm.team2} onChange={(e) => handleChange(e, true)} required />
                                            </div>

                                            <div className="mb-1 col-12">
                                                <label htmlFor="fixture-type" className="form-label">Sport:</label>
                                                <select className="form-control form-select py-1" id="fixture-type"
                                                    value={editForm.sport} onChange={(e) => handleChange(e, true)} required>
                                                    <option value="" disabled>Select a sport</option>
                                                    <option value="Football">Football</option>
                                                    <option value="Basketball">Basketball</option>
                                                    <option value="Cricket">Cricket</option>
                                                    <option value="Tennis">Tennis</option>
                                                    <option value="Badminton">Badminton</option>
                                                    <option value="Volleyball">Volleyball</option>
                                                    <option value="Boxing">Boxing</option>
                                                    <option value="Table Tennis">Table Tennis</option>
                                                    <option value="Kabbadi">Kabaddi</option>
                                                    <option value="Hockey">Hockey</option>
                                                    <option value="Cacing">Racing</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            <div className="mb-2 col-12">
                                                <label htmlFor="fixture-date" className="form-label">Date:</label>
                                                <input type="date" className="form-control" id="fixture-date"
                                                    value={editForm.date} onChange={(e) => handleChange(e, true)} required />
                                            </div>

                                            <div className="mb-3 col-12">
                                                <label htmlFor="fixture-time" className="form-label">Time <span>(Optional)</span>:</label>
                                                <input type="time" className="form-control" id="fixture-time"
                                                    value={editForm.time} onChange={(e) => handleChange(e, true)} />
                                            </div>

                                            <div className="col-12">
                                                <button type="submit" className="btn btn-primary fs-6 w-100">Update Fixture</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delete Confirm Modal */}
                    <div
                        className="modal fade"
                        id="deleteFixtureModal"
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

            )}

            {/* Toast */}
            <div className="toast-container position-fixed p-3">
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
        </>
    );


}

export default Fixtures_Home;
