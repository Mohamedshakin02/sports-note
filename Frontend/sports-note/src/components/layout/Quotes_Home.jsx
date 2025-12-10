import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

import quote1 from "../../assets/quotes/virat.jpg";
import quote2 from "../../assets/quotes/muhammad.jpg";

// Default static quotes for non-logged-in users
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

function Quotes_Home() {
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const [quotesList, setQuotesList] = useState(defaultQuotes);
  const [loading, setLoading] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [editingQuote, setEditingQuote] = useState({ id: null, quote: "", author: "", image: null, imageUrl: "" });
  const [form, setForm] = useState({ quote: "", author: "", image: null });
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ message: "" });

  const menuRefs = useRef([]);
  const toastRef = useRef();
  const swiperRef = useRef(null);

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

  // Fetch quotes from backend
  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user) {
        setQuotesList(defaultQuotes); // reset to default when logged out
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/quotes", { withCredentials: true });
        setQuotesList(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setQuotesList([]);
        console.error("Error fetching quotes:", err);
        showToast("Failed to load quotes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [user]);


  // Click outside to close menu
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

  const toggleMenu = (index) => setOpenMenuIndex((prev) => (prev === index ? null : index));

  const handleChange = (e, edit = false) => {
    const { id, value, files } = e.target;
    let key = id.includes("quote-image") ? "image" : id.includes("quote-text") ? "quote" : "author";
    if (edit) setEditingQuote(prev => ({ ...prev, [key]: files ? files[0] : value }));
    else setForm(prev => ({ ...prev, [key]: files ? files[0] : value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return showToast("Please login to add quotes");
    setLoading(true);


    let imageUrl = "";
    if (form.image) {
      const formData = new FormData();
      formData.append("file", form.image);
      formData.append("upload_preset", "quotes_preset");
      try { const res = await axios.post("https://api.cloudinary.com/v1_1/dy3pvt29a/image/upload", formData); imageUrl = res.data.secure_url; }
      catch {
        const modalEl = document.getElementById("addQuoteModal");
        window.bootstrap.Modal.getInstance(modalEl).hide();
        showToast("Image upload failed");
        setLoading(false); return;
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/api/quotes", { ...form, imageUrl }, { withCredentials: true });
      setQuotesList(prev => [res.data, ...prev]);
      setForm({ quote: "", author: "", image: null });
      const modalEl = document.getElementById("addQuoteModal");
      window.bootstrap.Modal.getInstance(modalEl).hide();
      showToast("Quote added successfully!");
    } catch {
      const modalEl = document.getElementById("addQuoteModal");
      window.bootstrap.Modal.getInstance(modalEl).hide();
      showToast("Failed to save quote.");
    } finally { setLoading(false); }


  };

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    let imageUrl = editingQuote.image ? await (async () => {
      const formData = new FormData();
      formData.append("file", editingQuote.image);
      formData.append("upload_preset", "quotes_preset");
      try { const res = await axios.post("https://api.cloudinary.com/v1_1/dy3pvt29a/image/upload", formData); return res.data.secure_url; }
      catch {
        const modalEl = document.getElementById("editQuoteModal");
        window.bootstrap.Modal.getInstance(modalEl).hide();
        showToast("Image upload failed");
        setLoading(false); return null;
      }
    })() : editingQuote.imageUrl || "";

    if (imageUrl === null) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/quotes/${editingQuote.id}`, { ...editingQuote, imageUrl }, { withCredentials: true });
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

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/quotes/${deleteId}`, { withCredentials: true });
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

  const getInitials = (name) => {
    const words = name.split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const showLoginToast = () => showToast("Please login to continue");

  return (
    <>
      {loading && (<div className="loading-overlay"><div className="spinner-border text-light" role="status"><span className="visually-hidden">Loading...</span></div></div>)}

      {quotesList && quotesList.length > 0 && (
        <section className="quotes-section">

          <div className="section-container container-md py-5 mt-2 px-3 px-md-2">
            <div className="heading-container mb-5">
              <div className="text">
                <h1 className="m-0 p-0 mb-3">Quotes</h1>
                <p className="m-0 p-0 fs-4">Read your favorite quotes from players and coaches. Let their words inspire and motivate you every day.</p>
              </div>
              <div className="button">
                <button type="button" className="btn p-2" onClick={() => { if (!isLoggedIn) return showLoginToast(); const modalEl = document.getElementById("addQuoteModal"); new window.bootstrap.Modal(modalEl).show(); }}>
                  <i className="bi bi-plus-lg me-2"></i>Add Quote
                </button>
              </div>
            </div>

            <Swiper
              ref={swiperRef}
              spaceBetween={20}
              navigation={true}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                centerInsufficientSlides: true,
                renderBullet: (index, className) => {
                  const author = quotesList[index].author;
                  const image = quotesList[index].image || quotesList[index].imageUrl;
                  if (image) return `<span class="${className} custom-bullet"><img src="${image}" alt="${author}" class="bullet-image"/></span>`;
                  return `<span class="${className} custom-bullet initials">${getInitials(author)}</span>`;
                }
              }}
              modules={[Navigation, Pagination]}
              centeredSlides={true}
              className="quotes-slider"
              breakpoints={{ 0: { slidesPerView: 1.25 }, 768: { slidesPerView: 1.25 }, 992: { slidesPerView: 1 } }}
            >
              {quotesList.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="quote-box d-flex p-3 px-4">
                    <div className="image-container me-2 me-sm-4 d-flex justify-content-center align-items-center">
                      {item.image || item.imageUrl ? <img src={item.image || item.imageUrl} alt={item.author} className="img-fluid" /> : <i className="bi bi-person-fill display-3"></i>}
                    </div>
                    <div className="quote-container"><i className="bi bi-quote display-3"></i></div>
                    <div className="text-container h-100 p-2 d-flex flex-column justify-content-between">
                      <p className="quote m-0 display-6 fs-4 pt-0 pt-lg-1">"{item.quote}"</p>
                      <p className="author m-0 p-0 mt-2 fs-5 text-end text-capitalize"><i>- {item.author}</i></p>
                    </div>
                    <div className="menu-wrapper ms-auto" ref={(el) => (menuRefs.current[index] = el)} onClick={() => toggleMenu(index)}>
                      <i className="bi bi-three-dots-vertical menu-icon" title="Actions"></i>
                      {openMenuIndex === index && (
                        <div className="menu-dropdown">
                          <button onClick={() => { if (!isLoggedIn) return showLoginToast(); handleEdit(item); }}>Edit</button>
                          <button onClick={() => { if (!isLoggedIn) return showLoginToast(); setDeleteId(item._id || item.id); const modalEl = document.getElementById("deleteQuoteModal"); new window.bootstrap.Modal(modalEl).show(); }}>Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="explore mt-5">
              <Link to="/quotes" className="text-decoration-none"><button type="button" className="btn p-3 p-lg-3 fs-6 fs-lg-5">EXPLORE MORE</button></Link>
            </div>

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
            <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-progress-wrapper"><div className="toast-progress"></div></div>
        </div>
      </div>

    </>



  );
}

export default Quotes_Home;
