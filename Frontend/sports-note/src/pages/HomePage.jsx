import React from 'react'
import Intro from '../components/layout/Intro'
import Features from '../components/layout/Features'
import '../stylesheet/pages/home.css';
import Moments_Home from '../components/layout/Moments_Home';
import Fixtures_Home from '../components/layout/Fixtures_Home';
import Quotes_Home from '../components/layout/Quotes_Home';
import Techniques_Home from '../components/layout/Techniques_Home';
import Sessions_home from '../components/layout/Sessions_home';
import Footer from '../components/layout/Footer';

function HomePage() {
  return (
    <>
      <style>
        {`
          body .fixtures-section, .techniques-section {
            min-height: 695px;
            }

          body .quotes-section, .sessions-section{
            min-height: 700px;
          }
          `}
      </style>

      <main>
        <Intro />
        <Features />
        <Moments_Home />
        <Fixtures_Home />
        <Quotes_Home />
        <Techniques_Home />
        <Sessions_home />
      </main>
      <Footer />
    </>
  )
}

export default HomePage