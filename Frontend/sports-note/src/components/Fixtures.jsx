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
    { date: "2024-11-19", team1: "INDIA", team2: "PAK", time: "9:30", sport: "Cricket" },
    { date: "2024-11-20", team1: "AUSTRALIA", team2: "ENG", time: "14:00", sport: "Cricket" },
    { date: "2024-11-22", team1: "BARCELONA", team2: "REAL MADRID", time: "20:45", sport: "Football" },
    { date: "2024-11-23", team1: "MAN UNITED", team2: "ARSENAL", time: "", sport: "Football" },
    { date: "2024-11-25", team1: "BULLS", team2: "CELTICS", time: "", sport: "Basketball" }
  ];

  // Format date to "19 NOV"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();
  };

  return (
    <section className="fixtures-section container-md py-5 pt-3 pt-md-5 mb-5 mt-3 mt-md-2 px-3 px-md-2">
      <div className="heading-container mb-5">
        <div className="text">
          <h1 className="m-0 p-0 mb-3">Fixtures</h1>
          <p className="m-0 p-0 fs-4">
            See all the upcoming matches you want to watch. Keep track of dates and times so you never miss any game.
          </p>
        </div>
        <div className="button">
          <button type="button" className="btn p-2" data-bs-toggle="modal" data-bs-target="#addFixtureModal"><i className="bi bi-plus-lg me-2"></i>Add Fixture</button>
        </div>
      </div>

      <div className="grid-container">
        {fixturesList.map((fixture, index) => (
          <div className="fixture-box pt-0 text-center" key={index}>
            <div className="top-container p-2 py-3 d-flex flex-column justify-content-center align-items-center">
              <h2 className="m-0 fs-3">{formatDate(fixture.date)}</h2>

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
              <p className="sport-badge m-0 p-0 mt-2 rounded-pill">{fixture.sport}</p>
              <p className="m-0 p-0 my-2 mt-3 fs-4 fw-bolder">{fixture.team1} VS {fixture.team2}</p>
              <p className="m-0 p-0 fs-6"> <span><i className="bi bi-clock me-2"></i></span>
                {fixture.time ? fixture.time : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
                <form className="row g-2 gx-3 py-2">
                  <div className="mb-1 col-6">
                    <label htmlFor="fixture-team-1" className="form-label">Team 1:</label>
                    <input type="text" className="form-control" id="fixture-team-1" placeholder="Enter Team 1" required/>
                  </div>

                   <div className="mb-1 col-6">
                    <label htmlFor="fixture-team-2" className="form-label">Team 2:</label>
                    <input type="text" className="form-control" id="fixture-team-2" placeholder="Enter Team 2" required/>
                  </div>

                  <div className="mb-1 col-12">
                    <label htmlFor="fixture-type" className="form-label">Sport:</label>
                    <select className="form-control form-select py-1" aria-label="Sport select" id="fixture-type" defaultValue="" required>
                      <option value="" disabled>Select a sport</option>
                      <option value="football">Football</option>
                      <option value="basketball">Basketball</option>
                      <option value="cricket">Cricket</option>
                      <option value="tennis">Tennis</option>
                      <option value="badminton">Badminton</option>
                      <option value="volleyball">Volleyball</option>
                      <option value="swimming">Swimming</option>
                      <option value="running">Running</option>
                      <option value="boxing">Boxing</option>
                      <option value="table-tennis">Table Tennis</option>
                      <option value="rugby">Kabaddi</option>
                      <option value="hockey">Hockey</option>
                    </select>
                  </div>

                  <div className="mb-2 col-12">
                    <label htmlFor="fixture-date" className="form-label">Date:</label>
                    <input type="date" className="form-control" id="fixture-date" required/>
                  </div>

                  <div className="mb-3 col-12">
                    <label htmlFor="fixture-time" className="form-label">Time <span>(Optional)</span>:</label>
                    <input type="time" className="form-control" id="fixture-time" />
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
    </section>
  );
}

export default Fixtures;
