import React from 'react'
import Sign_Up from '../components/layout/Sign_Up'
import Header from '../components/layout/Header'
import '../stylesheet/pages/sign-up-page.css';


function Sign_UpPage() {
  return (
    <>
        <style>
        {`
          body {
            background-color: #FCF0D6;
          }

          header, footer{
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

      <Header/>
      <main>
        <Sign_Up/>
      </main>
    </>
  )
}

export default Sign_UpPage