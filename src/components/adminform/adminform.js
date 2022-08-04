import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './adminform.css';
import { db, storage } from "../../fireBaseConfig.js";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { auth } from "../../fireBaseConfig.js";
import { Spinner } from 'react-bootstrap';
import LoadingSpinner from '../loadingAnim/loadingAnim.js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Adminform() {
    const Navigate = useNavigate();
    const [text, setText] = useState({ title: "", breif: "", opTitle: "", opCont: "", ytlink: "", iglink: "" });
    const [check, setCheck] = useState({ vegan: false, meals: false, eggfree: false, bev: false })
    const [file, setfile] = useState("");
    const [snapRef, setsnapRef] = useState("gs://atflavours-44276.appspot.com/default.jpeg");
    const [uploadTime, setUploadTime] = useState(new Date().toUTCString());
    const [isLoading, setIsLoading] = useState(true);
    const [isUploaded, setIsuploaded] = useState(true);
    const [isloggedin, setIsloggedin] = useState(false);
    const clearRef = useRef();


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

    function handleType(event) {
        const { name, value } = event.target;
        setText(prev => {
            return { ...prev, [name]: value }
        })
        //  console.log(text);
    }

    function handleCheckbox(event) {
        const { name, checked } = event.target;
        setCheck(prev => {
            return ({ ...prev, [name]: checked })
        })
    }
    function clearfileinputfield() {
        clearRef.current.value = "";
    }

    function handleUpload() {
        setIsLoading(false);
        let imagesRef;
        if (text.title !== "")
            imagesRef = ref(storage, `images/${text.title}`);
        else
            imagesRef = ref(storage, 'images/no title');
        // console.log(file.name)
        uploadBytes(imagesRef, file).then((snapshot) => {
            setsnapRef(`gs://${snapshot.ref.bucket}/${snapshot.ref.fullPath}`);
            // console.log(snapshot.metadata.timeCreated)
        }).then(() => {
            setIsLoading(true);
            setIsuploaded(false);
            toast.info(`Image Uploaded Successfully`);
        })
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setUploadTime(new Date().toUTCString());
        try {
            const formData = { ...text, ...check, snapRef: snapRef, timeCreated: uploadTime, Likes: [], Comments: [] }
            await addDoc(collection(db, "userData"), formData).then(() => {
                toast.success(`New Post Submitted Successfully`);
            });
        } catch (error) { console.error(error); }
        setText({ title: "", breif: "", opTitle: "", opCont: "", ytlink: "", iglink: "" });
        setCheck({ vegan: false, meals: false, eggfree: false, bev: false });
        setfile("");
        setsnapRef("gs://atflavours-44276.appspot.com/default.jpeg");
        setIsuploaded(true);
        clearfileinputfield();
    }

    return (
        <>
            <div hidden={isloggedin} className="container row mx-auto">
                <LoadingSpinner />
            </div>

            <form hidden={!isloggedin} onSubmit={handleSubmit}>
                <div className="container">

                    <div className="row mb-4 mt-4">
                        <div className="col-lg-4 col-8">
                            <div className="text-left">
                                <h2 >Create new post</h2>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }} className="col-lg-2 col-4 my-auto">
                            <button className="btn btn-sm btn-danger pointerCls" type="button" onClick={() => { Navigate("/adminlogin") }} >Add Admin</button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6 col-12">

                            <div className="form-group mb-4">
                                <label htmlFor="title">Title</label>
                                <input type="text" name="title" value={text.title} onChange={handleType} className="form-control" id="title" placeholder="Post title..." />
                            </div>

                            <div className="form-group mb-4">
                                <label htmlFor='tags'>Select Tags</label>
                                <div className="" id="tags">
                                    <div className="form-check form-check-inline me-4">
                                        <input onChange={handleCheckbox} checked={check.vegan} name="vegan" className="form-check-input" type="checkbox" id="Checkbox1" />
                                        <div className="form-check-label" htmlFor="Checkbox1">Vegan</div>
                                    </div>
                                    <div className="form-check form-check-inline me-4">
                                        <input onChange={handleCheckbox} checked={check.meals} name="meals" className="form-check-input" type="checkbox" id="Checkbox2" />
                                        <div className="form-check-label" htmlFor="Checkbox2">Meals</div>
                                    </div>
                                    <div className="form-check form-check-inline me-4">
                                        <input onChange={handleCheckbox} checked={check.eggfree} name="eggfree" className="form-check-input" type="checkbox" id="Checkbox3" />
                                        <div className="form-check-label" htmlFor="Checkbox3">Egg-free</div>
                                    </div>
                                    <div className="form-check form-check-inline me-4">
                                        <input onChange={handleCheckbox} checked={check.bev} name="bev" className="form-check-input" type="checkbox" id="Checkbox4" />
                                        <div className="form-check-label" htmlFor="Checkbox4">Beverages</div>
                                    </div>
                                </div>
                            </div>

                            <label htmlFor="fileselect">Upload image</label>
                            <div className="form-group mb-3 d-flex justify-content-between">
                                <div className="col-lg-11 col-11" >
                                    <input type="file"
                                        name="input" onInput={event => setfile(...(event.target.files))}
                                        className="form-control " id="fileselect" ref={clearRef} />
                                </div>
                                <div style={{ textAlign: "right" }} className="col-lg-1 col-1 my-auto" hidden={isLoading} >
                                    <Spinner animation="border" id="Spinner" variant="primary" />
                                </div>
                                <div style={{ textAlign: "right" }} className="col-lg-1 col-1 my-auto" hidden={isUploaded} >
                                    <CheckCircleIcon style={{ color: "green" }} />
                                </div>
                            </div>

                            <div className="form-group mb-4">
                                <div className="">
                                    <button onClick={handleUpload} type="button" className="btn btn-sm btn-primary">Upload</button>
                                </div>
                            </div>

                            <div className="form-group mb-4">
                                <label htmlFor="brieftext">Brief text <small className="text-right" style={{ color: "grey" }}> {"  -  (use '$' for newline)"}</small></label>
                                <br />
                                <textarea type="text" name="breif" value={text.breif} onChange={handleType} className="form-control" id="brieftext" placeholder="Brief text..." />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="ytlink">Youtube link</label>
                                <br></br>
                                <input type="text" name="ytlink" value={text.ytlink} onChange={handleType} className="form-control" id="ytlink" placeholder="Paste yor link here..." />
                            </div>

                            <div className="form-group mb-4">
                                <label htmlFor="iglink">Instagram Link</label>
                                <br></br>
                                <input type="text" name="iglink" value={text.iglink} onChange={handleType} className="form-control" id="iglink" placeholder="Paste yor link here..." />
                            </div>
                            <div className="form-group mb-4">
                                <h2>Optional content</h2>
                            </div>

                            <div className="form-group mb-3">
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" name="opTitle" value={text.opTitle} onChange={handleType} className="form-control" id="title" placeholder="Optional title..." />
                                </div>
                                <div className="mt-3 form-group">
                                    <label htmlFor="brieftext">Content  <small className="text-right" style={{ color: "grey" }}> {"  -  (use '$' for newline)"}</small></label>
                                    <textarea type="text" name="opCont" value={text.opCont} onChange={handleType} className="form-control" id="brieftext" placeholder="Optional content..." />
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <button type="submit" className="btn btn-sm btn-danger">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Adminform;
