import React from 'react';
import Head from "../components/head/head.js"
import SecondHead from "../components/secondhead/secondhead.js"
// import Newrecipiestitle from "../components/newrecipiestitle/newrecipiestitle.js"
// import Carousel from "../components/carousel/carousel.js"
import Singlepost from "../components/singlepost/singlepost.js"
import Footer from "../components/footer/footer.js"


function SinglePost() {
  window.scrollTo(0, 0);
  return (
    <>
      <Head />
      <SecondHead/>
      <Singlepost />
      <Footer />
    </>
  )
}

export default SinglePost