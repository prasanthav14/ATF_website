import React from 'react';
import Head from "../components/head/head.js"
import SecondHead from "../components/secondhead/secondhead.js"
import Allposts from "../components/allposts/allposts.js"
import Footer from "../components/footer/footer.js"

function AllPosts() {
  window.scrollTo(0, 0);
  return (
    <>
      <Head />
      <SecondHead/>
      <Allposts />
      <Footer />
    </>
  )
}

export default AllPosts