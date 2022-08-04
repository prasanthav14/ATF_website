import React, { useEffect, useState } from 'react';
import './adminlogin.css';
import { useNavigate } from "react-router-dom";
import { auth } from "../../fireBaseConfig.js";
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from "../../fireBaseConfig.js";
import LoadingSpinner from '../loadingAnim/loadingAnim.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Adminlogin() {
    const [inputs, setInputs] = React.useState({ name: "", email: "" });
    const Navigate = useNavigate();
    const [isloggedin, setIsloggedin] = useState(false);

    useEffect(() => {
        const isAdmin = async () => {
            await getDocs(collection(db, 'admin'))
                .then((res) => {
                    const admins = res.docs.map(doc => (doc.data()));
                    const user = auth.currentUser;
                    if (user != null) {
                        if (admins.length > 0) {
                            if (admins.filter(e => (e.name === user.displayName && e.email === user.email)).length > 0) {
                                setIsloggedin(true)
                                // toast.info(`${user.displayName} is admin`);
                            }
                            else {
                                setIsloggedin(false)
                                toast.info(`${user.displayName} is not admin`, {
                                    onClose: () => Navigate("/") 
                                });
                            }
                        }
                    }

                    else {
                        setIsloggedin(false)
                        toast.error(`Please log-in`, {
                            onClose: () => Navigate("/userlogin")
                        })
                    }
                })
                .catch(error => { console.error(error) })
        }
        isAdmin()

    }, [])

    async function handleAdminReg(event) {
        event.preventDefault();
        try {
            const formData = { name: inputs.name, email: inputs.email }
            await addDoc(collection(db, "admin"), formData)
                .then(() => {
                    toast.success(`${inputs.name} - added into the Admin-list`, { onClose: () => Navigate(-1) });
                });
        } catch (error) { console.error(error); }
        setInputs({ name: "", email: "" })
    }

    function handleType(event) {
        const { name, value } = event.target;
        setInputs(prev => {
            return { ...prev, [name]: value }
        })
    }

    return (
        <>
            <div hidden={isloggedin} className="container row mx-auto">
                <LoadingSpinner />
            </div>
            <div hidden={!isloggedin}>

                <div className="container">

                    {/* <div className="row">
                        <div className="nav-scroller mt-4 mb-4">
                            <nav className="nav d-flex justify-content-between">
                                <img src='/img/ATF_logo.JPG' alt="ATF logo" />
                            </nav>
                            <br />
                        </div>
                    </div> */}

                    <div className="row">
                        <div className="col-lg-6 col-12">

                            <form onSubmit={handleAdminReg}>
                                <div className="align-items-left mb-4">
                                    <h2>Add Admin</h2>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="" htmlFor="name">Name</label>
                                    <input type="text" name="name" value={inputs.name} onChange={handleType} className="form-control" id="name" placeholder="Your name..." />
                                </div>
                                <div className="form-group mb-4">
                                    <label className="" htmlFor="email">Email ID</label>
                                    <input type="email" name="email" value={inputs.email} onChange={handleType} className="form-control" id="email" placeholder="Enter email-id..." />
                                </div>
                                <div className="mb-5">
                                    <button type="submit" className="btn btn-sm btn-danger">Add to admin list</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Adminlogin;