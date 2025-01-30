import React, { useEffect, Fragment, useState, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { checkPurchasesProductToRate, postRating, singleProduct } from '../../action/productaction'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader/Loader'
import './Ppage.css'
import { BiSpreadsheet } from 'react-icons/bi'
import elementClass from 'element-class'
import Single_product from '../Product/Single_product'
import {getuser} from '../../action/useraction'
import {createbag, createwishlist, clearErrors, getwishlist, getbag} from '../../action/orderaction'
import Footer from '../Footer/Footer'
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, getLocalStorageBag} from '../../config'
import ImageZoom from './ImageZoom'
import PincodeChecker from './PincodeChecker'
import ReactPlayer from 'react-player';
import { Heart, ShoppingBag, ShoppingCart} from 'lucide-react'
import SizeChartModal from './SizeChartModal'
import { useSessionStorage } from '../../Contaxt/SessionStorageContext'
import { useSettingsContext } from '../../Contaxt/SettingsContext'


const reviews = [
  {
    rating: 5,
    comment: "Excellent product! Exceeded my expectations.",
  },
  {
    rating: 4,
    comment: "Great quality, but a bit expensive.",
  },
  {
    rating: 3,
    comment: "Average product. It works, but I was expecting more.",
  },
  {
    rating: 2,
    comment: "Not as described. Poor quality.",
  },
  {
    rating: 1,
    comment: "Terrible! It broke after one use.",
  },
  {
    rating: 4,
    comment: "Really good overall. The performance is great, just wish it had more features.",
  },
  {
    rating: 5,
    comment: "I love it! Exactly what I needed, and the price was reasonable for the quality.",
  },
  {
    rating: 3,
    comment: "It's okay, but I expected better durability. It's decent for the price.",
  },
  {
    rating: 2,
    comment: "Disappointing. It didn’t perform as expected, and the build quality feels cheap.",
  },
  {
    rating: 1,
    comment: "I regret purchasing this. It stopped working after a couple of days.",
  },
  {
    rating: 4,
    comment: "Very happy with this! It does what it promises, but the packaging could’ve been better.",
  },
  {
    rating: 5,
    comment: "Fantastic! I’ll definitely be buying again. This has become my go-to product.",
  },
  {
    rating: 3,
    comment: "It’s fine, but it doesn’t stand out from other similar products in the market.",
  },
  {
    rating: 2,
    comment: "Not worth the money. The product was underwhelming and didn’t meet my needs.",
  },
  {
    rating: 1,
    comment: "Do not buy this! The quality is horrible and it malfunctioned within a week.",
  },
];

