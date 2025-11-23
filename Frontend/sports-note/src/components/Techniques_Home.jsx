import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function Techniques_Home() {
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

    return (
        <section className="techniques-section py-5 mt-2">
            <div className="techniques-container container-md px-3 px-md-2">
                <div className="heading-container mb-5">
                    <div className="text">
                        <h1 className="m-0 p-0 mb-3">Techniques</h1>
                        <p className="m-0 p-0 fs-4">
                            Learn step-by-step moves and drills. Practice them to improve your
                            skills and play better.
                        </p>
                    </div>
                    <div className="button">
                        <button type="button" className="btn p-2"><i className="bi bi-plus-lg me-2"></i>Add Technique</button>
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


                <div className="explore mt-5">
                    <Link to="/techniques" className="text-decoration-none"><button type="button" className="btn p-3 p-lg-3 fs-6 fs-lg-5">EXPLORE MORE</button></Link>
                </div>
            </div>
        </section>
    )
}

export default Techniques_Home