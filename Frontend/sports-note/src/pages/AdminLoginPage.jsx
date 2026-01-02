import React from 'react'
import '../stylesheet/pages/admin-login-page.css';
import Admin_Login from '../components/layout/Admin_Login';
import Header from '../components/layout/Header';


function AdminLoginPage() {
    return (
        <>
            {/* Inline CSS specific to Admin Login page */}
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

            {/* Page content */}
            <Header />
            <main>
                <Admin_Login />
            </main>
        </>
    )
}

export default AdminLoginPage