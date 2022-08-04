import React, { useEffect, useState } from 'react';
import './allposts.css'
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, } from 'firebase/firestore';
import { db, storage } from "../../fireBaseConfig.js";
import { ref, getDownloadURL } from "firebase/storage";
import LoadingSpinner from "../loadingAnim/loadingAnim.js";
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Allposts() {
    const [dbData, setdbData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const fireStoreData = async () => {
            await getDocs(collection(db, 'userData')).then((res) => {
                const textRef = res.docs.map(doc => {
                    if (doc.exists()) {
                        return ({ ...doc.data(), id: doc.id })
                    }
                    else
                        return (null);
                })
                textRef.map(async (e) => {
                    const gsReference = ref(storage, e.snapRef);
                    await getDownloadURL(gsReference)
                        .then((url) => {
                            e.URL = url;
                            setdbData(prev => [...prev, e]);
                            setIsLoading(false);
                        }).catch(error => { console.error(error) })
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
        return (d - c);
    });

    // console.log(dbData);
    // console.log(id);

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
                    const breifVar = e.breif.replace(/[$]/g, " ");
                    return (
                        <div key={index} className="col-lg-4 col-md-6 col-12 mt-3">
                            <div className="mx-auto card allcardCls">
                                <div className="allcardImgdiv" onClick={() => { handleClick(e.id) }}>
                                    <img src={e.URL} className="allcardImg card-img-top" alt={e.title} />
                                </div>

                                <div className="card-body allcardCont">
                                    <div className="row ps-2" style={{ textAlign: "center" }} onClick={() => { handleClick(e.id) }}>
                                        {e.vegan && <h6 className="tagCls">Vegan</h6>}
                                        {e.meals && <h6 className="tagCls">Meals</h6>}
                                        {e.eggfree && <h6 className="tagCls">Egg-free</h6>}
                                        {e.bev && <h6 className="tagCls">Beverages</h6>}
                                    </div>
                                    <div className="row" onClick={() => { handleClick(e.id) }}>
                                        <h3 className="card-title" >{(e.title.length > 50) ? `${e.title.slice(0, 50)}...` : e.title}</h3>
                                        <hr />
                                       
                                        <p className="card-text" style={{ textAlign: "justify" }}>{(breifVar.length > 250) ? `${breifVar.slice(0, 250)}...` : breifVar}</p>
                                    </div>
                                    <div className="row mt-2 mb-2 my-auto">
                                        <div className="ytDiv">
                                            {(e.ytlink !== "") && <a target="_blank" rel="noreferrer noopener" href={e.ytlink} className="linkCls"><YouTubeIcon sx={{ fontSize: "45px" }} className="ytCls" /></a>}
                                        </div>
                                        <div className="igDiv">
                                            {(e.iglink !== "") && <a target="_blank" rel="noreferrer noopener" href={e.iglink} className="linkCls"> <InstagramIcon sx={{ fontSize: "30px" }} className="igCls" /></a>}
                                        </div>
                                        {/* <div className="favDiv">
                                                <div hidden={index > 0} className="linkCls"><AutoAwesomeIcon sx={{ fontSize: "30px" }} className="newpostCls" /></div>
                                            </div>
                                            <div className="igDiv">
                                                <h6 hidden={index > 0} style={{ color: "red" }}>New Post</h6>
                                            </div> */}
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
                })}
            </div>
        </div>
    )
}
export default Allposts

