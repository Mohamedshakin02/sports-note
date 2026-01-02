import React from 'react'
import Sessions from '../components/layout/Sessions'
import Header from '../components/layout/Header'
import '../stylesheet/pages/sessions-page.css';
import Footer from '../components/layout/Footer';

function SessionsPage() {
  return (
    <>
    {/* Inline CSS specific to Sessions page */}
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

          body .sessions-section{
            border-top: none;
          }

          .auth-dropdown i, .bi-grid-fill, .menu-links li hr{
           filter: invert(100%);
          }
        `}
      </style>

      {/* Page content */}
      <Header/>
      <main>
        <Sessions/>
      </main>
      <Footer/>
    </>
  )
}

export default SessionsPage