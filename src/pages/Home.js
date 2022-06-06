import React from 'react';
import Head from "../components/head/head.js"
import SecondHead from "../components/secondhead/secondhead.js"
import Newrecipiestitle from "../components/newrecipiestitle/newrecipiestitle.js"
// import Carousel from "../components/carousel/carousel.js"
import Tagfilter from "../components/tagfilter/tagfilter.js"
import Cooklist from "../components/cooklist/cooklist.js"
import Footer from "../components/footer/footer.js"

function Home() {
  window.scrollTo(0, 0);
  return (
    <>
      <Head />
      <SecondHead />
      {/* <Carousel /> */}
      <Newrecipiestitle />
      <Cooklist />
      <Tagfilter/>
      <Footer />
    </>
  )
}

export default Home