import React from 'react'
import Header from '../components/header'
import Intro from '../components/Intro'
import Features from '../components/Features'
import '../stylesheet/pages/home.css';
import Moments_Home from '../components/Moments_Home';
import Fixtures from '../components/Fixtures';
import Fixtures_Home from '../components/Fixtures_Home';

function HomePage() {
  return (
    <>
      <main>
        <Intro/>
        <Features/>
        <Moments_Home/>
        <Fixtures_Home/>
      </main>
    </>
  )
}

export default HomePage