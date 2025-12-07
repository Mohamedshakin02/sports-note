import React from 'react'
import Header from '../components/header'
import Intro from '../components/Intro'
import Features from '../components/Features'
import '../stylesheet/pages/home.css';
import Moments_Home from '../components/Moments_Home';
import Fixtures from '../components/Fixtures';
import Fixtures_Home from '../components/Fixtures_Home';
import Quotes_Home from '../components/Quotes_Home';
import Techniques_Home from '../components/Techniques_Home';
import Sessions_home from '../components/Sessions_home';
import Footer from '../components/Footer';

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