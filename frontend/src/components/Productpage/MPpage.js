import React, { useEffect, Fragment, useState, CSSProperties, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkPurchasesProductToRate, postRating, singleProduct } from '../../action/productaction';
import Loader from '../Loader/Loader';
import './Ppage.css';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { BsTag } from 'react-icons/bs';
import Single_product from '../Product/Single_product';
import { createbag, createwishlist, getbag, getwishlist} from '../../action/orderaction';
import Footer from '../Footer/Footer';
import img1 from '../images/1.webp'
import img2 from '../images/2.webp'
import img3 from '../images/3.webp'
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, getLocalStorageBag, getLocalStorageWishListItem } from '../../config';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PincodeChecker from './PincodeChecker';
import ReactPlayer from 'react-player';
import { Heart, ShoppingBag, ShoppingCart } from 'lucide-react';



import toast from 'react-hot-toast';
import { useToast } from '../../Contaxt/ToastProvider';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';


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


const maxScrollAmount = 1024
const MPpage = () => {
    const navigation = useNavigate();
    const param = useParams();
    const dispatch = useDispatch();


    const { sessionData,sessionBagData, setWishListProductInfo, setSessionStorageBagListItem} = useSessionStorage();
    
    const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const { product, loading, similar } = useSelector((state) => state.Sproduct);
    const { loading: userLoading, user, isAuthentication } = useSelector((state) => state.user);
    


    const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type,message) => {
        console.log("check Toast: ",type, message,activeToast);
        if(!activeToast){
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
    }
    
    const [isInWishList, setIsInWishList] = useState(false);
    const [isInBagList, setIsInBagList] = useState(false);
    const [currentColor, setCurrentColor] = useState(null);
    const [currentSize, setCurrentSize] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState([]);
    const[hasPurchased, setHasPurchased] = useState(false);
    const [selectedSizeColorImageArray, setSelectedSizeColorImageArray] = useState([]);
    // const [selectedColorId, setSelectedColorId] = useState(null);
    const[ratingData,setRatingData] = useState(null);
    const [isInViewport, setIsInViewport] = useState(false);
    const [scrollAmount, setScrollAmount] = useState(0);  // To hold the scroll amount


    const divRef = useRef(null);
    const scrollContainerRef = useRef(null);

    

    // const[isInWishList,setIsInWishList] = useState(false);
    // const[isInBagList,setIsInBagList] = useState(false);

    useEffect(() => {
        dispatch(singleProduct(param.id));
        document.documentElement.scrollTop = 0;
    }, [dispatch, param]);

    const indicatorStyles: CSSProperties = {
        background: '#CFCECD',
        width: 7,
        height: 7,
        borderRadius: 50,
        display: 'inline-block',
        margin: '0 4px 0 4px',
    };

    function indicator(onClickHandler, isSelected, index, label) {
        if (isSelected) {
            return (
                <li
                    style={{ ...indicatorStyles, background: '#1D1616' }}
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
            await dispatch(createbag(orderData));
            // await dispatch(getwishlist());
            dispatch(getbag({ userId: user.id }));
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
            setIsInWishList(getLocalStorageWishListItem().some(b => b.productId?._id === product?._id));
            setIsInBagList(getLocalStorageBag().some(b => b.productId === product?._id));
        }
    };
    const addToWishList = async () => {
        if (user) {
            const response = await dispatch(createwishlist({ productId: param.id }));
            // await dispatch(getbag({ userId: user.id }));
            await dispatch(getwishlist());
            checkAndCreateToast("success", "Wishlist Updated Successfully");
            console.log("Wishlist Updated Successfully: ",response);
            if(response){
                // updateButtonStates();
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
            const orderData = {
                userId: user.id,
                productId: param.id,
                quantity: 1,
                color: currentColor,
                size: currentSize,
            };
            const response = await dispatch(createbag(orderData));
            if(response){
                setIsInBagList(response);
                navigation('/bag')
            }
        } catch (error) {
            console.error("Error Adding to Bag: ",error);
            checkAndCreateToast("success","Error adding to Bag");
        }
    }


    const handleSetNewImageArray = (size) => {
        setCurrentSize(size);
        setSelectedSize(size);
        setSelectedColor(size.colors);
        // setSelectedColorId(size.colors[0]._id);
    };

    const handleSetColorImages = (color) => {
        setSelectedSizeColorImageArray(color.images);
        // setSelectedImage(color.images[0]);
        // setSelectedColorId(color._id);
    };
    const PostRating = (e)=>{
        e.preventDefault();
        if(ratingData && user && product){
            dispatch(postRating({productId:product?._id, ratingData}))
        }
    }
    const checkFetchedIsPurchased = async ()=>{
        const didPurchased = await dispatch(checkPurchasesProductToRate({productId:product?._id}))
        setHasPurchased(didPurchased?.success || false);
    }
    useEffect(() => {
        // Check if the user is logged in
        if(!loadingWishList && !bagLoading){
            updateButtonStates();
        }
      }, [user, wishlist, bag, product,loadingWishList,sessionData,sessionBagData]); 

    useEffect(() => {
        if (product) {
            const availableSize = product.size.find(item => item.quantity > 0);
            setSelectedSize(availableSize);
            setSelectedColor(availableSize.colors);
            const color = availableSize.colors[0];
            setSelectedSizeColorImageArray(color.images);
            // setSelectedColorId(color._id);
            // setSelectedImage(color.images[0]);
        }
        if (selectedSize) {
            setSelectedColor(selectedSize.colors);
            const color = selectedSize.colors[0];
            setSelectedSizeColorImageArray(color.images);
            // setSelectedColorId(color._id);
            // setSelectedImage(color.images[0]);
        }
        if(product){
            checkFetchedIsPurchased();
        }
        if(user){
            dispatch(getbag({ userId: user.id }));
        }
        dispatch(getwishlist())
    }, [product, dispatch]);
    // console.log("getLocalStorageWishListItem",getLocalStorageWishListItem());



    

    // Function to check if the target element is in the viewport
    const checkIfInViewport = () => {
        const targetDiv = divRef.current;
        const scrollContainer = scrollContainerRef.current;

        if (!targetDiv || !scrollContainer) return;

        const rect = targetDiv.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();

        // Check if the target element is within the container
        const isVisible =
        rect.top < containerRect.bottom &&
        rect.bottom > containerRect.top &&
        rect.left < containerRect.right &&
        rect.right > containerRect.left;

        setIsInViewport(isVisible);

        // Update scroll position
        setScrollAmount(scrollContainer.scrollTop);  // Log the current scroll position
    };
    const carouselRef = useRef(null); // This is the carousel reference

    // Function to handle wheel event and prevent carousel from scrolling vertically
    const handleWheel = (event) => {
        const scrollContainer = scrollContainerRef.current;
        const carouselContainer = carouselRef.current;

        if (!scrollContainer || !carouselContainer) return;

        // Check if the user is scrolling vertically within the scroll container
        if (event.deltaY !== 0) {
            // Allow scroll inside the container
            if (scrollContainer.scrollTop + scrollContainer.clientHeight === scrollContainer.scrollHeight && event.deltaY > 0) {
                // Prevent carousel scroll and allow the page to scroll
                event.stopPropagation();
                window.scrollBy(0, event.deltaY);  // Scroll window instead
            } else {
                // Otherwise, handle scroll normally inside the container
                scrollContainer.scrollTop += event.deltaY;
                event.preventDefault(); // Prevent default scroll behavior inside carousel
            }
        }
    };
    useEffect(() => {
        // Set up the scroll event listener on the scroll container
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkIfInViewport);
            scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
        }
        // Initial check on mount
        checkIfInViewport();

        // Cleanup event listener on unmount
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', checkIfInViewport);
                scrollContainer.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);
    return (
        <Fragment>
            
            <div ref={scrollContainerRef} className="w-screen h-screen overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">

                {loading === false ? (
                    <div>
                        {
                            scrollAmount < maxScrollAmount  && <div className={`mobilevisible fixed bottom-0 w-full z-20 hidden`}>
                                <div className='grid grid-cols-12 w-full font1 bg-white border-t-[0.5px] border-slate-200 relative z-10'>
                                    <div className="col-span-2 flex justify-center items-center p-1">
                                        <button className="bg-gray-100 text-center w-full h-full border-[1px] border-opacity-50 flex justify-center items-center border-gray-400 text-black" onClick={addToWishList}>
                                            {isInWishList ? 
                                                (
                                                    <div className="text-red-500 animate-shine p-1 rounded-full">
                                                        <Heart size={30} strokeWidth={0} fill="red" className="text-red-500" />
                                                    </div>
                                                ) : (
                                                    <Heart size={30}/>
                                                )
                                            }
                                        </button>
                                    </div>
                                    <div className="col-span-10 text-lg flex justify-center text-center p-1" >
                                        <button className="font1 font-semibold w-full text-sm p-4 inline-flex items-center justify-center border-slate-300 bg-black text-white" onClick={addtobag}>
                                            <ShoppingCart className='mr-4' />
                                            <span>{isInBagList ? "GO TO BAG":"ADD TO CART"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                        <Carousel
                            ref={carouselRef}
                            showThumbs={false}
                            showStatus={false}
                            showArrows={false}
                            showIndicators={true}
                            swipeable={true}
                            emulateTouch
                            infiniteLoop
                            preventMovementUntilSwipeScrollTolerance
                            renderIndicator={(onClickHandler, isSelected, index, label) =>
                                indicator(onClickHandler, isSelected, index, label)
                            }
                        >
                            {selectedSizeColorImageArray &&
                                selectedSizeColorImageArray.length > 0 &&
                                selectedSizeColorImageArray.map((im, i) => (
                                    <div key={i}>
                                        {im.url ? (
                                        // Check if the file is a video (based on file extension)
                                        im.url.endsWith(".mp4") || im.url.endsWith(".mov") || im.url.endsWith(".avi") ? (
                                            <div className="relative">
                                                <ReactPlayer
                                                    className="w-full h-full object-contain"
                                                    url={im.url}
                                                    loop={true}
                                                    muted={true}
                                                    controls={false}
                                                    playing = {true}
                                                    loading="lazy"
                                                    width="100%"
                                                    height="100%"
                                                />
                                                <div className="h-[30px] bg-neutral-100"></div>
                                            </div>
                                        ) : (
                                            // Render image using LazyLoadImage
                                            <div className="relative">
                                                <LazyLoadImage
                                                    effect="blur"
                                                    src={im.url}
                                                    alt={`product ${i}`}
                                                    loading="lazy"
                                                    className="w-full h-full object-contain"
                                                />
                                                <div className="h-[30px] bg-white"></div>
                                            </div>
                                        )
                                        ) : (
                                            // Fallback if there's no URL, display a fallback message or content
                                            <div>No media found</div>
                                        )}
                                    </div>
                                ))}
                        </Carousel>
                        <div className="bg-white p-4">
                            <div className="border-b border-gray-300 pb-6 pt-4">
                                <h1 className="font1 text-xl font-semibold text-slate-800">
                                    {capitalizeFirstLetterOfEachWord(product?.title)}
                                </h1>
                                <h1 className="text-xl text-gray-500 font-light">
                                    {capitalizeFirstLetterOfEachWord(product?.gender)}
                                </h1>
                            </div>
                            
                            <div className="border-b border-gray-600 pb-2 pt-2 bg-white">
                                <h1 className="font1 text-lg font-semibold text-slate-800">
                                    <span className="mr-4 font-bold">
                                        ₹ {Math.round(product?.salePrice && product?.salePrice > 0 ? product?.salePrice : product?.price)}
                                    </span>
                                    {product?.salePrice && product?.salePrice > 0 && (
                                        <Fragment>
                                            <span className="line-through mr-4 text-slate-500 font-light">
                                                ₹ {product?.price}
                                            </span>
                                            <span className="text-gray-700">
                                                {calculateDiscountPercentage(product.price,product.salePrice)} % OFF
                                                {/* ( {Math.round((product.salePrice / product.price) * 100 - 100)}% OFF) */}
                                            </span>
                                        </Fragment>
                                    )}
                                </h1>
                                <h1 className="text-[#0db7af] font-semibold text-sm mt-1">
                                    inclusive of all taxes
                                </h1>
                                <h1 className="font1 text-base font-semibold mt-2 mb-2">SELECT SIZE</h1>
                                <div className='w-full flex flex-col justify-start items-center mt-3 py-5 mx-auto'>
                                    {/* Size Selection */}
                                    <div className="w-full flex flex-wrap justify-start items-center max-h-fit space-x-4 sm:space-x-5">
                                    {product && product.size && product.size.length > 0 && product.size.map((size, index) => (
                                        <div key={`size_${index}_${size._id}`} 
                                            className={`flex relative flex-col items-center justify-center rounded-full p-2 font-bold shadow-md gap-2 transition-transform duration-300 border-[1px] border-gray-400 ease-in-out 
                                            ${currentSize?._id === size?._id ? " bg-gray-600 text-white scale-110" : "bg-slate-100 border-2 text-black"}`}
                                            onClick={() => { handleSetNewImageArray(size); }}
                                        >
                                            <button className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                                                {size.label}
                                            </button>
                                            {size?.quantity <= 0 && (
                                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                                                        {/* Diagonal Line 1 */}
                                                        <div className="absolute w-[5px] h-[50px] bg-red-900 transform rotate-45"></div>
                                                        {/* Diagonal Line 2 */}
                                                        <div className="absolute w-[5px] h-[50px] bg-red-900 transform -rotate-45"></div>
                                                    </div>
                                                {/* <div className="absolute bottom-7 w-22 h-fit flex-row rounded-full px-3 flex items-center justify-center bg-red-500 text-white font-semibold text-[10px] text-center">
                                                <span className='w-full flex justify-center flex-row'>Out of Stock</span>
                                                </div> */}
                                            </div>
                                            )}
                                        </div>
                                    ))}
                                    </div>

                                    {/* Color Selection */}
                                    <div className="w-full flex flex-wrap justify-start items-center max-h-fit mt-5 gap-1">
                                    {selectedColor && selectedColor.length > 0 ? (
                                        selectedColor.map((color, i) => (
                                        <div key={`color_${i}`} 
                                            className={`flex relative flex-col p-1 items-center justify-center transition-transform duration-300 ease-in-out 
                                                ${color.quantity <= 10 ? "h-fit w-14" : "h-fit w-fit"}`}
                                            onClick={(e) => { setCurrentColor(color); handleSetColorImages(color); }}>
                                            <button disabled={color.quantity <= 0} 
                                                style={{ backgroundColor: color?.label || color._id, width: "40px", height: "40px" }} 
                                                className={`${color.quantity <= 0 ? 
                                                    `w-8 h-8 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out bg-slate-500` :
                                                    `w-8 h-8 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out p-1
                                                    ${currentColor?._id === color?._id ? "outline-offset-1 outline-1 border-[3px] border-slate-900 shadow-md scale-110" : "scale-100 border-separate border-2 border-solid border-slate-300"}`}`}
                                                title={color?.quantity || color?.label || "Color"} 
                                                />
                                                {color?.quantity <= 0 && (
                                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                                        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                                                            {/* Diagonal Line 1 */}
                                                            <div className="absolute w-[5px] h-[40px] bg-red-900 transform rotate-45"></div>
                                                            {/* Diagonal Line 2 */}
                                                            <div className="absolute w-[5px] h-[40px] bg-red-900 transform -rotate-45"></div>
                                                        </div>
                                                    {/* <div className="absolute bottom-7 w-22 h-fit flex-row rounded-full px-3 flex items-center justify-center bg-red-500 text-white font-semibold text-[10px] text-center">
                                                    <span className='w-full flex justify-center flex-row'>Out of Stock</span>
                                                    </div> */}
                                                </div>
                                                )}
                                        </div>
                                        ))
                                    ) : (
                                        <p className="text-black">No colors available</p>
                                    )}
                                    </div>
                                </div>
                            </div>
                            <PincodeChecker productId={product?._id}/>
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
                            <div className='mt-2 pb-6 pt-4 relative bg-white px-4'>
                                <h1 className='font1 flex items-center mt-2 font-semibold'>More Information</h1>
                                <li className='list-none mt-2'>Product Code:&nbsp;{product?.style_no?.toUpperCase()}</li>
                                <li className='list-none mt-2'>Seller:&nbsp;<span className='text-[#F72C5B] font-bold'>{capitalizeFirstLetterOfEachWord(product?.brand).toUpperCase() || "No Brand"}</span></li>
                            </div>
                            <div className='h-fit w-full justify-center items-center flex flex-col space-y-5'>
                                <button className="font1 font-semibold w-full text-sm p-4 inline-flex items-center justify-center bg-gray-900 text-white rounded-md" onClick={handleBuyNow}><ShoppingBag className='mr-4' /><span>BUY NOW</span></button>
                            </div>
                            <div ref={divRef} className={`flex-row justify-center items-center flex w-full`}>
                                <div className={`grid grid-cols-12 w-full font1 relative z-10 ${scrollAmount > maxScrollAmount? "block":"hidden"}`}>
                                    <div className="col-span-2 flex justify-center items-center p-1">
                                        <button className="bg-gray-100 text-center w-full h-full border-[1px] border-opacity-50 flex justify-center items-center border-gray-400 text-black" onClick={addToWishList}>
                                            {
                                                loadingWishList ? <Fragment>
                                                    <p>U</p>
                                                </Fragment>:(
                                                    <Fragment>
                                                    {
                                                        isInWishList ? <div className="text-red-500 animate-shine p-1 rounded-full">
                                                            <Heart size={30} strokeWidth={0} fill="red" className="text-red-500" />
                                                        </div>: <Heart size={30}/>
                                                    }
                                                    </Fragment>    
                                                )
                                            }
                                        </button>
                                    </div>
                                    <div className="col-span-10 text-lg flex justify-center text-center p-1" >
                                        <button className="font1 font-semibold w-full text-sm p-4 inline-flex items-center justify-center border-slate-300 bg-black text-white" onClick={addtobag}>
                                            <ShoppingCart className='mr-4' size={30}/>
                                            <span>{isInBagList ? "GO TO BAG":"ADD TO CART"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full px-4 md:px-2'>
                                {/* Reviews Section */}
                                <div className='reviews-section'>
                                    <h3 className='text-xl md:text-lg font-semibold mt-4 text-center md:text-left'>All Reviews</h3>
                                    <div className='reviews-list mt-4 overflow-y-auto h-72'>
                                        <div className='reviews-list mt-4 overflow-y-auto'>
                                            {product && product.Rating && product.Rating.length > 0 ? <ProductReviews reviews={/* product.Rating */reviews}/> : <ProductReviews reviews={reviews}/>}
                                        </div>
                                    </div>
                                    {hasPurchased && <Fragment>
                                        {/* Review Input Section */}
                                        <div className='w-full flex flex-col justify-start items-center'>
                                            <div className='mt-6 w-full max-w-3xl'>
                                                <h4 className='text-xl md:text-lg font-semibold text-center md:text-left'>Write a Review</h4>

                                                <form className='mt-4'>
                                                    {/* Review Text Input */}
                                                    <div className='mb-4'>
                                                        <label htmlFor='reviewText' className='block text-sm font-semibold text-gray-700'>Review Text:</label>
                                                        <textarea
                                                            onChange={(e) => setRatingData({...ratingData,comment:e.target.value})}
                                                            id='reviewText'
                                                            name='reviewText'
                                                            rows='4'
                                                            placeholder='Write your review here...'
                                                            className='mt-2 p-3 w-full border border-gray-300 rounded-md'
                                                        />
                                                    </div>

                                                    {/* Star Rating Input */}
                                                    <div className='mb-4'>
                                                        <label htmlFor='starRating' className='block text-sm font-semibold text-gray-700'>Rating:</label>
                                                        <input
                                                            onChange={(e)=> setRatingData({...ratingData,rating:e.target.value})}
                                                            id='starRating'
                                                            name='starRating'
                                                            type='number'
                                                            min='1'
                                                            max='5'
                                                            className='mt-2 p-3 w-full border border-gray-300 rounded-md'
                                                            placeholder='Rate from 1 to 5'
                                                        />
                                                    </div>

                                                    {/* Submit Button */}
                                                    <div className='flex justify-start'>
                                                        <button
                                                            onClick={PostRating}
                                                            className='bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors'
                                                        >
                                                            Submit Review
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </Fragment>}
                                </div>
                                </div>
                                {
                                    similar && similar.length > 0 && similar.filter(s => s?._id !== product?._id).length > 0 && <div className="mt-2 pb-6 pt-4 relative bg-white px-4">
                                        <h1 className="font1 flex items-center mt-4 font-semibold px-1 py-2">SIMILAR PRODUCTS</h1>
                                        <div className="overflow-x-auto">
                                            <ul className="flex space-x-4 py-2 sm:space-x-6 md:space-x-8 lg:space-x-10">
                                                {similar.map((pro) => (
                                                    <li key={pro._id} className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[250px] lg:w-[300px]">
                                                    <Single_product pro={pro} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                }
                                
                        </div>
                        <Footer />
                    </div>
                ) : (
                    <Loader />
                )}
            </div>
        </Fragment>
    );
};
const ProductReviews = ({ reviews }) => {
  const [showMore, setShowMore] = useState(false); // State to toggle the visibility of more reviews

  const handleToggleReviews = () => {
    setShowMore(!showMore); // Toggle the state between true/false
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Product Reviews</h2>

      <div
        className={`overflow-y-auto max-h-[400px]`} // Making the review container scrollable
      >
        {/* Display only the first 3 reviews or more based on showMore */}
        {reviews.slice(0, 3).map((review, index) => {
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

        {/* "View More" / "Show Less" Toggle Button */}
        <button
          onClick={handleToggleReviews}
          className="mt-4 text-blue-500 hover:underline"
        >
          {showMore ? 'Show Less' : 'View More'}
        </button>
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

export default MPpage;



