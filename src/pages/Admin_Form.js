import React from 'react';
import Head from "../components/head/head.js"
import Adminform from "../components/adminform/adminform.js"
import SecondHead from "../components/secondhead/secondhead.js"
import Footer from "../components/footer/footer.js"


function AdminForm() {
  window.scrollTo(0, 0);
  return (
    <>
      <Head />
      <SecondHead />
      <Adminform />
      <Footer />
    </>
  )
}

export default AdminForm