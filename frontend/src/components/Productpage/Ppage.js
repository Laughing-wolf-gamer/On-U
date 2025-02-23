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
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, clothingSizeChartData, formattedSalePrice, getLocalStorageBag} from '../../config'
import ImageZoom from './ImageZoom'
import PincodeChecker from './PincodeChecker'
import ReactPlayer from 'react-player';
import { Clock, Heart, RotateCw, ShoppingBag, ShoppingCart, Truck} from 'lucide-react'
import SizeChartModal from './SizeChartModal'
import { useSessionStorage } from '../../Contaxt/SessionStorageContext'
import { useSettingsContext } from '../../Contaxt/SettingsContext'
import toast from 'react-hot-toast'
import StarRatingInput from './StarRatingInput'
import BackToTopButton from '../Home/BackToTopButton'
import { IoIosCopy, IoLogoWhatsapp } from 'react-icons/io'
import WhatsAppButton from '../Home/WhatsAppButton'
import styled from '@emotion/styled'

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

const maxScrollAmount = 1272,maxScrollWithReviewInput = 1500, LargeScreenSize = 916.7999877929688
const Ppage = () => {
    const { sessionData,sessionBagData, setWishListProductInfo,setSessionStorageBagListItem } = useSessionStorage();
    const[currentMaxScrollAmount,setCurrentMaxScrollAmount] = useState(maxScrollAmount);

    const [isInWishList, setIsInWishList] = useState(false);
    const [isInBagList, setIsInBagList] = useState(false);
    const {checkAndCreateToast} = useSettingsContext();
    const navigation = useNavigate();
    const param = useParams()
    const dispatch = useDispatch()
    
    const [isFocused, setIsFocused] = useState(false);
    const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const { product, loading:productLoading, similar } = useSelector(state => state.Sproduct)
    const {user} = useSelector(state => state.user)
    const {error:warning} = useSelector(state => state.wishlist)
    
    

    
    const[isPostingReview,setIsPostingReview] = useState(false);
    const[selectedSize, setSelectedSize] = useState(null);
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
            const response = await dispatch(createbag(orderData));
            if(response){
                // await dispatch(getwishlist());
                dispatch(getbag({ userId: user.id }));
                checkAndCreateToast("success", "Product successfully in Bag");
            }else{
                checkAndCreateToast("error", "Product Failed to add in bag");
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
				isChecked:true,
            };
            setSessionStorageBagListItem(orderData, param.id);
            checkAndCreateToast("success", "Product successfully in Bag");
        }
        updateButtonStates();
    };
    const updateButtonStates = () => {
        if (user) {
            // console.log("Updateing wishList: ",wishlist);
            setIsInWishList(wishlist?.orderItems?.some(w => w.productId?._id === product?._id));
			const similarProductsInBag = bag?.orderItems?.filter(item => item.productId?._id === product?._id);
            let isBag = false;

            // If there are similar products in the bag
            if (similarProductsInBag?.length > 0) {
                // If current size and color are provided, find the matching product
                if (currentSize && currentColor) {
                    const matchingItem = similarProductsInBag.find(item => 
                        item.color?._id === currentColor?._id && item.size?._id === currentSize?._id
                    );
                    // If matching item found, check its isChecked property
                    if (matchingItem) {
                        isBag = matchingItem.isChecked;
                    }
                } else {
                    // If no size or color is selected, check if any similar product is checked
                    isBag = similarProductsInBag.some(item => item.isChecked);
                }
            }

            // Set the result in state
            setIsInBagList(isBag);

        } else {
            setIsInWishList(sessionData.some(b => b.productId?._id === product?._id));
			// Get items from localStorage and filter for the product
            const similarProductsInBag = getLocalStorageBag().filter(item => item.productId === product?._id);
            let isBag = false;

            // Check if there are matching items in the bag
            if (similarProductsInBag?.length > 0) {
                // If current size and color are provided, check for matching items with the size and color
                if (currentSize && currentColor) {
                    const matchingItem = similarProductsInBag.find(item => 
                    item.color?._id === currentColor?._id && item.size?._id === currentSize?._id
                    );
                    // If matching item is found, set isBag based on its 'isChecked' status
                    /* if (matchingItem) {
                        isBag = matchingItem.isChecked;
                    } */
                } /* else {
                    // If no size/color is specified, check if any product is checked
                    isBag = similarProductsInBag.some(item => item.isChecked);
                } */
            }

            // Set the result in the state (i.e., update whether the product is in the bag)
            setIsInBagList(isBag);

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
                checkAndCreateToast("success", "Product successfully in Bag");
            }
            updateButtonStates();
        } catch (error) {
            console.error("Error Adding to Bag: ",error);
            checkAndCreateToast("error","Error adding to Bag");
        }
    }

    

    const PostRating = async (e)=>{
        // console.log("Rating Data: ", ratingData);
        if(ratingData && user && product){
            setIsPostingReview(true);
            try {
                e.preventDefault();
                await dispatch(postRating({productId:product?._id, ratingData}))
                dispatch(singleProduct(param.id))
                toast.success("Your Rating Has been Added");
            } catch (error) {
                checkAndCreateToast("error","Error Posting Rating");
            }finally{
                setIsPostingReview(false);
            }
        }
    }


    const checkFetchedIsPurchased = async ()=>{
        // console.log("Checking: ",product);
        const didPurchased = await dispatch(checkPurchasesProductToRate({productId:product?._id}))
		console.log("Did Purchased: ", didPurchased);
        setHasPurchased(didPurchased?.success || false);
    }

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
        setSelectedColor(newSize.colors);
        setSelectedSize(newSize);
        setCurrentSize(newSize);
        setCurrentColor(null);
		
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
            setSelectedImage(color.images[0]);
        }
        if (selectedSize) {
            setSelectedColor(selectedSize.colors);
            const color = selectedSize.colors[0];
            setSelectedSizeColorImageArray(color.images);
            setSelectedImage(color.images[0]);
        }
        if(product){
            checkFetchedIsPurchased();
        }
        if(user){
            dispatch(getbag({ userId: user.id }));
            dispatch(getwishlist());
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
            setSelectedImage(currentColor.images[0]);
        }
    },[selectedSize])
	useEffect(() => {
		dispatch(singleProduct(param.id));
		if (scrollableDivRef.current) {
			scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, [dispatch, param]);


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
		updateButtonStates();
	},[currentSize,currentColor])
    useEffect(()=>{
        setCurrentMaxScrollAmount(hasPurchased ? maxScrollWithReviewInput:maxScrollAmount);
    },[hasPurchased])
    // console.log("isIn Bag / is In Wishlist",isInBagList,isInWishList,user);
    // console.log("current Scroll Amount: ",scrollPosition);
    
    return (
        <div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto justify-start scrollbar bg-white overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300">
            {
                !productLoading ?
                    <div className='max-w-screen-2xl w-full justify-self-center flex flex-col py-2'>
                        <div className='grid grid-cols-2 gap-1 mt-2 py-4'>
                            <div>
                                {selectedSize_color_Image_Array && selectedSize_color_Image_Array.length > 0 && (
                                    <NewLeftSideImageContent
                                        selectedSize_color_Image_Array={selectedSize_color_Image_Array}
                                        Addclass={Addclass}
                                        setSelectedImage={setSelectedImage}
                                        selectedImage={selectedImage}
                                        isFocused={isFocused}
                                        setIsFocused={setIsFocused}
                                    />
                                )}

                            </div>

                            {/* Right Column: Product Details */}
                            <div className='flex flex-col justify-start h-[900px] px-8'>
                                {/* Product Title and Gender */}
                                <div className='pt-1'>
                                    <h1 className='text-2xl font-semibold text-slate-800'>
                                        {capitalizeFirstLetterOfEachWord(product?.title)}
                                    </h1>
                                    <h1 className='text-xl text-[#808080e8] font-light'>
                                        {capitalizeFirstLetterOfEachWord(product?.gender)}
                                    </h1>
                                    <AverageRatingView ratings={product?.Rating} />
                                </div>

                                {/* Price and Discount */}
                                <div className='border-b-[1px] border-slate-200 pb-6 pt-1'>
                                    <h1 className='text-xl font-semibold text-slate-800'>
                                        <span className="mr-4 font-bold">
                                            ₹ {formattedSalePrice(product?.salePrice > 0 ? product?.salePrice : product?.price)}
                                        </span>
                                        {product?.salePrice > 0 && (
                                            <Fragment>
                                                <span className="line-through mr-4 font-extralight text-slate-500">₹ {formattedSalePrice(product?.price)}</span>
                                                <span className="text-gray-700">{calculateDiscountPercentage(product.price, product.salePrice)} % OFF</span>
                                            </Fragment>
                                        )}
                                    </h1>
                                    <h1 className='text-green-500 font-semibold text-sm mt-1'>
                                        Inclusive All Taxes.
                                    </h1>
                                </div>
								{/* Size and Color Selection */}
                                <div className="w-full flex flex-col py-1 space-y-3 mx-auto">
                                    {/* Size Selection */}
                                    <div className='w-[92%] flex justify-between items-center'>
                                        <h3 className='text-base'>Size: <span className='font-semibold'>{currentSize?.label}</span></h3>
                                        <SizeChartModal sizeChartData={clothingSizeChartData} />
                                    </div>
                                    <div className="w-full flex flex-wrap gap-4 justify-start items-start font-extrabold">
                                        {product && product?.size && product?.size.length > 0 && product?.size.map((size, index) => {
                                            const active = size;
                                            return(
                                                <div key={`size_${index}_${active._id}`} className='w-fit h-fit p-1'>
                                                    <div
                                                        style={{ pointerEvents: active.quantity <= 0 ? 'none' : 'all' }}
                                                        className={`flex flex-col w-14 h-14 items-center relative justify-center rounded-full shadow-md transition-transform duration-300 hover:border-gray-900 ease-in-out border-[1px]
                                                        ${currentSize?._id === active?._id ? "border-2 bg-black text-white" : "bg-gray-200 text-gray-900"}`}
                                                        onClick={() => { handleSetNewImageArray(active); }}
                                                        title={active.quantity >= 0 ? "In Stock " + active?.quantity || active?.label: "out of stock"}
                                                    >
														{
															active.quantity <= 0 && <div className='w-full h-full place-self-center flex flex-col justify-self-center justify-end items-center rounded-full absolute inset-0 bg-gray-700 z-[2px] bg-opacity-40'>
																<div className="text-white w-auto justify-center text-[10px] flex bg-red-600 rounded-lg shadow-lg px-1 whitespace-nowrap">
																	<span>No Stock</span>
																</div>
															</div>
														}
														<button className="w-full h-full rounded-full flex items-center text-base font-extrabold justify-center">
															<span className='m-2'>
																{active.label}
															</span>
														</button>
                                                    </div>

                                                </div>
                                            )
                                        })}
                                    </div>

                                </div>
                                {/* Color Selection */}
                                <div className="w-full flex flex-col mt-2 py-2 space-y-2 mx-auto">
                                    <h3 className='text-base'>Color: <span className='font-semibold'>{currentColor?.name}</span></h3>
                                    <div className="w-full flex flex-wrap gap-2 justify-start items-start font-extrabold">
                                        {selectedColor && selectedColor.length > 0 ? (
                                            selectedColor.map((color, i) => {
                                                const active = color;
                                                return(
                                                    <div  key={`color_${i}`} className='w-fit h-fit p-1'>
                                                        <div
                                                            style={{ pointerEvents: active.quantity <= 0 ? 'none' : 'all' }}
                                                            className={`flex flex-col p-1 items-center h-fit w-fit justify-center transition-transform relative duration-300 ease-in-out`}
                                                            onClick={(e) => {setCurrentColor(active); handelSetColorImages(active);}}
                                                        >
                                                            {
                                                                active.quantity <= 0 && <div className='w-full h-full place-self-center flex flex-col justify-self-center justify-end items-center rounded-full absolute inset-0 bg-gray-600 z-[5] bg-opacity-70'>
																	<div className="text-white w-auto justify-center text-[10px] flex bg-red-600 rounded-lg shadow-lg px-1 whitespace-nowrap">
																		<span>No Stock</span>
																	</div>
																
																</div>
                                                            }
                                                            <button
                                                                disabled={active.quantity <= 0}
                                                                className={`${active.quantity <= 0 ?
                                                                `w-10 h-10 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out bg-gray-600` :
                                                                `w-10 h-10 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out
                                                                ${currentColor?._id === active?._id ? "outline-offset-1 outline-1 border-2 p-1 hover:border-slate-900 shadow-md scale-110" : "scale-100 border-solid border-slate-300"}`}`}
                                                                title={active?.quantity || active?.label || "Color"}
                                                            >
                                                                <div style={{ backgroundColor: active?.label || active._id }} className="w-full h-full rounded-full"></div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <p className="text-black">No colors available</p>
                                        )}
                                    </div>

                                </div>

                                
                                

                                {/* Add to Cart & Wishlist Buttons */}
                                <PincodeChecker productId={product?._id} />
                                <div className='w-full h-fit pr-10 justify-center items-center flex flex-col'>
                                    <div className='grid grid-cols-2 justify-center items-center gap-2 w-full'>
                                        <button
                                            disabled={bagLoading}
                                            className="h-16 font-semibold text-base w-full p-4 inline-flex items-center justify-center border-[1px] bg-gray-800 text-white mt-4 rounded-md hover:border-2 hover:bg-gray-900"
                                            onClick={addToBag}
                                        >
                                            {bagLoading ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div> : (
                                                <Fragment>
                                                    <ShoppingCart size={30} className='m-4' />
                                                    <span>{isInBagList ? "GO TO CART" : "ADD TO CART"}</span>
                                                </Fragment>
                                            )}
                                        </button>
                                        <button
                                            disabled={loadingWishList}
                                            className="h-16 font-semibold text-base w-full p-2 inline-flex items-center justify-center mt-4 rounded-md border-[0.5px] hover:border-[1px] hover:border-gray-900"
                                            onClick={addToWishList}
                                        >
                                            {loadingWishList ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div> : (
                                                <Fragment>
                                                    {isInWishList ? <Heart fill='red' strokeWidth={0} size={30} className='m-4' />:<Heart strokeWidth={2} size={30} className='m-4' />}
                                                    <span>{isInWishList ? "GO TO WISHLIST" : "ADD TO WISHLIST"}</span>
                                                </Fragment>
                                            )}
                                        </button>
                                    </div>
                                    <button
                                        disabled={bagLoading || loadingWishList}
                                        className="h-16 font-semibold text-base w-full p-4 inline-flex items-center justify-center border-[1px] border-slate-300 mt-4 rounded-md hover:border-[1px] hover:border-gray-900"
                                        onClick={handleBuyNow}
                                    >
                                        {bagLoading ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div> : (
                                            <Fragment>
                                                <ShoppingBag size={30} className='m-4' />
                                                <span>BUY NOW</span>
                                            </Fragment>
                                        )}
                                    </button>
                                    <div className='w-full flex mt-4'>
                                        <div className='w-fit justify- space-x-4 justify-center flex flex-row items-center'>
                                            <h1 className="text-gray-500 transition duration-300 text-xl">Share: </h1>
                                            <div
												onClick={() => HandleOnShareTypeButtonClick("whatsApp")}
                                                className="text-gray-700 bg-white shadow-md rounded-full p-3 hover:text-green-600 transition duration-300 text-xl"
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
									<div className="w-full flex flex-col space-y-3 mt-4 text-sm">
										{/* {
											product && product?.delivaryPoints && product?.delivaryPoints.length > 0 && product?.delivaryPoints.map((point,index)=>{
												return(
													<div key={`point_${index}`} className="w-full flex flex-row items-center space-x-2 text-left justify-start">
														<h1 className="text-gray-500">{point}</h1>
													</div>
												)
											})
										} */}
										<div className="w-full flex flex-col space-y-4 mt-4 text-sm">
											<div className="w-full flex flex-row items-center space-x-2 text-left justify-start">
												<h1 className="text-gray-500"><Clock /></h1>
												<h1 className="text-gray-500">Estimated Delivery: 12-26 days (International), 3-6 days</h1>
											</div>

											<div className="w-full flex flex-row items-center space-x-2 justify-start">
												<h1 className="text-gray-500"><RotateCw /></h1>
												<h1 className="text-gray-500">Return within 45 days of purchase. Duties & taxes are non-refundable.</h1>
											</div>

											<div className="w-full flex flex-row items-center space-x-2 justify-start">
												<h1 className="text-gray-500"><Truck /></h1>
												<h1 className="text-gray-500">Estimated Delivery: 12-26 days (International), 3-6 days</h1>
											</div>
										</div>
									</div>
                                </div>
                            </div>
                        </div>
                        {
                            product && <ProductDetails product={product} setRatingData={setRatingData} ratingData={ratingData} isPostingReview={isPostingReview} PostRating={PostRating} />
                        }
                    </div>
                :
                <Loader />
            }
            {
                product&&similar && similar.length > 0 && <div className='w-full justify-center items-center flex flex-col mb-8 2xl:px-0 px-6'>
                    <h1 className='flex items-center justify-center text-center mt-4 font-semibold text-2xl p-8'>SIMILAR PRODUCTS</h1>
                    <div className='w-full flex justify-center items-center'>
                        <ul className='grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-6 gap-12'>
                            {similar.map((pro, index) => (
                                <Single_product key={index} pro={pro} user={user} />
                            ))}
                        </ul>
                    </div>
                </div>
            }
            <Footer/>
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef}/>
        </div>
    )
}
const ProductSkeletonLoader = () => {
    return (
        <div className="flex font-kumbsan flex-row gap-4 mb-6">
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
                            <span key={i} className='star text-[30px] text-black hover:-translate-y-2 cursor-pointer duration-300 ease-in-out transition-transform'>★</span>
                        ))}
                        {/* Render empty stars */}
                        {[...Array(emptyStars)].map((_, i) => (
                            <span key={i} className='star text-[30px] text-gray-300 hover:-translate-y-2 cursor-pointer duration-300 ease-in-out transition-transform'>★</span>
                        ))}
                    </div>
                    <span className='ml-2 text-sm text-gray-500 hover:-translate-y-2 duration-300 cursor-pointer ease-in-out transition-transform'>{roundedAvg} Stars</span>
                </div>
            </div>
        </Fragment>
    );
};


