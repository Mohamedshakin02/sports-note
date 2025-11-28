import React, { useState, useRef, useEffect } from "react";
import quote1 from "../assets/quotes/virat.jpg";
import quote2 from "../assets/quotes/muhammad.jpg";

function Quotes() {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);

  const toggleMenu = (index) => {
    setOpenMenuIndex(prev => (prev === index ? null : index));
  };

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

  // STORE QUOTES IN CONST ARRAY
  const quotesList = [
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

  return (
    <section className="quotes-section container-md py-5 pt-3 pt-md-5 mb-5 mt-3 mt-md-2 px-3 px-md-2">
      <div className="heading-container mb-5">
        <div className="text">
          <h1 className="m-0 p-0 mb-3">Quotes</h1>
          <p className="m-0 p-0 fs-4">
            Read your favorite quotes from players and coaches. Let their words inspire and motivate you every day.
          </p>
        </div>
        <div className="button">
          <button type="button" className="btn p-2" data-bs-toggle="modal" data-bs-target="#addQuoteModal"><i className="bi bi-plus-lg me-2"></i>Add Quote</button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid-container">

        {quotesList.map((item, index) => (
          <div className="quote-box d-flex p-3 px-4" key={index}>

            {/* IMAGE */}
            <div className="image-container me-2 me-sm-4 d-flex justify-content-center align-items-center">
              {item.image ? (
                <img src={item.image} alt="" className="img-fluid" />
              ) : (
                <i className="bi bi-person-fill display-3 text-secondary"></i>
              )}
            </div>

            {/* QUOTE ICON */}
            <div className="quote-container">
              <i className="bi bi-quote display-3"></i>
            </div>

            {/* TEXT */}
            <div className="text-container h-100 p-2 d-flex flex-column justify-content-between">
              <p className="quote m-0 display-6 fs-5 pt-0 pt-lg-1">
                "{item.quote}"
              </p>
              <p className="author m-0 p-0 mt-2 fs-6 text-end">
                <i>- {item.author}</i>
              </p>
            </div>

            {/* THREE DOTS MENU (Right side) */}
            <div
              className="menu-wrapper ms-auto"
              ref={(el) => (menuRefs.current[index] = el)}
            >
              <i
                className="bi bi-three-dots-vertical menu-icon"
                onClick={() => toggleMenu(index)}
              ></i>

              {openMenuIndex === index && (
                <div className="menu-dropdown">
                  <button>Edit</button>
                  <button>Delete</button>
                </div>
              )}
            </div>

          </div>
        ))}

      </div>

      {/* Modal */}
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
                <h1 className="modal-title fs-4" id="staticBackdropLabel">Add New Quote</h1>
                <p className="m-0 mt-2 fs-6 text-center">
                  Save an inspirational quote from your favorite player.
                </p>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="form mt-3">
                <form className="row g-2 py-2">

                  <div className="mb-2 col-12">
                    <label htmlFor="quote-text" className="form-label">Quote:</label>
                    <textarea className="form-control" id="quote-text" placeholder="Type the inspirational quote here..." required></textarea>
                  </div>

                  <div className="mb-4 col-12">
                    <label htmlFor="quote-author" className="form-label">Author/Player:</label>
                    <input type="text" className="form-control" id="quote-author" placeholder="Enter the name of the author or player" required/>
                  </div>

                  <div className="mb-4 col-12">
                    <label htmlFor="quote-image" className="form-label">Image <span>(Optional)</span>:</label>
                    <input className="form-control form-control-sm" id="quote-image" type="file" accept=".jpg, .jpeg, .png, .webp" />
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary fs-6 w-100">Add Quote</button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Quotes;
