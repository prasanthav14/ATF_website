import React from 'react';
import './footer.css';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useNavigate } from "react-router-dom";


function Footer() {

    const Navigate = useNavigate();

    return (
        <footer >
            <div className="container">
                <div className="row">
                    <ul className="nav justify-content-center border-bottom">
                        <li className="nav-item" onClick={() => { Navigate("/") }}><h6 className="pointerCls nav-link px-2 text-dark">Home</h6></li>
                        <li className="nav-item" onClick={() => { Navigate("/allposts") }}><h6 className="pointerCls nav-link px-2 text-dark">All Recipes</h6></li>
                        <li className="nav-item" onClick={() => { Navigate("/userlogin") }}><h6 className="pointerCls nav-link px-2 text-dark">Login</h6></li>
                        <li className="nav-item" onClick={() => { Navigate("/about") }}><h6 className="pointerCls nav-link px-2 text-dark">About</h6></li>
                    </ul>
                </div>

                <div className="row">
                    <div className="d-flex justify-content-center my-auto col-lg-6 col-12">
                        <img className="me-2" alt="atf-logo-sm" src={`${process.env.PUBLIC_URL}/img/ATF_logo_sm.jpg`} width="30" height="30" />
                        <p>&copy; 2022 Company, Inc</p>
                    </div>
                    <div style={{ textAlign: "center"}} className="d-flex justify-content-center my-auto col-lg-6 col-12">
                        <a target="_blank" rel="noreferrer noopener" href={process.env.REACT_APP_YT_LINK} style={{color:"black"}}>
                            <label  style={{fontWeight: 600}} className="pointerCls" htmlFor='yticon'>Youtube</label>
                            <YouTubeIcon id="yticon" className="pointerCls me-2" sx={{ fontSize: "40px" }} />
                        </a>
                        <a target="_blank" rel="noreferrer noopener" href={process.env.REACT_APP_IG_LINK} style={{color:"black"}}>
                            <label style={{fontWeight: 600}} className="mt-1 pointerCls" htmlFor='igicon'>Instagram</label>
                            <InstagramIcon className="mt-1 pointerCls" id="igicon" sx={{ fontSize: "30px" }} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer