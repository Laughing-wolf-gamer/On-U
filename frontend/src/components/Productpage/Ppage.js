import React, { useEffect, Fragment, useState } from 'react'
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
import { capitalizeFirstLetterOfEachWord} from '../../config'
import ImageZoom from './ImageZoom'
import namer from 'color-namer';
import LoadingSpinner from '../Product/LoadingSpinner'
import PincodeChecker from './PincodeChecker'
const Ppage = () => {
  const navigation = useNavigate();
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
  // console.log("All Products: ",product,product?.Rating)

  return (
    <Fragment>
      {
        loading === false ?
          <div>
            <div className='grid grid-cols-12 px-6 gap-8 mt-8'>
              <div className='h-max col-span-7'>
                <div className='max-h-full w-full p-3 m-2 justify-center items-center overflow-hidden'>
                  {selectedImage ? <ImageZoom imageSrc={selectedImage.url ? selectedImage.url: selectedImage }/> : <LoadingSpinner/>}
                </div>
                <div className='h-20 justify-start items-center flex-row flex col-span-7'>
                    <div className='grid grid-cols-8 h-full col-span-7 gap-2 px-3'>
                      {
                        selectedSize_color_Image_Array && selectedSize_color_Image_Array.length > 0 && selectedSize_color_Image_Array.map((e, index) =>
                          <div
                            key={index} // Ensure each element has a unique key
                            className='w-full h-full overflow-hidden p-0.5 shadow-sm cursor-pointer flex justify-center items-center bg-slate-400 transform transition-transform duration-300 ease-in-out'
                            onMouseEnter={() => (Addclass(), setSelectedImage(e))}
                            onClick={() => (Addclass(), setSelectedImage(e))}
                          >
                            <img
                              src={e.url || e}
                              className='w-full h-full object-contain  hover:scale-110'
                              alt="productImage"
                            />
                          </div>
                        )
                      }
                    </div>
                  </div>

              </div>
              {/* Content div for large screen */}
              <div className='col-span-5'>
                <div className='border-b-[1px] border-slate-300  pb-6 pt-4'>
                  <h1 className='font1 text-2xl font-semibold text-slate-800'>{capitalizeFirstLetterOfEachWord(product?.title)}</h1>
                  <h1 className='text-xl text-[#808080e8] font-light'>{capitalizeFirstLetterOfEachWord(product?.gender)}</h1>
                </div>
                <div className='border-b-[1px] border-slate-200  pb-6 pt-4'>
                  <h1 className='font1 text-xl font-semibold text-slate-800'>
                    <span className="mr-4 font-bold">₹ {Math.round(product?.salePrice && product?.salePrice > 0 ? product?.salePrice : product?.price)}</span>
                    {
                      product && product.salePrice && product.salePrice > 0 &&(
                        <>
                          <span className="line-through mr-4 font-extralight text-slate-500">₹ {product?.price}</span>
                          <span className="text-[#f26a10e1]">( {-Math.round(product?.salePrice / product?.price * 100 - 100)}% OFF )</span>
                        </>
                      )
                    }
                    </h1>
                  <h1 className='text-[#0db7af] font-semibold font1 text-sm mt-1'>inclusive of all taxes</h1>
                  <div className="w-auto h-auto flex flex-wrap justify-start items-center p-4 gap-2">
                      {
                        product && product.size && product.size.length > 0 && product.size.map((size,index) =>
                            <div key={`size_${index}_${size._id}`} className={`flex flex-col h-fit rounded-full p-2 items-center shadow-md justify-center gap-2 transition-transform duration-300 ease-in-out 
                              ${currentSize?._id === size?._id  ? "border-2 border-gray-800 bg-gray-600 text-white font-bold scale-110" : "bg-white"}`} onClick={(e)=> {
                                console.log("Selecting Size: ",currentSize?._id === size?._id);
                              handleSetNewImageArray(size);
                            }}>
                            <button  type='button' 
                              className={`w-12 h-12 rounded-full flex items-center justify-center`}>
                              {size.label}
                            </button>
                          </div>
                        )
                      }
                  </div>
                  <div className="w-auto h-auto flex flex-wrap justify-start items-center p-4 gap-2">
                  {selectedColor && selectedColor.length > 0 && selectedColor.length > 0 ? (
                      selectedColor && selectedColor.length > 0 && selectedColor.map((color, i) => (
                        <div className={`flex flex-col h-32 w-24  p-3 rounded-md items-center justify-start gap-2 transition-transform duration-300 ease-in-out`} onClick={(e)=> {
                            e.preventDefault();
                            setCurrentColor(color);
                            handelSetColorImages(color)
                        }}>
                          <button
                            disabled = {color.quantity <= 0}
                            style={{
                              backgroundColor: color?.label || color._id, // Use the label or raw color value
                              width: "40px",
                              height: "40px",
                            }}
                            type='button'
                            className={`${color.quantity <= 0 ? `w-20 h-20 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out
                              bg-gray-600`:`w-20 h-20 rounded-full flex items-center justify-center shadow-md outline-offset-4 transition-transform duration-300 ease-in-out
                                ${currentColor?._id === color?._id
                                  ? "outline-dotted outline-offset-4 border-separate border-solid border-gray-700 shadow-md scale-110"
                                  : "scale-100 border-4 border-gray-800"}`}
                            `}
                            title={color?.quantity || color?.label || "Color"} // Optional tooltip
                          />
                          {
                            color.quantity <= 10 && color.quantity > 0 && (
                              <div className='flex flex-col justify-center items-center'>
                                <span className="text-red-900 text-sm font-extrabold mt-2 text-center text-[12px] flex-wrap">Only {color?.quantity} Left</span>
                              </div>
                            )
                          }
                          {
                            color.quantity <= 0 && (
                              <div className='flex flex-col justify-center items-center'>
                                <span className="text-gray-500 text-sm font-extrabold text-center flex-wrap">Out of Stock</span>
                              </div>
                            )
                          }
                        </div>
                      ))
                    ) : (
                      <p className="text-black">No colors available</p>
                    )}
                    </div>
                    <PincodeChecker productId={product._id}/>
                  <button 
                    className="font1 w-60 font-semibold text-base py-4 px-12 inline-flex items-center justify-center bg-slate-800 text-white mr-6  mt-4 rounded-md hover:bg-gray-600" 
                    onClick={addtobag}>
                      <BsHandbag className='mr-4' /> <span>ADD TO CART</span>
                  </button>
                  <button className="font1 font-semibold text-base py-4 px-8 inline-flex items-center justify-center border-[1px] border-slate-300 mt-4 rounded-md hover:border-[1px] hover:border-gray-900"onClick={handleBuyNow}><BsHeart className='mr-4' /><span>BUY NOW</span></button>
                </div>
                <div className='border-b-[1px] border-slate-200  pb-6 pt-4'>
                  <h1 className='font1 text-base font-semibold text-slate-800'>
                    {
                      product && product.salePrice && product?.salePrice > 0 && (<span className="mr-4 font-bold">&#8377; {Math.round(product?.salePrice)}</span>)
                    }
                    
                    <span className="line-through mr-4 font-extralight text-slate-500">Rs. {product?.price}</span>
                    {
                      product && product.salePrice && product?.salePrice > 0 && (
                        <>
                          <span className="text-[#f26a10e1]">( {-Math.round(product?.salePrice / product?.price * 100 - 100)}% OFF )</span> 
                        </>
                      )
                    }
                    </h1>
                  <h1 className='font1 '>Seller: <span className='text-gray-800 font-semibold'>{capitalizeFirstLetterOfEachWord(product?.brand?.toUpperCase())}</span> </h1>
                </div>

                <div className='border-b-[1px] border-slate-200  pb-6 pt-4'>
                  {
                    product && product.bulletPoints && product.bulletPoints.length > 0 && product.bulletPoints.map((e) =>
                      <Fragment>
                        <h1 className='font1 flex items-center mt-2 font-semibold'>{e?.header}</h1>
                        <span className='mt-4'>
                          <li className='list-disc mt-2'>{e?.body}</li>
                        </span>
                      </Fragment>
                    )
                  }
                  <h1 className='font1 flex items-center mt-8 font-semibold'>BEST OFFERS<BsTag className='ml-2' /></h1>
                  <h1 className='font1 flex items-center mt-4 font-semibold'>Best Price:&nbsp; <span className='text-[#f26a10e1]'>&nbsp;Rs. {Math.round(product?.salePrice && product?.salePrice > 0 ? product?.salePrice : product?.price)}</span></h1>
                  <li className='list-disc mt-2'>Applicable on: Orders above Rs. 1599 (only on first purchase)</li>
                  <li className='list-disc mt-2'>Coupon code: <span className='font-semibold'>ONU250</span></li>
                  <li className='list-disc mt-2'>Coupon Discount: Rs. 62 off (check cart for final savings)</li>

                </div>

                <div className='border-b-[1px] border-slate-200 pb-6 pt-4 '>

                  <h1 className='font1 flex items-center mt-2 font-semibold'>PRODUCT DETAILS <BiSpreadsheet className='ml-2 text-xl' /></h1>
                  <h1 className='mt-4'>
                    <li className='list-none mt-2'>{product?.description}</li>
                    <li className='list-none '>Warranty: 1 month</li>
                    <li className='list-none '>Warranty provided by Brand Owner / Manufacturer</li>
                  </h1>
                  <h1 className='font1 flex items-center mt-4 font-semibold'>Size & Fit</h1>
                  <div className='w-auto max-h-fit justify-center items-start space-x-4'>
                    {
                      product && Array.isArray(product?.size) && product.size.length > 0 && product.size.map((e,i) =>
                        // <button className={`px-6 py-3 rounded-[35px] font1 text-sm font-semibold text-[#0db7af] ${e.selected?'bg-[#0db7af] text-white' : ''}`} onClick={() => dispatch(singleProduct(param.id, {size: e.label}))}>{e.label}</button>
                        // <li className='px-6 py-3 rounded-[35px] font1 text-sm font-semibold text-[#ff3f6c] border-[1px] border-[#ff3f6c]'>{e.label}</li>
                        <Fragment key={e?.id || i}>
                          <span className='list-none mt-2'>{e?.label}</span>
                          <span className='list-none mt-2'>{e?.quantity}</span>
                        </Fragment>
                      )
                    }
                  </div>
                  {/* <li className='list-none mt-2'>{product?.size}</li> */}
                  <h1 className='font1 flex items-center mt-4 font-semibold'>Material & Care</h1>
                    {/* <li className='list-none mt-2'>{product?.color?.length}</li> */}
                    <p>{product?.material}</p>
                  <h1 className='font1 flex items-center mt-4 font-semibold'>Care Instructions:</h1>
                  <h1 className='font1 flex items-center mt-4 font-semibold'>Specifications</h1>
                  {
                    product && product.specification && product.specification.length > 0 && product.specification.map((e) =>
                      <li className='list-none mt-2'>{e?.point}</li>
                    )
                  }
                </div>

                <div className='border-b-[1px] border-slate-200 pb-6 pt-4 '>
                  <li className='list-none mt-2'>Product Code:&nbsp;{product?.productId?.toUpperCase()}</li>
                  <li className='list-none mt-2'>Seller:&nbsp;<span className='text-gray-700 font-bold'>{capitalizeFirstLetterOfEachWord(product?.brand?.toUpperCase())}</span></li>
                </div>
                  {/* Average Rating Section */}
                  {product && product?.Rating && product?.Rating.length > 0  && (
                    <div className='average-rating mt-6'>
                      <h4 className='text-lg font-semibold'>Average Rating:</h4>
                      <div className='flex items-center'>
                        {(() => {
                          const totalStars = product && product.Rating &&product.Rating.length > 0 && product.Rating.reduce((acc, review) => acc + review.rating, 0);
                          const avgStars = totalStars / product.Rating.length;
                          const roundedAvg = Math.round(avgStars * 10) / 10; // Round to 1 decimal place

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
           <div className='w-[70%] px-2'>
              {/* Reviews Section */}
              <div className='reviews-section'>
                <h3 className='text-lg font-semibold mt-4'>All Reviews</h3>
                <div className='reviews-list mt-4 overflow-y-auto'>
                  {product && product.Rating &&product.Rating.length > 0 && product.Rating.map((review, index) => {
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

                {/* Review Input Section */}
                <div className='w-full flex flex-col justify-start items-center'>
                  <div className='mt-6 w-full'>

                    <h4 className='text-lg font-semibold'>Write a Review</h4>

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
                          className='mt-2 p-2 w-full border border-gray-300 rounded-md'
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

    </Fragment>
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