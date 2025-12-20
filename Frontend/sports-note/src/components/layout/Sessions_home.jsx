import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Mousewheel, Pagination } from "swiper/modules";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

// Default sessions for non-login users
const defaultSessions = [
  { title: "Morning Basketball Drills", exercises: ["Warm-up jog (5 mins)", "Dribbling practice", "Layup drills", "Free-throw routine", "Cooldown stretches"] },
  { title: "Badminton Smash Training", exercises: ["Warm-up footwork", "Shadow swings", "Smash repetitions", "Net recovery drills"] },
  { title: "Football Dribbling Drills", exercises: ["Cone dribbling", "Fast touches", "Directional changes", "Ball control challenges"] },
  { title: "Cardio and Endurance", exercises: ["5km run", "Interval sprints", "Jump rope (10 mins)", "Cooldown stretching"] },
  { title: "Badminton Rally Session", exercises: ["Long rallies", "Placement shots", "Side-to-side drills"] },
  { title: "Football Shooting Practice", exercises: ["First-touch shots", "Power shooting", "Target accuracy"] },
  { title: "Badminton Footwork Practice", exercises: ["Front-back steps", "Side-to-side steps", "Recovery training"] },
];

function Sessions_home() {
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const token = localStorage.getItem("token");

  const [sessionsList, setSessionsList] = useState([]);
  const [selected, setSelected] = useState(null); // start with null
  const [openMenu, setOpenMenu] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRef = useRef(null);
  const menuRefs = useRef([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showArrows, setShowArrows] = useState(false);
  const swiperRef = useRef(null);

  // Toast
  const toastRef = useRef(null);
  const [toast, setToast] = useState({ message: "" });
  const showToast = (message) => {
    setToast({ message });
    const toastElement = toastRef.current;
    if (!toastElement) return;
    const progress = toastElement.querySelector(".toast-progress");
    progress.style.animation = "none";
    progress.offsetHeight;
    progress.style.animation = "shrink 3s linear forwards";
    new window.bootstrap.Toast(toastElement, { delay: 3000 }).show();
  };
  const showLoginToast = () => showToast("Please login to continue");

  const [loading, setLoading] = useState(false);

  // Form state for add/edit
  const [form, setForm] = useState({ title: "", exercises: [""] }); // ✅ CHANGED 'exercises' to 'exercises'
  const [editForm, setEditForm] = useState({ id: null, title: "", exercises: [""] }); // ✅ CHANGED 'exercises' to 'exercises'
  const [deleteId, setDeleteId] = useState(null);

  // Fetch sessions from backend if logged in
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user || !token) {
        setSessionsList(defaultSessions);
        setSelected(defaultSessions[0]);
        return;
      }

      try {
        setLoading(true);
        // const res = await axios.get("https://sports-note-backend.onrender.com/api/sessions", { withCredentials: true });

        const res = await axios.get(
          "https://sports-note-backend.onrender.com/api/sessions",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );


        setSessionsList(res.data);
        setSelected(res.data.length > 0 ? res.data[0] : null);
      } catch (err) {
        setSessionsList([]);
        setSelected(null);
        console.error("Failed to fetch sessions:", err);
        showToast("Failed to fetch sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);


  // Track screen resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenu && menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(false);
      if (openMenuIndex !== null && menuRefs.current[openMenuIndex] && !menuRefs.current[openMenuIndex].contains(e.target)) setOpenMenuIndex(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu, openMenuIndex]);

  // Update swiper & arrow visibility
  const updateArrows = () => {
    const swiper = swiperRef.current;
    if (!swiper || !swiper.slides) return;

    // Desktop: compare slide count with slidesPerView
    if (screenWidth >= 1024) {
      setShowArrows(swiper.slides.length > swiper.params.slidesPerView);
    }

    // Mobile: compare total slides width with container
    else {
      const totalWidth = Array.from(swiper.slides).reduce(
        (sum, slide) => sum + slide.offsetWidth + (swiper.params.spaceBetween || 0),
        0
      );
      setShowArrows(totalWidth > swiper.width);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(updateArrows, 50); // Wait for swiper to render
    return () => clearTimeout(timeout);
  }, [screenWidth, selected, sessionsList]);

  // Arrow button handlers
  const slidePrev = () => swiperRef.current?.slidePrev();
  const slideNext = () => swiperRef.current?.slideNext();

  // Form handlers
  const handleChange = (e, edit = false, index = null) => {
    const { value } = e.target;
    if (index !== null) {
      if (edit) {
        const exercises = [...editForm.exercises];
        exercises[index] = value;
        setEditForm(prev => ({ ...prev, exercises }));
      } else {
        const exercises = [...form.exercises];
        exercises[index] = value;
        setForm(prev => ({ ...prev, exercises }));
      }
      return;
    }


    if (edit) setEditForm(prev => ({ ...prev, title: value }));
    else setForm(prev => ({ ...prev, title: value }));
  };

  const addItem = (edit = false) => {
    if (edit) setEditForm(prev => ({ ...prev, exercises: [...prev.exercises, ""] }));
    else setForm(prev => ({ ...prev, exercises: [...prev.exercises, ""] }));
  };


  const deleteItem = (index, edit = false) => {
    if (edit) setEditForm(prev => ({ ...prev, exercises: prev.exercises.filter((_, i) => i !== index) }));
    else setForm(prev => ({ ...prev, exercises: prev.exercises.filter((_, i) => i !== index) }));
  };

  // Add session
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return showLoginToast();
    setLoading(true);
    const modalEl = document.getElementById("addSessionModal");
    try {
      // const res = await axios.post("https://sports-note-backend.onrender.com/api/sessions", form, { withCredentials: true });

      const res = await axios.post(
        "https://sports-note-backend.onrender.com/api/sessions",
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSessionsList(prev => [res.data, ...prev]);
      setSelected(res.data); // select newly added
      setForm({ title: "", exercises: [""] });
      window.bootstrap.Modal.getInstance(modalEl)?.hide();
      showToast("Session added successfully!");
    } catch {
      window.bootstrap.Modal.getInstance(modalEl)?.hide();
      showToast("Failed to add session.");
    } finally { setLoading(false); }
  };

  // Edit session
  const handleEdit = (session) => {
    setEditForm({ id: session._id, title: session.title, exercises: session.exercises });
    const modalEl = document.getElementById("editSessionModal");
    new window.bootstrap.Modal(modalEl).show();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const modalEl = document.getElementById("editSessionModal");
    try {
      // const res = await axios.put(`https://sports-note-backend.onrender.com/api/sessions/${editForm.id}`, editForm, { withCredentials: true });

      const res = await axios.put(
        `https://sports-note-backend.onrender.com/api/sessions/${editForm.id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSessionsList(prev => prev.map(session => session._id === editForm.id ? res.data : session));
      setSelected(res.data); // update selected if edited
      window.bootstrap.Modal.getInstance(modalEl)?.hide();
      showToast("Session updated successfully!");
    } catch {
      window.bootstrap.Modal.getInstance(modalEl)?.hide();
      showToast("Failed to update session.");
    } finally { setLoading(false); }
  };

  // Delete session
  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    const modalEl = document.getElementById("deleteSessionModal");
    try {
      // await axios.delete(`https://sports-note-backend.onrender.com/api/sessions/${deleteId}`, { withCredentials: true });

      await axios.delete(
        `https://sports-note-backend.onrender.com/api/sessions/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedList = sessionsList.filter(session => session._id !== deleteId);

      setSessionsList(updatedList);

      if (selected?._id === deleteId) {
        setSelected(updatedList.length > 0 ? updatedList[0] : null);
      }

      window.bootstrap.Modal.getInstance(modalEl)?.hide();
      showToast("Session deleted successfully!");

    } catch {
      window.bootstrap.Modal.getInstance(modalEl)?.hide();
      showToast("Failed to delete session.");

    } finally { setLoading(false); }
  };


  return (
    <>
      {loading && (<div className="loading-overlay"><div className="spinner-border text-light" role="status"></div></div>)}

      {sessionsList.length > 0 && selected && selected.exercises?.length > 0 && (
        <section className="sessions-section py-5">
          <div className="sessions-container container-md px-3 px-md-2">
            <div className="heading-container mb-5">
              <div className="text">
                <h1 className="m-0 p-0 mb-3">Sessions</h1>
                <p className="m-0 p-0 fs-4">
                  Record your training sessions and exercises to stay on track and improve your performance.
                </p>
              </div>
              <div className="button">
                <button type="button" className="btn p-2" onClick={() => {
                  if (!isLoggedIn) return showLoginToast();
                  const modalEl = document.getElementById("addSessionModal");
                  new window.bootstrap.Modal(modalEl).show();
                }}><i className="bi bi-plus-lg me-2"></i>Add Session</button>
              </div>
            </div>


            <div className="grid-container">
              <div className="content">
                <div className="menu-wrapper" ref={menuRef} onClick={() => setOpenMenu(!openMenu)}>
                  <i className="bi bi-three-dots-vertical menu-icon" title="Actions"></i>
                  {openMenu && (
                    <div className="menu-dropdown">
                      <button onClick={() => { if (!isLoggedIn) return showLoginToast(); handleEdit(selected) }}>Edit</button>
                      <button onClick={() => {
                        {
                          if (!isLoggedIn) return showLoginToast();
                          setDeleteId(selected._id);
                          new window.bootstrap.Modal(document.getElementById("deleteSessionModal")).show();
                        }
                      }}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {selected && (
                  <>
                    <h1 className="mb-3 text-capitalize">{selected.title}</h1>
                    <p className="exercise-title m-0 p-0 fs-4 mb-2">Exercises:</p>
                    <ul className="mt-0">
                      {selected.exercises.map((item, i) => (
                        <li key={i} className="fs-5">{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="buttons">
                {screenWidth >= 1024 && showArrows && (
                  <div className="arrow-desktop-container">
                    <button className="arrow-btn up" onClick={slidePrev}><i className="bi bi-caret-up-fill"></i></button>
                    <button className="arrow-btn down" onClick={slideNext}><i className="bi bi-caret-down-fill"></i></button>
                  </div>
                )}
                {screenWidth < 1024 && showArrows && (
                  <>
                    <button className="arrow-btn left" onClick={slidePrev}><i className="bi bi-caret-left-fill"></i></button>
                    <button className="arrow-btn right" onClick={slideNext}><i className="bi bi-caret-right-fill"></i></button>
                  </>
                )}

                <Swiper
                  key={screenWidth}
                  direction={screenWidth >= 1024 ? "vertical" : "horizontal"}
                  slidesPerView={screenWidth >= 1024 ? 5 : "auto"}
                  spaceBetween={screenWidth >= 1024 ? 0 : 5}
                  mousewheel={screenWidth >= 1024}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  onSwiper={(swiper) => { swiperRef.current = swiper; setTimeout(updateArrows, 50); }}
                  observer={true}
                  observeParents={true}
                  modules={[Mousewheel, Pagination]}
                  className="mySwiper"
                >
                  {sessionsList.map((session, index) => (
                    <SwiperSlide key={index}>
                      <button
                        className={`session-btn ${selected?.title === session.title ? "active" : ""} text-truncate text-capitalize`}
                        onClick={() => setSelected(session)}
                      >
                        {session.title}
                        <hr className="session-divider" />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>


            <div className="explore mt-5">
              <Link to="/sessions" className="text-decoration-none"><button type="button" className="btn p-3 p-lg-3 fs-6 fs-lg-5">EXPLORE MORE</button></Link>
            </div>
          </div>

          {/*Add Session Modal */}
          <div className="modal fade"
            id="addSessionModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="addSessionLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="heading">
                    <h1 className="modal-title fs-4" id="staticBackdropLabel">Add Session</h1>
                    <p className="m-0 mt-2 fs-6 text-center">
                      Save your training session details and exercises.
                    </p>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>

                  <div className="form mt-3">
                    <form className="row g-2 gx-3 py-2" onSubmit={handleAddSubmit}>
                      <div className="mb-1 col-12">
                        <label htmlFor="session-title" className="form-label">Session Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="session-title"
                          placeholder="Enter a session name"
                          value={form.title}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>

                      <div className="mb-4 col-12">
                        <label className="form-label">Exercises:</label>

                        {form.exercises.map((step, index) => (
                          <div key={index} className="exercise d-flex align-items-center mb-2">
                            <input
                              type="text"
                              className="form-control"
                              value={step}
                              onChange={(e) => handleChange(e, false, index)}
                              placeholder={`Enter Exercise/Activity ${index + 1}`}
                              required
                            />

                            <button
                              type="button"
                              className="btn btn-sm ms-2"
                              onClick={() => deleteItem(index)}
                              disabled={form.exercises.length === 1}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="add btn btn-sm mt-2"
                          onClick={() => addItem()}
                        >
                          <i className="bi bi-plus-lg me-1"></i>Add Exercise
                        </button>
                      </div>

                      <div className="col-12">
                        <button type="submit" className="btn btn-primary fs-6 w-100">Save Session</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>




          {/* Edit Session Modal */}
          <div className="modal fade"
            id="editSessionModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="editSessionLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="heading">
                    <h1 className="modal-title fs-4" id="editSessionLabel">Edit Session</h1>
                    <p className="m-0 mt-2 fs-6 text-center">
                      Update your training session details and exercises.
                    </p>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>

                  <div className="form mt-3">
                    <form className="row g-2 gx-3 py-2" onSubmit={handleEditSubmit}>
                      <div className="mb-1 col-12">
                        <label htmlFor="edit-session-title" className="form-label">Session Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="edit-session-title"
                          placeholder="Enter a session name"
                          value={editForm.title}
                          onChange={(e) => handleChange(e, true)}
                          required
                        />
                      </div>

                      <div className="mb-4 col-12">
                        <label className="form-label">Exercises:</label>

                        {editForm.exercises.map((step, index) => (
                          <div key={index} className="exercise d-flex align-items-center mb-2">
                            <input
                              type="text"
                              className="form-control"
                              value={step}
                              onChange={(e) => handleChange(e, true, index)}
                              placeholder={`Enter Exercise/Activity ${index + 1}`}
                              required
                            />

                            <button
                              type="button"
                              className="btn btn-sm ms-2"
                              onClick={() => deleteItem(index, true)}
                              disabled={editForm.exercises.length === 1}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="add btn btn-sm mt-2"
                          onClick={() => addItem(true)}
                        >
                          <i className="bi bi-plus-lg me-1"></i>Add Exercise
                        </button>
                      </div>

                      <div className="col-12">
                        <button type="submit" className="btn btn-primary fs-6 w-100">Update Session</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Delete Session Modal */}
          <div className="modal fade"
            id="deleteSessionModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-hidden="true">

            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Session</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">Are you sure you want to delete this session?</div>
                <div className="modal-footer">
                  <button type="button" className="btn cancel" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" className="btn delete" onClick={confirmDelete}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        </section>

      )}

      {/* Toast */}
      <div className="toast-container position-fixed p-3">
        <div ref={toastRef} className="toast custom-toast" role="alert" aria-live="assertive" aria-atomic="true">
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

export default Sessions_home