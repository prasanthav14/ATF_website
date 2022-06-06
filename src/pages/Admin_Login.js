import React from 'react';
import Head from "../components/head/head.js"
import Adminlogin from "../components/adminlogin/adminlogin.js"
import Footer from "../components/footer/footer.js"

function AdminLogin() {
  window.scrollTo(0, 0);
  return (
    <>
      <Head />
      <Adminlogin />
      <Footer />
    </>
  )
}

export default AdminLogin