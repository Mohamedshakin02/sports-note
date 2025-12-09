import React from 'react'
import Moments from '../components/layout/Moments'
import Header from '../components/layout/Header'
import '../stylesheet/pages/moments-page.css';
import Footer from '../components/layout/Footer';


function MomentsPage() {
  return (
    <>
    <style>
        {`
          body {
            background-color: #710004; 
          }

          header{
            background-color: #FCF0D6;
          }

          .logo p a, .menu-links li a, .Logo a{
            color: black !important
          }

          body .menu-links li a:hover {
            color: #710004 !important;
          }

          .auth-dropdown i, .bi-grid-fill, .menu-links li hr{
           filter: invert(100%);
          }

          
        `}
      </style>

      <main>
        <Header/>
        <Moments/>
      </main>
      <Footer/>
    </>
  )
}

export default MomentsPage