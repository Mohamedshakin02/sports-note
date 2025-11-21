import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";

import quote1 from "../assets/quotes/virat.jpg";
import quote2 from "../assets/quotes/muhammad.jpg";

function Quotes_Home() {
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

  // Function to get initials
  const getInitials = (name) => {
    const words = name.split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <section className="quotes-section container-md py-5 mt-2 px-2">
      <div className="heading-container mb-5 px-2">
        <h1 className="m-0 p-0 mb-3">Quotes</h1>
        <p className="m-0 p-0 fs-4 w-75">
          Read your favorite quotes from players and coaches. Let their words inspire and motivate you every day.
        </p>
      </div>

      <Swiper
        spaceBetween={20}
        navigation={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: (index, className) => {
            const author = quotesList[index].author;
            const image = quotesList[index].image;
            if (image) {
              return `<span class="${className} custom-bullet">
                        <img src="${image}" alt="${author}" class="bullet-image"/>
                      </span>`;
            } else {
              return `<span class="${className} custom-bullet initials">${getInitials(author)}</span>`;
            }
          },
        }}
        modules={[Navigation, Pagination]}
        centeredSlides={true}
        className="quotes-slider"
        breakpoints={{
          0: {
            slidesPerView: 1.25,   
          },
          768: {
            slidesPerView: 1.25,   
          },
          992: {
            slidesPerView: 1,     // desktop
          }
        }}
      >
      {quotesList.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="quote-box d-flex p-3 px-4">

            {/* IMAGE */}
            <div className="image-container me-2 me-sm-4 d-flex justify-content-center align-items-center">
              {item.image ? (
                <img src={item.image} alt="" className="img-fluid" />
              ) : (
                <i className="bi bi-person-fill display-3"></i>
              )}
            </div>

            {/* QUOTE ICON */}
            <div className="quote-container">
              <i className="bi bi-quote display-3"></i>
            </div>

            {/* TEXT */}
            <div className="text-container h-100 p-2 d-flex flex-column justify-content-between">
              <p className="quote m-0 display-6 fs-4 pt-0 pt-lg-1">
                "{item.quote}"
              </p>
              <p className="author m-0 p-0 mt-2 fs-5 text-end">
                <i>- {item.author}</i>
              </p>
            </div>

            {/* MENU WRAPPER */}
            <div
              className="menu-wrapper ms-auto"
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

          </div>
        </SwiperSlide>
      ))}
    </Swiper>

    </section >
  )
}

export default Quotes_Home