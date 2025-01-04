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
        console.log("selected color: ",size);
        setCurrentSize(size);
        setSelectedSize(size);
        setSelectedColor(size.colors);
        setSelectedColorId(size.colors[0]._id);
    }
    const handelSetColorImages = (color) => {
        setSelectedSize_color_Image_Array(color.images)
        setSelectedImage(color.images[0]);
        setSelectedColorId(color._id);
    }
    useEffect(()=>{
    if(product){
        setSelectedSize(product.size[0]);
        setSelectedColor(product.size[0].colors);
        const color = product.size[0].colors[0];
        setSelectedSize_color_Image_Array(color.images);
        setSelectedColorId(color._id);
        setSelectedImage(color.images[0]);
    }
        if(selectedSize){
            setSelectedColor(selectedSize.colors);
            const color = selectedSize.colors[0];
            setSelectedSize_color_Image_Array(color.images);
            setSelectedColorId(color._id);
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
                        <div className="bg-white p-4">
                            <div className="border-b border-gray-300 pb-6 pt-4">
                                <h1 className="font1 text-xl font-semibold text-slate-800">{capitalizeFirstLetterOfEachWord(product?.title)}</h1>
                                <h1 className="text-xl text-gray-500 font-light">{capitalizeFirstLetterOfEachWord(product?.gender)}</h1>
                            </div>
                            <div className="border-b border-white pb-6 pt-2 bg-white">
                                <h1 className="font1 text-lg font-semibold text-slate-800">
                                <span className="mr-4 font-bold">₹ {Math.round(product?.salePrice ? product?.salePrice : product?.price)}</span>
                                {product?.salePrice && (
                                    <Fragment>
                                    <span className="line-through mr-4 text-slate-500 font-light">₹ {product?.price}</span>
                                    <span className="text-gray-700">( {-Math.round(product.salePrice / product.price * 100 - 100)}% OFF)</span>
                                    </Fragment>
                                )}
                                </h1>
                                <h1 className="text-[#0db7af] font-semibold text-sm mt-1">inclusive of all taxes</h1>
                                <h1 className="font1 text-base font-semibold mt-2 mb-2">SELECT SIZE</h1>
                                <div className="flex flex-wrap justify-start items-center gap-2">
                                {product?.size?.map((size, index) => (
                                    <div 
                                    key={`size_${index}`} 
                                    className={`flex flex-col h-fit w-fit rounded-full justify-start p-2 items-center shadow-md gap-2 transition-transform hover:scale-110 duration-300 ease-in-out 
                                        ${currentSize?._id === size?._id  ? "border-2 border-black bg-gray-600 text-white font-bold" : "bg-gray-100"}`}
                                    onClick={(e) => {
                                        // e.preventDefault();
                                        
                                        handleSetNewImageArray(size);
                                    }}
                                    >
                                    <button className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold">
                                        {size?.label}
                                    </button>
                                    </div>
                                ))}
                                </div>
                                <div className="flex flex-wrap justify-start items-center gap-2 mt-2">
                                {selectedColor?.map((color, i) => (
                                    <div 
                                    key={`color-${color?._id} ${i}`} 
                                    className={`flex flex-col h-32 w-24 p-3 rounded-md items-center justify-start gap-2 transition-transform duration-300 ease-in-out`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentColorColor(color);
                                        handelSetColorImages(color);
                                    }}
                                    >
                                    <button
                                        style={{ backgroundColor: color?.label || color._id, width: "40px", height: "40px" }}
                                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out
                                            ${currentColor?._id === color?._id  ? "outline-dotted outline-offset-4 border-separate border-solid border-gray-700 shadow-md scale-110" : "scale-100 border-4 border-black"}
                                          `}
                                    />
                                    {
                                        color.quantity <= 10 && color.quantity > 0 && (
                                        <div className='flex flex-col justify-center items-center mt-2'>
                                            <span className="text-red-600 text-sm font-extrabold text-center text-[12px] flex-wrap">Only {color?.quantity} Left</span>
                                        </div>
                                        )
                                    }
                                    {
                                        color.quantity <= 0 && (
                                        <div className='flex flex-col justify-center items-center'>
                                            <span className="text-red-600 text-sm font-extrabold text-center flex-wrap">Out of Stock</span>
                                        </div>
                                        )
                                    }
                                    </div>
                                ))}
                                </div>
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