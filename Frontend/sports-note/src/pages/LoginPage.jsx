import React from 'react'
import Header from '../components/header'
import Login from '../components/Login'
import '../stylesheet/pages/login-page.css';

function LoginPage() {
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
            <Header />
            <main>
                <Login />
            </main>
        </>
    )
}

export default LoginPage