import React from 'react'
import Header from '../components/header'
import Quotes from '../components/Quotes'

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

          .auth-dropdown i, .bi-grid-fill, .menu-links li hr{
           filter: invert(100%);
          }
        `}
      </style>

      <main>
        <Header/>
        <Quotes/>
      </main>
    </>
  )
}

export default QuotesPage