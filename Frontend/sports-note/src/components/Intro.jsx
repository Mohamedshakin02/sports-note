import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation as SwiperNavigation } from "swiper/modules";
import Header from "./header";
import { fetchVideos } from "../api/youtube";

import football from "../assets/bg-image/football.jpg";
import cricket from "../assets/bg-image/cricket.jpg";
import basketball from "../assets/bg-image/basketball.jpg";
import f1 from "../assets/bg-image/f1.png";

import quote1 from "../assets/quotes/virat.jpg";
import quote2 from "../assets/quotes/muhammad.jpg";

const slides = [
  { id: 1, image: football },
  { id: 2, image: cricket },
  { id: 3, image: basketball },
  { id: 4, image: f1 },
];

const fixturesList = [
  { date: "2024-1-19", team1: "INDIA", team2: "PAK", time: "9:30", sport: "Cricket" },
  { date: "2024-11-20", team1: "AUSTRALIA", team2: "ENG", time: "14:00", sport: "Cricket" },
  { date: "2024-11-22", team1: "BARCELONA", team2: "REAL MADRID", time: "20:45", sport: "Football" },
  { date: "2024-11-23", team1: "MAN UNITED", team2: "ARSENAL", time: "", sport: "Football" },
  { date: "2024-11-25", team1: "BULLS", team2: "CELTICS", time: "", sport: "Basketball" }
];

const quotesList = [
  {
    image: quote1,
    quote:
      "Whatever you want to do, do with full passion and work really hard towards it. Don't look anywhere else.",
    author: "Virat Kohli",
  },
  {
    image: quote2,
    quote: "I hated every minute of training, but I said, 'Don’t quit. Suffer now and live the rest of your life as a champion.'",
    author: "Muhammad Ali",
  },
  {
    image: "",
    quote: "Success isn’t owned. It’s leased. And rent is due every day.",
    author: "J.J. Watt",
  },
];

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  return { month, day };
};

const formatDate2 = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();
};

const getInitials = (name) => {
  const words = name.trim().split(" ");
  const first = words[0][0] || "";
  const second = words[1]?.[0] || "";
  return (first + second).toUpperCase();
};


function Intro() {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = () => swiperRef.current?.slidePrev();
  const goNext = () => swiperRef.current?.slideNext();

  const handleSlideChange = (swiper) => setActiveIndex(swiper.realIndex);

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState("");

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);

  const openFixtureModal = (fixture) => {
    setSelectedItem(fixture);
    setModalType("fixture");
  };

  const openQuoteModal = async (quote) => {
    setSelectedItem(quote);
    setModalType("quote");

    setVideos([]);
    setVideosLoading(true);

    const searchText = `Best of ${quote.author} Moments in Sports`;

    try {
      const results = await fetchVideos(searchText);

      const videosFiltered = results.filter(
        (v) =>
          v.id?.videoId &&
          v.id.videoId.length === 11 &&
          v.snippet?.thumbnails?.default
      );

      setVideos(videosFiltered.slice(0, 3));
    } catch (err) {
      console.error("Video fetch error:", err);
    }

    setVideosLoading(false);
  };

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
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center top"
              }}
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
        <div className="content-container px-3 px-md-2">
          {/* Dates */}
          <div className="dates-container d-flex flex-column gap-4">
            {fixturesList.slice(0, 3).map((fixture, i) => {
              const { month, day } = formatDate(fixture.date);

              return (
                <div key={i} className="dates-box d-flex flex-column justify-content-center align-items-center" onClick={() => openFixtureModal(fixture)}
                  data-bs-toggle="modal"
                  data-bs-target="#infoModal">
                  <p className="month m-0 p-0 mt-1 fw-semibold">{month}</p>
                  <p className="day m-0 p-0 fs-4 fw-semibold">{day}</p>
                </div>
              );
            })}
          </div>

          {/* Description */}
          <div className="slogan-container fst-italic text-center text-md-start">
            <h1 className="m-0 p-0 display-4 text-center">Every Moment Counts</h1>

          </div>

          <div className="desc-container">
            <p className="m-0 p-0 h4 text-center my-4">
              <i>With Sports Note, capture your unforgettable plays, track your progress,
                and relive the moments that make every game memorable.</i>
            </p>
          </div>

          {/* Quotes */}
          <div className="quotes-container d-flex flex-column gap-4 fs-3 fw-semibold">
            {quotesList.map((quote, i) => (
              <div key={i} className="quotes-box d-flex justify-content-center align-items-center" onClick={() => openQuoteModal(quote)}
                data-bs-toggle="modal"
                data-bs-target="#infoModal">
                {quote.image ? (
                  <img src={quote.image} alt={quote.author} className="quote-img img-fluid" />
                ) : (
                  <p className="author m-0 p-0">{getInitials(quote.author)}</p>
                )}
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

      <div
        className="modal fade"
        id="infoModal"
        tabIndex="-1"
        aria-labelledby="infoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">

            <div className="modal-body p-4">

              <h1 className="m-0 fs-3 mb-4">{modalType === "fixture" ? "Upcoming Fixture" : "Quote"}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>

              {modalType === "fixture" && selectedItem && (
                <div className="fixture-box pt-0 text-center">
                  <div className="top-container p-2 py-3 d-flex flex-column justify-content-center align-items-center">
                    <h2 className="m-0 fs-3"> {formatDate2(selectedItem.date)}</h2>
                  </div>
                  <div className="bottom-container p-4">
                    <p className="sport-badge m-0 p-0 mt-2 rounded-pill">{selectedItem.sport}</p>
                    <p className="m-0 p-0 my-2 mt-3 fs-4 fw-bolder"> {selectedItem.team1} vs {selectedItem.team2}</p>
                    <p className="m-0 p-0 fs-6"> <span><i className="bi bi-clock me-2"></i></span> {selectedItem.time || "N/A"}</p>
                  </div>
                </div>

              )}

              {modalType === "quote" && selectedItem && (
                <div className="quote-box d-flex flex-column ">
                  <div className="image-container mb-3 me-2 me-sm-4 d-flex align-items-center">
                    {selectedItem.image ? (
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.author}
                        className="img-fluid"
                      />
                    ) :
                      (
                        <i className="bi bi-person-fill display-3"></i>
                      )}
                  </div>

                  <div className="bottom container d-flex">
                    <div className="quote-container">
                      <i className="bi bi-quote display-3"></i>
                    </div>
                    <div className="text-container h-100 p-2 d-flex flex-column justify-content-between">
                      <p className="quote m-0 display-6 fs-4 pt-0 pt-lg-1">"{selectedItem.quote}"</p>
                      <p className="author m-0 p-0 mt-2 fs-5 text-end"><i>- {selectedItem.author}</i></p>
                    </div>
                  </div>

                  {/* Render videos only if videos exist */}
                  {videos.length > 0 && (
                    <>
                      <hr className="my-3" />
                      <h2 className="fs-4 mb-3">Best of {selectedItem.author}</h2>

                      {videosLoading && <p className="text-center">Loading videos...</p>}

                      <div className="video-container d-flex flex-column gap-3">
                        {videos.map((v) => (
                          <div key={v.id.videoId} className="video-box">
                            <iframe
                              width="100%"
                              height="200"
                              src={`https://www.youtube.com/embed/${v.id.videoId}`}
                              title={v.snippet.title}
                              allowFullScreen
                            ></iframe>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                </div>




              )}

            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

export default Intro;
