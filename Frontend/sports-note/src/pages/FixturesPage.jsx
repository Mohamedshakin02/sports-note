import React from 'react'
import Header from '../components/layout/Header'
import Fixtures from '../components/layout/Fixtures'
import '../stylesheet/pages/fixtures-page.css';
import Footer from '../components/layout/Footer';


function FixturesPage() {
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

          body footer .footer-container .menu-links ul a, 
          body footer .footer-container, 
          body footer .footer-container .logo p{
            color: #FCF0D6 !important;
          }

          body footer .footer-container .menu-links ul a:hover{
            color: white !important
          }

          body footer .footer-container .auth-links ul a{
            border: 3px solid #FCF0D6 !important;
            color: #FCF0D6 !important
          }

          body footer .footer-container .auth-links ul a:hover{
            border: 3px solid white !important;
            background-color: white !important;
            color: black !important
          }

          body footer .footer-container .auth-links ul .sign{
            background-color: #FCF0D6 !important;
            color: #710004 !important;
          }

          footer .footer-container .auth-links .logout{
            color: #FCF0D6 !important;
            border: 3px solid #FCF0D6 !important;
          }

          footer .footer-container .auth-links .logout:hover{
            color: #000 !important;
            background-color: #fff !important;
            border: 3px solid #fff !important;
          }

          body footer .footer-container p, .copyright{
            color: white !important
          }

          footer .footer-container .logo::before, 
          footer .footer-container .logo::after{
            background-color: #FCF0D6;
          }
        `}
      </style>

      <Header/>
      <main>
        <Fixtures/>
      </main>
      <Footer/>
    </>
  )
}

export default FixturesPage