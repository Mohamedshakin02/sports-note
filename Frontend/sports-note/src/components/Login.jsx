import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation as SwiperNavigation } from "swiper/modules";
import Header from "./header";

import football from "../assets/bg-image/football.jpg";
import cricket from "../assets/bg-image/cricket.jpg";
import basketball from "../assets/bg-image/basketball.jpg";
import f1 from "../assets/bg-image/f1.png";

const slides = [
    { id: 1, image: football },
    { id: 2, image: cricket },
    { id: 3, image: basketball },
    { id: 4, image: f1 },
];

function Login() {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const goPrev = () => swiperRef.current?.slidePrev();
    const goNext = () => swiperRef.current?.slideNext();

    const handleSlideChange = (swiper) => setActiveIndex(swiper.realIndex);

    return (
        <section className="login-section">
            {/* Full-width slider */}
            <Swiper
                modules={[SwiperNavigation]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={handleSlideChange}
                loop={true}
                className="login-swiper"
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
            <div className="login-container container-md position-absolute">
                    <div className="login-form">
                        <h1>Login</h1>

                        <form>
                            <label><input type="email"
                                placeholder="Enter your email"
                                required
                            />
                            </label>

                            <label><input type="password"
                                placeholder="Enter your password"
                                required
                            />
                            </label>

                            {/* Submit button for the form */}
                            <button type="submit">Login</button>
                        </form>
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


        </section>
    );
}

export default Login