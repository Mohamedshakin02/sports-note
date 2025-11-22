import React from 'react'

function Footer() {
    return (
        <footer className='py-5 pb-3 mt-2 px-2'>
            <div className='footer-container container-md'>
                <div className='menu-links pe-5'>
                    <h1 className='h2 m-0 p-0'>Explore Sports Note</h1>
                    <p className='h5 m-0 p-0 pt-3'>Find everything you need to explore your sports notes.</p>
                    <ul className='list-unstyled m-0 p-0 pt-3 fs-4'>
                        <li className='pb-2'>Moments <span><i className="bi bi-arrow-up-right"></i></span></li>
                        <li className='pb-2'>Fixtures  <span><i className="bi bi-arrow-up-right"></i></span></li>
                        <li className='pb-2'>Quotes  <span><i className="bi bi-arrow-up-right"></i></span></li>
                        <li className='pb-2'>Techniques  <span><i className="bi bi-arrow-up-right"></i></span></li>
                        <li className='pb-2'>Sessions  <span><i className="bi bi-arrow-up-right"></i></span></li>
                    </ul>
                </div>
                <div className='auth-links ps-lg-5'>
                    <h1 className='h2 m-0 p-0'>Planning to organise your sports notes?</h1>
                    <p className='h5 m-0 p-0 pt-3'>Start building your sports collection by joining Sport Note.</p>
                    <ul className='list-unstyled m-0 p-0 mt-4'>
                        <li className='login rounded-pill p-2 fs-5'>Login</li>
                        <li className='sign rounded-pill p-2 fs-5'>Sign Up</li>
                    </ul>
                </div>

                <div className='logo'>
                    <h2 className='display-3 m-0 p-0'>SPORTS <br />
                        NOTE</h2>
                    <p className='m-0 p-0 pt-3 px-lg-5 fs-5'><i>Capture Plays, Track Progress, Relive Moments</i></p>
                </div>
            </div>

            <div className='copyright mt-5 mt-lg-3'>
                <p className='m-0 p-0'>&copy; 2025 SPORTS NOTE</p>
            </div>
        </footer>
    )
}

export default Footer