import React, { useEffect, useState } from 'react';
import './tagfilter.css'
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, storage } from "../../fireBaseConfig.js";
import { ref, getDownloadURL } from "firebase/storage";
import LoadingSpinner from "../loadingAnim/loadingAnim.js";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

function Tagfiler() {
    const [dbData, setdbData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [button, setButton] = useState({ field: 'vegan' });
    const navigate = useNavigate();

    useEffect(() => {

        const querryData = async () => {
            const q = query(collection(db, "userData"), where(button.field, "==", true));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async doc => {
                let qrydata = doc.data();
                const gsReference = ref(storage, qrydata.snapRef);
                await getDownloadURL(gsReference)
                    .then(url => {
                        qrydata.URL = url;
                        qrydata.id = doc.id;
                        setdbData(prev => [...prev, qrydata])
                        setIsLoading(false)
                    }).catch(error => { console.error(error) })
            })
        }
        querryData();
    }, [button])

    function handleClick(id) {
        navigate(`/singlepost/${id}`)
    }

    dbData.sort((a, b) => {
        const c = new Date(a.timeCreated).getTime()
        const d = new Date(b.timeCreated).getTime()
        return (d - c);
    });

    return (
        <div className="filterbodyCls">
            <div className="container">
                <hr />
                <div className="row mt-4 mb-4">
                    <h1 style={{ textAlign: 'center' }}>Explore Recipes</h1>
                </div>
            </div>
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-lg-3 mb-3 col-md-6 col-12">
                        <button onClick={() => { setdbData([]); setIsLoading(true); setButton({ field: 'vegan' }) }} type='button' className='btnCls btn btn-lg btn-outline-success'>VEGAN</button>
                    </div>
                    <div className="col-lg-3 mb-2 col-md-6 col-12">
                        <button onClick={() => { setdbData([]); setIsLoading(true); setButton({ field: 'meals' }) }} type='button' className='btnCls btn btn-lg btn-outline-danger'>MEALS</button>
                    </div>
                    <div className="col-lg-3 mb-2 col-md-6 col-12">
                        <button onClick={() => { setdbData([]); setIsLoading(true); setButton({ field: 'eggfree' }) }} type='button' className='btnCls btn btn-lg btn-outline-primary'>EGG-FREE</button>
                    </div>
                    <div className="col-lg-3 mb-2 col-md-6 col-12">
                        <button onClick={() => { setdbData([]); setIsLoading(true); setButton({ field: 'bev' }) }} type='button' className='btnCls btn btn-lg btn-outline-dark'>BEVERAGES</button>
                    </div>
                </div>
            </div>

            <div hidden={!isLoading} className="row">
                <div className="container mx-auto">
                    <LoadingSpinner />
                </div>
            </div>

            <div hidden={isLoading} className="row">
                {dbData.map((e, index) => {
                    if (index < 4) {
                        return (
                            <div key={index} className="col-lg-3 col-md-6 col-12 mt-3 mx-auto">
                                <div onClick={() => { handleClick(e.id) }} className="mx-auto card filtercardCls">
                                    <div className="filterImgdiv">
                                        <img src={e.URL} className="filterImgCls card-img-top" alt={`${e.title}`} />
                                    </div>

                                    <div className="card-body filtercardCont">
                                        <div className="row ps-2" style={{ textAlign: "center" }}>
                                            {e.vegan && <h6 className="tagCls">Vegan</h6>}
                                            {e.meals && <h6 className="tagCls">Meals</h6>}
                                            {e.eggfree && <h6 className="tagCls">Egg-free</h6>}
                                            {e.bev && <h6 className="tagCls">Beverages</h6>}
                                        </div>
                                        <div className="row">
                                            <h3 className="card-title" style={{ textAlign: "left" }}>{(e.title.length > 35) ? `${e.title.slice(0, 35)}...` : e.title} </h3>
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

            <div className="mt-4 showCls">
                <p onClick={() => { navigate('/allposts') }}> show me everything <ArrowRightAltIcon fontSize="large" /> </p>
            </div>

        </div>
    )
}
export default Tagfiler

