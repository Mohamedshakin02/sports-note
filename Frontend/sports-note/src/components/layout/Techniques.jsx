import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

// Default techniques for non-login users
const defaultTechniques = [
  {
    title: "Rainbow Flick",
    steps: [
      "Place your dominant foot in front of the ball",
      "Roll the ball up the back of your standing leg",
      "Flick your standing leg forward and upward",
      "The ball should arc over your head and land in front of you"
    ],
    sport: "Football"
  },
  {
    title: "Cover Drive",
    steps: [
      "Take a side-on stance",
      "Step forward with your front foot toward the pitch of the ball",
      "Swing the bat smoothly along the ground",
      "Hit the ball along the ground through the cover region"
    ],
    sport: "Cricket"
  },
  {
    title: "Reverse Sweep",
    steps: [
      "Take a normal batting stance",
      "Rotate your wrists and bat to sweep the ball opposite direction",
      "Bend your knees slightly for balance",
      "Follow through to guide the ball past fielders"
    ],
    sport: "Cricket"
  },
  {
    title: "Jump Smash",
    steps: [
      "Stand in a ready position with knees slightly bent",
      "Move quickly under the shuttle and jump upward",
      "Rotate your shoulders and swing your racket overhead",
      "Hit the shuttle downward with power while landing balanced"
    ],
    sport: "Badminton"
  },
  {
    title: "Crossover Dribble",
    steps: [
      "Start dribbling the ball with your dominant hand",
      "Lower your body to maintain control",
      "Quickly bounce the ball to your opposite hand",
      "Explode in the new direction to beat your defender"
    ],
    sport: "Basketball"
  }
];

