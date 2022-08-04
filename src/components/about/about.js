import React, { useEffect, useState, } from 'react';
import './about.css'
import { db } from "../../fireBaseConfig.js";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../../fireBaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

require('dotenv').config()


function About() {

    const [text, setText] = useState("");
    const [userData, setUserdata] = useState("");
    const aboutText = `Hi, I’m so glad you’re here!',$Since you are here let's chat a little about the background of Above The Flavors.
     I’ve always had a love for baking and cooking. Being an IT professional, I had been forced to stay away from my family for a long years.
      This is when I discovered my passion for experimenting with food.$I always dream about the food that I love to eat and I try to make it at my own kitchen in my own way.
      $Soon, it became my hobby to post the videos and photos of the recipes that I make in instagram, before that it was only shared among my family and friends.
       But it was always in mind that I wanted to start a blog to save all my recipe ideas.$My partner and me always reminasce that buying an OTG was one of the greatest decison that ever we took.
        Because it broke all the boundaries of my recipe experiments and helped me to add a lot baked healthy recipes into my blog.
        $My loving brother put a lot of his efforts to help me to launch this website you see today. Through it, we hope we can offer you a calming, happy and yet healthy recipes and promote conscious eating.
        $–Poornima`

    useEffect(() => {

        const loginStatus = () => {
            onAuthStateChanged(auth, (user) => {
                setUserdata({ name: user ? user.displayName : "", email: user ? user.email : "" });
            })
        }
        loginStatus()

    }, [])

    function handleFeedback(event) {
        event.preventDefault();

        const uploadFeedback = async () => {
            try {
                await addDoc(collection(db, "feedback"), { ...userData, Feedback: text })
                    .then(() => {
                        toast.success(`Feedback submitted successfully`);
                    });
            } catch (error) { console.error(error); }
        }
        uploadFeedback();

        setText("");
    }

    return (
        <div className="container">
            <div className="card m-1 p-2 bg-light">

                <div className="card-body">
                    <div className="row ">
                        <h1 className="titleClas">About</h1>
                        {/* <hr /> */}
                        <div className="col-lg-6 col-12" style={{ textAlign: "center", margin: "auto" }}>
                            <img className="aboutImg" src={process.env.REACT_APP_ABOUT_IMG} alt="About Img"></img>
                        </div>
                        <div className="col-lg-6 col-12 mx-auto my-auto">
                            <h3 className='mb-2 mt-3 brandFont'>Above the Flavors</h3>
                            {aboutText.split('$').map((e, index) => (<p key={index} style={{ textAlign: "justify" }} >{e}</p>))}
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="row ">
                        <div className="col-lg-6 col-12">
                            <h1 className="titleClas">Feedback</h1>
                            <textarea type="text" value={text} onChange={(event) => { setText(event.target.value) }} className="commentboxDiv form-control" id="comment" placeholder="Comment here..." />
                            <button type="button" onClick={handleFeedback} className="mt-3 mb-3 btn btn-sm btn-outline-danger">Comment</button>
                        </div>
                    </div>

                    <div className="row ">
                        <div className="col-lg-6 col-12" >
                            <h2 className="titleClas mt-3">{`dev-by`}</h2>
                            <p onClick={()=>{window.open("https://www.linkedin.com/in/prasanth-av-307605171")}}>prasanthav14@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About