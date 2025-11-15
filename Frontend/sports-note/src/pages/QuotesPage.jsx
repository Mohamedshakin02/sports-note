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