import React from 'react'
import Header from '../components/header'
import Techniques from '../components/Techniques'
import '../stylesheet/pages/techniques-page.css';

function TechniquesPage() {
  return (
    <>
    <style>
        {`
          body {
            background-color: #FCF0D6;
          }

          header{
            background-color: #710004;
          }

          .logo p a, .menu-links li a, .Logo a{
            color: white !important
          }

          body .menu-links li a:hover {
            color: #FCF0D6 !important;
          }

          .auth-dropdown i, .bi-grid-fill, .menu-links li hr{
           filter: invert(0%);
          }
        `}
      </style>

      <main>
        <Header/>
        <Techniques/>
      </main>
    </>
  )
}

export default TechniquesPage