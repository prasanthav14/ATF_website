// import React, { useState, useEffect } from 'react';
// import Slider from "react-slick";
// import "./carousel.css"
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import LoadingSpinner from '../loadingAnim/loadingAnim.js';
// import { storage } from "../../fireBaseConfig.js";
// import { ref, getDownloadURL, listAll } from "firebase/storage";

// function Carousel() {

//     const [isLoading, setIsLoading] = useState(true);
//     const [imgArr, setimgArr] = useState([]);

//     useEffect(() => {
//         const listRef = ref(storage, 'images');
//         listAll(listRef)
//             .then(res => {
//                 res.items.forEach(async (itemRef, index) => {
//                     const gsref = (`gs://${itemRef.bucket}/${itemRef.fullPath}`);
//                     const gsReference = ref(storage, gsref);
//                     await getDownloadURL(gsReference)
//                         .then(url => {
//                             setimgArr(prev => ([...prev, { src: url, id: index, alt: ("image" + index) }]))
//                         })
//                         .catch(error => { console.error(error) })
//                 });
//             })
//             .catch((error) => {
//                 console.log("Uh-oh, an error occurred! " + error);
//             })
//     }, [])

//     // console.log(imgArr);

//     const settings = {
//         infinite: true,
//         dots: true,
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         lazyLoad: true,
//         autoplay: true,
//         autoplaySpeed: 4000
//     }

//     if (imgArr.length > 0) {
//         return (
//             <>
//                 <div className="container mx-auto">
//                     <div hidden={!isLoading} className="row">
//                         <LoadingSpinner />
//                     </div>

//                     <div hidden={isLoading} className="row">
//                         {/* <div className="tag">
//                         <h1>Image Gallery</h1>
//                     </div> */}
//                         <div className="imgslider">
//                             <Slider {...settings}>
//                                 {imgArr.map((item) => (
//                                     <div key={item.id}>
//                                         <img className='carousalImg mx-auto' onLoad={() => setIsLoading(false)} src={item.src} alt={item.alt} />
//                                     </div>
//                                 ))}
//                             </Slider>
//                         </div>

//                     </div>
//                 </div>
//             </>
//         )
//     }
// }

// export default Carousel