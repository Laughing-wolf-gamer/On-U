import React, { useEffect, Fragment, useState, CSSProperties } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { singleProduct } from '../../action/productaction'
import Loader from '../Loader/Loader'
import './Ppage.css'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { BsTag } from 'react-icons/bs'
import img1 from '../images/1.webp'
import img2 from '../images/2.webp'
import img3 from '../images/3.webp'
import { BsHeart } from 'react-icons/bs'
import { BsHandbag } from 'react-icons/bs'
import Single_product from '../Product/Single_product'
import {createbag, createwishlist} from '../../action/orderaction'
import {useAlert} from 'react-alert'
import Footer from '../Footer/Footer'
import { capitalizeFirstLetterOfEachWord } from '../../config'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const MPpage = () => {
    const param = useParams()
    const alert = useAlert()
    const dispatch = useDispatch()
    const [currentColor,setCurrentColorColor] = useState({})
    const[currentSize,setCurrentSize] = useState({})

    const[selectedSize, setSelectedSize] = useState(null);
    const[selectedColor, setSelectedColor] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize_color_Image_Array, setSelectedSize_color_Image_Array] = useState([]);
    const[selectedColorId,setSelectedColorId] = useState(null);

    const { product, loading, similar } = useSelector(state => state.Sproduct)

    useEffect(() => {
        dispatch(singleProduct(param.id))
        document.documentElement.scrollTop = 0;
    }, [dispatch, param]);

    const indicatorStyles: CSSProperties = {
        background: '#CFCECD',
        width: 7,
        height: 7,
        borderRadius: 50,
        display: 'inline-block',
        margin: '0 4px 0 4px'

    };
    // #CFCECD
    function indicator(onClickHandler, isSelected, index, label) {
        if (isSelected) {
            return (
                <li
                    style={{ ...indicatorStyles, background: '#fb56c1' }}
                    aria-label={`Selected: ${label} ${index + 1}`}
                    title={`Selected: ${label} ${index + 1}`}
                />
            );
        }
        return (

            <li
                style={{ ...indicatorStyles }}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                value={index}
                key={index}
                role="button"
                tabIndex={0}
                title={`${label} ${index + 1}`}
                aria-label={`${label} ${index + 1}`}
            />
        );
    }
    const {loading: userloading, user, isAuthentication} = useSelector(state => state.user)

    function buyNow(e) {
        e.preventDefault();
        if (user) {
            const option ={
                user:user._id,
                orderItems:[
                    {product:param.id}
                ]
            
            }
            console.log(option)
            dispatch(createwishlist(option))
        
            alert.success('Product added successfully in wishlist')
        
        }else{
            alert.error('You have To Login To Add This Product Into Wishlist')
        }
    }

    function addtobag(e) {
        e.preventDefault();
        if (user) {
            const orderData ={
                userId:user.id,
                productId:param.id, 
                quantity:1,
                color:currentColor,
                size:currentSize,
            }
            console.log("Order Data: ",orderData)
            dispatch(createbag(orderData))
            alert.success('Product added successfully in Bag')
        }else{
            alert.error('You have To Login To Add This Product Into Bag')
        }
    }
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };
    const handleSetNewImageArray = (size)=>{
        console.log("selected color: ",size.colors[0].images[0]);
        setSelectedSize(size);
        setSelectedColor(size.colors);
        setSelectedColorId(size.colors[0].id);
    }
    const handelSetColorImages = (color) => {
        setSelectedSize_color_Image_Array(color.images)
        setSelectedImage(color.images[0]);
        setSelectedColorId(color.id);
    }
    useEffect(()=>{
    if(product){
        setSelectedSize(product.size[0]);
        setSelectedColor(product.size[0].colors);
        const color = product.size[0].colors[0];
        setSelectedSize_color_Image_Array(color.images);
        setSelectedColorId(color.id);
        setSelectedImage(color.images[0]);
    }
        if(selectedSize){
            setSelectedColor(selectedSize.colors);
            const color = selectedSize.colors[0];
            setSelectedSize_color_Image_Array(color.images);
            setSelectedColorId(color.id);
            console.log("Colors: ",color);
            setSelectedImage(color.images[0]);
        }
    },[product,dispatch])
    console.log("Selected : ",selectedSize,selectedColor);


    console.log("user",user)
    return (
        <Fragment>
            {
                loading === false ?
                    <div>
                        <Carousel showThumbs={false} showStatus={false} showArrows={false} showIndicators={true} renderIndicator={(onClickHandler, isSelected, index, label) => indicator(onClickHandler, isSelected, index, label)}>
                            {
                                selectedSize_color_Image_Array && selectedSize_color_Image_Array.length > 0 && selectedSize_color_Image_Array.map((im,i) => (
                                    <div className='' key={i}>
                                        <LazyLoadImage src={im.url ? im.url : im} alt={`product ${i}`} />
                                            <div className='h-[30px] bg-white'>
                                        </div>
                                    </div>

                                ))
                            }
                        </Carousel>
                        <div className=''>
                            <div className='bg-white '>
                                <div className='border-b-[1px] border-slate-300  pb-6 pt-4'>
                                    <h1 className='font1 text-xl font-semibold text-slate-800'>{capitalizeFirstLetterOfEachWord(product?.title)}</h1>
                                    <h1 className='text-xl text-[#808080e8] font-light'>{capitalizeFirstLetterOfEachWord(product?.gender)}</h1>
                                </div>
                                <div className='border-b-[1px] border-white  pb-6 pt-2 bg-white px-4'>
                                    <h1 className='font1 text-lg font-semibold text-slate-800'>
                                        <span className="mr-4 font-bold">&nbsp;₹ {Math.round(product?.salePrice ? product?.salePrice : product?.price)}</span>
                                        {
                                            product && product.salePrice &&(
                                                <Fragment>
                                                    <span className="line-through mr-4 font-extralight text-slate-500">&#8377;&nbsp;{product?.price}</span>
                                                    <span className="text-gray-700">( {-Math.round(product.salePrice / product.price * 100 - 100)}% OFF)</span> 
                                                </Fragment>
                                            )
                                        }
                                    </h1>
                                    <h1 className='text-[#0db7af] font-semibold font1 text-sm mt-1'>inclusive of all taxes</h1>
                                    <h1 className='font1 text-base font-semibold mt-2 mb-2'>SELECT SIZE</h1>
                                    <div className="w-auto h-auto flex flex-wrap justify-start items-center p-4 gap-2">
                                        {
                                            product && product.size.length > 0 && product.size.map((size,index) =>
                                                <div key={`size_${index}`} className={`flex flex-col h-fit w-fit rounded-full p-2 items-center shadow-md justify-center gap-2 transition-transform hover:scale-110 duration-300 ease-in-out 
                                                    ${currentSize?.id === size?.id ? "border-2 outline-offset-1 border-gray-300":""}`} 
                                                    onClick={(e)=> {
                                                        e.preventDefault();
                                                        setCurrentSize(size);
                                                        handleSetNewImageArray(size);
                                                    }}>
                                                    <button className={`w-12 h-12 rounded-full flex items-center justify-center`}>
                                                        {size?.label}
                                                    </button>
                                                    
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="w-auto h-auto flex flex-wrap justify-start items-center p-4 gap-2">
                                        {selectedColor && selectedColor.length > 0 && selectedColor.length > 0 ? (
                                            selectedColor && selectedColor.length > 0 && selectedColor.map((color, i) => (
                                                <div key={`color-${color?.id}`} className={`flex flex-col h-fit w-fit shadow-md rounded-full p-2 items-center justify-center gap-2 transition-transform hover:scale-110 duration-300 ease-in-out 
                                                    ${selectedColorId === color?.id ? "border-2 outline-offset-1 border-gray-300":""} `} 
                                                    onClick={(e)=> {
                                                        e.preventDefault();
                                                        setCurrentColorColor(color);
                                                        handelSetColorImages(color)
                                                    }}
                                                >
                                                    <button
                                                        style={{
                                                            backgroundColor: color?.label || color.id, // Use the label or raw color value
                                                            width: "30px",
                                                            height: "30px",
                                                        }}
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center
                                                            ${selectedColorId === color?.id ? "border-2 outline-offset-1 border-gray-100 scale-110 shadow-md" : ""}
                                                        `}
                                                        title={color?.id || color?.label || "Color"} // Optional tooltip
                                                    />
                                                    {
                                                        color.quantity <= 10 && (
                                                            <div className='flex flex-col justify-center items-center space-y-1'>
                                                                <span className="text-red-500 text-sm font-black text-center flex-wrap">{color?.quantity} 
                                                                    <span> Left</span></span> 
                                                                {/* <span className="text-red-600 text-sm font-extrabold text-center flex-wrap">Left</span>  */}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-black font-bold">No colors available</p>
                                        )}
                                    </div>
                                    <br />
                                </div>
                                <div className='mt-2 pt-4 bg-white px-4'>
                                    <h1 className='font1 flex items-center mt-2 font-semibold'>BulletPoints<BsTag className='ml-2' /></h1>
                                </div>
                                <div className='mt-2 pb-4 pt-4 bg-white px-4'>
                                    {
                                        product && product.bulletPoints && product.bulletPoints.length > 0 && product.bulletPoints.map((e) =>
                                            <Fragment>
                                                <h1 className='font1 flex items-center mt-2 font-semibold'>{e.header}</h1>
                                                <span className='mt-4'>
                                                    <li className='list-disc mt-2'>{e.body}</li>
                                                </span>
                                            </Fragment>
                                        )
                                    }
                                </div>
                                <div className='mt-2 pb-6 pt-4 relative bg-white px-4 grid grid-cols-12'>
                                    <div className='col-span-3'>
                                        <div className='absolute bg-[#0db7af] font1 px-4 py-1 font-semibold text-white text-sm'>OFFER</div>
                                        <svg viewBox="0 0 24 25" className='w-[75px] p-2 absolute bottom-0'><g fill="none" fill-rule="evenodd"><path d="M0 1h24v24H0z"></path><path d="M21.872 12.843l-.68 3.849a1.949 1.949 0 00-.398-.819c-.377-.447-.925-.693-1.549-.693-1.024 0-1.98.669-2.395 1.601l1.159-6.571h1.703c.7 0 1.31.265 1.713.746.415.494.573 1.164.447 1.887m-3.238 5.812c-.297 0-.55-.108-.715-.306-.172-.204-.236-.486-.183-.795.123-.698.816-1.288 1.51-1.288.296 0 .55.108.716.306.17.204.235.486.18.794-.123.699-.814 1.289-1.508 1.289m-11.308 0c-.295 0-.55-.108-.715-.306-.171-.204-.236-.486-.18-.794.122-.699.814-1.289 1.508-1.289.296 0 .55.108.714.306.172.204.237.486.182.794-.123.699-.815 1.289-1.509 1.289m14.932-8.397c-.616-.731-1.518-1.134-2.546-1.134H18.2l.262-1.487A.546.546 0 0017.927 7H6.417a.543.543 0 100 1.086H17.28l-1.557 8.832h-5.8a1.965 1.965 0 00-.438-1.045c-.376-.447-.926-.693-1.548-.693-1.074 0-2.074.734-2.454 1.738h-.356l.143-.811a.543.543 0 10-1.069-.188l-.256 1.447a.546.546 0 00.535.637h.86c.045.389.194.753.438 1.045.375.446.925.693 1.548.693 1.075 0 2.075-.734 2.454-1.738h6.867c.044.389.194.752.439 1.045.375.446.925.693 1.547.693 1.075 0 2.075-.734 2.454-1.738h.52c.264 0 .49-.189.534-.449l.799-4.523c.184-1.043-.058-2.028-.683-2.773" fill="#535766"></path><path d="M9.812 9.667c0-.3-.243-.543-.543-.543H1.543a.544.544 0 000 1.086h7.726c.3 0 .543-.243.543-.543M9.387 12.074c0-.3-.243-.543-.543-.543h-5.82a.543.543 0 100 1.086h5.82c.3 0 .543-.243.543-.543M8.42 13.938H4.502a.543.543 0 100 1.086H8.42a.543.543 0 100-1.086" fill="#535766"></path></g></svg>
                                    </div>
                                    <div className='col-span-9'>
                                        <h1 className='text-sm font1 font-semibold'>Flat 300 Off + Free Shipping on first order</h1>
                                        <h1 className='text-sm font1 text-slate-500 mt-2'>Applicable on your first order. <br />  Use code: ONU300</h1>
                                    </div>

                                </div>
                                {/* <div className='mt-2 pb-6 pt-4 relative bg-white px-4'>
                                    <h1 className='font1 flex items-center mt-2 font-semibold'>BEST OFFERS<BsTag className='ml-2' /></h1>
                                    <h1 className='font1 flex items-center mt-1 font-semibold'>Best Price:&nbsp; <span className='text-slate-500'>&nbsp;&#8377;&nbsp; {Math.round(product?.salePrice || product?.price)}</span></h1>
                                    <li className='list-none text-slate-500 text-sm'>Applicable on: Orders above &#8377;&nbsp; 1599 (only on first purchase)</li>
                                    <li className='list-none text-slate-500 text-sm'>Coupon code: <span className='font-semibold'>ONU250</span></li>
                                    <li className='list-none text-slate-500 text-sm'>Coupon Discount: Rs. 62 off (check cart for final savings)</li>
                                </div> */}
                                <div className='mt-2 pb-6 pt-4 relative bg-white px-4 grid grid-cols-3'>
                                    <div className="col-span-1 text-center text-xs text-slate-500 ">
                                        <img src={img1} alt="Product_images" className='w-[75px] mx-auto' />
                                        Genuine Products
                                    </div>
                                    <div className="col-span-1 text-center text-xs text-slate-500 ">
                                        <img src={img2} alt="Product_images" className='w-[75px] mx-auto' />
                                        7 step Quality Check
                                    </div>
                                    <div className="col-span-1 text-center text-xs text-slate-500 ">
                                        <img src={img3} alt="Product_images" className='w-[75px] mx-auto' />
                                        Secure Payments
                                    </div>
                                </div>
                                <div className='pb-2 pt-2 bg-white px-2 grid grid-cols-2 sticky bottom-0 '>
                                    <button className="font1 font-semibold text-sm py-4 inline-flex items-center justify-center border-[1px] border-slate-300 rounded-md hover:border-[1px] hover:border-slate-900" onClick={buyNow}><BsHeart className='mr-4' /><span>BUY NOW</span></button>
                                    <button className="font1 font-semibold text-sm py-4 px-6 inline-flex items-center justify-center bg-slate-500 text-white ml-4 rounded-md hover:bg-gray-900" onClick={addtobag}><BsHandbag className='mr-4'/> <span>ADD&nbsp;TO&nbsp;CART</span></button>
                                </div>

                                <div className='mt-2 pb-6 pt-4 relative bg-white px-4'>
                                    <h1 className='font1 flex items-center mt-2 font-semibold'>More Information</h1>
                                    <li className='list-none mt-2'>Product Code:&nbsp;{product?.style_no?.toUpperCase()}</li>
                                    <li className='list-none mt-2'>Seller:&nbsp;<span className='text-[#F72C5B] font-bold'>{capitalizeFirstLetterOfEachWord(product?.brand).toUpperCase() || "No Brand"}</span></li>
                                </div>

                                <div className='mt-2 pb-6 pt-4 relative bg-white px-4'>
                                <h1 className='font1 flex items-center mt-4 font-semibold px-6 py-2'>SIMILAR PRODUCTS</h1>
                                    <ul className='grid grid-cols-2 gap-2'>
                                        {similar && similar.length > 0 && similar.map((pro) => (<Single_product pro={pro} key={pro._id} />))}
                                    </ul>
                                </div>
                            </div>

                        </div>
                        <Footer/>
                    </div>
                    :
                    <Loader />
            }

        </Fragment>
    )
}

export default MPpage