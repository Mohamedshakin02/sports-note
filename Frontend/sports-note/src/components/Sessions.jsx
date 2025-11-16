import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel, Pagination } from 'swiper/modules';

function Sessions() {

  const sessionsData = {
    "Morning Basketball Drills": [
      "Warm-up jog (5 mins)",
      "Dribbling practice",
      "Layup drills",
      "Free-throw routine",
      "Cooldown stretches"
    ],

    "Badminton Smash Training": [
      "Warm-up footwork",
      "Shadow swings",
      "Smash repetitions",
      "Net recovery drills",
      "Warm-up footwork",
      "Shadow swings",
      "Smash repetitions",
      "Net recovery drills",
    ],

    "Football Dribbling Drills": [
      "Cone dribbling",
      "Fast touches",
      "Directional changes",
      "Ball control challenges"
    ],

    "Cardio and Endurance": [
      "5km run",
      "Interval sprints",
      "Jump rope (10 mins)",
      "Cooldown stretching"
    ],

    "Badminton Rally Session": [
      "Long rallies",
      "Placement shots",
      "Side-to-side drills"
    ],

    "Football Shooting Practice": [
      "First-touch shots",
      "Power shooting",
      "Target accuracy"
    ],

    "Badminton Footwork Practice": [
      "Front-back steps",
      "Side-to-side steps",
      "Recovery training"
    ]
  };

  const [selected, setSelected] = useState("Cardio and Endurance");

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
          <h1>{selected}</h1>
          <ul>
            {sessionsData[selected].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* RIGHT BUTTON SLIDER */}
        <div className='buttons'>
          <Swiper
            direction={'vertical'}
            slidesPerView={5}
            mousewheel={true}
            pagination={{ clickable: true }}
            modules={[Mousewheel, Pagination]}
            className="mySwiper"
          >
            {Object.keys(sessionsData).map((session, index) => (
              <SwiperSlide key={index}>
                <button className={`session-btn ${selected === session ? "active" : ""}`} onClick={() => setSelected(session)}>
                  {session}
                  {<hr className="session-divider" />}
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
