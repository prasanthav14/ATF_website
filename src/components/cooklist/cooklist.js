import React, { useEffect, useState } from 'react';
import './cooklist.css'
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, } from 'firebase/firestore';
import { db, storage } from "../../fireBaseConfig.js";
import { ref, getDownloadURL } from "firebase/storage";
import LoadingSpinner from "../loadingAnim/loadingAnim.js";
// import YouTubeIcon from '@mui/icons-material/YouTube';
// import InstagramIcon from '@mui/icons-material/Instagram';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Cooklist() {
    const [dbData, setdbData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const fireStoreData = async () => {
            await getDocs(collection(db, 'userData')).then((res) => {
                const textRef = res.docs.map(doc => {
                    if (doc.exists())
                        return ({ ...doc.data(), id: doc.id })
                    else
                        return (null);
                })
                textRef.map(async (e) => {
                    const gsReference = ref(storage, e.snapRef);
                    await getDownloadURL(gsReference)
                        .then(url => {
                            e.URL = url;
                            setdbData(prev => [...prev, e])
                            setIsLoading(false)
                        }).catch(error => { console.error(error) })
                    return (null);
                })
            })
        }
        fireStoreData();
    }, []);

    function handleClick(id) {
        navigate(`/singlepost/${id}`)
    }

    dbData.sort((a, b) => {
        const c = new Date(a.timeCreated).getTime()
        const d = new Date(b.timeCreated).getTime()
        // setTimeout(()=>{settime(new Date(new Date().getTime() - c).getMinutes())},5000)
        // console.log(time);
        return (d - c);
    });

    return (
        <div className='bodyCls mx-auto'>

            <div hidden={!isLoading} className="row">
                <div className="container mx-auto">
                    <LoadingSpinner />
                </div>
            </div>

            <div hidden={isLoading} className="row">
                {/* <div className="col-md-12 col-12"> */}
                {dbData.map((e, index) => {
                    if (index < 3) {
                        return (
                            <div key={index} className="col-lg-4 col-md-6 col-12 mt-3 mx-auto">
                                <div onClick={() => { handleClick(e.id) }} className="cardCls mx-auto card">
                                    <div className="cardImgdiv">
                                        <img src={e.URL} className="cardImg card-img-top" alt={e.title} />
                                    </div>

                                    <div className="card-body cardCont">
                                        <div className="row ps-2" style={{ textAlign: "center" }}>
                                            {e.vegan && <h6 className="tagCls">Vegan</h6>}
                                            {e.meals && <h6 className="tagCls">Meals</h6>}
                                            {e.eggfree && <h6 className="tagCls">Egg-free</h6>}
                                            {e.bev && <h6 className="tagCls">Beverages</h6>}
                                        </div>
                                        <div className="row">
                                            <h3 className="card-title">{(e.title.length > 50) ? `${e.title.slice(0, 50)}...` : e.title} </h3>
                                            {/* <hr /> */}
                                            {/* <p className="card-text" style={{ textAlign: "justify" }}>{e.breif.slice(0, 200) + "..."}</p> */}
                                        </div>
                                        <div className="row mt-2 mb-2 my-auto">
                                            {/* <div className="ytDiv">
                                                    {(e.ytlink != "") && <a href={e.ytlink} className="linkCls"><YouTubeIcon sx={{ fontSize: "45px" }} className="ytCls" /></a>}
                                                </div>
                                                <div className="igDiv">
                                                    {(e.iglink != "") && <a href={e.iglink} className="linkCls"> <InstagramIcon sx={{ fontSize: "30px" }} className="igCls" /></a>}
                                                </div> */}
                                            <div className="favDiv">
                                                <div hidden={index > 0} className="linkCls"><AutoAwesomeIcon sx={{ fontSize: "30px" }} className="newpostCls" /></div>
                                            </div>
                                            <div className="igDiv">
                                                <h6 hidden={index > 0} style={{ color: "red" }}>New Post</h6>
                                            </div>
                                        </div>
                                        <div>
                                            {e.Likes.length > 0 && <small className="card-body likesCls muted" ><FavoriteIcon sx={{ fontSize: "20px" }} className="likeCls me-1" /> {e.Likes.length}</small>}
                                        </div>
                                        <div>
                                            <small className="card-body preCls">{new Date(e.timeCreated).toLocaleString()}</small>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    }
                    else
                        return (null);
                })}
            </div>
            {/* <div className="row">
                <div className="container mx-auto showCls">
                    <a type="button" onClick={() => { navigate('/allposts') }}> show me everything <ArrowRightAltIcon fontSize="large" /> </a>
                </div>
            </div> */}
        </div>
    )
}
export default Cooklist

