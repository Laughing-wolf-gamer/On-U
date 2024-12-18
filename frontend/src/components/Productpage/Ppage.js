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

const Ppage = () => {
  const param = useParams()
  const alert  =useAlert()
  const dispatch = useDispatch()
  const { product, loading, similar } = useSelector(state => state.Sproduct)
  const {loading: userloading, user, isAuthentication} = useSelector(state => state.user)
  const {error, bag} = useSelector(state => state.bag)
  const {error:werror} = useSelector(state => state.wishlist)
  const [firstImage, setFirstImage] = useState('')
  function Addclass() {
    var foo1 = document.querySelector(`.imgfulldiv`)
    elementClass(foo1).add('visible')
  }
  function Removeclass() {
    var foo1 = document.querySelector(`.imgfulldiv`)
    elementClass(foo1).remove('visible')
  }

  function addtobag() {
    if (user) {

      const option ={
         user:user._id,
         orderItems:[
           {product:param.id, qty:1}
         ]
        
       }
     
       dispatch(createbag(option))
       
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
  // console.log("First Image: ",getRandomItem(product?.image));
  return (
    <Fragment>
      {
        loading === false ?
          <div>
            {/* <div className='hidden fixed top-0 z-10 w-full h-screen imgfulldiv overflow-scroll ' >
              <div className='flex'>
              <div className='w-[10%] bg-[#2b2b2b6d] h-screen fixed top-0 left-0'onClick={Removeclass}></div>
                <div className='min-h-screen w-[80%] mx-auto relative '>
                  <div className='absolute top-5 right-5 bg-white border-[1px] border-slate-200 font-thin text-[50px] text-slate-300 rounded-md cursor-pointer' onClick={Removeclass}><VscChromeClose/></div>
                    <img src={img} alt="Product Image" className='min-h-screen w-full '/>
                </div>
                <div className='w-[10%] bg-[#2b2b2b6d] h-screen fixed right-0 top-0'onClick={Removeclass}></div>
              </div>
              
            </div> */}
            <div className='grid grid-cols-12 px-6 gap-8 mt-8'>
              <div className='h-max col-span-7'>
                <div className='max-h-full w-full p-3 m-2 justify-center items-center overflow-hidden'>
                  {/* <img src={firstImage || getRandomItem(product?.image)} alt="Product Image" className='h-full w-full border-[0.5px] border-slate-100 hover:-translate-y-1 hover:scale-110 duration-300 cursor-zoom-in'/> */}
                  <ImageZoom imageSrc={firstImage || getRandomItem(product?.image)}/>
                </div>
                <div className='h-20 justify-start items-center flex-row flex col-span-7'>
                  <div className='grid grid-cols-8 h-full col-span-7 gap-2 px-3'>
                    {
                      product && product.image && product.image.map((e) =>
                        <div className='w-full h-full overflow-hidden cursor-pointer' onClick={()=>(Addclass(),setFirstImage(e))}>
                          <img src={e} className='w-full h-full object-contain outline outline-2 outline-red-600' alt="productImage" />
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
              {/* Content div for large screen */}
              <div className='col-span-5'>
                <div className='border-b-[1px] border-slate-300  pb-6 pt-4'>
                  <h1 className='font1 text-2xl font-semibold text-slate-800'>{capitalizeFirstLetterOfEachWord(product?.gender)}</h1>
                  <h1 className='text-xl text-[#808080e8] font-light'>{product?.title}</h1>
                </div>
                <div className='border-b-[1px] border-slate-200  pb-6 pt-4'>
                  <h1 className='font1 text-xl font-semibold text-slate-800'>
                    <span className="mr-4 font-bold">Rs. {Math.round(product?.salePrice ? product?.salePrice : product?.price)}</span>
                    {
                      product && product.salePrice && product.salePrice > 0 &&(
                        <>
                          <span className="line-through mr-4 font-extralight text-slate-500">Rs. {product?.price}</span>
                          <span className="text-[#f26a10e1]">( {-Math.round(product?.salePrice / product?.price * 100 - 100)}% OFF )</span> :
                          <span className="text-[#0db7af]">Rs. {product?.salePrice}</span>
                        </>
                      )
                    }
                    {/* <span className="line-through mr-4 font-extralight text-slate-500">Rs. {product?.price}</span>
                    <span className="text-[#f26a10e1]">( {-Math.round(product?.salePrice / product?.price * 100 - 100)}% OFF )</span>  */}
                    </h1>
                  <h1 className='text-[#0db7af] font-semibold font1 text-sm mt-1'>inclusive of all taxes</h1>
                  <div className='w-auto max-h-fit justify-center items-start space-x-2'>
                      {
                        product && product.size && product.size.length > 0 && product.size.map((e) =>
                            // <button className={`px-6 py-3 rounded-[35px] font1 text-sm font-semibold text-[#0db7af] ${e.selected?'bg-[#0db7af] text-white' : ''}`} onClick={() => dispatch(singleProduct(param.id, {size: e.label}))}>{e.label}</button>
                            <button type='button' className='px-6 py-3 rounded-[35px] font1 text-sm font-semibold text-[#ff3f6c] border-[1px] border-[#ff3f6c]'>{e.label}</button>
                        )
                      }
                  </div>
                  <div className="w-auto h-auto flex flex-wrap justify-start items-center p-4 gap-2">
                    {product?.color?.length > 0 ? (
                      product.color.map((color, i) => (
                        <button
                          key={i}
                          style={{
                            backgroundColor: color?.label || color, // Use the label or raw color value
                            width: "30px",
                            height: "30px",
                          }}
                          className="rounded-full border border-gray-200 shadow-md"
                          title={color?.name || color?.label || "Color"} // Optional tooltip
                        />
                      ))
                    ) : (
                      <p className="text-black">No colors available</p>
                    )}
                  </div>

                  <button className="font1 w-60 font-semibold text-base py-4 px-12 inline-flex items-center justify-center bg-[#ff3f6c] text-white mr-6  mt-4 rounded-md hover:bg-[#f64871]" onClick={addtobag}><BsHandbag className='mr-4' /> <span>ADD TO BAG</span></button>
                  <button className="font1 font-semibold text-base py-4 px-8 inline-flex items-center justify-center border-[1px] border-slate-300 mt-4 rounded-md hover:border-[1px] hover:border-slate-900"onClick={addtowishlist}><BsHeart className='mr-4' /><span>WISHLIST</span></button>
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
                  <h1 className='font1 '>Seller: <span className='text-[#ff3f6c] font-semibold'>{capitalizeFirstLetterOfEachWord(product?.brand?.toUpperCase())}</span> </h1>
                </div>

                <div className='border-b-[1px] border-slate-200  pb-6 pt-4'>

                  {
                    product && product.bulletPoints && product.bulletPoints.map((e) =>
                      <div className='mb-2 font-extralight text-slate-600'>
                        {e.point}
                      </div>
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
                  <li className='list-none mt-2'>Seller:&nbsp;<span className='text-[#ff3f6c] font-bold'>{capitalizeFirstLetterOfEachWord(product?.brand?.toUpperCase())}</span></li>
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

export default Ppage