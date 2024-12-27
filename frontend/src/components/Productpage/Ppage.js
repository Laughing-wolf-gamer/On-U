import React, { useEffect, Fragment, useState } from 'react'
import { useParams } from 'react-router-dom'
import { singleProduct } from '../../action/productaction'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../Loader/Loader'
import './Ppage.css'
import { BsHandbag } from 'react-icons/bs'
import { BsHeart } from 'react-icons/bs'
import { BsTag } from 'react-icons/bs'
import { BiSpreadsheet } from 'react-icons/bi'
import elementClass from 'element-class'
import Single_product from '../Product/Single_product'
import {VscChromeClose} from 'react-icons/vsc'
import {useAlert} from 'react-alert'
import {getuser} from '../../action/useraction'
import {createbag, createwishlist, clearErrors} from '../../action/orderaction'
import Footer from '../Footer/Footer'
import { capitalizeFirstLetterOfEachWord, getRandomItem, getRandomItems } from '../../config'
import ImageZoom from './ImageZoom'
import namer from 'color-namer';

const Ppage = () => {
	const[selectedSize, setSelectedSize] = useState(null);
	const[selectedColor, setSelectedColor] = useState([]);
	const [selectedImage, setSelectedImage] = useState(null);
	const [selectedSize_color_Image_Array, setSelectedSize_color_Image_Array] = useState([]);
	const[selectedColorId,setSelectedColorId] = useState(null);
  const param = useParams()
  const alert  =useAlert()
  const dispatch = useDispatch()
  const [currentColor,setCurrentColorColor] = useState({})
  const[currentSize,setCurrentSize] = useState({})

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
      console.log("Order Data: ",orderData)
      dispatch(createbag(orderData))
      alert.success('Product added successfully in Bag')
       
      alert.success('Product added successfully in Bag')

     }else{
       alert.show('You have To Login To Add This Product Into Bag')
     }
  }

  function addtowishlist() {
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
      alert.show('You have To Login To Add This Product Into Wishlist')
    }
  }

  const [state, setstate] = useState(false)
  
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
  return (
    <Fragment>
      {
        loading === false ?
          <div>
            <div className='grid grid-cols-12 px-6 gap-8 mt-8'>
              <div className='h-max col-span-7'>
                <div className='max-h-full w-full p-3 m-2 justify-center items-center overflow-hidden'>
                  <ImageZoom imageSrc={selectedImage || getRandomItem(selectedSize_color_Image_Array)}/>
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
                              src={e}
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
                    <span className="mr-4 font-bold">₹ {Math.round(product?.salePrice ? product?.salePrice : product?.price)}</span>
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
                  <div className='w-auto max-h-fit justify-center items-start space-x-2'>
                      {
                        product && product.size && product.size.length > 0 && product.size.map((size) =>
                            <button onClick={(e)=> {
                              e.preventDefault();
                              setCurrentSize(size);
                              // setSelectedSize(s);
                              handleSetNewImageArray(size);
  
                            }} type='button' className={`px-6 py-3 m-1 rounded-[35px] font1 text-sm font-semibold text-slate-400 ${currentSize?.id === size?.id ? "border bg-slate-700 text-white":""} border-slate-400 border-[2px] hover:border-slate-700`}>{size.label}</button>
                        )
                      }
                  </div>
                  <div className="w-auto h-auto flex flex-wrap justify-start items-center p-4 gap-2">
                  {selectedColor && selectedColor.length > 0 && selectedColor.length > 0 ? (
                      selectedColor && selectedColor.length > 0 && selectedColor.map((color, i) => (
                        <button
                          onClick={(e)=> {
                            e.preventDefault();
                            setCurrentColorColor(color);
                            handelSetColorImages(color)
                          }}
                          key={`color-${color?.id}`}
                          style={{
                            backgroundColor: color?.label || color.id, // Use the label or raw color value
                            width: "30px",
                            height: "30px",
                          }}
                          type='button'
                          //
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-300 ease-in-out shadow-md
														${selectedColorId === color?.id ? "outline outline-2 outline-offset-1 outline-black scale-110 shadow-md" : ""}
													`}
                          title={color?.id || color?.label || "Color"} // Optional tooltip
                        />
                      ))
                    ) : (
                      <p className="text-black">No colors available</p>
                    )}
                  </div>

                  <button className="font1 w-60 font-semibold text-base py-4 px-12 inline-flex items-center justify-center bg-slate-400 text-white mr-6  mt-4 rounded-md hover:bg-gray-700" onClick={addtobag}><BsHandbag className='mr-4' /> <span>ADD TO CART</span></button>
                  <button className="font1 font-semibold text-base py-4 px-8 inline-flex items-center justify-center border-[1px] border-slate-300 mt-4 rounded-md hover:border-[1px] hover:border-gray-900"onClick={addtowishlist}><BsHeart className='mr-4' /><span>BUY NOW</span></button>
                </div>
                <div className='border-b-[1px] border-slate-200  pb-6 pt-4'>
                  <h1 className='font1 text-base font-semibold text-slate-800'>
                    {
                      product && product.salePrice && (<span className="mr-4 font-bold">&#8377; {Math.round(product?.salePrice)}</span>)
                    }
                    
                    <span className="line-through mr-4 font-extralight text-slate-500">Rs. {product?.price}</span>
                    {
                      product && product.salePrice && (
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
                    product && product.bulletPoints && product.bulletPoints.map((e) =>
                      <Fragment>
                        <h1 className='font1 flex items-center mt-2 font-semibold'>{e.header}</h1>
                        <span className='mt-4'>
                          <li className='list-disc mt-2'>{e.body}</li>
                        </span>
                      </Fragment>
                    )
                  }
                  <h1 className='font1 flex items-center mt-8 font-semibold'>BEST OFFERS<BsTag className='ml-2' /></h1>
                  <h1 className='font1 flex items-center mt-4 font-semibold'>Best Price:&nbsp; <span className='text-[#f26a10e1]'>&nbsp;Rs. {Math.round(product?.salePrice)}</span></h1>
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
                        <span key={e?.id || i} className='list-none mt-2'>{e.label}</span>
                      )
                    }
                  </div>
                  {/* <li className='list-none mt-2'>{product?.size}</li> */}
                  <h1 className='font1 flex items-center mt-4 font-semibold'>Material & Care</h1>
                    {/* <li className='list-none mt-2'>{product?.color?.length}</li> */}
                    <p>{product?.material}</p>
                  <h1 className='font1 flex items-center mt-4 font-semibold'>Care Instructions:</h1>
                  <div className='mt-2'>
                    Wipe your jewelry with a soft cloth after every use
                    Always store your jewelry in a flat box to avoid accidental scratches
                    Keep sprays and perfumes away from your jewelry
                    Do not soak your jewelry in water
                    Clean your jewelry using a soft brush, dipped in jewelry cleaning solution only
                  </div>
                  <h1 className='font1 flex items-center mt-4 font-semibold'>Specifications</h1>
                  {
                    product && product.specification && product.specification.length > 0 && product.specification.map((e) =>
                      <li className='list-none mt-2'>{e?.point}</li>
                    )
                  }
                </div>

                <div className='border-b-[1px] border-slate-200 pb-6 pt-4 '>
                  <li className='list-none mt-2'>Product Code:&nbsp;{product?.style_no?.toUpperCase()}</li>
                  <li className='list-none mt-2'>Seller:&nbsp;<span className='text-gray-700 font-bold'>{capitalizeFirstLetterOfEachWord(product?.brand?.toUpperCase())}</span></li>
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