import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel, Pagination } from 'swiper/modules';

function Sessions() {

  const sessionsData = [
    {
      title: "Morning Basketball Drills",
      items: [
        "Warm-up jog (5 mins)",
        "Dribbling practice",
        "Layup drills",
        "Free-throw routine",
        "Cooldown stretches"
      ]
    },
    {
      title: "Badminton Smash Training",
      items: [
        "Warm-up footwork",
        "Shadow swings",
        "Smash repetitions",
        "Net recovery drills",
        "Warm-up footwork",
        "Shadow swings",
        "Smash repetitions",
        "Net recovery drills"
      ]
    },
    {
      title: "Football Dribbling Drills",
      items: [
        "Cone dribbling",
        "Fast touches",
        "Directional changes",
        "Ball control challenges"
      ]
    },
    {
      title: "Cardio and Endurance",
      items: [
        "5km run",
        "Interval sprints",
        "Jump rope (10 mins)",
        "Cooldown stretching"
      ]
    },
    {
      title: "Badminton Rally Session",
      items: ["Long rallies", "Placement shots", "Side-to-side drills"]
    },
    {
      title: "Football Shooting Practice",
      items: ["First-touch shots", "Power shooting", "Target accuracy"]
    },
    {
      title: "Badminton Footwork Practice",
      items: ["Front-back steps", "Side-to-side steps", "Recovery training"]
    }
  ];

  const [selected, setSelected] = useState(sessionsData[3]);

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (openMenu && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenu]);

  return (
    <>
      <section className="sessions-section container-md py-5 mt-2 px-2">

        <div className="heading-container mb-5">
          <h1 className="m-0 p-0 mb-3">Sessions</h1>
          <p className="m-0 p-0 fs-4 w-75">
            Record your training sessions and exercises to stay on track and improve your performance.
          </p>
        </div>

        <div className='grid-container'>

          {/* LEFT CONTENT BOX */}
          <div className='content'>
            {/* THREE DOTS MENU */}
            <div className="menu-wrapper" ref={menuRef}>
              <i
                className="bi bi-three-dots-vertical menu-icon"
                onClick={() => setOpenMenu(!openMenu)}
              ></i>

              {openMenu && (
                <div className="menu-dropdown">
                  <button>Edit</button>
                  <button>Delete</button>
                </div>
              )}
            </div>

            <h1>{selected.title}</h1>
            <ul className='mt-3'>
              {selected.items.map((item, i) => (
                <li key={i} className='fs-5'>{item}</li>
              ))}
            </ul>
          </div>

          {/* RIGHT BUTTON SLIDER */}
          <div className='buttons'>
            <Swiper
              direction='vertical'
              slidesPerView={5}
              mousewheel={true}
              pagination={{ clickable: true }}
              modules={[Mousewheel, Pagination]}
              className="mySwiper"
            >
              {sessionsData.map((session, index) => (
                <SwiperSlide key={index}>
                  <button
                    className={`session-btn ${selected.title === session.title ? "active" : ""}`}
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

    </>
  );
}

export default Sessions;
