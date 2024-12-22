import React,{Fragment} from 'react'
import g1 from '../images/googleplay.png'
import g2 from '../images/appleplay.png'
import g3 from '../images/original.png'
import g4 from '../images/return.png'
import {AiFillFacebook, AiFillYoutube} from 'react-icons/ai'
import {ImTwitter, ImInstagram} from 'react-icons/im'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <Fragment>
    {
      window.screen.width > 1024 ?

      <Fragment>
      <div className='w-10/12 mx-auto grid grid-cols-12 mt-12 font1'>
       <div className="col-span-2">
         <h1 className=' text-sm font-extrabold '>ONLINE&nbsp;SHOPPING</h1>
         <ul className=' text-sm text-black pt-6'>
           <li>Men</li>
           <li>Women</li>
           <li>Kids</li>
           {/* <li>Home & Living</li>
           <li>Beauty</li>
           <li>Gift Cards</li>
           <li>ONU Insider</li> */}
         </ul>
       </div>

       <div className="col-span-2">
       <h1 className='text-sm font-extrabold col-span-2'>USEFUL LINKS</h1>
       <ul className='text-sm text-black pt-6'>
         <Link to='/about'><li className="hover:underline">About Us</li></Link>
         <Link to='/contact'><li className="hover:underline">Contact Us</li></Link>
         <li className="">FAQ</li>
         <li className="">T&C</li>
         <li className="">Terms Of Use</li>
         <li className="">Track Orders</li>
         <li className="">Shipping</li>
         <li className="">Cancellation</li>
         <li className="">Returns</li>
         <li className="">Whitehat</li>
         <li className="">Blog</li>
         <li className="">Careers</li>
         <li className="">Privacy Policy</li>
         <li className="">Site Map</li>
         <li className="">Corporate Information</li>
         </ul>
       </div>

       <div className="col-span-4">
       {/* <h1 className='text-sm font-bold col-span-2'>EXPERIENCE ON-U APP ON MOBILE</h1> */}
        <div className='grid grid-cols-2 gap-4 pt-6 w-[50%]'>
          <img src={g1} alt="" />
          <img src={g2} alt="" />
        </div>
        <h1 className='text-sm font-extrabold col-span-2 mt-6'>KEEP IN TOUCH</h1>
        <br />
        <div className='flex'>
          <span className='text-2xl text-slate-800 mr-4'><AiFillFacebook /></span>
          <span className='text-2xl text-slate-800 mr-4'><ImTwitter /></span>
          <span className='text-2xl text-slate-800 mr-4'><AiFillYoutube /></span>
          <span className='text-2xl text-slate-800 mr-4'><ImInstagram /></span>
        </div>
       
       </div>
       <div className="col-span-4">
            <div className='grid grid-cols-6 text-black'>
                  <div className="col-span-1"><img src={g3} alt="" className='w-14' /></div>
                  <div className="col-span-5">
                    
                  <span className='font-bold text-black'>100% ORIGINAL</span>  guarantee <br />
                    for all products at on_u.com
                  </div>
            </div>
            <br />
            <div className='grid grid-cols-6 text-black'>
                <div className="col-span-1"><img src={g4} alt="" className='w-12' /></div>
                <div className="col-span-5">
                  
                <span className='font-semibold'>Return within 30days</span> of<br />
                receiving your order
            </div>
            </div>
       </div>

      </div>
      <div className='w-10/12 mx-auto font1 text-base text-black'>
        <h1 className='font-extrabolds text-black mb-4 mt-4 text-sm'>POPULAR SEARCHES</h1>
        <h1>
        Makeup | Dresses For Girls | T-Shirts {/* | Sandals | Headphones | Babydolls | Blazers For Men | Handbags | Ladies Watches | Bags | Sport Shoes | Reebok Shoes | Puma Shoes | Boxers | Wallets | Tops | Earrings | Fastrack Watches | Kurtis | Nike | Smart Watches | Titan Watches | Designer Blouse | Gowns | Rings | Cricket Shoes | Forever 21 | Eye Makeup | Photo Frames | Punjabi Suits | Bikini | Onu Fashion Show | Lipstick | Saree | Watches | Dresses | Lehenga | Nike Shoes | Goggles | Bras | Suit | Chinos | Shoes | Adidas Shoes | Woodland Shoes | Jewellery | Designers Sarees */}
        </h1>
      </div>
      <div className='relative w-10/12 mx-auto text-black'>
        <span className='absolute right-0'> © 2024 www.On-U.com. All rights reserved.</span> 
      </div>
    </Fragment>

    :

    <Fragment>
        <div className='w-10/12 mx-auto font1 mt-4'>
       <div className="w-full">
         <h1 className=' text-base font-extrabold'>SHOP&nbsp;&nbsp;FOR</h1>
         <ul className=' text-sm text-slate-500 pt-2 flex '>
           <li className='mr-2'>Men</li>|
           <li className='mr-2 ml-2'>Women</li>|
           <li className='mr-2 ml-2'>Kids</li>|
         </ul>
       </div>

       <div className="mt-4">
       <h1 className='text-base font-extrabold '>EXPERIENCE ON-U APP ON MOBILE</h1>
        <div className='grid grid-cols-2 gap-4 pt-2 w-[60%]'>
          <img src={g1} alt="" />
          <img src={g2} alt="" />
        </div>
        <h1 className='text-base font-extrabold mt-4'>KEEP IN TOUCH</h1>
        
        <div className='flex mt-2'>
        <span className='text-3xl text-slate-500 mr-4'><AiFillFacebook/></span>
        <span className='text-3xl text-slate-500 mr-4'><ImTwitter/></span>
        <span className='text-3xl text-slate-500 mr-4'><AiFillYoutube/></span>
        <span className='text-3xl text-slate-500 mr-4'><ImInstagram/></span>
        </div>
       
       </div>

       <div className="mt-4 w-full">
        <h1 className='text-base font-extrabold'>USEFUL LINKS</h1>
        <div className='text-sm text-slate-700 pt-2 leading-7 w-[100%] overflow-clip'>
          <a className="mr-2 leading-7">Contact Us</a>|
          <a className="mr-2 leading-7 ml-2">FAQ</a>|
          <a className="mr-2 leading-7 ml-2">T&C</a>|
          <a className="mr-2 leading-7 ml-2">Terms Of Use</a>|
          <a className="mr-2 leading-7 ml-2">Track Orders</a>|
          <a className="mr-2 leading-7 ml-2">Shipping</a>|
          <a className="mr-2 leading-7 ml-2">Cancellation</a>|
          <a className="mr-2 leading-7 ml-2">Returns</a>|
          <a className="mr-2 leading-7 ml-2">Whitehat</a>|
          <a className="mr-2 leading-7 ml-2">Blog</a>|
          <a className="mr-2 leading-7 ml-2">Careers</a>|
          <a className="mr-2 leading-7 ml-2">Privacy Policy</a>|
          <a className="mr-2 leading-7 ml-2">Site Map</a>|
          <a className="mr-2 leading-7 ml-2">Corporate Information</a>
         </div>
       </div>

       <div className='flex mx-auto text-slate-400 mt-4 mb-20'>
        <div className=' text-xs float-left'> © 2024 www.On-U.com All rights reserved</div>
      </div>
      </div>
     
    </Fragment>

    }

</Fragment>
    
  )
}

export default Footer