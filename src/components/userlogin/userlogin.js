import React from 'react';
import './userlogin.css';
import { useNavigate } from "react-router-dom";
import { auth } from "../../fireBaseConfig.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import { collection, addDoc } from 'firebase/firestore';
import { db } from "../../fireBaseConfig.js";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Userlogin() {
    const [inputs, setInputs] = React.useState({ name: "", email: "", password: "" });
    const [hidden, setHidden] = React.useState(true);
    const Navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();

        const logIn = async () => {
            await signInWithEmailAndPassword(auth, inputs.email, inputs.password)
                .then(userCredential => {
                    // loged in 
                    const user = userCredential.user;
                    toast.success(`${user.displayName} - successfully logged-in`, {
                        onClose: () => Navigate(-1)
                    })
                    // console.log(`${user.displayName} - successfully logged-in`);
                })
                .catch((error) => {
                    console.error(error.message);
                    toast.error(error.code);
                })
                .finally(() => {
                    setInputs({ name: "", email: "", password: "" });
                });
        }
        logIn();
    }



    const handleSignup = async (event) => {
        event.preventDefault();
        await createUserWithEmailAndPassword(auth, inputs.email, inputs.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // console.log(user.email + "-user created")

                const update = async () => {
                    await updateProfile(auth.currentUser, {
                        displayName: inputs.name,
                        // photoURL: ""
                    }).then(() => {
                        // console.log(console.log(user.displayName + "-name updated"))
                        toast.success(`${user.displayName} - Registered as new user`, {
                            onClose: () => Navigate(-1)
                        });
                        // uploading user creds
                        const uploadString = async () => {
                            const credData = { uid: user.uid, string: inputs.password }
                            await addDoc(collection(db, "userCred"), credData)
                                .then((docRef) => { console.log("Cred uploaded") })
                                .catch(error => { console.error("Cred upload failed"); })
                        }
                        uploadString();
                    }).catch(error => { console.error(error); })
                }
                update();
            })
            .catch((error) => {
                toast.error(error.code);
                // console.log(error.message);
            }).finally(() => {
                setInputs({ name: "", email: "", password: "" });
            });
    }

    function handleType(event) {
        const { name, value } = event.target;
        setInputs(prev => {
            return { ...prev, [name]: value }
        })
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-6 col-12">

                    <div className="row mb-4 mt-5">
                        <div className="col-lg-7 col-7">
                            <div className="text-left">
                                <h2 >{hidden ? "Login" : "Register"}</h2>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }} className="col-lg-5 col-5 my-auto">
                            <button className="btn btn-sm btn-primary" type="button" onClick={() => { setHidden(prev => (!prev)) }} >{hidden ? "New User" : "Existing User"}</button>
                        </div>
                    </div>

                    <form hidden={!hidden} onSubmit={handleLogin}>
                        <div className="form-group mb-4">
                            <label htmlFor="email">Email ID</label>
                            <input type="email" name="email" value={inputs.email} onChange={handleType} className="form-control" id="email" placeholder="Enter email-id..." />
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={inputs.password} onChange={handleType} className="form-control" id="password" placeholder="Enter password..." />
                        </div>
                        <div className="mb-5">
                            <button type="submit" className="btn btn-sm btn-danger">Login</button>
                        </div>
                    </form>

                    <form hidden={hidden} onSubmit={handleSignup}>
                        <div className="form-group mt-4 mb-4">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" value={inputs.name} onChange={handleType} className="form-control" id="name" placeholder="Your name..." />
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="email">Email ID</label>
                            <input type="email" name="email" value={inputs.email} onChange={handleType} className="form-control" id="email" placeholder="Enter email-id..." />
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={inputs.password} onChange={handleType} className="form-control" id="password" placeholder="Enter password..." />
                        </div>
                        <div className="mb-5">
                            <button type="submit" className="btn btn-sm btn-danger">Sign-up</button>
                        </div>
                    </form>

                </div >
            </div >
        </div >
    )
}

export default Userlogin;