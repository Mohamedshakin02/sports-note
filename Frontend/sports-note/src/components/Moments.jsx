import React, { useState, useEffect, useRef } from "react";
import moment1 from "../assets/moments/rcb.jpg";
import moment2 from "../assets/moments/argentina.jpeg";
import moment3 from "../assets/moments/india vs new zealand.jpg";
import moment4 from "../assets/moments/lakers win.jpg";
import moment5 from "../assets/moments/england win.jpg";
import noImage from "../assets/logos/moments-grey.png";

function Moments() {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const menuRefs = useRef([]);

    const toggleMenu = (index) => {
        setOpenMenuIndex((prev) => (prev === index ? null : index));
    };

    // Close dropdown when clicking outside
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

    const momentsList = [
        {
            image: moment1,
            sport: "Cricket",
            title: "RCB Won This Year IPL",
            description: "I was extremely happy when RCB finally won this year IPL. It was their first win and I still can’t believe it happened. The joy and excitement of watching the team lift the trophy was unforgettable and truly special for all the fans.",
            date: "2024-05-12"
        },
        {
            image: "",
            sport: "Football",
            title: "Argentina Won FIFA World Cup 2022",
            description: "I was overjoyed when Argentina won the 2022 FIFA World Cup. The match was thrilling and seeing the team lift the trophy felt surreal. I still can’t believe the incredible journey and the unforgettable moments of that tournament.",
            date: "2022-12-18"
        },
        {
            image: moment3,
            sport: "Cricket",
            title: "India vs New Zealand Heart Breaking Semi Final 2019",
            description: "Watching India play against New Zealand in the 2019 semi final was heartbreaking. I felt so proud of the team for giving their best, yet so sad when the match ended. It was a rollercoaster of emotions that I will never forget.",
            date: "2019-07-10"
        },
        {
            image: moment4,
            sport: "Basketball",
            title: "Lakers Win NBA Finals 2020",
            description: "I was thrilled when the Lakers clinched the 2020 NBA Finals. Witnessing the team's hard work pay off and seeing the championship celebration was unforgettable. The energy and excitement of the game made it a truly special moment.",
            date: "2020-10-11"
        },
        {
            image: "",
            sport: "Cricket",
            title: "England Won 2019 Cricket World Cup",
            description: "I could not stop cheering when England won the 2019 Cricket World Cup. The final was so intense and nerve-wracking, and I still remember the excitement when the match ended in a super over. It was an amazing experience to witness history.",
            date: "2019-07-14"
        }
    ];

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <section className="moments-section container-md py-5 mt-2 px-3">
            <div className="heading-container mb-5">
                <h1 className="m-0 p-0 mb-3">Moments</h1>
                <p className="m-0 p-0 fs-4 w-75">
                    Keep and enjoy your best sports moments. Remember the exciting games and achievements that made you proud.
                </p>
            </div>

            <div className="grid-container">
                {momentsList.map((moment, index) => (
                    <div className="moment-box" key={index}>

                        {/* IMAGE SECTION */}
                        <div className={`moment-image mb-3 position-relative ${!moment.image ? "no-image-wrapper" : ""}`}>

                            {/* Sport Label */}
                            <span className="sport-badge">{moment.sport}</span>

                            {/* Three Dots Menu */}
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

                            {/* Image */}
                            {moment.image ? (
                                <img className="img-fluid" src={moment.image} alt={moment.title} />
                            ) : (
                                <div className="no-image-inner">
                                    <img src={noImage} alt="No image" />
                                </div>
                            )}
                        </div>

                        {/* CONTENT SECTION */}
                        <div className="moment-content pb-3 px-3 pt-0">
                            <div className="top-container">
                                <h2 className="m-0 p-0 mb-3 fs-3">{moment.title}</h2>
                                <p className="m-0 p-0 mb-4">{moment.description}</p>
                            </div>
                            <div className="bottom-container">
                                <p className="m-0 p-0 text-dark fs-6">{formatDate(moment.date)}</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}

export default Moments;
