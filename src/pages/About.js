import React from 'react';
import Head from "../components/head/head.js"
import SecondHead from "../components/secondhead/secondhead.js"
import About from "../components/about/about.js"
import Footer from "../components/footer/footer.js"


function Single_Post() {
  return (
    <>
      <Head />
      <SecondHead/>
      <About />
      <Footer />
    </>
  )
}

export default Single_Post