import React, { Fragment, useState, useCallback, useEffect } from 'react'
import './Navbar.css'
import onUlogo from '../images/applogo.png'
import { FaRegUser } from 'react-icons/fa'
import { BsHeart } from 'react-icons/bs'
import { BsHandbag } from 'react-icons/bs'
import Search from './Search.js'
import Men from './Submenu/Men'
import Women from './Submenu/Women'
import Kids from './Submenu/Kids'
import Home from './Submenu/Home'
import Beauty from './Submenu/Beauty'
import Studio from './Submenu/Studio'
import Profile from './Submenu/Profile'
import {Link} from 'react-router-dom'
import ProductsBar from './Submenu/ProducstBar.js'
import { useDispatch, useSelector } from 'react-redux'
import { getbag } from '../../action/orderaction.js'
import { ShoppingCart } from 'lucide-react'


const Navbar = ({user}) => {
  const dispatch = useDispatch();
  const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
  const { product, pro, loading, error, length } = useSelector(state => state.Allproducts)
  console.log("Navbar User: ", user)
  const [Menu1, setMenu1] = useState('hidden')
  const [Menu2, setMenu2] = useState('hidden')
  const [Menu3, setMenu3] = useState('hidden')
  const [Menu4, setMenu4] = useState('hidden')
  const [Menu5, setMenu5] = useState('hidden')
  const [Menu6, setMenu6] = useState('hidden')
  const [Menu7, setMenu7] = useState('hidden')
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)
  const [show5, setShow5] = useState(false)
  const [show6, setShow6] = useState(false)
  const [show7, setShow7] = useState(false)
  
  

  const callback = useCallback((Menu, v) => {
    setMenu1(Menu);
    setShow1(v)
  }, []);

  const Callbackmenu2 = useCallback((Menu2, v) => {
    setMenu2(Menu2);
    setShow2(v)
  }, []);

  const Callbackmenu3 = useCallback((Menu3, v) => {
    setMenu3(Menu3);
    setShow3(v)
  }, []);

  const Callbackmenu4 = useCallback((Menu4, v) => {
    setMenu4(Menu4);
    setShow4(v)
  }, []);

  const Callbackmenu5 = useCallback((Menu5, v) => {
    setMenu5(Menu5);
    setShow5(v)
  }, []);

  const Callbackmenu6 = useCallback((Menu6, v) => {
    setMenu6(Menu6);
    setShow6(v)
  }, []);

  const Callbackmenu7 = useCallback((Menu7, v) => {
    setMenu7(Menu7);
    setShow7(v)
  }, []);

  useEffect(()=>{
    if(user){
      dispatch(getbag({ userId: user.id }));
    }
  },[user])
  console.log("Nav Bar bag: ",bag?.orderItems)
  return (
    <Fragment>
      <div className="container sticky top-0 2xl:w-[100%] xl:w-[100%] lg:w-[100%] mx-auto w-screen max-w-[100%] h-[80px] bg-white contenthide z-40 ">
        <div className='flex-row flex justify-between items-center w-screen h-full'>

          <ul className=' h-full flex font1 font-semibold text-base md:text-[14px] text-[#282c3f] tracking-[.3px] uppercase'>
            <Link className='w-max px-3 flex items-stretch hover:animate-vibrateScale' to="/">
              <li className='w-max flex items-stretch'>
                
                <div className='w-auto justify-between items-center h-auto flex-row flex rounded-t'>
                  {/* <img src={onUlogo} alt="On-U Logo" className='w-14 h-full object-contain rounded-lg' /> */}
                  <Link to='/'> <h1 className='text-slate-800 text-3xl py-1 ml-2 font-extrabold text-center'>On U</h1></Link>
                </div>
                
              </li>
            </Link>
            <Link className='w-max px-3 flex items-stretch hover:animate-vibrateScale' to="/">
              <li className='w-max flex  justify-center items-center border-4 border-transparent cborder1 cursor-pointer'
                onMouseEnter={() => (setMenu1('block'), setShow1(true))} onMouseLeave={() => (setMenu1('hidden'), setShow1(false))}
              >
                <h1 className='px-3'>HOME</h1>
              </li>
            </Link>
              <Link to={"/products"} className='w-max px-3 flex items-stretch hover:animate-vibrateScale'>
                <li className='w-max flex justify-center items-center border-4 border-transparent cborder2 cursor-pointer'
                  onMouseEnter={() => (setMenu2('block'), setShow2(true))} onMouseLeave={() => (setMenu2('hidden'), setShow2(false))}
                >
                  <h1 className='px-3'>PRODUCTS</h1>
                </li>
              </Link>

            <Link to={'/about'} className='w-max px-3 flex items-stretch hover:animate-vibrateScale'>
              <li className='w-max flex justify-center items-center border-4 border-transparent cborder3 cursor-pointer'>
                <h1 className='px-3'>ABOUT</h1>
              </li>
            </Link>
            <Link to={'/contact'} className='w-max px-3 flex items-stretch hover:animate-vibrateScale'>
              <li className='w-max flex justify-center items-center border-4 border-transparent cborder3 cursor-pointer'>
                <h1 className='px-3'>CONTACT</h1>
              </li>
            </Link>
          </ul>
          <div className="w-full flex justify-center h-14 mt-1 items-center">
            <div className="flex flex-row w-full h-full mx-6 py-1">
              <Search />
            </div>
          </div>

          <div className=' h-full mt-3 max-w-fit flex flex-row items-center justify-end'>
            <ul className='flex float-right h-full w-full text-[#282c3f] tracking-[.3px] sent'>
                <li className='w-max flex justify-center items-center font1 font-semibold capitalize no-underline text-sm border-4 border-transparent cursor-pointer'
                  onClick={() => (setMenu7(Menu7 === 'block' ? "hidden" : "block"), setShow7(!show7))}
                  onMouseEnter={() => (setMenu7('block'), setShow7(true))} onMouseLeave={() => (setMenu7('hidden'), setShow7(false))}
                >
                  <l1 className='px-3  text-center text-xs relative hover:animate-vibrateScale'> <span className='text-lg block absolute -top-5 left-1/3'><FaRegUser color='black' /></span> <span className='block'>PROFILE</span> </l1>
                </li>
                {/* <li className='w-max flex justify-center items-center font1 font-semibold capitalize no-underline text-sm border-4 border-transparent ' >
                  <Link to='/my_wishlist'><h1 className='px-1 text-xs text-center relative '> <span className='text-lg absolute -top-5 left-1/3 justify-center items-center'><BsHeart color='black' className='w-full h-full flex'/></span>Wishlist</h1></Link>
                </li> */}
                <li className="w-max flex justify-center items-center font1 font-semibold capitalize no-underline text-sm border-4 border-transparent relative">
                  {user && bag && bag.orderItems && bag.orderItems.length > 0 && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                        <span>{bag.orderItems.length}</span>
                    </div>
                  )}
                  <Link to="/bag">
                    <h1 className="px-3 text-xs text-center relative">
                      <span className="text-lg absolute -top-5 left-1/3">
                        <BsHandbag color="black" />
                      </span>
                      BAG
                    </h1>
                  </Link>
                </li>
            </ul>
          </div>
        </div>
        {/* <Men show={show1} CMenu={Menu1} parentCallback={callback} /> */}
        {/* <Women show={show2} CMenu={Menu2} parentCallback={Callbackmenu2} /> */}
        <ProductsBar show={show2} CMenu={Menu2} parentCallback={Callbackmenu2} />
        {/* <Kids show={show3} CMenu={Menu3} parentCallback={Callbackmenu3} /> */}
        <Profile user={user} show={show7} CMenu={Menu7} parentCallback={Callbackmenu7} /> 
        {/* <Home show={show4} CMenu={Menu4} parentCallback={Callbackmenu4} />  */}
        {/* <Beauty show={show5} CMenu={Menu5} parentCallback={Callbackmenu5} /> */}
        {/* <Studio show={show6} CMenu={Menu6} parentCallback={Callbackmenu6} /> */}

      </div>
      

    </Fragment>
  )
}

export default Navbar
