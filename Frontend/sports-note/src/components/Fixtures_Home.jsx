import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";

function Fixtures_Home() {
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const menuRefs = useRef([]);
    const swiperRef = useRef(null);

    const toggleMenu = (index) => {
        setOpenMenuIndex((prev) => (prev === index ? null : index));
    };

    // Close dropdown on outside click
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

    const fixturesList = [
        { date: "2024-11-19", match: "INDIA VS PAK", time: "9:30", sport: "Cricket" },
        { date: "2024-11-20", match: "AUSTRALIA VS ENG", time: "14:00", sport: "Cricket" },
        { date: "2024-11-22", match: "BARCELONA VS REAL MADRID", time: "20:45", sport: "Football" },
        { date: "2024-11-23", match: "MAN UNITED VS ARSENAL", time: "", sport: "Football" },
        { date: "2024-11-25", match: "BULLS VS CELTICS", time: "", sport: "Basketball" },
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
        }).toUpperCase();
    };

    return (
        <section className="fixtures-section py-5 mt-2">
            <div className="fixtures-container container-md px-2">
                <div className="heading-container mb-5">
                    <h1 className="m-0 p-0 mb-3">Fixtures</h1>
                    <p className="m-0 p-0 fs-4 w-75">
                        See all the upcoming matches you want to watch. Keep track of dates and times so you never miss any game.
                    </p>
                </div>

                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={true}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    spaceBetween={25}
                    breakpoints={{
                        320: { slidesPerView: 1.2, spaceBetween: 15, centeredSlides:true }, 
                        576: { slidesPerView: 2, spaceBetween: 15, centeredSlides: false },   
                        992: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },  
                        1400: { slidesPerView: 4, spaceBetween: 20, centeredSlides: false },
                    }}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    className="fixtures-slider"
                >
                    {fixturesList.map((fixture, index) => (
                        <SwiperSlide
                            key={index}
                            className="fixture-slide"
                        >
                            <div className="fixture-box pt-0 text-center">
                                {/* TOP */}
                                <div className="top-container p-2 py-3 d-flex flex-column justify-content-center align-items-center">
                                    <h2 className="m-0 fs-3">{formatDate(fixture.date)}</h2>

                                    <div
                                        className="menu-wrapper"
                                        ref={(el) => (menuRefs.current[index] = el)}
                                    >
                                        <i className="bi bi-three-dots-vertical menu-icon" onClick={() => toggleMenu(index)}></i>

                                        {openMenuIndex === index && (
                                            <div className="menu-dropdown">
                                                <button>Edit</button>
                                                <button>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* BOTTOM */}
                                <div className="bottom-container p-4">
                                    <p className="sport-badge m-0 p-0 mt-2 rounded-pill">
                                        {fixture.sport}
                                    </p>
                                    <p className="m-0 p-0 my-2 mt-3 fs-4 fw-bolder">{fixture.match}</p>
                                    <p className="m-0 p-0 fs-6">
                                        <i className="bi bi-clock me-2"></i>
                                        {fixture.time || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default Fixtures_Home