import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { FreeMode, Navigation, Pagination } from "swiper/modules";

import moment1 from "../assets/moments/rcb.jpg";
import moment3 from "../assets/moments/india vs new zealand.jpg";
import moment4 from "../assets/moments/lakers win.jpg";
import noImage from "../assets/logos/moments-grey.png";

function Moments_Home() {
  const [openIndex, setOpenIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const swiperRef = useRef(null);

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
      description:
        "I was extremely happy when RCB finally won this year IPL. It was their first win and I still can’t believe it happened. The joy and excitement of watching the team lift the trophy was unforgettable and truly special for all the fans.",
      date: "2024-05-12",
    },
    {
      image: "",
      sport: "Football",
      title: "Argentina Won FIFA World Cup 2022",
      description:
        "I was overjoyed when Argentina won the 2022 FIFA World Cup. The match was thrilling and seeing the team lift the trophy felt surreal. I still can’t believe the incredible journey and the unforgettable moments of that tournament.",
      date: "2022-12-18",
    },
    {
      image: moment3,
      sport: "Cricket",
      title: "India vs New Zealand Heart Breaking Semi Final 2019",
      description:
        "Watching India play against New Zealand in the 2019 semi final was heartbreaking. I felt so proud of the team for giving their best, yet so sad when the match ended. It was a rollercoaster of emotions that I will never forget.",
      date: "2019-07-10",
    },
    {
      image: moment4,
      sport: "Basketball",
      title: "Lakers Win NBA Finals 2020",
      description:
        "I was thrilled when the Lakers clinched the 2020 NBA Finals. Witnessing the team's hard work pay off and seeing the championship celebration was unforgettable. The energy and excitement of the game made it a truly special moment.",
      date: "2020-10-11",
    },
    {
      image: "",
      sport: "Cricket",
      title: "England Won 2019 Cricket World Cup",
      description:
        "I could not stop cheering when England won the 2019 Cricket World Cup. The final was so intense and nerve-wracking, and I still remember the excitement when the match ended in a super over. It was an amazing experience to witness history.",
      date: "2019-07-14",
    },
  ];

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth <= 576;

  return (
    <section className="moments-section container-md py-5 mt-2 px-2">
      <div className="heading-container mb-5">
        <h1 className="m-0 p-0 mb-3">Moments</h1>
        <p className="m-0 p-0 fs-4 w-75">
          Keep and enjoy your best sports moments. Remember the exciting games
          and achievements that made you proud.
        </p>
      </div>

      <Swiper
        key={screenWidth} // re-render on screenWidth change
        modules={[Navigation, Pagination]}
        navigation={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        freeMode={!isMobile}
        slidesPerView={isMobile ? 1.3 : screenWidth >= 1024 ? "auto" : "auto"}
        centeredSlides={isMobile} // center slides on mobile
        spaceBetween={20}
        observer={true}
        observeParents={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setTimeout(() => swiper.update(), 50);
        }}
        onResize={() => {
          setTimeout(() => {
            swiperRef.current.update();
            swiperRef.current.slideTo(0);
          }, 50);
        }}
        className="moments-slider"
      >
        {momentsList.map((moment, index) => (
          <SwiperSlide
            key={index}
            className="moment-card"
            style={{
              width: !isMobile
                ? openIndex === index
                  ? "300px"
                  : "120px"
                : "auto", // Swiper calculate width in mobile
              maxWidth: isMobile ? "90vw" : undefined, // prevent overflow
              transition: "0.3s ease",
              flexShrink: 0,
            }}
            onClick={() => {
              if (!isMobile) {
                const newIndex = openIndex === index ? null : index;
                setOpenIndex(newIndex);
                if (newIndex !== null && swiperRef.current)
                  swiperRef.current.slideTo(newIndex);
              }
            }}
          >
            <div
              className={`card-inner ${openIndex === index || isMobile ? "open" : "closed"
                }`}
            >
              <div className="card-image">
                <span className="sport-badge">{moment.sport}</span>

                {moment.image ? (
                  <img src={moment.image} alt={moment.title} />
                ) : (
                  <div className="no-image-inner">
                    <img src={noImage} className="img-fluid" />
                  </div>
                )}
              </div>

              {!isMobile && openIndex !== index && (
                <div className="card-vertical-text">
                  <p className="m-0 p-0 text-truncate fs-6">{moment.title}</p>
                </div>
              )}

              {(openIndex === index || isMobile) && (

                <>
                  <div
                    className="menu-wrapper"
                    ref={(el) => (menuRefs.current[index] = el)}
                    onClick={(e) => {
                      e.stopPropagation(); // <-- prevent slide click
                      toggleMenu(index);
                    }}
                  >
                    <i className="bi bi-three-dots-vertical menu-icon"></i>

                    {openMenuIndex === index && (
                      <div className="menu-dropdown">
                        <button>Edit</button>
                        <button>Delete</button>
                      </div>
                    )}
                  </div>

                  <div className="card-content">
                    <h3 className="fs-4">{moment.title}</h3>
                    <p className="text-truncate-vertical flex-grow-1 mb-2">
                      {moment.description}
                    </p>
                    <small className="date mb-3">
                      <i className="bi bi-calendar me-2"></i>
                      {formatDate(moment.date)}
                    </small>
                  </div>
                </>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Moments_Home;
