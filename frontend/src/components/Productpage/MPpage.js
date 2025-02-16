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
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, clothingSizeChartData, formattedSalePrice, getLocalStorageBag, getLocalStorageWishListItem } from '../../config';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PincodeChecker from './PincodeChecker';
import ReactPlayer from 'react-player';
import { ArrowDownCircle, Bus, Clock, Heart, RotateCw, ShoppingBag, ShoppingCart, Truck } from 'lucide-react';

import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import StarRatingInput from './StarRatingInput';
import SizeChartModal from './SizeChartModal';
import MShareView from './MShareView';
import { ImFacebook, ImGoogle, ImInstagram, ImTwitter } from 'react-icons/im';
import BackToTopButton from '../Home/BackToTopButton';
import { IoIosCopy, IoIosRibbon, IoLogoWhatsapp } from 'react-icons/io';
import { RiSecurePaymentFill } from "react-icons/ri";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
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
    const {checkAndCreateToast} = useSettingsContext();


    const[isPostingReview,setIsPostingReview] = useState(false);
    const [isInWishList, setIsInWishList] = useState(false);
    const [isInBagList, setIsInBagList] = useState(false);
    const [currentColor, setCurrentColor] = useState(null);
    const [currentSize, setCurrentSize] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState([]);
    const[hasPurchased, setHasPurchased] = useState(false);
    const [selectedSizeColorImageArray, setSelectedSizeColorImageArray] = useState([]);
    const[ratingData,setRatingData] = useState(null);
    const [isInViewport, setIsInViewport] = useState(false);
    const [scrollAmount, setScrollAmount] = useState(0);  // To hold the scroll amount


    const divRef = useRef(null);
    const scrollContainerRef = useRef(null);
    
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

    const addToBag = async () => {
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
        if(currentSize.quantity <= 0){
            checkAndCreateToast("error", "Size Out of Stock");
            return;
        }
        if(currentColor.quantity <= 0){
            checkAndCreateToast("error", "Color Out of Stock");
            return;
        }
        if (user) {
            const orderData = {
                userId: user.id,
                productId: param.id,
                quantity: 1,
                color: currentColor,
                size: currentSize,
				isChecked:true,
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
				isChecked:true,
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
        setCurrentColor(null);
    };

    const handleSetColorImages = (color) => {
        setSelectedSizeColorImageArray(color.images);
    };
	const getProductURL = () => {
		return window.location.href; // Gets the current URL of the page
	};
	// Method to generate the WhatsApp share link
	const generateWhatsAppLink = (url) => {
		const encodedUrl = encodeURIComponent(url); // Encode the URL to make it URL-safe
		return `https://wa.me/?text=Check%20out%20this%20product!%20${encodedUrl}`;
	};

	// Method to handle the sharing
	const handleShare = () => {
		const productURL = getProductURL(); // Get the active page URL
		const shareLink = generateWhatsAppLink(productURL); // Generate the WhatsApp sharing URL
		// Open the WhatsApp share link in a new window or tab
		window.open(shareLink, "_blank");
	};

	const getCopyUrl = () => {
		const productURL = getProductURL(); // Get the active page URL
		const shareLink = generateWhatsAppLink(productURL); // Generate the WhatsApp sharing URL
		return shareLink;
	};

	// Handle button click for different share types
	const HandleOnShareTypeButtonClick = (type) => {
		switch (type) {
		case "whatsApp":
			handleShare();
			checkAndCreateToast("success", "Sharing The Product On Whatsapp!");
			break;
		case "copyUrl":
			navigator.clipboard.writeText(window.location.href);
			checkAndCreateToast("success", "Link Copied to Clipboard!");
			break;
		}
	};
    const PostRating = async (e)=>{
        e.preventDefault();
        try {
            if(ratingData && user && product){
                setIsPostingReview(true);
                await dispatch(postRating({productId:product?._id, ratingData}))
                await dispatch(singleProduct(param.id))
                checkAndCreateToast("success","Rating Posted Successfully");
            }
        } catch (error) {
            console.error("An error occurred while setting the Rating",error);
            checkAndCreateToast("error","An error occurred while setting the Rating");
        }finally{
            setIsPostingReview(false);
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
            
            <div ref={scrollContainerRef} className="w-screen font-kumbsan h-screen overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300">

                {loading === false ? (
                    <div>
                        {
                            scrollAmount < maxScrollAmount  && <div className={`mobilevisible fixed bottom-0 w-full z-20 hidden`}>
                                <div className='grid grid-cols-12 w-full bg-white border-t-[0.5px] border-slate-200 relative z-10'>
                                    <div className="col-span-2 flex justify-center items-center p-1">
                                        <button className="bg-gray-100 text-center w-full h-full border-[1px] border-opacity-50 flex justify-center items-center border-gray-400 text-black" onClick={addToWishList}>
                                            {
                                                loadingWishList ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>:<Fragment>
                                                    {isInWishList ? 
                                                        (
                                                            <div className="text-red-500 animate-shine p-1 rounded-full">
                                                                <Heart size={30} strokeWidth={0} fill="red" className="text-red-500" />
                                                            </div>
                                                        ) : (
                                                            <Heart size={30}/>
                                                        )
                                                    }
                                                </Fragment>
                                            }
                                            
                                        </button>
                                    </div>
                                    <div className="col-span-10 text-lg flex justify-center text-center p-1" >
                                        <button className=" font-semibold w-full text-sm p-4 inline-flex items-center justify-center border-white bg-black text-white" onClick={addToBag}>
                                            {
                                                bagLoading? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-gray-500 rounded-full animate-spin "></div>:<Fragment>
                                                    <ShoppingCart className='mr-4' />
                                                    <span>{isInBagList ? "GO TO BAG":"ADD TO CART"}</span>
                                                </Fragment>
                                            }
                                            
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
												{/* <MShareView/> */}
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
                                                {/* <div className="h-[30px] bg-white"></div> */}
                                            </div>
                                        ) : (
                                            // Render image using LazyLoadImage
                                            <div className="relative">
												
                                                <LazyLoadImage
                                                    effect="blur"
                                                    src={im.url}
                                                    alt={`product_${i}`}
                                                    loading="lazy"
                                                    className="w-full h-full object-contain"
                                                />
                                                {/* <div className="h-[30px] bg-white"></div> */}
												{/* <MShareView/> */}
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
                                <h1 className=" text-xl font-semibold text-slate-800">
                                    {capitalizeFirstLetterOfEachWord(product?.title)}
                                </h1>
                                <h1 className="text-xl text-gray-500 font-light">
                                    {capitalizeFirstLetterOfEachWord(product?.gender)}
                                </h1>
                            </div>
                            
                            <div className="border-b border-gray-600 pb-2 pt-2 bg-white">
                                <h1 className=" text-lg font-semibold text-slate-800">
                                    <span className="mr-4 font-bold">
                                        ₹ {formattedSalePrice(product?.salePrice && product?.salePrice > 0 ? product?.salePrice : product?.price)}
                                    </span>
                                    {product?.salePrice && product?.salePrice > 0 && (
                                        <Fragment>
                                            <span className="line-through mr-4 text-slate-500 font-light">
                                                ₹ {formattedSalePrice(product?.price)}
                                            </span>
                                            <span className="text-gray-700">
                                                {calculateDiscountPercentage(product.price,product.salePrice)} % OFF
                                                {/* ( {Math.round((product.salePrice / product.price) * 100 - 100)}% OFF) */}
                                            </span>
                                        </Fragment>
                                    )}
                                </h1>
                                <h1 className="text-green-800 font-semibold text-sm mt-1">
                                    inclusive all taxes.
                                </h1>
								<div className='w-full flex flex-col justify-start items-center mt-1 py-5 space-y-3 mx-auto'>
                                    <div className='w-full flex justify-between items-center'>
                                        <h3 className='text-sm text-left'>Selected Size: <span className='font-normal'>{currentSize?.label}</span>
                                        </h3>
                                        <SizeChartModal sizeChartData={clothingSizeChartData} />
                                    </div>
                                    <div className="w-full flex flex-wrap gap-4 justify-start items-start">
                                        {product && product.size && product.size.length > 0 && product.size.map((size, index) => {
                                            const active = size;
                                            return(
                                                <div key={`size_${index}_${active._id}`}>
                                                    <div
                                                        style={{pointerEvents:active.quantity <= 0 ? 'none':'all'}}
                                                        className={`flex relative flex-col w-fit h-fit items-center justify-center rounded-full font-bold shadow-md gap-2 transition-all duration-500 border-[1px] border-gray-400 ease-in-out 
                                                        ${currentSize?._id === active?._id ? " bg-black text-white" : "bg-slate-100 border-2 text-black"}`}
                                                        onClick={() => { handleSetNewImageArray(active); }}
                                                    >
                                                        {
                                                            active.quantity <= 0 && <div className='w-full h-full place-self-center justify-self-center rounded-full absolute inset-0 z-[2px] bg-gray-700 bg-opacity-40'></div>
                                                        }
                                                        <button disabled={active.quantity <= 0} className={`w-10 h-10 p-1 rounded-full flex relative items-center justify-center`}>
                                                            <span className='text-base font-medium'>{active.label}</span>
                                                        </button>
                                                        {active?.quantity <= 0 && (
                                                            <div className="absolute bottom-[-10px] w-[30%] z-[4px] h-6 flex justify-center items-center pb-1">
                                                                <div className="text-white w-20 justify-center flex text-[10px] bg-red-600 rounded-lg shadow-lg px-1 whitespace-nowrap">
                                                                    <span>Out of Stock</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className='w-full flex flex-col justify-start items-center mt-3 py-5 space-y-3 mx-auto'>
                                    <div className='w-full justify-start items-start flex'><h3 className='text-sm text-left'>Selected Color: <span className='font-normal'>{currentColor?.name}</span></h3></div>
                                    <div className="w-full flex flex-wrap gap-4 justify-start items-start">
                                        {selectedColor && selectedColor.length > 0 && selectedColor.map((color, index) => {
                                            const active = color;
                                            return(
                                                <div key={`color_${index}_${active._id}`} className='w-fit h-fit'>
                                                    <div
                                                        style={{pointerEvents:active.quantity <= 0 ? 'none':'all'}}
                                                        className={`flex relative flex-col w-full h-full items-center justify-center rounded-full font-bold shadow-md transition-all duration-500 border-[1px] border-gray-400 ease-in-out 
                                                        ${currentColor?._id === active?._id ? "text-white" : "bg-slate-100 border-2 text-black"}`}
                                                        onClick={() => { setCurrentColor(active); handleSetColorImages(active); }}
                                                    >
                                                        {
                                                            active.quantity <= 0 && <div className='w-full h-full place-self-center justify-self-center rounded-full absolute inset-0 bg-gray-700 z-10 bg-opacity-40'></div>
                                                        }
                                                        <button disabled={active.quantity <= 0} className={`w-[40px] h-[40px] relative rounded-full flex ${currentColor?._id === active?._id ? "p-1":""} items-center justify-center`}>
                                                            <div style={{ backgroundColor: active?.label || active._id}} className='w-full h-full rounded-full'></div>
                                                        </button>
                                                        {active?.quantity <= 0 && (
                                                            <div className="absolute bottom-[-10px] w-[30%] z-[4px] h-6 flex justify-center items-center pb-1">
                                                                <div className="text-white w-20 justify-center flex text-[10px] bg-red-600 rounded-lg shadow-lg px-1 whitespace-nowrap">
                                                                    <span>Out of Stock</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                
                            </div>
                            <PincodeChecker productId={product?._id}/>
                            <div className='mt-2 pt-4 bg-white px-4'>
                                <h1 className=' flex items-center mt-2 font-semibold'>BulletPoints<BsTag className='ml-2' /></h1>
                            </div>
                            <div className='mt-2 pb-4 pt-4 bg-white px-4'>
                                {
                                    product && product.bulletPoints && product.bulletPoints.length > 0 && product.bulletPoints.map((e) =>
                                        <Fragment>
                                            <h1 className=' flex items-center mt-2 font-semibold'>{e.header}</h1>
                                            <span className='mt-4'>
                                                <li className='list-disc mt-2'>{e.body}</li>
                                            </span>
                                        </Fragment>
                                    )
                                }
                            </div>
                            {/* <div className='mt-2 pb-6 pt-4 relative bg-white px-4 grid grid-cols-12'>
                            	<div className='col-span-12 md:col-span-3'>
									<div className='absolute bg-[#0db7af]  px-4 py-1 font-semibold text-white text-sm'>OFFER</div>
									<Bus/>
								</div>
								<div className='col-span-12 md:col-span-9 mt-4 md:mt-0'>
									<h1 className='text-sm  font-semibold'>RETURN WITH IN 45 DAYS</h1>
								</div>
                            </div>

                            <div className='mt-2 pb-6 pt-4 relative bg-white px-4 grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 gap-4'>
								<div className="col-span-1 text-center text-xs text-slate-700">
									<IoShieldCheckmarkSharp color='black' size={75} className='w-[75px] mx-auto'/>
									Genuine Products
								</div>
								<div className="col-span-1 text-center text-xs text-slate-700">
									<IoIosRibbon color='black' size={75} className='w-[75px] mx-auto'/>
									7 step Quality Check
								</div>
								<div className="col-span-1 text-center text-xs text-slate-700">
									<RiSecurePaymentFill color='black' size={75} className='w-[75px] mx-auto'  />
									Secure Payments
								</div>
                            </div> */}

                            <div className='mt-2 pb-6 pt-4 relative bg-white px-4'>
                            <h1 className=' flex items-center mt-2 font-semibold'>More Information</h1>
                            <li className='list-none mt-2'>Product Code:&nbsp;{product?.productId}</li>
                            <li className='list-none mt-2'>Seller:&nbsp;<span className='text-[#1e1e1e] font-bold'>{capitalizeFirstLetterOfEachWord(product?.brand).toUpperCase() || ""}</span></li>
                            </div>

                            <div className='h-full w-full justify-center items-center flex flex-col space-y-5'>
                                <button className=" font-semibold w-full text-sm p-4 inline-flex items-center justify-center bg-gray-900 text-white rounded-md" onClick={handleBuyNow}>
                                    <ShoppingBag className='mr-4' /><span>BUY NOW</span>
                                </button>
                            </div>

                            <div ref={divRef} className={`flex-row justify-center items-center flex w-full`}>
                                <div className={`grid grid-cols-12 w-full  relative z-10 ${scrollAmount > maxScrollAmount? "block":"hidden"}`}>
                                    <div className="col-span-2 flex justify-center items-center p-1">
                                        <button className="bg-gray-50 text-center w-full h-full border-[1px] border-opacity-50 flex justify-center items-center border-gray-400 text-black" onClick={addToWishList}>
                                            {
                                                loadingWishList ? <Fragment>
                                                    <div className="w-full h-full border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
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
                                        <button className=" font-semibold w-full text-sm p-4 inline-flex items-center justify-center border-slate-300 bg-black text-white" onClick={addToBag}>
                                            {
                                                bagLoading ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>:<Fragment>
                                                    <ShoppingCart className='mr-4' size={30}/>
                                                    <span>{isInBagList ? "GO TO BAG":"ADD TO CART"}</span>
                                                </Fragment>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex mt-4'>
                                <div className='w-fit space-x-2 justify-center flex flex-row items-center'>
                                    <h1 className="text-gray-500 transition duration-300 text-xl">Share: </h1>
                                    <div
										onClick={() => HandleOnShareTypeButtonClick("whatsApp")}
                                        className="text-gray-700 bg-white shadow-md rounded-full p-3 hover:text-blue-600 transition duration-300 text-xl"
                                    >
                                        <IoLogoWhatsapp />
                                    </div>
                                    <div
										onClick={() => HandleOnShareTypeButtonClick("copyUrl")}
                                        className="text-gray-700 bg-white shadow-md rounded-full p-3 hover:text-red-600 transition duration-300 text-xl"
                                    >
                                    	<IoIosCopy />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col space-y-4 mt-4">
								{
									product && product?.delivaryPoints && product?.delivaryPoints.length > 0 && product?.delivaryPoints.map((point,index)=>{
										return(
											<div key={`point_${index}`} className="w-full flex flex-row items-center space-x-2 text-xs text-left justify-start">
												<h1 className="text-gray-500">• {/* Bullet symbol */}</h1>
												<h1 className="text-gray-500">{point}</h1>
											</div>
										)
									})
								}
                            </div>

                            <div className='w-full px-4 md:px-2'>
                                {/* Reviews Section */}
                                <div className='reviews-section'>
                                    <h3 className='text-xl md:text-lg font-semibold mt-4 text-center md:text-left'>All Reviews</h3>
                                    <div className='reviews-list mt-4 overflow-y-auto h-72'>
                                        <div className='reviews-list mt-4 overflow-y-auto'>
                                            {product && product.Rating && product.Rating.length > 0 ? <ProductReviews reviews={product.Rating}/> : <ProductReviews reviews={reviews}/>}
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
                                                        <StarRatingInput onChangeValue={(value) =>{
                                                            setRatingData({...ratingData,rating:value})
                                                        }}/>
                                                    </div>

                                                    {/* Submit Button */}
                                                    <div className='flex justify-start'>
                                                        <button
                                                            disabled = {isPostingReview}
                                                            onClick={PostRating}
                                                            className='bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors'
                                                        >
                                                            {
                                                                isPostingReview ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>:<span>Submit Review</span>
                                                            }
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </Fragment>}
                                </div>
                                </div>
                                {
                                    similar && similar.length > 0 && <div className="mt-2 mb-7 pb-6 pt-4 relative bg-white px-4">
                                        <div className='w-full justify-center items-center flex px-1 py-2'>
                                            <h1 className=" flex text-center mt-4 font-semibold">SIMILAR PRODUCTS</h1>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <ul className="flex space-x-4 py-2 sm:space-x-6 md:space-x-8 lg:space-x-10">
                                            {similar.map((pro) => (
                                                    <li key={pro._id} className="flex-shrink-0 w-[200px] sm:w-[200px] md:w-[250px] lg:w-[300px]">
                                                        <Single_product pro={pro} refreshTwice ={true}/>
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
				<BackToTopButton scrollableDivRef={scrollContainerRef} />
            </div>
        </Fragment>
    );
};
/* const CustomSlider = styled(Slider)({
    '& .MuiSlider-thumb': {
        backgroundColor: '#4CAF50', // Green thumb color
        border: '3px solid #388E3C', // Darker green border for the thumb
        '&:hover': {
            backgroundColor: '#81C784', // Lighter green on hover
            border: '3px solid #66BB6A', // Lighter green border on hover
        },
        '&:focus': {
            boxShadow: '0 0 0 0.3rem rgba(0, 128, 0, 0.25)', // Green shadow on focus
        },
    },
    '& .MuiSlider-rail': {
        backgroundColor: '#D1C4E9', // Light purple rail color
    },
    '& .MuiSlider-track': {
        backgroundColor: '#3F51B5', // Blue track color
    },
    '& .MuiSlider-valueLabel': {
        backgroundColor: '#3F51B5', // Blue background for the value label
        color: '#FFF', // White text for the value label
        fontWeight: 'bold', // Make the value label text bold
    },
    // Optional: Add a gradient effect to the slider's track and rail
    '& .MuiSlider-rail, & .MuiSlider-track': {
        background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)', // Gradient from blue to green
    },
}); */

const ProductReviews = ({ reviews }) => {
  const [showMore, setShowMore] = useState(false); // State to toggle the visibility of more reviews

  const handleToggleReviews = () => {
    setShowMore(!showMore); // Toggle the state between true/false
  };

  return (
    <div>
      <h2 className="text-xl font-kumbsan font-bold mb-4">Product Reviews</h2>
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
                                    <span key={i} className="star text-black hover:-translate-y-2 duration-300 ease-in-out transition-all">★</span>
                                ))}
                                {[...Array(5 - randomStars)].map((_, i) => (
                                    <span key={i} className="star text-gray-300 hover:-translate-y-2 duration-300 ease-in-out transition-all">★</span>
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-500 hover:-translate-y-2 duration-300 ease-in-out transition-all">{randomStars} Stars</span>
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
            <div className='average-rating font-kumbsan mt-6'>
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



