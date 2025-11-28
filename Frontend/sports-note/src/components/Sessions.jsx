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

  // exercises storage
    const [exercises, setExercises] = useState([""]);
  
    // Add new exercise
    const addExercise = () => {
      setExercises([...exercises, ""]);
    };
  
    // Update exercise text
    const updateExercise = (index, value) => {
      const updated = [...exercises];
      updated[index] = value;
      setExercises(updated);
    };
  
    // Delete a exercise
    const deleteExercise = (index) => {
      const updated = exercises.filter((_, i) => i !== index);
      setExercises(updated);
    };

  return (
    <section className="sessions-section container-md py-5 pt-3 pt-md-5 mb-5 mt-3 mt-md-2 px-3 px-md-2">
      <div className="heading-container mb-5">
        <div className="text">
          <h1 className="m-0 p-0 mb-3">Sessions</h1>
          <p className="m-0 p-0 fs-4">
            Record your training sessions and exercises to stay on track and improve your performance.
          </p>
        </div>
        <div className="button">
          <button type="button" className="btn p-2" data-bs-toggle="modal" data-bs-target="#addSessionModal"><i className="bi bi-plus-lg me-2"></i>Add Session</button>
        </div>
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

      <div className="modal fade"
        id="addSessionModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="addSessionLabel"
        aria-hidden="true">

        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">

            <div className="modal-body">
              <div className="heading">
                <h1 className="modal-title fs-4" id="staticBackdropLabel">Add Session</h1>
                <p className="m-0 mt-2 fs-6 text-center">
                  Save your training session details and exercises.
                </p>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>

              <div className="form mt-3">
                <form className="row g-2 gx-3 py-2">
                  <div className="mb-1 col-12">
                    <label htmlFor="session-title" className="form-label">Session Name:</label>
                    <input type="text" className="form-control" id="session-title" placeholder="Enter a short title for your sports moment" required/>
                  </div>

                  <div className="mb-4 col-12">
                    <label className="form-label">Steps:</label>

                    {exercises.map((step, index) => (
                      <div key={index} className="exercise d-flex align-items-center mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={step}
                          onChange={(e) => updateExercise(index, e.target.value)}
                          placeholder={`Enter Exercise/Activity ${index + 1}`}
                          required
                        />

                        <button
                          type="button"
                          className="btn btn-sm ms-2"
                          onClick={() => deleteExercise(index)}
                          disabled={exercises.length === 1}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    ))}


                    <button
                      type="button"
                      className="add btn btn-sm mt-2"
                      onClick={addExercise}
                    >
                      <i className="bi bi-plus-lg me-1"></i>Add Exercise
                    </button>
                  </div>


                  <div className="col-12">
                    <button type="submit" className="btn btn-primary fs-6 w-100">Save Session</button>
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

export default Sessions;