const maxScrollAmount = 1100,maxScrollWithReviewInput = 1500
const Ppage = () => {
    const { sessionData,sessionBagData, setWishListProductInfo,setSessionStorageBagListItem } = useSessionStorage();
    const[currentMaxScrollAmount,setCurrentMaxScrollAmount] = useState(maxScrollAmount);

    const [isInWishList, setIsInWishList] = useState(false);
    const [isInBagList, setIsInBagList] = useState(false);
    const {checkAndCreateToast} = useSettingsContext();
    /* const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type,message) => {
        console.log("check Toast: ",type, message,activeToast);
        if(activeToast !== message){
            switch(type){
                case "error":
                    toast.error(message)
                    break;
                case "warning":
                    toast.warning(message)
                    break;
                case "info":
                    toast.info(message)
                    break;
                case "success":
                    toast.success(message)
                    break;
                default:
                    toast.info(message)
                    break;
            }
            showToast(message);
        }
    } */
    const navigation = useNavigate();
    const param = useParams()
    const dispatch = useDispatch()


    const [isFocused, setIsFocused] = useState(false);
    const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const { product, loading:productLoading, similar } = useSelector(state => state.Sproduct)
    const {loading: userloading, user, isAuthentication} = useSelector(state => state.user)
    const {error:warning} = useSelector(state => state.wishlist)




    const[selectedSize, setSelectedSize] = useState(null);
    const[showSizeChart,setShowSizeChart] = useState(false);
    const[selectedColor, setSelectedColor] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [state, setstate] = useState(false)
    const [selectedSize_color_Image_Array, setSelectedSizeColorImageArray] = useState([]);
    
    const [currentColor,setCurrentColor] = useState(null)
    const[currentSize,setCurrentSize] = useState(null)
    const[hasPurchased, setHasPurchased] = useState(false);
    const[ratingData,setRatingData] = useState(null);

    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollableDivRef = useRef(null); // Create a ref to access the div element


    function Addclass() {
        var foo1 = document.querySelector(`.imgfulldiv`)
        elementClass(foo1).add('visible')
    }
    function Removeclass() {
        var foo1 = document.querySelector(`.imgfulldiv`)
        elementClass(foo1).remove('visible')
    }

    const addtobag = async () => {
        if (isInBagList) {
            navigation("/bag");
            return;
        }
        if (!currentColor) {
            checkAndCreateToast("error", "No Color Selected");
            return;
        }
        if (!currentSize) {
            checkAndCreateToast("error", "No Size Selected");
            return;
        }
        if (user) {
            const orderData = {
                userId: user.id,
                productId: param.id,
                quantity: 1,
                color: currentColor,
                size: currentSize,
            };
            const response = await dispatch(createbag(orderData));
            if(response){
                // await dispatch(getwishlist());
                dispatch(getbag({ userId: user.id }));
            }
            setIsInBagList(response);
        } else {
            // Add to localStorage logic
            const orderData = {
                productId: param.id,
                quantity: 1,
                color: currentColor,
                size: currentSize,
                ProductData: product,
            };
            setSessionStorageBagListItem(orderData, param.id);
        }
        checkAndCreateToast("success", "Product successfully in Bag");
        updateButtonStates();
    };
    const updateButtonStates = () => {
        if (user) {
            // console.log("Updateing wishList: ",wishlist);
            setIsInWishList(wishlist?.orderItems?.some(w => w.productId?._id === product?._id));
            setIsInBagList(bag?.orderItems?.some(w => w.productId?._id === product?._id));
        } else {
            setIsInWishList(sessionData.some(b => b.productId?._id === product?._id));
            setIsInBagList(getLocalStorageBag().some(b => b.productId === product?._id));
        }
    };
    const addToWishList = async () => {
        if (user) {
            const response = await dispatch(createwishlist({ productId: param.id }));
            await dispatch(getwishlist());
            checkAndCreateToast("success", "Wishlist Updated Successfully");
            console.log("Wishlist Updated Successfully: ",response);
            if(response){
                setIsInWishList(response);
            }
        } else {
            setWishListProductInfo(product, param.id);
            checkAndCreateToast("success", "Bag is Updated Successfully");
            updateButtonStates();
        }
    };

    const handleBuyNow = async () => {
        if (!currentColor) {
            checkAndCreateToast("error", "No Color Selected");
            return;
        }
        if (!currentSize) {
            checkAndCreateToast("error", "No Size Selected");
            return;
        }
        try {
            if (user) {
                const orderData = {
                    userId: user.id,
                    productId: param.id,
                    quantity: 1,
                    color: currentColor,
                    size: currentSize,
                };
                const response = await dispatch(createbag(orderData));
                setIsInBagList(response);
                if(response){
                    navigation("/bag");
                }
            } else {
                // Add to localStorage logic
                const orderData = {
                    productId: param.id,
                    quantity: 1,
                    color: currentColor,
                    size: currentSize,
                    ProductData: product,
                };
                setSessionStorageBagListItem(orderData, param.id);
                navigation("/bag");
            }
            checkAndCreateToast("success", "Product successfully in Bag");
            updateButtonStates();
        } catch (error) {
            console.error("Error Adding to Bag: ",error);
            checkAndCreateToast("error","Error adding to Bag");
        }
    }

    

    const PostRating = async (e)=>{
        console.log("Rating Data: ", ratingData);
        if(ratingData && user && product){
            await dispatch(postRating({productId:product?._id, ratingData}))
            dispatch(singleProduct(param.id))
        }
    }


    const checkFetchedIsPurchased = async ()=>{
        console.log("Checking: ",product);
        const didPurchased = await dispatch(checkPurchasesProductToRate({productId:product?._id}))
        setHasPurchased(didPurchased?.success || false);
    }
    useEffect(() => {
        if (state === false) {
            dispatch(getuser())
            dispatch(singleProduct(param.id))
            setstate(true)
        }
        
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0;
        if(warning){
            checkAndCreateToast("warning",warning)
            dispatch(clearErrors())
        }
    }, [dispatch, param, warning]);
    const handleSetNewImageArray = (newSize)=>{
        setCurrentSize(newSize);
        setSelectedSize(newSize);
        setSelectedColor(newSize.colors);
    }
    const handelSetColorImages = (color) => {
        setSelectedSizeColorImageArray(color.images)

        setSelectedImage(color.images[0]);
    }
    useEffect(()=>{
        if (product) {
            const availableSize = product.size.find(item => item.quantity > 0);
            setSelectedSize(availableSize);
            setSelectedColor(availableSize.colors);
            const color = availableSize.colors[0];
            setSelectedSizeColorImageArray(color.images);
            // setSelectedColorId(color._id);
            setSelectedImage(color.images[0]);
        }
        if (selectedSize) {
            setSelectedColor(selectedSize.colors);
            const color = selectedSize.colors[0];
            setSelectedSizeColorImageArray(color.images);
            // setSelectedColorId(color._id);
            setSelectedImage(color.images[0]);
        }
        /* if(product){
            const availableSize = product.size.find(item => item.quantity > 0);
            setSelectedColor(availableSize);
            setSelectedSize(product.size[0].quantity <= 0 ? product.size[1]: product.size[0]);
            setCurrentSize(product.size[0].quantity <= 0 ? product.size[1]: product.size[0]);

            const currentColor = product.size[0].colors[0];

            // setSelectedColorId(currentColor._id);
            setSelectedImage(currentColor.images[0]);
            setSelectedSizeColorImageArray(currentColor.images);
        } */
        if(product){
            checkFetchedIsPurchased();
        }
        if(user){
            dispatch(getbag({ userId: user.id }));
        }
    },[product,user,dispatch])
    useEffect(() => {
        // Check if the user is logged in
        if(!loadingWishList && !bagLoading){
            updateButtonStates();
        }
    }, [user, wishlist, bag, product,loadingWishList,sessionData,sessionBagData]); 
    useEffect(()=>{
        if(selectedSize){
            setSelectedColor(selectedSize.colors);
            const currentColor = selectedSize.colors[0];
            setSelectedSizeColorImageArray(currentColor.images);
            // setSelectedColorId(currentColor._id);
            setSelectedImage(currentColor.images[0]);
        }
    },[selectedSize])


    useEffect(() => {
        // Function to handle the scroll event
        const handleScroll = () => {
            // Get the scroll position of the specific div
            setScrollPosition(scrollableDivRef.current.scrollTop);
        };

        // Attach the scroll event listener when the component mounts
        const divElement = scrollableDivRef.current;
        divElement.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            divElement.removeEventListener('scroll', handleScroll);
        };
    }, []);
    useEffect(()=>{
        setCurrentMaxScrollAmount(hasPurchased ? maxScrollWithReviewInput:maxScrollAmount);
    },[hasPurchased])
    // console.log("isIn Bag / is In Wishlist",isInBagList,isInWishList,user);
    console.log("current Scroll Amount: ",scrollPosition);
    
    return (
        <div ref={scrollableDivRef} className="w-screen h-screen justify-start items-center overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
            {
                !productLoading ?
                    <div className='pt-5'>
                        <div className='flex-row h-fit flex justify-between items-start relative gap-4 overflow-hidden mb-6'>
                            <div className='w-[36%] 2xl:w-[36%] min-h-[200px] flex flex-col px-7'>
                                <div className={`w-[40%] ${scrollPosition < currentMaxScrollAmount ? "fixed z-30 mt-5":"flex absolute bottom-5 left-8"} `}>
                                    <div className='w-full h-full justify-start items-center flex'>
                                        <LeftImageContent 
                                            selectedSize_color_Image_Array = {selectedSize_color_Image_Array} 
                                            Addclass ={Addclass} 
                                            setSelectedImage = {setSelectedImage} 
                                            selectedImage ={selectedImage} 
                                            isFocused = {isFocused}
                                            setIsFocused = {setIsFocused}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Content div for large screen */}
                            <div className='w-[56%] 2xl:w-[68%] h-full flex flex-col pl-9'>
                                {/* Left Column (Add to Cart Section) */}
                                <div className='w-full flex flex-col justify-start items-start p-2'>
                                    <div className='pt-1'>
                                    <h1 className='font1 text-2xl font-semibold text-slate-800'>
                                        {capitalizeFirstLetterOfEachWord(product?.title)}
                                    </h1>
                                    <h1 className='text-xl text-[#808080e8] font-light'>
                                        {capitalizeFirstLetterOfEachWord(product?.gender)}
                                    </h1>
                                    <AverageRatingView ratings={/* product.Rating || */ reviews}/>
                                    </div>
                                    
                                    <div className='border-b-[1px] border-slate-200 pb-6 pt-4 w-full'>
                                    <h1 className='font1 text-xl font-semibold text-slate-800'>
                                        <span className="mr-4 font-bold">
                                        ₹ {Math.round(product?.salePrice && product?.salePrice > 0 ? product?.salePrice : product?.price)}
                                        </span>
                                        {product?.salePrice && product?.salePrice > 0 && (
                                            <Fragment>
                                                <span className="line-through mr-4 font-extralight text-slate-500">₹ {product?.price}</span>
                                                <span className="text-gray-700">{calculateDiscountPercentage(product.price, product.salePrice)} % OFF</span>
                                            </Fragment>
                                        )}
                                    </h1>
                                    <h1 className='text-[#0db7af] font-semibold font1 text-sm mt-1'>
                                        inclusive of all taxes
                                    </h1>
                                    <div className='w-full flex flex-col justify-start items-center mt-3 py-5 mx-auto'>
                                        {/* Size Selection */}
                                        <div className="w-full flex flex-wrap justify-start items-center max-h-fit space-x-4 text-xl sm:space-x-5 font-sans font-extrabold">
                                        {product && product.size && product.size.length > 0 && product.size.map((size, index) => (
                                            <div key={`size_${index}_${size._id}`}
                                                className={`flex flex-col items-center relative justify-center rounded-full p-3 shadow-md gap-2 transition-transform duration-300 border-gray-900 ease-in-out border-[1px]
                                                ${currentSize?._id === size?._id ? "border-2 bg-gray-600 text-white scale-110" : "bg-gray-200  text-gray-900"}`}
                                                onClick={() => { handleSetNewImageArray(size); }}
                                            >
                                                <button className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                                                    {size.label}
                                                </button>
                                                {size?.quantity <= 0 && (
                                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                                        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                                                            {/* Diagonal Line 1 */}
                                                            <div className="absolute w-[5px] h-[60px] bg-red-600 transform rotate-45"></div>
                                                            {/* Diagonal Line 2 */}
                                                            <div className="absolute w-[5px] h-[60px] bg-red-600 transform -rotate-45"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        </div>
                                        {/* Color Selection */}
                                        <div className="w-full flex flex-wrap justify-start items-center max-h-fit mt-2 gap-1">
                                            {selectedColor && selectedColor.length > 0 ? (
                                                selectedColor.map((color, i) => (
                                                    <div key={`color_${i}`} 
                                                        className={`flex flex-col p-1 items-center justify-center transition-transform relative duration-300 ease-in-out 
                                                        ${color.quantity <= 10 ? "h-32 w-14" : "h-fit w-fit"}`}
                                                        onClick={(e) => { setCurrentColor(color); handelSetColorImages(color); }}
                                                    >
                                                        <button 
                                                            disabled={color.quantity <= 0} 
                                                            style={{ backgroundColor: color?.label || color._id, width: "40px", height: "40px" }} 
                                                            className={`${color.quantity <= 0 ? 
                                                            `w-8 h-8 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out bg-gray-600` :
                                                            `w-8 h-8 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out p-1
                                                            ${currentColor?._id === color?._id ? "outline-offset-1 outline-1 border-4 border-slate-900 shadow-md scale-110" : "scale-100 border-separate border-2 border-solid border-slate-300"}`}`}
                                                            title={color?.quantity || color?.label || "Color"} 
                                                        />

                                                        {/* Diagonal Lines Over Button when quantity is 0 */}
                                                        {color?.quantity <= 0 && (
                                                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                                                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                                                                    {/* Diagonal Line 1 */}
                                                                    <div className="absolute w-[5px] h-[40px] bg-red-600 transform rotate-45"></div>
                                                                    {/* Diagonal Line 2 */}
                                                                    <div className="absolute w-[5px] h-[40px] bg-red-600 transform -rotate-45"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-black">No colors available</p>
                                            )}
                                        </div>

                                    </div>
                                    {/* Add to Cart & Buy Now Buttons */}
                                    <PincodeChecker productId={product?._id} />
                                    </div>
                                    <div className='w-[80%] h-fit pr-10 justify-center items-center flex flex-col'>
                                        <div className='grid grid-cols-2 justify-center items-center gap-2 w-full'>
                                            <button disabled = {bagLoading} className="font1 h-16 font-semibold text-base w-full p-4 inline-flex items-center justify-center border-[1px] bg-gray-800 text-white border-slate-900 mt-4 rounded-md hover:border-[1px] hover:border-gray-300" 
                                                onClick={addtobag}
                                            >
                                                <ShoppingCart size={30} className='m-4' /> <span>{isInBagList ? "GO TO CART":"ADD TO CART"}</span>
                                            </button>
                                            <button disabled = {loadingWishList} className="font1 h-16 font-semibold text-base w-full p-2 inline-flex items-center justify-center mt-4 rounded-md border-[0.5px] hover:border-[1px] hover:border-gray-900" 
                                                onClick={addToWishList}
                                            >
                                            {
                                                loadingWishList ? <Fragment>
                                                    <div className="absolute inset-0 flex justify-center items-center">
                                                        <div className="w-6 h-6 border-4 border-t-4 border-transparent border-t-white rounded-full animate-spin"></div>
                                                    </div>
                                                </Fragment>:(
                                                    <Fragment>
                                                        {
                                                            isInWishList ? <Heart fill='red' strokeWidth={0} size={30} className='m-4' />: <Heart size={30} className='m-4' />
                                                        }
                                                        <span>{isInWishList ? "GO TO WISHLIST":"ADD TO WISHLIST"}</span>
                                                    </Fragment>
                                                )
                                            }
                                            </button>
                                        </div>
                                        <button disabled = {bagLoading || loadingWishList} className="font1 h-16 font-semibold text-base w-full p-4 inline-flex items-center justify-center border-[1px] border-slate-300 mt-4 rounded-md hover:border-[1px] hover:border-gray-900" 
                                            onClick={handleBuyNow}
                                        >
                                            <ShoppingBag size={30} className='m-4' /><span>BUY NOW</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Right Column (Product Details Section) */}
                                <div className='w-full flex flex-col justify-start items-start p-4'>
                                    
                                    {/* Price and Discount Section */}
                                    <div className='border-b-[1px] border-slate-200 pb-6 pt-4'>
                                        <h1 className='font1'>Seller: <span className='text-gray-800 font-semibold'>{capitalizeFirstLetterOfEachWord(product?.brand?.toUpperCase())}</span></h1>
                                    </div>

                                    {/* Bullet Points */}
                                    <div className='border-b-[1px] border-slate-200 pb-6 pt-4'>
                                        {product?.bulletPoints && product.bulletPoints.length > 0 && product.bulletPoints.map((e, index) => (
                                            <ul key={index}>
                                                <h1 className='font1 flex items-center mt-2 font-semibold'>{e?.header}</h1>
                                                <span className='mt-4'>
                                                    <li className='list-disc mt-2'>{e?.body}</li>
                                                </span>
                                            </ul>
                                        ))}
                                    </div>

                                    {/* Product Details */}
                                    <div className='border-b-[1px] border-slate-200 pb-6 pt-4'>
                                    <h1 className='font1 flex items-center mt-2 font-semibold'>PRODUCT DETAILS <BiSpreadsheet className='ml-2 text-xl' /></h1>
                                    <h1 className='mt-4'>
                                        <li className='list-none mt-2'>{product?.description}</li>
                                        <li className='list-none '>Warranty: 1 month</li>
                                        <li className='list-none '>Warranty provided by Brand Owner / Manufacturer</li>
                                    </h1>
                                    <h1 className='font1 flex items-center mt-4 font-semibold'>Size & Fit</h1>
                                    <div className='w-full max-h-fit flex flex-wrap flex-row justify-start items-center space-x-1'>
                                        {product?.size && product.size.length > 0 && product.size.map((e, i) => (
                                            <div key={`size_${e?.id || i}`} className='m-2 '>
                                                <span className='list-none font-normal mt-2'>{e?.label}: </span>
                                                <span className='list-none mt-2'>{e?.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <h1 className='font1 flex items-center mt-4 font-semibold'>Material & Care</h1>
                                    <p>{product?.material}</p>
                                    <h1 className='font1 flex items-center mt-4 font-semibold'>Care Instructions:</h1>
                                    <h1 className='font1 flex items-center mt-4 font-semibold'>Specifications</h1>
                                        {product?.specification && product.specification.length > 0 && product.specification.map((e, index) => (
                                            <li key={index} className='list-none mt-2'>{e?.point}</li>
                                        ))}
                                    </div>
                                    <SizeChartModal/>
                                    {/* Additional Info */}
                                    <div className='border-b-[1px] border-slate-200 pb-6 pt-4 '>
                                        <li className='list-none mt-2'>Product Code:&nbsp;{product?.productId?.toUpperCase()}</li>
                                        <li className='list-none mt-2'>Seller:&nbsp;<span className='text-gray-700 font-bold'>{capitalizeFirstLetterOfEachWord(product?.brand?.toUpperCase())}</span></li>
                                    </div>
                                    <div className='w-[90%] px-2'> {/* Adjust the width of the reviews section */}
                                        {/* Reviews Section */}
                                        <div className='reviews-section'>
                                            <h3 className='text-lg font-semibold mt-4'>All Reviews</h3>
                                            <div className='reviews-list mt-4 overflow-y-auto'>
                                                {product && product.Rating && product.Rating.length > 0 ? <ProductReviews reviews={/* product.Rating */reviews}/> : <ProductReviews reviews={reviews}/>}
                                            </div>
                                            {hasPurchased ? (
                                                <div className='w-screen justify-center items-center flex-row flex'>
                                                    <div className='w-full flex flex-col justify-start items-center'>
                                                        {/* Review Input Section */}
                                                        <div className='mt-6 w-full'>
                                                            <h4 className='text-lg font-semibold'>Write a Review</h4>
                                                            <form className='mt-4'>
                                                                {/* Review Text Input */}
                                                                <div className='mb-4'>
                                                                    <label htmlFor='reviewText' className='block text-sm font-semibold text-gray-700'>Review Text:</label>
                                                                    <textarea
                                                                        onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
                                                                        id='reviewText'
                                                                        name='reviewText'
                                                                        rows='4'
                                                                        placeholder='Write your review here...'
                                                                        className='mt-2 p-2 w-full border border-gray-300 rounded-md'
                                                                    />
                                                                </div>

                                                                {/* Star Rating Input */}
                                                                <div className='mb-4'>
                                                                    <label htmlFor='starRating' className='block text-sm font-semibold text-gray-700'>Rating:</label>
                                                                    <input
                                                                        onChange={(e) => setRatingData({ ...ratingData, rating: e.target.value })}
                                                                        id='starRating'
                                                                        name='starRating'
                                                                        type='number'
                                                                        min='1'
                                                                        max='5'
                                                                        className='mt-2 p-2 w-full border border-gray-300 rounded-md'
                                                                        placeholder='Rate from 1 to 5'
                                                                    />
                                                                </div>

                                                                {/* Submit Button */}
                                                                <div className='flex justify-start'>
                                                                    <button
                                                                        onClick={PostRating}
                                                                        className='bg-gray-500 text-white px-4 py-2 rounded-md'
                                                                    >
                                                                    Submit Review
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) :(
                                                null
                                            )}
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                            </div>

                        </div>
                        <div className='w-screen justify-center items-center flex flex-col'>
                            <h1 className='font1 flex items-center justify-center text-center mt-4 font-semibold text-2xl p-8'>SIMILAR PRODUCTS</h1>
                            <div className='w-full flex justify-start items-start px-10'>
                                <ul className='grid grid-cols-2 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5 pb-8 gap-5'>
                                    {similar && similar.length > 0 && similar.slice(0,20).map((pro) => (
                                        <Single_product key={pro._id} pro={pro} user ={user}/>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                :
                <ProductSkeletonLoader />
            }
            <Footer/>
        </div>
    )
}
const ProductSkeletonLoader = () => {
    return (
        <div className="flex flex-row gap-4 mb-6">
            {/* Skeleton for Left Column (Product Image) */}
            <div className="w-[50%] min-h-[200px] flex flex-col px-7">
                <div className="w-[50%] bg-gray-300 animate-pulse h-64 rounded-md"></div>
                </div>
        
                {/* Skeleton for Right Column (Product Info) */}
                <div className="w-[50%] h-full flex flex-col pl-9">
                {/* Title and Price */}
                <div className="w-full flex flex-col justify-start items-start p-2">
                    <div className="w-full h-6 bg-gray-300 animate-pulse rounded mt-2"></div>
                    <div className="w-1/3 h-4 bg-gray-300 animate-pulse rounded mt-2"></div>
                    <div className="w-1/2 h-6 bg-gray-300 animate-pulse rounded mt-2"></div>
                </div>
        
                {/* Add to Cart and Buy Now Buttons */}
                <div className="w-full h-20 mt-4 flex flex-col gap-4">
                    <button className="w-full h-16 bg-gray-300 animate-pulse rounded-md"></button>
                    <button className="w-full h-16 bg-gray-300 animate-pulse rounded-md"></button>
                </div>
        
                {/* Size and Color Selection */}
                <div className="w-full flex flex-wrap justify-start items-center mt-3 gap-4">
                    <div className="w-16 h-16 bg-gray-300 animate-pulse rounded-full"></div>
                    <div className="w-16 h-16 bg-gray-300 animate-pulse rounded-full"></div>
                    <div className="w-16 h-16 bg-gray-300 animate-pulse rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

const AverageRatingView = ({ ratings }) => {
    if (!ratings || ratings.length === 0) return null;

    // Calculate the average rating
    const totalStars = ratings.reduce((acc, review) => acc + review.rating, 0);
    const avgStars = totalStars / ratings.length;
    const roundedAvg = Math.round(avgStars * 10) / 10; // Rounded to 1 decimal place
    const fullStars = Math.floor(roundedAvg);
    const emptyStars = 5 - fullStars;

    return (
        <Fragment>
            <div className='average-rating mt-6'>
                <div className='flex items-center'>
                    <div className='stars'>
                        {/* Render filled stars */}
                        {[...Array(fullStars)].map((_, i) => (
                            <span key={i} className='star text-[30px] text-black'>★</span>
                        ))}
                        {/* Render empty stars */}
                        {[...Array(emptyStars)].map((_, i) => (
                            <span key={i} className='star text-[30px] text-gray-300'>★</span>
                        ))}
                    </div>
                    <span className='ml-2 text-sm text-gray-500'>{roundedAvg} Stars</span>
                </div>
            </div>
        </Fragment>
    );
};

const ProductReviews = ({ reviews }) => {
    const [showMore, setShowMore] = useState(false); // State to toggle the visibility of more reviews
    const containerRef = useRef(null);

    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const isDragging = useRef(false); // Track mouse drag status
    const initialClientY = useRef(0); // Store initial mouse Y position
    const initialScrollTop = useRef(0); // Store initial scroll position

    // For touch events
    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY; // Capture initial touch position
    };

    const handleTouchMove = (e) => {
        if (containerRef.current) {
            const touchMoveY = e.touches[0].clientY;
            const touchDifference = touchStartY.current - touchMoveY;

            // Only apply scrolling if there is a significant touch movement
            if (Math.abs(touchDifference) > 5) {
                containerRef.current.scrollTop += touchDifference;
                touchStartY.current = touchMoveY; // Update touch start position
            }
        }
    };

    const handleTouchEnd = () => {
        touchEndY.current = touchStartY.current; // Update the end touch position
    };

    // For mouse events
    const handleMouseDown = (e) => {
        e.preventDefault(); // Prevent default scrolling behavior
        isDragging.current = true;
        initialClientY.current = e.clientY; // Capture initial mouse Y position
        initialScrollTop.current = containerRef.current.scrollTop; // Capture initial scroll position
        containerRef.current.style.cursor = 'grabbing'; // Change cursor to grabbing
    };

    const handleMouseMove = (e) => {
        if (isDragging.current && containerRef.current) {
            const deltaY = e.clientY - initialClientY.current; // Calculate mouse movement
            containerRef.current.scrollTop = initialScrollTop.current - deltaY; // Update scroll position
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        containerRef.current.style.cursor = 'grab'; // Revert cursor back to default
    };

    const handleMouseLeave = () => {
        if (isDragging.current) {
            handleMouseUp();
        }
    };

    const handleToggleReviews = () => {
        setShowMore(!showMore); // Toggle the state between true/false
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Product Reviews</h2>
            <div
                ref={containerRef}
                className="overflow-y-auto max-h-[300px] relative px-1 cursor-grab"
                style={{ userSelect: 'none' }} // Disable text selection during drag
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                {/* Display only the first 3 reviews or more based on showMore */}
                {reviews.slice(0, 4).map((review, index) => {
                    const randomStars = review.rating; // Random stars between 1 and 5
                    return (
                        <div key={index} className="review-item mb-4">
                            <div className="flex items-center">
                                <div className="stars">
                                    {[...Array(randomStars)].map((_, i) => (
                                        <span key={i} className="star text-black">★</span>
                                    ))}
                                    {[...Array(5 - randomStars)].map((_, i) => (
                                        <span key={i} className="star text-gray-300">★</span>
                                    ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">{randomStars} Stars</span>
                            </div>
                            <p className="text-gray-700 mt-2">{review.comment}</p>
                        </div>
                    );
                })}

                {/* If showMore is true, display all reviews */}
                {showMore &&
                    reviews.slice(3).map((review, index) => {
                        const randomStars = review.rating;
                        return (
                            <div key={index} className="review-item mb-4">
                                <div className="flex items-center">
                                    <div className="stars">
                                        {[...Array(randomStars)].map((_, i) => (
                                            <span key={i} className="star text-black">★</span>
                                        ))}
                                        {[...Array(5 - randomStars)].map((_, i) => (
                                            <span key={i} className="star text-gray-300">★</span>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-500">{randomStars} Stars</span>
                                </div>
                                <p className="text-gray-700 mt-2">{review.comment}</p>
                            </div>
                        );
                    })
                }
            </div>

            {/* "View More" / "Show Less" Toggle Button */}
            <button
                onClick={handleToggleReviews}
                className="mt-4 text-blue-500 hover:underline"
            >
                {showMore ? 'Show Less' : 'View More'}
            </button>
        </div>
    );
};


const LeftImageContent = ({selectedSize_color_Image_Array,Addclass,setSelectedImage,selectedImage,isFocused,setIsFocused})=>{
    const memoIsVideo = useMemo(() => {
        if (!selectedImage || !selectedImage.url) return false;

        const url = selectedImage.url;
        return (
            url.includes("video") || 
            url.endsWith(".mp4") || 
            url.endsWith(".mov") || 
            url.endsWith(".avi")
        );
    }, [selectedImage]);
    return(
        <div className='w-full min-h-full justify-start items-start flex-row flex'>
            <div className='h-full w-fit mr-5 justify-center items-center flex-col flex'>
                <div className='flex flex-col w-[70px] min-h-fit justify-between items-center space-y-6'> {/* Reduced grid-cols from 8 to 6 */}
                {
                    selectedSize_color_Image_Array && selectedSize_color_Image_Array.length > 0 &&
                        selectedSize_color_Image_Array.map((file, index) => {
                        // Check if the media is a video or an image
                        const isVideo = file?.url?.includes("video") || file?.url?.endsWith(".mp4") || file?.url?.endsWith(".mov") || file?.url?.endsWith(".avi");
                        console.log("Selected color Images is: ", isVideo);
                        return (
                            <div
                                key={index}
                                className={`w-full h-[100px] ${selectedImage === file ? "border-2":""}  border-purple-600 rounded-md overflow-hidden shadow-sm cursor-pointer flex justify-center items-center transform transition-transform duration-300 ease-in-out`}
                                onMouseEnter={() => { Addclass(); setSelectedImage(file); }}
                                onClick={() => { Addclass(); setSelectedImage(file); }}
                            >
                                {isVideo ? (
                                    <ReactPlayer
                                        className="w-full h-full object-cover hover:scale-110"
                                        url={file.url || file}
                                        playing={isFocused} // Play only when the element is in focus
                                        controls={false} // Hide video controls
                                        muted
                                        width="100%"
                                        height="100%"
                                        light={false} // No thumbnail before video plays
                                        onFocus={() => setIsFocused(true)} // Start playing when focused
                                        onBlur={() => setIsFocused(false)} // Stop playing when out of focus
                                        config={{ file: { attributes: { loading: 'lazy' } } }} // Optimize lazy loading
                                    />
                                ) : (
                                    <img
                                        src={file.url || file}
                                        className="w-full h-full object-cover hover:scale-110"
                                        alt="productImage"
                                        loading="lazy" // Ensure image is lazily loaded
                                    />
                                )}
                            </div>
                        );
                    })
                }
                </div>
            </div>
            <div className='w-fit min-h-full flex flex-col justify-center items-center'>
                {selectedImage ? (
                    memoIsVideo ? (
                        // Video handling using ReactPlayer
                        <div className="relative h-full w-full justify-center items-center overflow-hidden hover:shadow-md">
                            <ReactPlayer
                                className="w-full h-full object-contain rounded-md"
                                url={selectedImage.url || selectedImage}
                                loop={true}
                                muted={true}
                                controls={false}
                                width="100%"
                                height="100%"
                                playing={true} // Set to true if you want to auto-play
                                light={false}   // Optional: Display a thumbnail preview before play
                            />
                        </div>
                    ) : (
                        <div className="relative h-full min-w-fit justify-start items-start overflow-hidden hover:shadow-md">
                            <ImageZoom imageSrc={selectedImage.url || selectedImage} />
                        </div>
                    )
                    ) : (
                        // Loading Spinner
                        <Loader />
                    )}

            </div>
        </div>
    )
}
/* const getColorNameFromHex = (hexCode) => {
    try {
        // Use the color-namer library to get color names
        const names = namer(hexCode);

        // Get the closest name (e.g., Pantone, HTML, or Crayola categories)
        return names.html[0].name; // `html` gives common names like CSS color names
    } catch (error) {
        console.error("Invalid color hex code:", error);
        return "Unknown Color"; // Fallback if hexCode is invalid
    }
}; */


/* 
{selectedImage ? (
    isVideo ? (
    // Video handling using ReactPlayer
    <div className="relative h-[40%] p-3 w-full border-[0.5px] justify-center items-center overflow-hidden hover:shadow-md">
        <ReactPlayer
        className="w-full h-[70%] object-contain rounded-md border"
        url={selectedImage.url || selectedImage}
        loop={true}
        muted={true}
        controls={false}
        width="100%"
        height="100%"
        playing={true} // Set to true if you want to auto-play
        light={false}   // Optional: Display a thumbnail preview before play
        />
    </div>
    ) : (
    // Image handling (ImageZoom)
    <ImageZoom imageSrc={selectedImage.url || selectedImage} />
    )
) : (
    // Loading Spinner
    <Loader />
)} */
export default Ppage