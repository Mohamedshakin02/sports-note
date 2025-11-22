import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Mousewheel, Pagination } from "swiper/modules";

function Sessions() {
  const sessionsData = [
    { title: "Morning Basketball Drills", items: ["Warm-up jog (5 mins)", "Dribbling practice", "Layup drills", "Free-throw routine", "Cooldown stretches"] },
    { title: "Badminton Smash Training", items: ["Warm-up footwork", "Shadow swings", "Smash repetitions", "Net recovery drills"] },
    { title: "Football Dribbling Drills", items: ["Cone dribbling", "Fast touches", "Directional changes", "Ball control challenges"] },
    { title: "Cardio and Endurance", items: ["5km run", "Interval sprints", "Jump rope (10 mins)", "Cooldown stretching"] },
    { title: "Badminton Rally Session", items: ["Long rallies", "Placement shots", "Side-to-side drills"] },
    { title: "Football Shooting Practice", items: ["First-touch shots", "Power shooting", "Target accuracy"] },
    { title: "Badminton Footwork Practice", items: ["Front-back steps", "Side-to-side steps", "Recovery training"] },
  ];

  const [selected, setSelected] = useState(sessionsData[0]);
  const [openMenu, setOpenMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showArrows, setShowArrows] = useState(false);

  const menuRef = useRef(null);
  const swiperRef = useRef(null);

  // Track screen resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  // Update swiper & arrow visibility
  const updateArrows = () => {
  if (!swiperRef.current) return;

  const swiper = swiperRef.current;

  if (screenWidth >= 1024) {
    // Desktop: compare slide count with slidesPerView
    setShowArrows(swiper.slides.length > swiper.params.slidesPerView);
  } else {
    // Mobile: compare total slides width with container width
    const totalWidth = Array.from(swiper.slides).reduce(
      (sum, slide) => sum + slide.offsetWidth + swiper.params.spaceBetween,
      0
    );
    setShowArrows(totalWidth > swiper.width);
  }
};

  useEffect(() => {
    setTimeout(updateArrows, 50); // Wait for swiper to render
  }, [screenWidth, selected]);

  // Arrow button handlers
  const slidePrev = () => swiperRef.current?.slidePrev();
  const slideNext = () => swiperRef.current?.slideNext();

  return (
    <section className="sessions-section container-md py-5 pt-3 pt-md-5 mb-5 mt-3 mt-md-2 px-3 px-md-2">
      <div className="heading-container mb-5">
        <h1>Sessions</h1>
        <p className="fs-4 w-75">
          Record your training sessions and exercises to stay on track and improve your performance.
        </p>
      </div>

      <div className="grid-container">
        {/* LEFT CONTENT */}
        <div className="content">
          <div className="menu-wrapper" ref={menuRef}>
            <i className="bi bi-three-dots-vertical menu-icon" onClick={() => setOpenMenu(!openMenu)}></i>
            {openMenu && (
              <div className="menu-dropdown">
                <button>Edit</button>
                <button>Delete</button>
              </div>
            )}
          </div>

          <h1>{selected.title}</h1>
          <ul className="mt-3">
            {selected.items.map((item, i) => (
              <li key={i} className="fs-5">{item}</li>
            ))}
          </ul>
        </div>

        {/* RIGHT BUTTON SLIDER */}
        <div className="buttons">
          {/* Arrow buttons for desktop */}
          {screenWidth >= 1024 && showArrows && (
            <div className="arrow-desktop-container">
              <button className="arrow-btn up" onClick={slidePrev}>
                <i className="bi bi-caret-up-fill"></i>
              </button>
              <button className="arrow-btn down" onClick={slideNext}>
                <i className="bi bi-caret-down-fill"></i>
              </button>
            </div>
          )}

          {/* Arrow buttons for mobile */}
          {screenWidth < 1024 && showArrows && (
            <>
              <button className="arrow-btn left" onClick={slidePrev}>
                <i className="bi bi-caret-left-fill"></i>
              </button>
              <button className="arrow-btn right" onClick={slideNext}>
                <i className="bi bi-caret-right-fill"></i>
              </button>
            </>
          )}

          <Swiper
            key={screenWidth} // remount on screen width change
            direction={screenWidth >= 1024 ? "vertical" : "horizontal"}
            slidesPerView={screenWidth >= 1024 ? 5 : "auto"}
            spaceBetween={screenWidth >= 1024 ? 0 : 5}
            mousewheel={screenWidth >= 1024}
            pagination={{ clickable: true, dynamicBullets: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setTimeout(updateArrows, 50);
            }}
            observer={true}
            observeParents={true}
            modules={[Mousewheel, Pagination]}
            className="mySwiper"
          >
            {sessionsData.map((session, index) => (
              <SwiperSlide key={index}>
                <button
                  className={`session-btn ${selected.title === session.title ? "active" : ""} text-truncate`}
                  onClick={() => setSelected(session)}
                >
                  {session.title}
                  <hr className="session-divider" />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default Sessions;
