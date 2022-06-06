import React from 'react';
import { useNavigate } from 'react-router-dom';
import './newrecipiestitle.css'
import FastForwardIcon from '@mui/icons-material/FastForward';

function Newrecipiestitle() {
    const navigate = useNavigate();

    return (
        <div className='container'>
            <div className='row correctionCls'>
                <div className='col-lg-4 d-none d-lg-block' style={{ textAlign: "center" }}>
                    <div className="imgDiv">
                        <img className="imgCls" src={`${process.env.PUBLIC_URL}/img/ATF_logo_sm.jpg`} alt="ATF logo" />
                        <small className="ms-1 my-auto">Simple Recipes That Make You Feel Good</small>
                    </div>
                </div>
                <div className='col-lg-4 my-auto' style={{ textAlign: "center" }}>
                    <h1 className="link-dark my-auto">New Recipies</h1>
                </div>
                <div className='col-lg-4 my-auto .d-none .d-md-block .d-lg-none' style={{ textAlign: "center" }}>
                    <p className="link-dark" onClick={() => { navigate('/allposts') }}> <FastForwardIcon fontSize="large" /> </p>
                </div>
            </div>
            </div >
    )
}
export default Newrecipiestitle