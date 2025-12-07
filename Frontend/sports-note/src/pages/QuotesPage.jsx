import React from 'react'
import Header from '../components/header'
import Quotes from '../components/Quotes'
import '../stylesheet/pages/quotes-page.css';
import Footer from '../components/Footer';

function QuotesPage() {
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

          body .quotes-section{
            border-top: none;
          }

          .auth-dropdown i, .bi-grid-fill, .menu-links li hr{
           filter: invert(100%);
           
          }
        `}
      </style>

      <Header/>
      <main>
        <Quotes/>
      </main>
      <Footer/>
    </>
  )
}

export default QuotesPage