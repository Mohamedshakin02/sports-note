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

          .logo p a, .menu-links li a{
            color: black !important
          }

          body .menu-links li a:hover {
            color: #710004 !important;
          }

          .auth-dropdown i, .menu-links li hr{
           filter: invert(100%);
          }
           
          .auth-dropdown .dropdown-content a{
           background-color: #710004;
           color: white
          }

          .auth-dropdown .dropdown-content a:hover{
           background-color: black;
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