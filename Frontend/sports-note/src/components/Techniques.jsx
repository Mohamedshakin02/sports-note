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
      ]
    },
    {
      title: "Cover Drive",
      steps: [
        "Take a side-on stance",
        "Step forward with your front foot toward the pitch of the ball",
        "Swing the bat smoothly along the ground",
        "Hit the ball along the ground through the cover region"
      ]
    },
    {
      title: "Reverse Sweep",
      steps: [
        "Take a normal batting stance",
        "Rotate your wrists and bat to sweep the ball opposite direction",
        "Bend your knees slightly for balance",
        "Follow through to guide the ball past fielders"
      ]
    }
  ];

  return (
    <section className="techniques-section container-md py-5 mt-2 px-2">
      <div className="heading-container mb-5">
        <h1 className="m-0 p-0 mb-3">Techniques</h1>
        <p className="m-0 p-0 fs-4 w-75">
          Learn step-by-step moves and drills. Practice them to improve your
          skills and play better.
        </p>
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
                <i className="bi bi-caret-down-fill ms-auto ps-2 custom-arrow"></i>
              </button>
            </h2>

            <div
              id={`flush-collapse-${index}`}
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">

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
    </section>
  );
}

export default Techniques;