function Techniques() {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [techniquesList, setTechniquesList] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);
  const toastRef = useRef(null);
  const [toast, setToast] = useState({ message: "" });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", sport: "", steps: [""] });
  const [editForm, setEditForm] = useState({ id: null, title: "", sport: "", steps: [""] });
  const [deleteId, setDeleteId] = useState(null);

  const isLoggedIn = !!user;
  const showLoginToast = () => showToast("Please login to continue");

  const toggleMenu = (index) => setOpenMenuIndex(prev => (prev === index ? null : index));

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuIndex !== null &&
        menuRefs.current[openMenuIndex] &&
        !menuRefs.current[openMenuIndex].contains(event.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuIndex]);

  useEffect(() => {
    if (!user || !token) {
      setTechniquesList(defaultTechniques);
      return;
    }
    const fetchTechniques = async () => {
      try {
        setLoading(true);
        // const res = await axios.get("https://sports-note-backend.onrender.com/api/techniques", { withCredentials: true });

        const res = await axios.get(
          "https://sports-note-backend.onrender.com/api/techniques",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Sort by createdAt ascending so oldest first
        const sorted = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setTechniquesList(sorted);
      } catch (err) {
        setTechniquesList([]);
        console.error("Failed to fetch tecnhiques:", err);
        showToast("Failed to fetch techniques.");
      }
      finally { setLoading(false); }
    };
    fetchTechniques();
  }, [user]);

  const handleChange = (e, edit = false, stepIndex = null) => {
    const { id, value } = e.target;
    if (stepIndex !== null) {
      if (edit) {
        const steps = [...editForm.steps];
        steps[stepIndex] = value;
        setEditForm(prev => ({ ...prev, steps }));
      } else {
        const steps = [...form.steps];
        steps[stepIndex] = value;
        setForm(prev => ({ ...prev, steps }));
      }
      return;
    }


    const keyMap = {
      "tech-title": "title",
      "tech-sport": "sport",
      "edit-tech-title": "title",
      "edit-tech-sport": "sport"
    };

    const key = keyMap[id] || id;
    if (edit) setEditForm(prev => ({ ...prev, [key]: value }));
    else setForm(prev => ({ ...prev, [key]: value }));


  };

  const addStep = (edit = false) => {
    if (edit) setEditForm(prev => ({ ...prev, steps: [...prev.steps, ""] }));
    else setForm(prev => ({ ...prev, steps: [...prev.steps, ""] }));
  };

  const deleteStep = (index, edit = false) => {
    if (edit) setEditForm(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));
    else setForm(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const res = await axios.post("https://sports-note-backend.onrender.com/api/techniques", form, { withCredentials: true });

      const res = await axios.post(
        "https://sports-note-backend.onrender.com/api/techniques",
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTechniquesList(prev => [...prev, res.data]);
      setForm({ title: "", sport: "", steps: [""] });
      window.bootstrap.Modal.getInstance(document.getElementById("addTechniqueModal")).hide();
      showToast("Technique added successfully!");
    } catch {
      window.bootstrap.Modal.getInstance(document.getElementById("addTechniqueModal")).hide();
      showToast("Failed to add technique.");
    } finally { setLoading(false); }
  };

  const handleEdit = (tech) => {
    setEditForm({ id: tech._id, title: tech.title, sport: tech.sport, steps: tech.steps });
    new window.bootstrap.Modal(document.getElementById("editTechniqueModal")).show();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const res = await axios.put(`https://sports-note-backend.onrender.com/api/techniques/${editForm.id}`, editForm, { withCredentials: true });

      const res = await axios.put(
        `https://sports-note-backend.onrender.com/api/techniques/${editForm.id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTechniquesList(prev => prev.map(technique => (technique._id === editForm.id ? res.data : technique)));
      window.bootstrap.Modal.getInstance(document.getElementById("editTechniqueModal")).hide();
      showToast("Technique updated successfully!");
    } catch {
      window.bootstrap.Modal.getInstance(document.getElementById("editTechniqueModal")).hide();
      showToast("Failed to update technique.");
    }
    finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      // await axios.delete(`https://sports-note-backend.onrender.com/api/techniques/${deleteId}`, { withCredentials: true });

      await axios.delete(
        `https://sports-note-backend.onrender.com/api/techniques/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTechniquesList(prev => prev.filter(technique => technique._id !== deleteId));
      window.bootstrap.Modal.getInstance(document.getElementById("deleteTechniqueModal")).hide();
      showToast("Technique deleted successfully!");
    } catch {
      window.bootstrap.Modal.getInstance(document.getElementById("deleteTechniqueModal")).hide();
      showToast("Failed to delete technique.");
    }
    finally { setLoading(false); }
  };

  return (
    <>
      {loading && (<div className="loading-overlay"><div className="spinner-border text-light" role="status"></div></div>)}


      <section className="techniques-section py-5 mt-2 container-md px-3 px-md-2">
        <div className="heading-container mb-5">
          <div className="text">
            <h1 className="m-0 p-0 mb-3">Techniques</h1>
            <p className="m-0 p-0 fs-4">
              Learn step-by-step moves and drills. Practice them to improve your
              skills and play better.
            </p>
          </div>
          <div className="button">
            <button type="button" className="btn p-2" onClick={() => {
              if (!isLoggedIn) return showLoginToast();
              const modalEl = document.getElementById("addTechniqueModal");
              new window.bootstrap.Modal(modalEl).show();
            }}><i className="bi bi-plus-lg me-2"></i>Add Technique</button>
          </div>
        </div>


        <div className="accordion accordion-flush" id="accordionFlushExample">
          {techniquesList.map((tech, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header">
                <button className="accordion-button collapsed fs-5 text-capitalize" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse-${index}`}>
                  {tech.title} <span className="sport-badge m-0 p-0 ms-2 rounded-pill">{tech.sport}</span>
                  <i className="bi bi-caret-down-fill ms-auto ps-2 custom-arrow"></i>
                </button>
              </h2>
              <div id={`flush-collapse-${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div className="accordion-body">
                  <div className="menu-wrapper" ref={(el) => (menuRefs.current[index] = el)} onClick={() => toggleMenu(index)}>
                    <i className="bi bi-three-dots-vertical menu-icon" title="Actions"></i>
                    {openMenuIndex === index && (
                      <div className="menu-dropdown">
                        <button onClick={() => { if (!isLoggedIn) return showLoginToast(); handleEdit(tech) }}>Edit</button>
                        <button onClick={() => { if (!isLoggedIn) return showLoginToast(); setDeleteId(tech._id); new window.bootstrap.Modal(document.getElementById("deleteTechniqueModal")).show(); }}>
                          Delete
                        </button>
                      </div>
                    )}

                  </div>
                  <p className="body-head m-0 p-0 fs-5 mb-3">Steps:</p>
                  <ol>
                    {tech.steps.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Technique Modal */}
        <div className="modal fade" id="addTechniqueModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-body">
                <div className="heading">
                  <h1 className="modal-title fs-4" id="staticBackdropLabel">Add Technique</h1>
                  <p className="m-0 mt-2 fs-6 text-center">
                    Create a step-by-step tutorial for a trick shot or technique.
                  </p>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div className="form mt-3">
                  <form className="row g-2 gx-3 py-2" onSubmit={handleAddSubmit}>
                    <div className="mb-1 col-12">
                      <label htmlFor="tech-title" className="form-label">Technique Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tech-title"
                        placeholder="Enter a technique name"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-1 col-12">
                      <label htmlFor="tech-sport" className="form-label">Sport:</label>
                      <select
                        className="form-control form-select py-1"
                        aria-label="Sport select"
                        id="tech-sport"
                        value={form.sport}
                        onChange={handleChange}
                        required
                      >
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

                    <div className="mb-4 col-12">
                      <label className="form-label">Steps:</label>
                      {form.steps.map((step, index) => (
                        <div key={index} className="step d-flex align-items-center mb-2">
                          <span className="me-2 mt-1 fw-bold">{index + 1}.</span>
                          <input
                            type="text"
                            className="form-control"
                            value={step}
                            onChange={(e) => handleChange(e, false, index)}
                            placeholder={`Enter Step ${index + 1}`}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-sm ms-2"
                            onClick={() => deleteStep(index)}
                            disabled={form.steps.length === 1}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}

                      <button type="button" className="btn btn-sm mt-2" onClick={() => addStep()}>
                        <i className="bi bi-plus-lg me-1"></i>Add Step
                      </button>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary fs-6 w-100">Save Technique</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Technique Modal */}
        <div className="modal fade" id="editTechniqueModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-body">
                <div className="heading">
                  <h1 className="modal-title fs-4" id="staticBackdropLabel">Edit Technique</h1>
                  <p className="m-0 mt-2 fs-6 text-center">
                    Update the step-by-step tutorial for this trick shot or technique.
                  </p>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div className="form mt-3">
                  <form className="row g-2 gx-3 py-2" onSubmit={handleEditSubmit}>
                    <div className="mb-1 col-12">
                      <label htmlFor="edit-tech-title" className="form-label">Technique Name:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit-tech-title"
                        value={editForm.title}
                        onChange={(e) => handleChange(e, true)}
                        required
                        placeholder="Enter a technique name"
                      />
                    </div>

                    <div className="mb-1 col-12">
                      <label htmlFor="edit-tech-sport" className="form-label">Sport:</label>
                      <select
                        className="form-control form-select py-1"
                        aria-label="Sport select"
                        id="edit-tech-sport"
                        value={editForm.sport}
                        onChange={(e) => handleChange(e, true)}
                        required
                      >
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

                    <div className="mb-4 col-12">
                      <label className="form-label">Steps:</label>
                      {editForm.steps.map((step, index) => (
                        <div key={index} className="step d-flex align-items-center mb-2">
                          <span className="me-2 mt-1 fw-bold">{index + 1}.</span>
                          <input
                            type="text"
                            className="form-control"
                            value={step}
                            onChange={(e) => handleChange(e, true, index)}
                            placeholder={`Enter Step ${index + 1}`}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-sm ms-2"
                            onClick={() => deleteStep(index, true)}
                            disabled={editForm.steps.length === 1}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}

                      <button type="button" className="btn btn-sm mt-2" onClick={() => addStep(true)}>
                        <i className="bi bi-plus-lg me-1"></i>Add Step
                      </button>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary fs-6 w-100">Update Technique</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Technique Modal */}
        <div className="modal fade" id="deleteTechniqueModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Technique</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">Are you sure you want to delete this technique?</div>
              <div className="modal-footer">
                <button type="button" className="btn cancel" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn delete" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>

      </section>

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

export default Techniques;
