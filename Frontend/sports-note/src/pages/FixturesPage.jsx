import React from 'react'
import Header from '../components/header'
import Fixtures from '../components/Fixtures'
import '../stylesheet/pages/fixtures-page.css';


function FixturesPage() {
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
        <Fixtures/>
      </main>
    </>
  )
}

export default FixturesPage