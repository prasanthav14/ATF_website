import React from 'react';


function SecondHead() {
    return (
        <>
            <div className="container">
                <div className="nav-scroller mt-3">
                    <nav className="nav d-flex justify-content-between">
                        <img style={{height:"6rem"}} className="mx-auto" src={`${process.env.PUBLIC_URL}/img/ATF_logo.jpg`} alt="ATF logo" />
                    </nav>
                    <hr />
                </div>
            </div>
        </>
    )
}

export default SecondHead