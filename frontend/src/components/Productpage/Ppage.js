import React, { useEffect, Fragment, useState, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { checkPurchasesProductToRate, postRating, singleProduct } from '../../action/productaction'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader/Loader'
import './Ppage.css'
import { BiSpreadsheet } from 'react-icons/bi'
import elementClass from 'element-class'
import Single_product from '../Product/Single_product'
import {useAlert} from 'react-alert'
import {getuser} from '../../action/useraction'
import {createbag, createwishlist, clearErrors, getwishlist, getbag} from '../../action/orderaction'
import Footer from '../Footer/Footer'
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, getLocalStorageBag, getLocalStorageWishListItem, setSessionStorageBagListItem, setWishListProductInfo} from '../../config'
import ImageZoom from './ImageZoom'
import namer from 'color-namer';
import PincodeChecker from './PincodeChecker'
import ReactPlayer from 'react-player';
import { Heart, ShoppingBag, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'
import { useToast } from '../../Contaxt/ToastProvider'


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

const maxScrollAmount = 1200
let isInWishList = false
let isInBagList = false;
const Ppage = () => {
  const { activeToast, showToast } = useToast();
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
  }
  const navigation = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
  const { bag, loading: bagLoading } = useSelector(state => state.bag_data);



	const[selectedSize, setSelectedSize] = useState(null);
	const[selectedColor, setSelectedColor] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [selectedSize_color_Image_Array, setSelectedSize_color_Image_Array] = useState([]);
	// const[selectedColorId,setSelectedColorId] = useState(null);
  const param = useParams()
  // const alert  = useAlert()
  const dispatch = useDispatch()
  const [currentColor,setCurrentColor] = useState(null)
  const[currentSize,setCurrentSize] = useState(null)
  const[hasPurchased, setHasPurchased] = useState(false);
  const[ratingData,setRatingData] = useState(null);

  const { product, loading, similar } = useSelector(state => state.Sproduct)
  const {loading: userloading, user, isAuthentication} = useSelector(state => state.user)
  const {error:warning} = useSelector(state => state.wishlist)
  function Addclass() {
    var foo1 = document.querySelector(`.imgfulldiv`)
    elementClass(foo1).add('visible')
  }
  function Removeclass() {
    var foo1 = document.querySelector(`.imgfulldiv`)
    elementClass(foo1).remove('visible')
  }

  async function addtobag() {
    // console.log("User", user)
    if(isInBagList){
      navigation("/bag")
      return;
    }
    if(!currentColor){
      checkAndCreateToast("error","No Color Selected")
        return;
    }
    if(!currentSize){
        checkAndCreateToast("error","No Size Selected")
        return;
    }
    if (user) {
      const orderData ={
        userId:user.id,
        productId:param.id, 
        quantity:1,
        color:currentColor,
        size:currentSize,
      }
        await dispatch(createbag(orderData))
        await dispatch(getwishlist())
        dispatch(getbag({ userId: user.id }))
        checkAndCreateToast("success",'Product  successfully in Bag')
      }else{
      //  alert.show('You have To Login To Add This Product Into Bag')
      const orderData = {
        productId: param.id,
        quantity: 1,
        color: currentColor,
        size: currentSize,
        ProductData:product,
      };
      setSessionStorageBagListItem(orderData,param.id);
    }
    if(user){
        isInWishList = wishlist && wishlist.orderItems && wishlist.orderItems.length > 0 && wishlist.orderItems.some( w=> w.productId?._id === product?._id)
        isInBagList = bag && bag.orderItems && bag.orderItems.length > 0 && bag.orderItems.some( w=> w.productId?._id === product?._id)
      }else{
        isInWishList = getLocalStorageWishListItem().find(b => b.productId?._id=== product?._id);
        isInBagList = getLocalStorageBag().find( b=>  b.productId === product?._id)
      }
      // window.location.reload();
  }
  const addToWishList = async()=>{
    if (user) {
      await dispatch(createwishlist({productId:param.id,}));
      await dispatch(getwishlist());
      await dispatch(getbag({ userId: user.id }))
      if(isInWishList){
        checkAndCreateToast("success",'Added successfully to Wishlist')
      }else{
        checkAndCreateToast("success",'Removed successfully from Wishlist')
      }
    }else{
      //  alert.show('You have To Login To Add This Product To Wishlist')
      setWishListProductInfo(product,param.id);
    }
    if(user){
      isInWishList = wishlist && wishlist.orderItems && wishlist.orderItems.length > 0 && wishlist.orderItems.some( w=> w.productId?._id === product?._id)
      isInBagList = bag && bag.orderItems && bag.orderItems.length > 0 && bag.orderItems.some( w=> w.productId?._id === product?._id)
    }else{
      isInWishList = getLocalStorageWishListItem().find(b => b.productId?._id=== product?._id);
      isInBagList = getLocalStorageBag().find( b=>  b.productId === product?._id)
    }
    // window.location.reload();
  }

  const handleBuyNow = async () => {
    try {
      await addtobag();
      setTimeout(() => {
        navigation('/bag')
      }, 1000);
      window.location.reload();
    } catch (error) {
      console.error("Error Adding to Bag: ",error);
      checkAndCreateToast("success","Error adding to Bag");
    }
  }

  const [state, setstate] = useState(false)

  const PostRating = async (e)=>{
      e.preventDefault();
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
    console.log("selected Size: ",newSize);
    setCurrentSize(newSize);
    setSelectedSize(newSize);
    setSelectedColor(newSize.colors);
    // setSelectedColorId(newSize.colors[0]._id);
  }
  const handelSetColorImages = (color) => {
    setSelectedSize_color_Image_Array(color.images)

    setSelectedImage(color.images[0]);
    // setSelectedColorId(color._id);
  }
  useEffect(()=>{
    if(product){
      setSelectedSize(product.size[0]);
      setCurrentSize(product.size[0]);
      setSelectedColor(product.size[0]?.colors);

      const currentColor = product.size[0].colors[0];

      // setSelectedColorId(currentColor._id);
      setSelectedImage(currentColor.images[0]);
      setSelectedSize_color_Image_Array(currentColor.images);
    }
		if(product){
      checkFetchedIsPurchased();
    }
    if(user){
      dispatch(getwishlist());
      dispatch(getbag({ userId: user.id }));
    }
    // refreshWishListAndBag();
	},[product,user,dispatch])
  useEffect(()=>{
    if(selectedSize){
			setSelectedColor(selectedSize.colors);
      const currentColor = selectedSize.colors[0];
			setSelectedSize_color_Image_Array(currentColor.images);
			// setSelectedColorId(currentColor._id);
			setSelectedImage(currentColor.images[0]);
		}
  },[selectedSize])

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
  if(user){
      isInWishList = wishlist && wishlist.orderItems && wishlist.orderItems.length > 0 && wishlist.orderItems.some( w=> w.productId?._id === product?._id)
      isInBagList = bag && bag.orderItems && bag.orderItems.length > 0 && bag.orderItems.some( w=> w.productId?._id === product?._id)
    }else{
      isInWishList = getLocalStorageWishListItem().find(b => b.productId?._id=== product?._id);
      isInBagList = getLocalStorageBag().find( b=>  b.productId === product?._id)
  }
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollableDivRef = useRef(null); // Create a ref to access the div element

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
  console.log("Current Scroll Amount: ",scrollPosition);
  return (
    <div ref={scrollableDivRef} className="w-screen h-screen justify-start items-center overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
      {
        loading === false ?
          <div>
            <div className='flex-row h-full flex justify-between items-start ml-20 relative gap-4 overflow-hidden mb-6'>
              <div className='w-[70%] flex flex-col h-full'>
                {
                  scrollPosition > 10 && scrollPosition < maxScrollAmount ? (
                    <div className='w-[42%] flex fixed'>
                      <div className='w-[90%] h-full justify-start items-center flex'>
                          <RightImageContent 
                            selectedSize_color_Image_Array = {selectedSize_color_Image_Array} 
                            Addclass ={Addclass} 
                            setSelectedImage = {setSelectedImage} 
                            selectedImage ={selectedImage} 
                            isFocused = {isFocused}
                            setIsFocused = {setIsFocused}
                          />
                        </div>
                    </div>
                  ):(
                    <div className='w-full flex'>
                      <div className='w-full h-full justify-start items-center flex'>
                          <RightImageContent 
                            selectedSize_color_Image_Array = {selectedSize_color_Image_Array} 
                            Addclass ={Addclass} 
                            setSelectedImage = {setSelectedImage} 
                            selectedImage ={selectedImage} 
                            isFocused = {isFocused}
                            setIsFocused = {setIsFocused}
                          />
                        </div>
                    </div>
                  )
                }
                {
                  scrollPosition >= maxScrollAmount && (
                    <div className='w-[44%] flex absolute bottom-4 left-0'>
                      <div className='w-[90%] h-full justify-start items-center flex'>
                          <RightImageContent 
                            selectedSize_color_Image_Array = {selectedSize_color_Image_Array} 
                            Addclass ={Addclass} 
                            setSelectedImage = {setSelectedImage} 
                            selectedImage ={selectedImage} 
                            isFocused = {isFocused}
                            setIsFocused = {setIsFocused}
                          />
                        </div>
                    </div>
                  )
                }
              </div>
              {/* Content div for large screen */}
              <div className='w-full h-full flex flex-col pl-9'>
                  {/* Left Column (Add to Cart Section) */}
                  <div className='w-full flex flex-col justify-start items-start p-2'>
                    <div className='pt-1'>
                      <h1 className='font1 text-2xl font-semibold text-slate-800'>
                        {capitalizeFirstLetterOfEachWord(product?.title)}
                      </h1>
                      <h1 className='text-xl text-[#808080e8] font-light'>
                        {capitalizeFirstLetterOfEachWord(product?.gender)}
                      </h1>
                      <AverageRatingView ratings={product.Rating || reviews}/>
                    </div>
                    
                    <div className='border-b-[1px] border-slate-200 pb-6 pt-4 w-full'>
                      <h1 className='font1 text-xl font-semibold text-slate-800'>
                        <span className="mr-4 font-bold">
                          ₹ {Math.round(product?.salePrice && product?.salePrice > 0 ? product?.salePrice : product?.price)}
                        </span>
                        {product?.salePrice && product?.salePrice > 0 && (
                          <>
                            <span className="line-through mr-4 font-extralight text-slate-500">₹ {product?.price}</span>
                            <span className="text-gray-700">{calculateDiscountPercentage(product.price, product.salePrice)} % OFF</span>
                          </>
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
                                className={`flex flex-col items-center justify-center rounded-full p-3 shadow-md gap-2 transition-transform duration-300 border-gray-900 ease-in-out border-[1px]
                                  ${currentSize?._id === size?._id ? "border-2 bg-gray-600 text-white scale-110" : "bg-gray-200  text-gray-900"}`}
                                onClick={() => { handleSetNewImageArray(size); }}>
                              <button className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                                {size.label}
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Color Selection */}
                        <div className="w-full flex flex-wrap justify-start items-center max-h-fit mt-2 gap-1">
                          {selectedColor && selectedColor.length > 0 ? (
                            selectedColor.map((color, i) => (
                              <div key={`color_${i}`} 
                                  className={`flex flex-col p-1 items-center justify-center transition-transform duration-300 ease-in-out 
                                    ${color.quantity <= 10 ? "h-32 w-14" : "h-fit w-fit"}`}
                                  onClick={(e) => { e.preventDefault(); setCurrentColor(color); handelSetColorImages(color); }}>
                                <button disabled={color.quantity <= 0} 
                                  style={{ backgroundColor: color?.label || color._id, width: "40px", height: "40px" }} 
                                  className={`${color.quantity <= 0 ? 
                                    `w-8 h-8 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out bg-slate-100` :
                                    `w-8 h-8 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out p-1
                                    ${currentColor?._id === color?._id ? "outline-offset-1 outline-1 border-4 border-slate-900 shadow-md scale-110" : "scale-100 border-separate border-2 border-solid border-slate-300"}`}`}
                                  title={color?.quantity || color?.label || "Color"} />
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
                    <div className='w-[60%] h-fit justify-center items-center flex flex-col'>
                      <div className='grid grid-cols-2 justify-center items-center gap-2'>
                        <button className="font1 h-16 font-semibold text-base w-full p-4 inline-flex items-center justify-center border-[1px] bg-gray-800 text-white border-slate-900 mt-4 rounded-md hover:border-[1px] hover:border-gray-300" onClick={addtobag}>
                          <ShoppingCart size={20} className='m-4' /> <span>{isInBagList ? "GO TO CART":"ADD TO CART"}</span>
                        </button>
                        <button className="font1 h-16 font-semibold text-base w-full p-4 inline-flex items-center justify-center mt-4 rounded-md border-[0.5px] hover:border-[1px] hover:border-gray-900" onClick={addToWishList}>
                          {
                            isInWishList ? <Heart fill='red' strokeWidth={0} size={30} className='m-4' />: <Heart size={30} className='m-4' />
                          }
                          <span>ADD TO WISHLIST</span>
                        </button>
                      </div>
                      <button className="font1 h-16 font-semibold text-base w-full p-4 inline-flex items-center justify-center border-[1px] border-slate-300 mt-4 rounded-md hover:border-[1px] hover:border-gray-900" onClick={handleBuyNow}>
                        <ShoppingBag size={20} className='m-4' /><span>BUY NOW</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column (Product Details Section) */}
                  <div className='w-full flex flex-col justify-start items-start p-4'>
                    
                    {/* Price and Discount Section */}
                    <div className='border-b-[1px] border-slate-200 pb-6 pt-4'>
                      {/* <h1 className='font1 text-base font-semibold text-slate-800'>
                        {product?.salePrice && product.salePrice > 0 && (
                          <span className="mr-4 font-bold">&#8377; {Math.round(product?.salePrice)}</span>
                        )}
                        <span className="line-through mr-4 font-extralight text-slate-500">₹ {product?.price}</span>
                        {product?.salePrice && product.salePrice > 0 && (
                          <span className="text-gray-700">{calculateDiscountPercentage(product.price, product.salePrice)} % OFF</span>
                        )}
                      </h1> */}
                      <h1 className='font1'>Seller: <span className='text-gray-800 font-semibold'>{capitalizeFirstLetterOfEachWord(product?.brand?.toUpperCase())}</span></h1>
                    </div>

                    {/* Bullet Points */}
                    <div className='border-b-[1px] border-slate-200 pb-6 pt-4'>
                      {product?.bulletPoints && product.bulletPoints.length > 0 && product.bulletPoints.map((e, index) => (
                        <Fragment key={index}>
                          <h1 className='font1 flex items-center mt-2 font-semibold'>{e?.header}</h1>
                          <span className='mt-4'>
                            <li className='list-disc mt-2'>{e?.body}</li>
                          </span>
                        </Fragment>
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
                          <div key={e?.id || i} className='m-2 '>
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

                    {/* Additional Info */}
                    <div className='border-b-[1px] border-slate-200 pb-6 pt-4 '>
                      <li className='list-none mt-2'>Product Code:&nbsp;{product?.productId?.toUpperCase()}</li>
                      <li className='list-none mt-2'>Seller:&nbsp;<span className='text-gray-700 font-bold'>{capitalizeFirstLetterOfEachWord(product?.brand?.toUpperCase())}</span></li>
                    </div>
                    <div className='w-[80%] px-2'> {/* Adjust the width of the reviews section */}
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
            <div className='w-full justify-center flex flex-col'>
              <h1 className='font1 flex items-center mt-4 font-semibold p-8'>SIMILAR PRODUCTS</h1>
              <ul className='grid grid-cols-2 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5 2xl:gap-10 xl:gap-10 lg:gap-10 px-6 pb-8'>
                {similar && similar.length > 0 && similar.map((pro) => (<Single_product pro={pro} user ={user} key={pro._id}/>))}
              </ul>

            </div>
            
          </div>
          :
          <Loader />
      }
      <Footer/>

    </div>
  )
}


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

const RightImageContent = ({selectedSize_color_Image_Array,Addclass,setSelectedImage,selectedImage,isFocused,setIsFocused})=>{
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
    <div className='w-full min-w-full h-full justify-start items-start flex-row flex'>
      <div className='h-fit w-32 justify-center items-center flex-col flex col-span-7 mt-4'>
        <div className='grid grid-cols-1 h-full col-span-6 gap-2 px-3'> {/* Reduced grid-cols from 8 to 6 */}
          {
            selectedSize_color_Image_Array && selectedSize_color_Image_Array.length > 0 &&
            selectedSize_color_Image_Array.map((e, index) => {
              // Check if the media is a video or an image
              const isVideo = e?.url?.includes("video") || e?.url?.endsWith(".mp4") || e?.url?.endsWith(".mov") || e?.url?.endsWith(".avi");
              console.log("Selected color Images: ", isVideo);
              return (
                <div
                  key={index}
                  className={`w-full h-full ${selectedImage === e ? "border-2":""}  border-black rounded-md overflow-hidden p-0.5 shadow-sm cursor-pointer flex justify-center items-center transform transition-transform duration-300 ease-in-out`}
                  onMouseEnter={() => { Addclass(); setSelectedImage(e); }}
                  onClick={() => { Addclass(); setSelectedImage(e); }}
                >
                  {isVideo ? (
                    <ReactPlayer
                      className="w-full h-[80px] object-cover hover:scale-110"
                      url={e.url || e}
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
                      src={e.url || e}
                      className="w-full h-[80px] object-contain hover:scale-110"
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
      <div className='w-full h-full justify-center items-center'>
        {selectedImage ? (
              memoIsVideo ? (
                // Video handling using ReactPlayer
                <div className="relative h-full p-1 w-full justify-center items-center overflow-hidden hover:shadow-md">
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
                // Image handling (ImageZoom)
                <ImageZoom imageSrc={selectedImage.url || selectedImage} />
              )
            ) : (
              // Loading Spinner
              <Loader />
            )}

      </div>
    </div>
  )
}
const getColorNameFromHex = (hexCode) => {
  try {
    // Use the color-namer library to get color names
    const names = namer(hexCode);

    // Get the closest name (e.g., Pantone, HTML, or Crayola categories)
    return names.html[0].name; // `html` gives common names like CSS color names
  } catch (error) {
    console.error("Invalid color hex code:", error);
    return "Unknown Color"; // Fallback if hexCode is invalid
  }
};
export default Ppage