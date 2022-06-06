import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from "../loadingAnim/loadingAnim.js";
import './singlepost.css'
import { db, storage } from "../../fireBaseConfig.js";
import { ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from "react-router-dom";
import { auth } from "../../fireBaseConfig.js";
import {  onAuthStateChanged } from "firebase/auth";


function Singlepost() {
    let { key } = useParams();              //-----> refer App.js
    const [dbData, setdbData] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    const [text, setText] = useState("");
    const [comment, setComment] = useState([]);
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);
    const [currentuser, setCurrentuser] = useState("");
    const likecount = useRef(0);

    const Navigate = useNavigate();

    useEffect(() => {

        const getDbData = async () => {
            const docRef = doc(db, "userData", key);
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setdbData(docSnap.data());
                setLikes([...(docSnap.data().Likes)]);
                setComment(docSnap.data().Comments);

                const imgref = await docSnap.data().snapRef
                const gsReference = ref(storage, imgref);
                await getDownloadURL(gsReference)
                    .then(url => {
                        setdbData(prev => ({ ...prev, URL: url }))
                    }).catch(error => { console.error(error) })
            }
            else {
                console.log("No such document!");
            }

            // const user = auth.currentUser;
            // // console.log(user);
            // if (user) {
            //     setCurrentuser(user);
            //     if (likes.length > 0) {
            //       console.log(likes);
            //         console.log(likes.filter(e => (e.uid === user.uid)).length);
            //         setLiked(likes.filter(e => (e.uid === user.uid)).length > 0 ? true : false)
            //     }
            // }

        }
        getDbData();

    }, [])

    const pageloaded = () => {
        setIsLoading(false)

        // console.log('pageloaded')
        const user = auth.currentUser;
            // console.log(user);
           if (user) {
            //    console.log('inside user')
               setCurrentuser(user);
               if (likes) {
                //    console.log(likes);
                //    console.log(likes.filter(e => (e.uid === user.uid)).length);
                   setLiked(likes.filter(e => (e.uid === user.uid)).length > 0 ? true : false)
               }
           }

    }
   

    likecount.current = likes.length;
    // console.log(liked);

    function handleLike(param) {
        if (param) {
            const uploadLike = async () => {
                if (currentuser !== "") {
                    try {
                        setLiked(true);
                        likes.push({ uid: currentuser.uid });
                        const postRef = doc(db, "userData", key);
                        await updateDoc(postRef, {
                            Likes: likes
                        }).then(() => { console.log("liked") })
                        // console.log(likes);
                    }
                    catch (error) { console.log(error); }
                }
                else {
                    // console.log('User signed out');
                    toast.error(`User not logged-in`, { onClose: () => Navigate("/userlogin") });
                    return (null);
                }
            }
            uploadLike();
        }
        else {
            const uploadUnlike = async () => {
                if (currentuser !== "") {
                    try {
                        setLiked(false);
                        const remainingUsers = likes;
                        remainingUsers.map((ele, index) => {
                            if (ele.uid === currentuser.uid)
                                remainingUsers.splice(index, 1)
                                return(null);
                        })
                        // console.log(remainingUsers);
                        const postRef = doc(db, "userData", key);
                        await updateDoc(postRef, {
                            Likes: remainingUsers
                        }).then(() => {
                            console.log("unliked ");
                        })
                    }
                    catch (error) { console.error(error); }
                }
                else {
                    // console.log('User signed out');
                    toast.error(`User not logged-in`, { onClose: () => Navigate("/userlogin") });
                    return (null);
                }
            }
            uploadUnlike();
        }
    }


    function handleComment() {

        const status = () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    if (text !== "") {
                        // console.log(`${user.displayName} is the current user at commentFn`);
                        const timeNow = new Date().toUTCString();
                        // setComment(pre=>[...pre, { user: user.displayName, comment: text, time: timeNow }])
                        comment.push({ user: user.displayName, comment: text, time: timeNow });

                        const uploadComment = async () => {
                            try {
                                const userRef = doc(db, "userData", key);
                                await updateDoc(userRef, {
                                    Comments: comment
                                }).then(() => {
                                    // console.log("comments updated: " + user.displayName);
                                })
                            }
                            catch (error) { console.error(error); }
                        }
                        uploadComment();
                        setText("");
                    }
                }
                else {
                    setText("");
                    // console.log('User signed out');
                    toast.error(`User not logged-in`, { onClose: () => Navigate("/userlogin") });
                    return (null);
                }
            })
        }
        status();

    }

    return (
        <div className="container">
            <div className="row mx-auto my-auto ">

                <div hidden={!isLoading}>
                    <LoadingSpinner />
                </div>

                <div hidden={isLoading} className="card bg-light ms-1 me-1">
                    <div>
                        <img src={dbData.URL} onLoad={pageloaded} className="row mt-2 postImg mx-auto card-img-top" alt={dbData.title} />
                        {/* onLoad={setIsLoading(false)} */}
                    </div>

                    <div className="card-body ">
                        <div className="row ps-3" style={{ textAlign: "center" }}>
                            {dbData.vegan && <h6 className="tagCls">Vegan</h6>}
                            {dbData.meals && <h6 className="tagCls">Meals</h6>}
                            {dbData.eggfree && <h6 className="tagCls">Egg-free</h6>}
                            {dbData.bev && <h6 className="tagCls">Beverages</h6>}
                        </div>
                        <h3 className="card-title">{dbData.title}</h3>
                        {/* <p style={{ textAlign: "justify" }} className="card-text">{dbData.breif}</p> */}
                        {dbData.breif && dbData.breif.split('$').map((e, index) => (<p key={index} style={{ textAlign: "justify" }} className="card-text">{e}</p>))}
                        <h3 className="card-title mb-2">{dbData.opTitle}</h3>
                        {dbData.opCont && dbData.opCont.split('$').map((e, index) => (<p key={index} style={{ textAlign: "justify" }} className="card-text">{e}</p>))}
                        <div className="row mt-2">
                            <div className="singleytDiv">
                                {(dbData.ytlink !== "") && <a href={dbData.ytlink} target="_blank" rel="noreferrer noopener" className="linkCls"><YouTubeIcon sx={{ fontSize: "45px" }} className="ytCls" /></a>}
                            </div>
                            <div className="singleigDiv">
                                {(dbData.iglink !== "") && <a href={dbData.iglink} target="_blank" rel="noreferrer noopener" className="linkCls"> <InstagramIcon sx={{ fontSize: "30px" }} className="igCls" /></a>}
                            </div>
                        </div>
                        <h6 className="card-text"><small className="preCls text-muted">{new Date(dbData.timeCreated).toLocaleString()}</small></h6>
                        <hr />

                        {/* add like */}
                        <div className="mt-4 mb-4">
                            <p> <FavoriteIcon onClick={() => { handleLike(!liked) }} id="like" sx={{ fontSize: "30px" }} className={liked ? "likeCls" : "unlikeCls"} /> <label htmlFor="like">{likecount.current} {(likecount.current === 1) ? " Like" : " Likes"}</label></p>
                        </div>

                        {/* add comments */}
                        <div className="mb-5 form-group col-lg-12">
                            <h2 htmlFor="comment">Comments</h2>
                            {comment.map((e, index) => (
                                <div key={index} className='card-text commentDiv col-md-12'>
                                    <h6><pre>{e.user}</pre></h6>
                                    <h6 className="commentText">{e.comment}</h6>
                                    <h6 className='commentTime'>{new Date(e.time).toLocaleString()}</h6>
                                </div>
                            ))}
                            <div className='card-text col-lg-6'>
                                <textarea type="text" value={text} onChange={(event) => { setText(event.target.value) }} className="commentboxDiv form-control" id="comment" placeholder="Comment here..." />
                            </div>
                            <button type="button" onClick={handleComment} className="mt-2 mb-3 btn btn-sm btn-danger">Comment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Singlepost
