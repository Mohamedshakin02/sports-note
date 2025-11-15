import React from 'react'
import Moments from '../components/Moments'
import Header from '../components/header'
import '../stylesheet/pages/moments-page.css';


function MomentsPage() {
  return (
    <>
      <main>
        <Header/>
        <Moments/>
      </main>
    </>
  )
}

export default MomentsPage