import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js"
import AdminLogin from "./pages/Admin_Login.js"
import UserLogin from "./pages/UserLogin.js"
import AdminForm from "./pages/Admin_Form.js"
import About from "./pages/About.js"
import AllPosts from "./pages/AllPosts.js"
import SinglePost from "./pages/SinglePost.js"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
           <Route path="/" element={<Home />} />
         <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/adminform" element={<AdminForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/allposts" element={<AllPosts />} /> 
          <Route path="/singlepost/:key" element={<SinglePost />} /> 
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={500} hideProgressBar={true} newestOnTop={true} position={toast.POSITION.TOP_CENTER}/>
    </>
  )
}

export default App