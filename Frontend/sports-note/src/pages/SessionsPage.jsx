import React from 'react'
import Sessions from '../components/Sessions'
import Header from '../components/header'

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

          .auth-dropdown i, .bi-grid-fill, .menu-links li hr{
           filter: invert(100%);
          }
        `}
      </style>

      <main>
        <Header/>
        <Sessions/>
      </main>
    </>
  )
}

export default SessionsPage