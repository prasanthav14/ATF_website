import React from 'react';
import Head from "../components/head/head.js"
import Userlogin from "../components/userlogin/userlogin.js"
import SecondHead from "../components/secondhead/secondhead.js"
import Footer from "../components/footer/footer.js"

function UserLogin() {
  window.scrollTo(0, 0);
  return (
    <>
      <Head />
      <SecondHead />
      <Userlogin />
      <Footer />
    </>
  )
}

export default UserLogin