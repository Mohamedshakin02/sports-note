import React from 'react'
import Header from './header'

function Intro() {
  return (
    <section className='intro-section container-fluid'>
      <Header />  {/* Keep header outside of intro-container */}

      <div className='intro-container d-flex justify-content-center'>
        {/* Main Content */}
        <div className='content-container container-md p-0 d-flex justify-content-between align-items-center'>
          {/* Dates Section */}
          <div className='dates-container d-flex flex-column gap-3'>
            <div className='dates-box d-flex flex-column justify-content-center align-items-center'>
              <p className='month m-0 p-0'>NOV</p>
              <p className='day m-0 p-0'>12</p>
            </div>
            <div className='dates-box d-flex flex-column justify-content-center align-items-center'>
              <p className='month m-0 p-0'>NOV</p>
              <p className='day m-0 p-0'>15</p>
            </div>
            <div className='dates-box d-flex flex-column justify-content-center align-items-center'>
              <p className='month m-0 p-0'>NOV</p>
              <p className='day m-0 p-0'>20</p>
            </div>
          </div>

          {/* Description Section */}
          <div className='desc-container fst-italic w-50 text-center text-md-start'>
            <h1 className='m-0 p-0 fw-bolder'>Every Moment Counts</h1>
            <p className='m-0 p-0 fw-semibold'>
              With Sports Note, capture your unforgettable plays, track your progress, 
              and relive the moments that make every game memorable.
            </p>
          </div>

          {/* Quotes Section */}
          <div className='quotes-container d-flex flex-column gap-3'>
            <div className='quotes-box d-flex justify-content-center align-items-center'>
              <p className='author m-0 p-0'>VK</p>
            </div>
            <div className='quotes-box d-flex justify-content-center align-items-center'>
              <p className='author m-0 p-0'>RS</p>
            </div>
            <div className='quotes-box d-flex justify-content-center align-items-center'>
              <p className='author m-0 p-0'>LM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Intro
