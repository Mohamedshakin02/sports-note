import React, { useState, useRef, useEffect } from "react";

function Fixtures() {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);

  const toggleMenu = (index) => {
    setOpenMenuIndex(prev => (prev === index ? null : index));
  };

  // Close menu when clicking outside
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

  // Fixtures data with ISO dates
  const fixturesList = [
    { date: "2024-11-19", match: "INDIA VS PAK", time: "9:30", sport: "Cricket" },
    { date: "2024-11-20", match: "AUSTRALIA VS ENG", time: "14:00", sport: "Cricket" },
    { date: "2024-11-21", match: "SA VS NZ", time: "10:00", sport: "Cricket" },
    { date: "2024-11-22", match: "INDIA VS AUS", time: "16:30", sport: "Cricket" },
    { date: "2024-11-23", match: "ENG VS PAK", time: "12:00", sport: "Cricket" }
  ];

  // Format date to "19 NOV"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();
  };

  return (
    <section className="fixtures-section container-md py-5 mt-2 px-2">
      <div className="heading-container mb-5">
        <h1 className="m-0 p-0 mb-3">Fixtures</h1>
        <p className="m-0 p-0 fs-4 w-75">
          See all the upcoming matches you want to watch. Keep track of dates and times so you never miss any game.
        </p>
      </div>

      <div className="grid-container">
        {fixturesList.map((fixture, index) => (
          <div className="fixture-box pt-0 text-center" key={index}>
            <div className="top-container p-2 d-flex flex-column justify-content-center align-items-center">
              <h2 className="m-0 fs-3">{formatDate(fixture.date)}</h2>
              <p className="sport-badge m-0 p-0 mt-2">{fixture.sport}</p>

              <div
                className="menu-wrapper"
                ref={(el) => (menuRefs.current[index] = el)}
                onClick={() => toggleMenu(index)}
              >
                <i className="bi bi-three-dots-vertical menu-icon"></i>

                {openMenuIndex === index && (
                  <div className="menu-dropdown">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                )}
              </div>
            </div>

            <div className="bottom-container p-4">
              <p className="m-0 p-0 mb-2 fs-4 fw-bolder">{fixture.match}</p>
              <p className="m-0 p-0 fs-6"> <span><i class="bi bi-clock me-2"></i></span>{fixture.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Fixtures;