const ProductDetails = ({ product ,ratingData,setRatingData,isPostingReview,PostRating,hasPurchased}) => {
    // State to manage selected tab
    const [selectedTab, setSelectedTab] = useState('details');

    // Tab change handler
    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="w-full flex flex-col px-4 py-6 justify-center items-center">
            {/* Tabs */}
            <div className="w-full flex justify-center items-center mb-6 border-b-2 border-gray-300 space-x-4">
                <button
                    onClick={() => handleTabChange('details')}
                    className={`px-6 py-2 font-semibold text-lg transition-all duration-300 hover:text-gray-500 ${selectedTab === 'details' ? 'border-b-4 border-gray-500 text-gray-600' : 'text-gray-600'}`}
                >
                    Product Details
                </button>
                <button
                    onClick={() => handleTabChange('reviews')}
                    className={`px-6 py-2 font-semibold text-lg transition-all duration-300 hover:text-gray-500 ${selectedTab === 'reviews' ? 'border-b-4 border-gray-500 text-gray-600' : 'text-gray-600'}`}
                >
                    Reviews
                </button>
                <button
                    onClick={() => handleTabChange('material')}
                    className={`px-6 py-2 font-semibold text-lg transition-all duration-300 hover:text-gray-500 ${selectedTab === 'material' ? 'border-b-4 border-gray-500 text-gray-600' : 'text-gray-600'}`}
                >
                    Material & Care
                </button>
                <button
                    onClick={() => handleTabChange('specifications')}
                    className={`px-6 py-2 font-semibold text-lg transition-all duration-300 hover:text-gray-500 ${selectedTab === 'specifications' ? 'border-b-4 border-gray-500 text-gray-600' : 'text-gray-600'}`}
                >
                    Specifications
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-w-full flex px-4">
                {/* Product Details Tab */}
                {selectedTab === 'details' && (
                    <div className="w-full space-y-6">
                        <div className="border-b-[1px] border-slate-200 pb-6 pt-4">
                            <h1 className="font-semibold text-xl text-gray-800">
                                Seller: <span className="text-gray-600 font-normal">{capitalizeFirstLetterOfEachWord(product?.brand?.toUpperCase())}</span>
                            </h1>
                        </div>

                        <div className="border-b-[1px] border-slate-200 pb-6 pt-4">
                            {product?.bulletPoints && product.bulletPoints.length > 0 && product.bulletPoints.map((e, index) => (
                                <ul key={index} className="space-y-4">
                                    <h1 className="font-semibold text-lg text-gray-800">{e?.header}</h1>
                                    <span className="text-gray-600">
                                        <li className="list-disc ml-6">{e?.body}</li>
                                    </span>
                                </ul>
                            ))}
                        </div>

                        <div className="border-b-[1px] border-slate-200 pb-6 pt-4">
                            <h1 className="font-semibold text-lg text-gray-800 flex items-center">
                                PRODUCT DETAILS <BiSpreadsheet className="ml-2 text-xl" />
                            </h1>
                            <div className="mt-4 space-y-2">
                                <li className="list-none text-gray-600">{product?.description}</li>
                                <li className="list-none text-gray-600">Warranty: 1 month</li>
                                <li className="list-none text-gray-600">Warranty provided by Brand Owner / Manufacturer</li>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {selectedTab === 'reviews' && (
                    <div className="space-y-6 w-full justify-between justify-self-center items-center flex flex-col px-5">
                        {/* 2x2 Grid Layout */}
                        {
                            hasPurchased ? <div className="flex flex-row justify-between w-full items-center">
                                {/* Left: Reviews List */}
                                <div className='w-full flex flex-col justify-start items-start'>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">All Reviews</h3>
                                    <div className="flex w-[90%] flex-row space-y-4 overflow-y-auto">
                                        {product && product.Rating && product.Rating.length > 0 && (
                                            <ProductReviews reviews={product.Rating} />
                                        )}
                                    </div>
                                </div>
                                {/* Right: Review Input Form */}
                                <div className="w-full">
                                    <ReviewInputView
                                        setRatingData={setRatingData}
                                        ratingData={ratingData}
                                        isPostingReview={isPostingReview}
                                        PostRating={PostRating}
                                    />
                                </div>
                            </div>:(<div className="flex flex-row justify-between w-full items-center">
                                    {/* Left: Reviews List */}
                                    <div className='w-full flex flex-col justify-start items-start'>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">All Reviews</h3>
                                        <div className="flex w-[90%] flex-row space-y-4 overflow-y-auto">
                                            {product && product.Rating && product.Rating.length > 0 ? (
                                                <ProductReviews reviews={/* product.Rating */ reviews} />
                                            ) : (
                                                <ProductReviews reviews={reviews} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                            )
                        }
                        
                    </div>
                )}

                {/* Material & Care Tab */}
                {selectedTab === 'material' && (
                    <div className="w-full space-y-6">
                        <h1 className="font-semibold text-lg text-gray-800">Material & Care</h1>
                        <p className="text-gray-600">{product?.material}</p>

                        <h1 className="font-semibold text-lg text-gray-800">Care Instructions:</h1>
                        <p className="text-gray-600">{product?.careInstructions}</p>
                    </div>
                )}

                {/* Specifications Tab */}
                {selectedTab === 'specifications' && (
                    <div className="w-full space-y-6">
                        <h1 className="font-semibold text-lg text-gray-800">Specifications</h1>
                        {product?.specification && <p className="list-none text-gray-600">{capitalizeFirstLetterOfEachWord(product.specification)}</p>}
                    </div>
                )}
            </div>
			
        </div>

    );
};



const NewLeftSideImageContent = ({
    selectedSize_color_Image_Array,
    Addclass,
    setSelectedImage,
    selectedImage,
    isFocused,
    setIsFocused
}) => {
    // Memoize the video check logic
    const isVideoFile = (file) => {
        return (
            file?.url?.includes("video") ||
            file?.url?.endsWith(".mp4") ||
            file?.url?.endsWith(".mov") ||
            file?.url?.endsWith(".avi")
        );
    };

    // Memoizing the video detection for the selected image
    const memoIsVideo = useMemo(() => {
        if (!selectedImage || !selectedImage.url) return false;
        return isVideoFile(selectedImage);
    }, [selectedImage]);

    console.log("All Selected Sizes: ", selectedSize_color_Image_Array);
    console.log("Selected Image: ", selectedImage);

    return (
        <div className='flex bg-white h-[900px] justify-start items-start p-3'>
            {/* Left side: Image Array */}
            <div className='w-[100px] max-h-fit px-2 mr-3 overflow-y-auto'>
                <div className='grid grid-cols-1 gap-4'>
                    {
                        selectedSize_color_Image_Array && selectedSize_color_Image_Array.length > 0 &&
                        selectedSize_color_Image_Array.map((file, index) => {
                            const isVideo = isVideoFile(file); // Use the extracted function
                            return (
                                <div
                                    key={index} // Ensure each element has a unique key
                                    className='w-full h-full overflow-hidden p-0.5 shadow-sm cursor-pointer flex justify-center items-center bg-slate-400 transform transition-transform duration-300 ease-in-out'
                                    onMouseEnter={() => (Addclass(), setSelectedImage(file))}
                                    onClick={() => (Addclass(), setSelectedImage(file))}
                                >
                                    {
                                        isVideo ? (
                                            <ReactPlayer
                                                className="w-full h-full object-cover"
                                                url={file.url || file}
                                                playing={isFocused}
                                                controls={false}
                                                muted
                                                width="100%"
                                                height="100%"
                                                light={false}
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={() => setIsFocused(false)}
                                                config={{ file: { attributes: { loading: 'lazy' } } }}
                                            />
                                        ) : (
                                            <img
                                                src={file?.url}
                                                className='w-full h-full object-cover hover:scale-110'
                                                alt="productImage"
												onContextMenu={(e) => e.preventDefault()}  // Disable right-click
                                            />
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {/* Right side: Image Zoom or Video */}
            {
                selectedImage && memoIsVideo ? (
                    <div className="relative h-full w-full bg-gray-200 overflow-hidden">

                        <ReactPlayer
                            className="w-full h-full object-cover"
                            url={selectedImage.url || selectedImage}
                            loop={true}
                            muted={true}
                            controls={false}
                            width="100%"
                            height="100%"
                            playing={true}
                            light={false}
                        />
                        {/* <ShareView/> */}
                    </div>
                ) : (
                    <ImageZoom imageSrc={selectedImage.url || selectedImage} zoomSize={110}/>
                )
            }
        </div>
    );
};
const ReviewInputView = ({setRatingData,ratingData,isPostingReview,PostRating})=>{
    return (
        <div className='w-full justify-center items-center flex-row flex'>
            <div className='w-full flex flex-col justify-start items-center'>
                {/* Review Input Section */}
                <div className='mt-6 w-full'>
                    <h4 className='text-lg font-semibold'>Write a Review</h4>
                    <form className='mt-4'>
                        {/* Review Text Input */}
                        <div className='mb-4'>
                            {/* Star Rating Input */}
                            <div className='mb-4'>
                                <label htmlFor='starRating' className='block text-sm font-semibold text-gray-700'>Rating:</label>
                                <StarRatingInput onChangeValue={(value) =>{
                                    setRatingData({...ratingData,rating:value})
                                }}/>
                            </div>
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
                        {/* Submit Button */}
                        <div className='flex justify-start'>
                            <button
                                disabled = {isPostingReview}
                                onClick={PostRating}
                                className='bg-gray-500 text-white px-4 py-2 rounded-md'
                            >
                                {
                                    isPostingReview ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div> : 'Submit Review'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

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
        <div
            ref={containerRef}
            className="overflow-y-auto w-[800px] max-h-[300px] relative px-1 cursor-grab"
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
            })}

            {/* If showMore is true, display all reviews */}
            {showMore &&
                reviews.slice(4).map((review, index) => {
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

            {/* View More / View Less Button */}
            <div className="mt-4">
                <button 
                    onClick={handleToggleReviews} 
                    className="text-gray-500 font-semibold"
                >
                    {showMore ? 'View Less' : 'View More'}
                </button>
            </div>
        </div>
    );

};


/* const LeftImageContent = ({
    selectedSize_color_Image_Array,
    Addclass,
    setSelectedImage,
    selectedImage,
    isFocused,
    setIsFocused
}) => {
    // Memoize the video check logic
    const isVideoFile = (file) => {
        return (
            file?.url?.includes("video") ||
            file?.url?.endsWith(".mp4") ||
            file?.url?.endsWith(".mov") ||
            file?.url?.endsWith(".avi")
        );
    };

    // Memoizing the video detection for the selected image
    const memoIsVideo = useMemo(() => {
        if (!selectedImage || !selectedImage.url) return false;
            return isVideoFile(selectedImage);
    }, [selectedImage]);

    return (
        <div className="w-full min-h-fit max-w-fit px-2 flex flex-row justify-start items-start">
            <div className="flex flex-col pr-6 justify-center items-center h-full min-w-fit">
                <div className="flex flex-col mr-3 w-[70px] gap-8"> 
                    {selectedSize_color_Image_Array && selectedSize_color_Image_Array.length > 0 &&
                        selectedSize_color_Image_Array.map((file, index) => {
                            const isVideo = isVideoFile(file); // Use the extracted function
    
                            return (
                                <div
                                    key={index}
                                    className={`w-full h-[170px] 2xl:h-[120px] ${ // Reduced height of image container
                                        selectedImage === file ? "border-2 border-gray-800" : ""
                                    } rounded-md overflow-hidden shadow-sm cursor-pointer flex justify-center items-center transform transition-transform duration-300 ease-in-out hover:scale-110`}
                                    onMouseEnter={() => {
                                        Addclass();
                                        setSelectedImage(file);
                                    }}
                                    onClick={() => {
                                        Addclass();
                                        setSelectedImage(file);
                                    }}
                                >
                                    {isVideo ? (
                                        <ReactPlayer
                                            className="w-full h-full object-cover"
                                            url={file.url || file}
                                            playing={isFocused}
                                            controls={false}
                                            muted
                                            width="100%"
                                            height="100%"
                                            light={false}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                            config={{ file: { attributes: { loading: 'lazy' } } }}
                                        />
                                    ) : (
                                        <img
                                            src={file.url || file}
                                            className="w-full h-full object-cover"
                                            alt="productImage"
                                            loading="lazy"
                                        />
                                    )}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
    
            <div className="flex flex-col justify-center items-center w-full h-fit">
                {selectedImage ? (
                    memoIsVideo ? (
                        <div className="relative w-full h-full overflow-hidden hover:shadow-md">
                            <ReactPlayer
                                className="w-full h-full object-contain rounded-md"
                                url={selectedImage.url || selectedImage}
                                loop={true}
                                muted={true}
                                controls={false}
                                width="100%"
                                height="100%"
                                playing={true}
                                light={false}
                            />
                        </div>
                    ) : (
                        <ImageZoom imageSrc={selectedImage.url || selectedImage} />
                    )
                ) : (
                    <Loader />
                )}
            </div>
        </div>
    );
    
}; */

export default Ppage