import React from 'react'
import Sessions from '../components/layout/Sessions'
import Header from '../components/layout/Header'
import '../stylesheet/pages/sessions-page.css';
import Footer from '../components/layout/Footer';

function SessionsPage() {
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

          body .sessions-section{
            border-top: none;
          }

          .auth-dropdown i, .bi-grid-fill, .menu-links li hr{
           filter: invert(100%);
          }
        `}
      </style>

      <Header/>
      <main>
        <Sessions/>
      </main>
      <Footer/>
    </>
  )
}

export default SessionsPage