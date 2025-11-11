import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import moments from "../assets/logos/moments.png";
import fixtures from "../assets/logos/fixtures.png";
import quotes from "../assets/logos/quotes.png";
import techniques from "../assets/logos/techniques.png";
import sessions from "../assets/logos/sessions.png";

function MomentsPage() {
    return (
        <div className="moments-page container py-5">
            <h2>Moments</h2>
            <p>Here you can view and add your sports moments!</p>
        </div>
    );
}

function Features() {
    return (
        <BrowserRouter>
            <section className="features-section">
                <div className='features-container container-md py-3 py-lg-5 px-3'>
                    <div className='top-container d-flex justify-content-between mb-5'>
                        <div className='heading mt-4'>
                            <h1 className='m-0 p-0'>Discover Sport Note Features</h1>
                        </div>

                        <div className='desc fs-4 mt-4'>
                            <p className='m-0 p-0'>
                                Sport Note helps you capture your sports journey, track your progress, and relive your best moments all in one organized place.
                            </p>
                        </div>
                    </div>

                    <div className='bottom-container pt-3 pt-lg-5'>
                        <div className='feature-box d-flex flex-column justify-content-between ps-4 py-3'>
                            <div className='box-content mb-4'>
                                <div className='logo mb-4'>
                                    <img className='img-fluid' src={moments} alt="" />
                                </div>
                                <h1 className='m-0 p-0 fs-2 mb-3'>Moments</h1>
                                <p className='m-0 p-0 fs-5'>Record your unforgettable sports moments and relive the highlights that define your journey.</p>
                            </div>

                            <div className='box-link'>
                                <p>
                                    <Link to="/" className="text-decoration-none fs-4 m-0 p-0">Explore</Link>
                                </p>
                            </div>
                        </div>

                        <div className='feature-box d-flex flex-column justify-content-between ps-4 py-3'>
                            <div className='box-content mb-4'>
                                <div className='logo mb-4'>
                                    <img className='img-fluid' src={fixtures} alt="" />
                                </div>
                                <h1 className='m-0 p-0 fs-2 mb-3'>Fixtures</h1>
                                <p className='m-0 p-0 fs-5'>Add your upcoming match fixtures and stay prepared for every game that defines your passion.</p>
                            </div>

                            <div className='box-link'>
                                <p>
                                    <Link to="/" className="text-decoration-none fs-4 m-0 p-0">Explore</Link>
                                </p>
                            </div>
                        </div>

                        <div className='feature-box d-flex flex-column justify-content-between ps-4 py-3'>
                            <div className='box-content mb-4'>
                                <div className='logo mb-4'>
                                    <img className='img-fluid' src={quotes} alt="" />
                                </div>
                                <h1 className='m-0 p-0 fs-2 mb-3'>Quotes</h1>
                                <p className='m-0 p-0 fs-5'>Save your favourite player quotes and rediscover the words that keep your spirit alive.</p>
                            </div>

                            <div className='box-link'>
                                <p>
                                    <Link to="/" className="text-decoration-none fs-4 m-0 p-0">Explore</Link>
                                </p>
                            </div>
                        </div>

                        <div className='feature-box d-flex flex-column justify-content-between ps-4 py-3'>
                            <div className='box-content mb-4'>
                                <div className='logo mb-4'>
                                    <img className='img-fluid' src={techniques} alt="" />
                                </div>
                                <h1 className='m-0 p-0 fs-2 mb-3'>Techniques</h1>
                                <p className='m-0 p-0 fs-5'>Write your step-by-step techniques and master the moves that improve your overall game.</p>
                            </div>

                            <div className='box-link'>
                                <p>
                                    <Link to="/" className="text-decoration-none fs-4 m-0 p-0">Explore</Link>
                                </p>
                            </div>
                        </div>

                        <div className='feature-box d-flex flex-column justify-content-between ps-4 '>
                            <div className='box-content mb-4'>
                                <div className='logo mb-4'>
                                    <img className='img-fluid' src={sessions} alt="" />
                                </div>
                                <h1 className='m-0 p-0 fs-2 mb-3'>Sessions</h1>
                                <p className='m-0 p-0 fs-5'>Add your training sessions to keep a record of your sports practice and improve your performance.</p>
                            </div>

                            <div className='box-link'>
                                <p>
                                    <Link to="/" className="text-decoration-none fs-4 m-0 p-0">Explore</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Routes inside this component */}
                {/* <Routes>
          <Route path="/" element={<MomentsPage />} />
        </Routes> */}
            </section>
        </BrowserRouter>
    );
}

export default Features;
