import React, { useEffect, Fragment, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { checkPurchasesProductToRate, postRating, singleProduct } from '../../action/productaction'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader/Loader'
import './Ppage.css'
import { BsHandbag } from 'react-icons/bs'
import { BsHeart } from 'react-icons/bs'
import { BsTag } from 'react-icons/bs'
import { BiSpreadsheet } from 'react-icons/bi'
import elementClass from 'element-class'
import Single_product from '../Product/Single_product'
import {useAlert} from 'react-alert'
import {getuser} from '../../action/useraction'
import {createbag, createwishlist, clearErrors} from '../../action/orderaction'
import Footer from '../Footer/Footer'
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord} from '../../config'
import ImageZoom from './ImageZoom'
import namer from 'color-namer';
import LoadingSpinner from '../Product/LoadingSpinner'
import PincodeChecker from './PincodeChecker'
import ReactPlayer from 'react-player';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { ShoppingBag, ShoppingCart } from 'lucide-react'

const Ppage = () => {
  const navigation = useNavigate();
  const [isFocused, setIsFocused] = useState(false);


	const[selectedSize, setSelectedSize] = useState(null);
	const[selectedColor, setSelectedColor] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [selectedSize_color_Image_Array, setSelectedSize_color_Image_Array] = useState([]);
	const[selectedColorId,setSelectedColorId] = useState(null);
  const param = useParams()
  const alert  =useAlert()
  const dispatch = useDispatch()
  const [currentColor,setCurrentColor] = useState(null)
  const[currentSize,setCurrentSize] = useState(null)
  const[hasPurchased, setHasPurchased] = useState(false);
  const[ratingData,setRatingData] = useState(null);

  const { product, loading, similar } = useSelector(state => state.Sproduct)
  const {loading: userloading, user, isAuthentication} = useSelector(state => state.user)
  const {error, bag} = useSelector(state => state.bag)
  const {error:werror} = useSelector(state => state.wishlist)
  function Addclass() {
    var foo1 = document.querySelector(`.imgfulldiv`)
    elementClass(foo1).add('visible')
  }
  function Removeclass() {
    var foo1 = document.querySelector(`.imgfulldiv`)
    elementClass(foo1).remove('visible')
  }

  function addtobag() {
    console.log("User", user)
    if (user) {
      const orderData ={
        userId:user.id,
        productId:param.id, 
        quantity:1,
        color:currentColor,
        size:currentSize,
      }
      // console.log("Order Data: ",orderData)
      dispatch(createbag(orderData))
      alert.success('Product added successfully in Bag')
     }else{
       alert.show('You have To Login To Add This Product Into Bag')
     }
  }
  const addToWishList = async()=>{
    if (user) {
      // console.log("Wishlist Data: ", wishlistData)
      dispatch(createwishlist({productId:param.id,}))
      alert.success('Product added successfully to Wishlist')
     }else{
       alert.show('You have To Login To Add This Product To Wishlist')
     }
  }

  const handleBuyNow = async () => {
    try {
      await addtobag();
      setTimeout(() => {
        navigation('/bag')
      }, 1000);
    } catch (error) {
      console.error("Error Adding to Bag: ",error);
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
      // console.log("response On Is Purchased: ", didPurchased.success);
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
    if(error){
      alert.error(error)
      dispatch(clearErrors())
    }
    if(werror){
      alert.error(werror)
      dispatch(clearErrors())
    }
  }, [dispatch, param, error, alert, werror]);
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };
  const handleSetNewImageArray = (newSize)=>{
    console.log("selected Size: ",newSize);
    setCurrentSize(newSize);
    setSelectedSize(newSize);
    setSelectedColor(newSize.colors);
    // setCurrentColor(newSize.colors[0]);
    setSelectedColorId(newSize.colors[0]._id);
  }
  const handelSetColorImages = (color) => {
    setSelectedSize_color_Image_Array(color.images)

    setSelectedImage(color.images[0]);
    setSelectedColorId(color._id);
  }
  useEffect(()=>{
    if(product){
      setSelectedSize(product.size[0]);
      setCurrentSize(product.size[0]);
      setSelectedColor(product.size[0]?.colors);

      const currentColor = product.size[0].colors[0];

      setSelectedColorId(currentColor._id);
      setSelectedImage(currentColor.images[0]);
      setSelectedSize_color_Image_Array(currentColor.images);
    }
		if(product){
      checkFetchedIsPurchased();
    }
	},[product,dispatch])
  useEffect(()=>{
    if(selectedSize){
			setSelectedColor(selectedSize.colors);
      const currentColor = selectedSize.colors[0];
			setSelectedSize_color_Image_Array(currentColor.images);
			setSelectedColorId(currentColor._id);
			// console.log("Colors: ",currentColor.quantity);
			setSelectedImage(currentColor.images[0]);
		}
    // console.log("Selected Size New ",currentSize);
  },[selectedSize])
  console.log("All Products: ",selectedSize_color_Image_Array)
  const isVideo = useMemo(() => {
    if (!selectedImage || !selectedImage.url) return false;

    const url = selectedImage.url;
    return (
        url.includes("video") || 
        url.endsWith(".mp4") || 
        url.endsWith(".mov") || 
        url.endsWith(".avi")
    );
  }, [selectedImage]);
  console.log("hasPurchased: ",hasPurchased);
  return (
    <div className="w-screen h-screen justify-start items-center overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
      {
        loading === false ?
          <div>
            <div className='flex-row flex justify-between items-start px-3 gap-4'>
              <div className='w-[40%] h-[30%] justify-start items-start flex'>
                <div className='w-full h-fit justify-center items-start flex-col flex'>
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
                    )}
                    <div className='h-20 w-fit justify-center items-center flex-row flex col-span-7 mt-4'>
                      <div className='grid grid-cols-6 h-full col-span-4 gap-2 px-3'> {/* Reduced grid-cols from 8 to 6 */}
                        {
                          selectedSize_color_Image_Array && selectedSize_color_Image_Array.length > 0 &&
                          selectedSize_color_Image_Array.map((e, index) => {
                            // Check if the media is a video or an image
                            const isVideo = e?.url?.includes("video") || e?.url?.endsWith(".mp4") || e?.url?.endsWith(".mov") || e?.url?.endsWith(".avi");
                            console.log("Selected color Images: ", isVideo);
                            return (
                              <div
                                key={index}
                                className="w-full h-full overflow-hidden p-0.5 shadow-sm cursor-pointer flex justify-center items-center bg-slate-200 transform transition-transform duration-300 ease-in-out"
                                onMouseEnter={() => { Addclass(); setSelectedImage(e); }}
                                onClick={() => { Addclass(); setSelectedImage(e); }}
                              >
                                {isVideo ? (
                                  <ReactPlayer
                                    className="w-full h-[80px] object-contain hover:scale-110"
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
                    <div className='w-[80%] px-2'> {/* Adjust the width of the reviews section */}
                      {/* Reviews Section */}
                      <div className='reviews-section'>
                        <h3 className='text-lg font-semibold mt-4'>All Reviews</h3>
                        <div className='reviews-list mt-4 overflow-y-auto'>
                          {product && product.Rating && product.Rating.length > 0 && product.Rating.map((review, index) => {
                            const randomStars = review.rating; // Random stars between 1 and 5
                            return (
                              <div key={index} className='review-item mb-4'>
                                <div className='flex items-center'>
                                  {/* Display random star rating */}
                                  <div className='stars'>
                                    {[...Array(randomStars)].map((_, i) => (
                                      <span key={i} className='star text-black'>★</span>
                                    ))}
                                    {[...Array(5 - randomStars)].map((_, i) => (
                                      <span key={i} className='star text-gray-300'>★</span>
                                    ))}
                                  </div>
                                  <span className='ml-2 text-sm text-gray-500'>{randomStars} Stars</span>
                                </div>
                                <p className='text-gray-700 mt-2'>{review?.comment}</p>
                              </div>
                            );
                          })}
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

              {/* Content div for large screen */}
              <div className='w-full h-full flex flex-row '>
                  {/* Left Column (Add to Cart Section) */}
                  <div className='w-[60%] flex flex-col justify-start items-start p-4'>
                    <div className='border-b-[1px] border-slate-300 pb-6 pt-4'>
                      <h1 className='font1 text-2xl font-semibold text-slate-800'>
                        {capitalizeFirstLetterOfEachWord(product?.title)}
                      </h1>
                      <h1 className='text-xl text-[#808080e8] font-light'>
                        {capitalizeFirstLetterOfEachWord(product?.gender)}
                      </h1>
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
                      <div className='w-full justify-center items-center flex flex-col'>
                        {/* Size Selection */}
                        <div className="w-full flex flex-wrap justify-start items-start p-4 gap-2">
                          {product && product.size && product.size.length > 0 && product.size.map((size, index) => (
                            <div key={`size_${index}_${size._id}`} className={`flex flex-col h-fit rounded-full p-2 items-center shadow-md justify-center gap-2 transition-transform duration-300 ease-in-out 
                              ${currentSize?._id === size?._id ? "border-2 border-gray-800 bg-gray-600 text-white font-bold scale-110" : "bg-white"}`} 
                              onClick={() => { handleSetNewImageArray(size); }}>
                              <button className={`w-12 h-12 rounded-full flex items-center justify-center`}>
                                {size.label}
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Color Selection */}
                        <div className="w-full flex flex-wrap justify-start items-start gap-2">
                          {selectedColor && selectedColor.length > 0 ? (
                            selectedColor.map((color, i) => (
                              <div key={`color_${i}`} className="flex flex-col h-32 w-20 rounded-md items-center justify-start gap-2 transition-transform duration-300 ease-in-out" 
                                onClick={(e) => { e.preventDefault(); setCurrentColor(color); handelSetColorImages(color); }}>
                                <button disabled={color.quantity <= 0} 
                                  style={{ backgroundColor: color?.label || color._id, width: "40px", height: "40px" }} 
                                  className={`${color.quantity <= 0 ? `w-20 h-20 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out bg-gray-600` : 
                                    `w-20 h-20 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out ${currentColor?._id === color?._id ? "outline-dotted outline-offset-4 border-separate border-solid border-gray-700 shadow-md scale-110" : "scale-100 border-4 border-gray-800"}`}`}
                                  title={color?.quantity || color?.label || "Color"} />
                                {color.quantity <= 10 && color.quantity > 0 && (
                                  <div className='flex flex-col justify-center items-center'>
                                    <span className="text-red-900 text-sm font-extrabold mt-2 text-center text-[12px] flex-wrap">Only {color?.quantity} Left</span>
                                  </div>
                                )}
                                {color.quantity <= 0 && (
                                  <div className='flex flex-col justify-center items-center'>
                                    <span className='text-gray-500 text-sm font-extrabold text-center flex-wrap'>Out of Stock</span>
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
                    <div className='w-[90%] h-fit justify-center items-center flex flex-col'>
                      <button className="font1 h-16 font-semibold text-base w-full p-4 inline-flex items-center justify-center border-[1px] bg-gray-800 text-white border-slate-900 mt-4 rounded-md hover:border-[1px] hover:border-gray-300" onClick={addtobag}>
                        <ShoppingCart size={20} className='m-4' /> <span>ADD TO CART</span>
                      </button>
                      <button className="font1 h-16 font-semibold text-base w-full p-4 inline-flex items-center justify-center border-[1px] border-slate-300 mt-4 rounded-md hover:border-[1px] hover:border-gray-900" onClick={addToWishList}>
                        <BsHeart size={20} className='m-4' /><span>ADD TO WISHLIST NOW</span>
                      </button>
                      <button className="font1 h-16 font-semibold text-base w-full p-4 inline-flex items-center justify-center border-[1px] border-slate-300 mt-4 rounded-md hover:border-[1px] hover:border-gray-900" onClick={handleBuyNow}>
                        <ShoppingBag size={20} className='m-4' /><span>BUY NOW</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column (Product Details Section) */}
                  <div className='w-[40%] flex flex-col justify-start items-start p-4'>
                    
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

                    {/* Average Rating */}
                    {product?.Rating && product?.Rating.length > 0 && (
                      <div className='average-rating mt-6'>
                        <h4 className='text-lg font-semibold'>Average Rating:</h4>
                        <div className='flex items-center'>
                          {(() => {
                            const totalStars = product.Rating.reduce((acc, review) => acc + review.rating, 0);
                            const avgStars = totalStars / product.Rating.length;
                            const roundedAvg = Math.round(avgStars * 10) / 10;
                            return (
                              <>
                                <div className='stars'>
                                  {[...Array(Math.floor(roundedAvg))].map((_, i) => (
                                    <span key={i} className='star text-black'>★</span>
                                  ))}
                                  {[...Array(5 - Math.floor(roundedAvg))].map((_, i) => (
                                    <span key={i} className='star text-gray-300'>★</span>
                                  ))}
                                </div>
                                <span className='ml-2 text-sm text-gray-500'>{roundedAvg} Stars</span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>

            </div>
            
            <h1 className='font1 flex items-center mt-4 font-semibold px-6 py-2'>SIMILAR PRODUCTS</h1>
            <ul className='grid grid-cols-2 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5 2xl:gap-10 xl:gap-10 lg:gap-10 px-6'>
              {similar && similar.length > 0 && similar.map((pro) => (<Single_product pro={pro} key={pro._id} />))}
            </ul>
            <Footer/>
          </div>
          :
          <Loader />
      }

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