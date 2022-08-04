import React, { useEffect, useState } from 'react';
import './head.css';
import { useNavigate } from "react-router-dom";
import { db } from "../../fireBaseConfig.js";
import { collection, getDocs, } from "firebase/firestore";
import { auth } from "../../fireBaseConfig.js";
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@mui/icons-material/Search';

function Head() {
    const [username, setUsername] = useState("")
    const [isloggedIn, setisloggedIn] = useState(false)
    const [isAdmin, setIsadmin] = useState(false)
    const Navigate = useNavigate();

    useEffect(() => {

        const isAdmin = async () => {
            await getDocs(collection(db, 'admin'))
                .then((res) => {
                    const admins = res.docs.map(doc => (doc.data()));
                    const user = auth.currentUser;
                    if (user != null) {
                        // console.log(`${user.displayName} is active`);
                        setisloggedIn(true);
                        setUsername(user.displayName);
                        if (admins.length > 0) {
                            if (admins.filter(e => (e.name === user.displayName && e.email === user.email)).length > 0) {
                                setIsadmin(true)
                                // toast.info(`${user.displayName} is admin`);
                            }
                            else {
                                setIsadmin(false)
                                // toast.info(`${user.displayName} is not admin`);
                            }
                        }
                    }
                    else {
                        // console.log('User is signed out');
                        setisloggedIn(false);
                    }
                })
                .catch(error => { console.error(error) })
        }
        isAdmin()

    }, []);

    function logOut() {
        signOut(auth).then(() => {
            setUsername("");
            setisloggedIn(false);
            setIsadmin(false)
            console.log('User is signed out');
            toast.error(`User successfully logged out`,{
                onClose: () => Navigate("/")
            });
        })
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light navCls">
                <div className="container">
                    <SearchIcon fontSize="large" />
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <p className="nav-link my-auto active pointerCls" aria-current="page" onClick={() => { Navigate("/") }}>Home</p>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link my-auto pointerCls" onClick={() => { Navigate("/allposts") }}>All Recipes</p>
                            </li>
                            <li hidden={!isAdmin} className="nav-item">
                                <p className="nav-link my-auto pointerCls" onClick={() => { Navigate("/adminform") }}>Add Post</p>
                            </li>
                            <li className="nav-item">
                                <p className="nav-link my-auto pointerCls" onClick={() => { Navigate("/about") }}>About</p>
                            </li>
                        </ul>
                        <div className="d-flex">
                            {isloggedIn
                                ? <button type="button" onClick={logOut} className="btn btn-sm btn-outline-danger">Logout {username}</button>
                                : <button type="button" onClick={() => { Navigate("/userlogin") }} className="btn btn-sm btn-outline-dark">User log-in</button>}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Head