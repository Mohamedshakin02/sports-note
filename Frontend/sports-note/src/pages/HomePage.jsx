import React from 'react'
import Header from '../components/header'
import Intro from '../components/Intro'
import Features from '../components/Features'
import '../stylesheet/pages/home.css';

function HomePage() {
  return (
    <>
      <main>
        <Intro/>
        <Features/>
      </main>
    </>
  )
}

export default HomePage