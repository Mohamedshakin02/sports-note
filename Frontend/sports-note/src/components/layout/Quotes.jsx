import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import quote1 from "../../assets/quotes/virat.jpg";
import quote2 from "../../assets/quotes/muhammad.jpg";

// Default quotes to show when user is not logged in
const defaultQuotes = [
  {
    image: quote1,
    quote:
      "Whatever you want to do, do with full passion and work really hard towards it. Don't look anywhere else.",
    author: "Virat Kohli",
  },
  {
    image: quote2,
    quote: "I hated every minute of training, but I said, 'Don’t quit. Suffer now and live the rest of your life as a champion.'",
    author: "Muhammad Ali",
  },
  {
    image: "",
    quote: "Success isn’t owned. It’s leased. And rent is due every day.",
    author: "J.J. Watt",
  },
];

function Quotes() {
  // gets logged-in user
  const { user } = useContext(AuthContext);

  // true if user is logged in
  const isLoggedIn = !!user;

  // Get auth token from localStorage
  const token = localStorage.getItem("token");

  // State for fixtures
  const [quotesList, setQuotesList] = useState([]);

  // Loading spinner state
  const [loading, setLoading] = useState(false);

  // State for menu dropdown visibility
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  // Form states for Add and Edit
  const [editingQuote, setEditingQuote] = useState({ id: null, quote: "", author: "", image: null, imageUrl: "" });
  const [form, setForm] = useState({ quote: "", author: "", image: null });
  const [deleteId, setDeleteId] = useState(null);

  // Toast state
  const [toast, setToast] = useState({ message: "" });
  const toastRef = useRef();

  // References to detect clicks outside menus
  const menuRefs = useRef([]);

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

  // Fetch fixtures from backend if user is logged in
  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user || !token) {
        // User logged out shows default quotes immediately
        setQuotesList(defaultQuotes);
        return;
      }

      try {
        setLoading(true);

        // This code is commented out to switch from cookies auth auth to token/localStorage-based auth
        // const res = await axios.get("https://sports-note-backend.onrender.com/api/quotes", { withCredentials: true });

        const res = await axios.get(
          "https://sports-note-backend.onrender.com/api/quotes",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setQuotesList(Array.isArray(res.data) ? res.data : []);

      } catch (err) {
        setQuotesList([]);
        console.error("Failed to fetch quotes:", err);
        showToast("Failed to load quotes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [user]);


  // Handle changes in form inputs for adding or editing a quote
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

  const toggleMenu = (index) => setOpenMenuIndex(prev => (prev === index ? null : index));

  const handleChange = (e, edit = false) => {
    const { id, value, files } = e.target;
    let key;

    if (id.includes("quote-image")) key = "image";
    else if (id.includes("quote-text")) key = "quote";
    else if (id.includes("quote-author")) key = "author";

    if (edit) setEditingQuote(prev => ({ ...prev, [key]: files ? files[0] : value }));
    else setForm(prev => ({ ...prev, [key]: files ? files[0] : value }));
  };

  // Submits new quote to backend and update the fixtures list
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return showToast("Please login to add quotes");
    setLoading(true);

    // Stores uploaded image URL
    let imageUrl = "";

    // Checks if user uploaded an image
    if (form.image) {
      const formData = new FormData();
      formData.append("file", form.image); // Add image file
      formData.append("upload_preset", "quotes_preset"); // Cloudinary preset
      try {
        // Uploads image to Cloudinary
        const res = await axios.post("https://api.cloudinary.com/v1_1/dy3pvt29a/image/upload", formData); 
        imageUrl = res.data.secure_url; // Saves uploaded image URL
      }
      catch {
        const modalEl = document.getElementById("addQuoteModal");
        window.bootstrap.Modal.getInstance(modalEl).hide();
        showToast("Image upload failed");
        setLoading(false); return;
      }
    }

    try {

      // This code is commented out to switch from cookies auth auth to token/localStorage-based auth
      // const res = await axios.post("https://sports-note-backend.onrender.com/api/quotes", { ...form, imageUrl }, { withCredentials: true });

      const res = await axios.post(
        "https://sports-note-backend.onrender.com/api/quotes",
        { ...form, imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuotesList(prev => [res.data, ...prev]);
      setForm({ quote: "", author: "", image: null });
      const modalEl = document.getElementById("addQuoteModal");
      window.bootstrap.Modal.getInstance(modalEl).hide();
      showToast("Quote added successfully!");
    } catch {
      const modalEl = document.getElementById("addQuoteModal");
      window.bootstrap.Modal.getInstance(modalEl).hide();
      showToast("Failed to add quote.");
    } finally { setLoading(false); }


  };

  // Opens edit modal and populate fields with selected quote details
  const handleEdit = (quote) => {
    setEditingQuote({
      id: quote._id || quote.id,
      quote: quote.quote,
      author: quote.author,
      image: null,
      imageUrl: quote.imageUrl || quote.image || ""
    });
    const modalEl = document.getElementById("editQuoteModal");
    new window.bootstrap.Modal(modalEl).show();
  };

  // Submits edited quote to backend and update the quotes list
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Upload new image only if user uploads new one
    let imageUrl = editingQuote.image ? await (async () => {
      const formData = new FormData();
      formData.append("file", editingQuote.image);
      formData.append("upload_preset", "quotes_preset"); // Add image file
      try { 
        const res = await axios.post("https://api.cloudinary.com/v1_1/dy3pvt29a/image/upload", formData); 
        return res.data.secure_url; // Returns uploaded image URL
      }
      catch {
        const modalEl = document.getElementById("editQuoteModal");
        window.bootstrap.Modal.getInstance(modalEl).hide();
        showToast("Image upload failed");
        setLoading(false); return null;
      }
    })() : editingQuote.imageUrl || "";

    if (imageUrl === null) return;

    try {

      // This code is commented out to switch from cookies auth auth to token/localStorage-based auth
      // const res = await axios.put(`https://sports-note-backend.onrender.com/api/quotes/${editingQuote.id}`, { ...editingQuote, imageUrl }, { withCredentials: true });

      const res = await axios.put(
        `https://sports-note-backend.onrender.com/api/quotes/${editingQuote.id}`,
        { ...editingQuote, imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuotesList(prev => prev.map(quote => (quote._id === editingQuote.id || quote.id === editingQuote.id ? res.data : quote)));
      const modalEl = document.getElementById("editQuoteModal");
      window.bootstrap.Modal.getInstance(modalEl).hide();
      showToast("Quote updated successfully!");
    } catch {
      const modalEl = document.getElementById("editQuoteModal");
      window.bootstrap.Modal.getInstance(modalEl).hide();
      showToast("Failed to update quote.");
    } finally { setLoading(false); }


  };

  // Deletes quote from backend and remove it from the list
  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {

      // This code is commented out to switch from cookies auth auth to token/localStorage-based auth
      // await axios.delete(`https://sports-note-backend.onrender.com/api/quotes/${deleteId}`, { withCredentials: true });

      await axios.delete(
        `https://sports-note-backend.onrender.com/api/quotes/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setQuotesList(prev => prev.filter(quote => (quote._id || quote.id) !== deleteId));
      const modalEl = document.getElementById("deleteQuoteModal");
      window.bootstrap.Modal.getInstance(modalEl).hide();
      showToast("Quote deleted successfully!");
    } catch {
      const modalEl = document.getElementById("deleteQuoteModal");
      window.bootstrap.Modal.getInstance(modalEl).hide();
      showToast("Failed to delete quote.");
    } finally { setLoading(false); }
  };

  const showLoginToast = () => showToast("Please login to continue");

  return (
    <>
      {/* Loading spinner overlay */}
      {loading && (<div className="loading-overlay"><div className="spinner-border text-light" role="status"><span className="visually-hidden">Loading...</span></div></div>)}


      <section className="quotes-section container-md py-5">

        {/* Header with title and Add quote button */}
        <div className="heading-container mb-5">
          <div className="text">
            <h1 className="m-0 p-0 mb-3">Quotes</h1>
            <p className="m-0 p-0 fs-4">
              Read your favorite quotes from players and coaches. Let their words inspire and motivate you every day.
            </p>
          </div>
          <div className="button">

            {/* Adds quote only if user is logged in*/}
            <button type="button" className="btn p-2"
              onClick={() => {
                if (!isLoggedIn) return showLoginToast(); const modalEl = document.getElementById("addQuoteModal");
                new window.bootstrap.Modal(modalEl).show();
              }}>
              <i className="bi bi-plus-lg me-2"></i>Add Quote</button>
          </div>
        </div>

        {/* quotes grid */}
        <div className="grid-container">
          {quotesList.map((quote, index) => (
            <div className="quote-box d-flex p-3 mb-3" key={index}>
              {/* IMAGE */}
              <div className="image-container me-2 me-sm-4 d-flex justify-content-center align-items-center">
                {quote.image || quote.imageUrl ? <img src={quote.image || quote.imageUrl} alt={quote.author} className="img-fluid" /> : <i className="bi bi-person-fill display-3 text-secondary"></i>}
              </div>

              {/* QUOTE ICON */}
              <div className="quote-container">
                <i className="bi bi-quote display-3"></i>
              </div>

              {/* TEXT */}
              <div className="text-container h-100 p-2 d-flex flex-column justify-content-between">
                <p className="quote m-0 display-6 fs-5 pt-0 pt-lg-1">
                  "{quote.quote}"
                </p>
                <p className="author m-0 p-0 mt-2 fs-6 text-end text-capitalize">
                  <i>- {quote.author}</i>
                </p>
              </div>

              {/* Dropdown menu for edit/delete actions and only allowed to edit or delete the quote if user is logged in */}
              <div className="menu-wrapper ms-2" ref={el => menuRefs.current[index] = el} onClick={() => toggleMenu(index)}>
                <i className="bi bi-three-dots-vertical menu-icon" title="Actions"></i>
                {openMenuIndex === index && (
                  <div className="menu-dropdown">
                    <button onClick={() => { if (!isLoggedIn) return showLoginToast(); handleEdit(quote) }}>Edit</button>
                    <button onClick={() => {
                      if (!isLoggedIn) return showLoginToast(); setDeleteId(quote._id || quote.id);
                      const modalEl = document.getElementById("deleteQuoteModal");
                      new window.bootstrap.Modal(modalEl).show();
                    }}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>


        {/* Add Quote Modal */}

        <div className="modal fade"
          id="addQuoteModal"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="addQuoteLabel"
          aria-hidden="true">

          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">

              <div className="modal-body">
                <div className="heading">
                  <h1 className="modal-title fs-4">Add Quote</h1>
                  <p className="m-0 mt-2 fs-6 text-center">
                    Save an inspirational quote from your favorite player.
                  </p>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div className="form mt-3">
                  <form className="row g-2 py-2" onSubmit={handleAddSubmit}>

                    <div className="mb-2 col-12">
                      <label htmlFor="add-quote-text" className="form-label">Quote:</label>
                      <textarea
                        className="form-control"
                        id="add-quote-text"
                        placeholder="Type the inspirational quote here..."
                        required
                        value={form.quote}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="mb-2 col-12">
                      <label htmlFor="add-quote-author" className="form-label">Author/Player:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="add-quote-author"
                        placeholder="Enter the name of the author or player"
                        required
                        value={form.author}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-4 col-12">
                      <label htmlFor="add-quote-image" className="form-label">Image <span>(Optional)</span>:</label>
                      <input
                        className="form-control form-control-sm"
                        id="add-quote-image"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary fs-6 w-100">Save Quote</button>
                    </div>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Edit Quote Modal */}

        <div className="modal fade"
          id="editQuoteModal"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="editQuoteLabel"
          aria-hidden="true">

          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">

              <div className="modal-body">
                <div className="heading">
                  <h1 className="modal-title fs-4">Edit Quote</h1>
                  <p className="m-0 mt-2 fs-6 text-center">
                    Edit your inspirational quote.
                  </p>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div className="form mt-3">
                  <form className="row g-2 py-2" onSubmit={handleEditSubmit}>

                    <div className="mb-2 col-12">
                      <label htmlFor="edit-quote-text" className="form-label">Quote:</label>
                      <textarea
                        className="form-control"
                        id="edit-quote-text"
                        placeholder="Type the inspirational quote here..."
                        required
                        value={editingQuote.quote}
                        onChange={(e) => handleChange(e, true)}
                      ></textarea>
                    </div>

                    <div className="mb-2 col-12">
                      <label htmlFor="edit-quote-author" className="form-label">Author/Player:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit-quote-author"
                        placeholder="Enter the name of the author or player"
                        required
                        value={editingQuote.author}
                        onChange={(e) => handleChange(e, true)}
                      />
                    </div>

                    <div className="image-input mb-4 col-12">
                      <label htmlFor="edit-quote-image" className="form-label">
                        Image <span>(Optional)</span>:
                      </label>
                      <input
                        className="form-control form-control-sm"
                        id="edit-quote-image"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) => handleChange(e, true)}
                      />
                      {editingQuote.imageUrl && !editingQuote.image && (
                        <span className="existing-file translate-middle-y ps-2 text-truncate">
                          {editingQuote.imageUrl.split("/").pop()}
                        </span>
                      )}
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary fs-6 w-100">Update Quote</button>
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
          id="deleteQuoteModal"
          aria-labelledby="deleteModalLabel"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-hidden="true">

          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">Delete Quote</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                Are you sure you want to delete this quote?
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

      {/* Toast container for notifications */}
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

export default Quotes;


