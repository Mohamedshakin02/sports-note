import React, { useState, useRef, useEffect } from "react";

function Techniques() {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef([]);

  const toggleMenu = (index) => {
    setOpenMenuIndex((prev) => (prev === index ? null : index));
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

  // STORE TECHNIQUES LIST IN CONST
  const techniquesList = [
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

  // steps storage
  const [steps, setSteps] = useState([""]);

  // Add new step
  const addStep = () => {
    setSteps([...steps, ""]);
  };

  // Update step text
  const updateStep = (index, value) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  // Delete a step
  const deleteStep = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
  };

  return (
    <section className="techniques-section container-md py-5 pt-3 pt-md-5 mb-5 mt-3 mt-md-2 px-3 px-md-2">
      <div className="heading-container mb-5">
        <div className="text">
          <h1 className="m-0 p-0 mb-3">Techniques</h1>
          <p className="m-0 p-0 fs-4">
            Learn step-by-step moves and drills. Practice them to improve your
            skills and play better.
          </p>
        </div>
        <div className="button">
          <button type="button" className="btn p-2" data-bs-toggle="modal" data-bs-target="#addTechniqueModal"><i className="bi bi-plus-lg me-2"></i>Add Technique</button>
        </div>
      </div>

      {/* ACCORDION */}
      <div className="accordion accordion-flush" id="accordionFlushExample">
        {techniquesList.map((tech, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fs-5"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#flush-collapse-${index}`}
              >
                {tech.title}
                <p className="sport-badge m-0 p-0 ms-2 rounded-pill">{tech.sport}</p>
                <i className="bi bi-caret-down-fill ms-auto ps-2 custom-arrow"></i>
              </button>
            </h2>

            <div
              id={`flush-collapse-${index}`}
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">
                <p className="body-head m-0 p-0 fs-5 mb-3">Steps:</p>
                {/* THREE DOTS MENU INSIDE BODY */}
                <div
                  className="menu-wrapper"
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

                {/* STEPS */}
                <ol>
                  {tech.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div className="modal fade"
        id="addTechniqueModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="addTechniqueLabel"
        aria-hidden="true">

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
                <form className="row g-2 gx-3 py-2">
                  <div className="mb-1 col-12">
                    <label htmlFor="technique-title" className="form-label">Technique Name:</label>
                    <input type="text" className="form-control" id="technique-title" placeholder="Enter a short title for your sports moment" required/>
                  </div>

                  <div className="mb-1 col-12">
                    <label htmlFor="technique-type" className="form-label">Sport:</label>
                    <select className="form-control form-select py-1" aria-label="Sport select" id="technique-type" defaultValue="" required>
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
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-4 col-12">
                    <label className="form-label">Steps:</label>

                    {steps.map((step, index) => (
                      <div key={index} className="step d-flex align-items-center mb-2">
                        <span className="me-2 mt-1 fw-bold">{index + 1}.</span>

                        <input
                          type="text"
                          className="form-control"
                          value={step}
                          onChange={(e) => updateStep(index, e.target.value)}
                          placeholder={`Enter Step ${index + 1}`}
                          required
                        />

                        <button
                          type="button"
                          className="btn btn-sm ms-2"
                          onClick={() => deleteStep(index)}
                          disabled={steps.length === 1}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    ))}


                    <button
                      type="button"
                      className="btn btn-sm mt-2"
                      onClick={addStep}
                    >
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
    </section>
  );
}

export default Techniques;
