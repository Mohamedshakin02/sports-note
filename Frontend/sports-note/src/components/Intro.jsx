import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation as SwiperNavigation } from "swiper/modules";
import Header from "./header";

import football from "../assets/football.jpg";
import cricket from "../assets/cricket.webp";
import basketball from "../assets/basketball.jpg";
import f1 from "../assets/f1.png";

const slides = [
  { id: 1, image: football },
  { id: 2, image: cricket },
  { id: 3, image: basketball },
  { id: 4, image: f1 },
];

function Intro() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = () => swiperRef.current?.slidePrev();
  const goNext = () => swiperRef.current?.slideNext();

  const handleSlideChange = (swiper) => setActiveIndex(swiper.realIndex);

  return (
    <section className="intro-section">
      {/* Full-width slider */}
      <Swiper
        modules={[SwiperNavigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        loop={true}
        className="intro-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="slide-image"
              style={{ backgroundImage: `url(${slide.image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center top"}}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradient overlay */}
      <div className="gradient-overlay"></div>

      {/* Header on top of slider */}
      <Header />

      {/* Main content overlay */}
      <div className="intro-container container-md position-absolute">
        <div className="content-container d-flex justify-content-between align-items-center px-3">
          {/* Dates */}
          <div className="dates-container d-flex flex-column gap-4">
            {["12", "15", "20"].map((day, i) => (
              <div key={i} className="dates-box d-flex flex-column justify-content-center align-items-center">
                <p className="month m-0 p-0 fw-semibold">NOV</p>
                <p className="day m-0 p-0 fs-4 fw-semibold">{day}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="desc-container fst-italic w-50 text-center text-md-start">
            <h1 className="m-0 p-0 display-4 text-center">Every Moment Counts</h1>
            <p className="m-0 p-0 fw-bolder h4 text-center my-4">
              With Sports Note, capture your unforgettable plays, track your progress,
              and relive the moments that make every game memorable.
            </p>
          </div>

          {/* Quotes */}
          <div className="quotes-container d-flex flex-column gap-4 fs-3 fw-semibold">
            {["VK", "RS", "LM"].map((author, i) => (
              <div key={i} className="quotes-box d-flex justify-content-center align-items-center">
                <p className="author m-0 p-0">{author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slider control - on top of slider, bottom aligned */}
      <div className="slider-control position-absolute w-100">
        <div className="left-side">
          <div className="left-button" onClick={goPrev}>
            <i className="bi bi-chevron-double-left fs-2"></i>
          </div>
        </div>
        <div className="right-side">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`indicator ${activeIndex === index ? "active" : ""}`}
            />
          ))}
          <div className="right-button" onClick={goNext}>
            <i className="bi bi-chevron-double-right fs-2"></i>
          </div>
        </div>
      </div>

      {/* Scroll down */}
      <div className="scroll-down position-absolute">
        <p className="m-0 p-0">Scroll</p>
        <div className="arrow">
          <i className="bi bi-chevron-down fs-3"></i>
        </div>
      </div>
    </section>
  );
}

export default Intro;
