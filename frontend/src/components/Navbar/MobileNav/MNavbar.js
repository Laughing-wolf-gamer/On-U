import React, { Fragment, useEffect, useState } from 'react'
import './MNavbar.css'
import { AiOutlineMenu } from 'react-icons/ai'
import { FiSearch } from 'react-icons/fi'
import { BsHeart } from 'react-icons/bs'
import { BsHandbag } from 'react-icons/bs'
import { GoDiffAdded } from 'react-icons/go'
import Offcanvas from 'react-bootstrap/Offcanvas'
import { useTransition, animated } from 'react-spring'
import Mbanner from '../../images/Nbanner.webp'
import Ripples from 'react-ripples'
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io'
import MMen from './Msubmenu/Men'
import MWoMen from './Msubmenu/Women'
import MKids from './Msubmenu/Kids'
import Mhome from './Msubmenu/Home'
import Mbeauty from './Msubmenu/Beauty'
import { Link, useNavigate } from 'react-router-dom'
import {logout, getuser, otpverifie, loginmobile} from '../../../action/useraction'
import { useDispatch, useSelector} from 'react-redux'
import { useAlert } from 'react-alert'
import {registermobile} from '../../../action/useraction'
import {MdArrowBack} from 'react-icons/md'
import {Allproduct} from '../../../action/productaction'
import { Alert } from '@mui/material'
import MProductsBar from './Msubmenu/ProductsBar'
import { FaUserAlt } from 'react-icons/fa'
import { getbag } from '../../../action/orderaction'
import { ShoppingCart } from 'lucide-react'


const MNavbar = ({ user }) => {

    const dispatch = useDispatch()
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const redirect = useNavigate()
    const [show, setShow] = useState(false);
    const [Class, setClass] = useState("hidden");
    const [Menul, setMenul] = useState("hidden");
    const [Menu2, setMenu2] = useState("hidden");
    const [Menu3, setMenu3] = useState("hidden");
    const [Menu4, setMenu4] = useState("hidden");
    const [Menu5, setMenu5] = useState("hidden");
    const [startX, setstartX] = useState(null)
    const [startY, setstartY] = useState(null)
    const [Men, setMen] = useState(false)
    const [Women, setWomen] = useState(false)
    const [Kids, setKids] = useState(false)
    const [Home, setHome] = useState(false)
    const [Beauty, setBeauty] = useState(false)
    const classchange = () => setClass("block");
    const classunchange = () => setClass("hidden");
    const handleClose = () => (setShow(false), redirect('/products'));
    const handleShow = () => setShow(true);
    const loginunchange = () => setClass("hidden");
    const loginClose = () => setShow(false);


    const transitions = useTransition(show, {

        from: { transform: "translateX(0)" },
        enter: { transform: "translateX(75vw)" },
        leave: { transform: "translateX(0vw)" },
        delay: 1000,

    })

    const touchstart = (e) => {

        let startX = e.changedTouches[0].clientX
        let startY = e.changedTouches[0].clientY
        setstartX(startX)
        setstartY(startY)

    }




    const touchhandler = (e) => {

        var xm = e.changedTouches[0].clientX;
        var ym = e.changedTouches[0].clientY;
        var el = document.getElementById('offcanvas')
        var total = el.clientWidth;
        var position = xm - total;
        var x = startX - xm
        var y = startY - ym

        if (x < 0 && y >= 0) {  // - + up
            if (y > -x) {
                return
            }
            if (y < -x) {
                return
            }

        }
        if (x >= 0 && y >= 0) { // + + down
            if (y > x) {
                return
            }

            if (y < x) {
                if (x > 20) {
                    if (position < 0) { el.style.transform = `translateX(${position}px)` }
                    else if (position >= 0) { el.style.transform = `translateX(0px)` }
                }
            }
        }
        if (x < 0 && y < 0) { // - - left
            console.log("hello")
            if (-y > -x) {
                return
            }
            if (-y < -x) {
                return
            }
        }
        if (x >= 0 && y < 0) { // + - right
            if (-y > x) {
                return
            }

            if (y < x) {
                if (x > 20) {
                    if (position < 0) { el.style.transform = `translateX(${position}px)` }
                    else if (position >= 0) { el.style.transform = `translateX(0px)` }
                }
            }
        }


    }

    const touchend = (e) => {
        var xm = e.changedTouches[0].clientX;
        var ym = e.changedTouches[0].clientY;
        var el = document.getElementById('offcanvas')
        var total = el.clientWidth;
        var position = xm - total;
        var x = startX - xm;
        var y = startY - ym
        /* console.log("x:", x)
        console.log("y:", y)
        console.log("P:", -position) */
        if (x >= 0 && y >= 0) { // + + down
            if (x > 20 && x > y) {

                if (-position >= 60) {
                    el.style.display = `none`;
                    setShow(false)
                    setClass("hidden")
                } else {
                    el.style.transform = `translateX(0)`
                }

            }

        }
        if (x >= 0 && y < 0) { // + - right

            if (x > 20 && x > -y) {

                if (-position >= 60) {

                    el.style.display = `none`;
                    setShow(false)
                    setClass("hidden")
                } else {
                    el.style.transform = `translateX(0)`
                }
            }
        }
    }

    const logoutBTN = () =>{
        dispatch(logout())
        // Alert.show('Logout Successfully')
        /* dispatch(getuser())
        dispatch(loginmobile())
        dispatch(otpverifie()) */
      }

      const [serdiv, setserdiv] = useState('hidden')
      const [state, setstate] = useState("")

      function searchenter(e) {
       
        if (e.keyCode == 13) {
            if (state.trim()) {
                redirect(`/products?keyword=${state}`)
                dispatch(Allproduct())
                setserdiv('hidden')
            } else {
                redirect('/products')
                setserdiv('hidden')
            }
            
        }
     
    }

    function searchenters() {
        if (state.trim()) {
            redirect(`/products?keyword=${state}`)
            dispatch(Allproduct())
            setserdiv('hidden')
        } else {
            redirect('/products')
            setserdiv('hidden')
        }
    }
    useEffect(()=>{
        if(user){
          dispatch(getbag({ userId: user.id }));
        }
    },[user])
    console.log("Nav Bar bag: ",bag?.orderItems?.length)
    return (
        <Fragment>
            <div className='MNavbar hidden sticky top-0 bg-white overflow-x-hidden h-max z-10 ' >
                <div className='relative w-full h-full'>
                <div className=' border-b-2 h-14 px-3 py-3 '>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row justify-center items-center'>
                            <AiOutlineMenu color='black' className='text-3xl ' onClick={() => (handleShow(), classchange())} />
                            <Link to='/'> <h1 className='text-black px-3 text-3xl text-center font-extrabold'>ON U</h1></Link>
                        </div>

                        <div className='absolute right-2 flex-row justify-center items-center'>
                            {user && bag && bag.orderItems && bag.orderItems.length > 0 && (
                                <div className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                    <span>{bag.orderItems.length}</span>
                                </div>
                            )}
                            {/* <ShoppingCart /> */}
                            <Link to='/bag'><ShoppingCart size={26} color='black' className='float-right m-2 pb-0.5' /></Link>
                            
                            <FiSearch size={25} color='black' className='float-right m-2' onClick={()=> setserdiv('block')}/>
                        </div>
                    </div>
                    
                </div>
                <div className={`${serdiv} z-20 absolute w-full h-full top-0 bg-white`}>
                    <div className='grid grid-cols-12 py-3 px-[6px]'>
                        <div className="col-span-1 align-middle text-center flex items-center text-2xl"onClick={()=> setserdiv('hidden')}><MdArrowBack color='black'/></div>
                        <div className="col-span-10">
                        <input type="text" placeholder='Search for brands & products' 
                            className=' msearch caret-[#ff2459] w-full h-full bg-white' onChange={(e)=> setstate(e.target.value)} onKeyUp={(e)=>searchenter(e)}/>
                        </div>
                        <div className="col-span-1 flex items-center text-center align-middle" onClick={()=>(searchenters())}><FiSearch color='black' strokeWidth={.9} className='text-2xl text-black' /></div>
                    </div>
                </div>
                </div>
            </div>


            <div className={`w-[100vw] ${Class} absolute top-0 z-10 overflow-y-scroll`}>
                <div className='overflow-y-scroll canvas'>
                    {transitions((styles, item) => item && <animated.div style={styles}>
                        <Offcanvas show={show} onHide={() => (loginClose(), loginunchange())} id="offcanvas"
                            className='absolute canvas  h-[100vh] top-0 z-20 translate-x-0 bg-white focus:outline-0 overflow-y-scroll'
                            onTouchEnd={touchend} onTouchMove={touchhandler} onTouchStart={touchstart}
                        >
                            <Offcanvas.Body className='border-none'>
                                <img src={Mbanner} alt="Banner" className='min-h-[150px]'/>
                                    {
                                        user ?

                                            <div className='text-slate-400 font1 text-xs font-bold absolute right-14 top-24 ' onClick={()=>(loginClose(), loginunchange(),logoutBTN())}>
                                                <span>LOGOUT</span>
                                            </div>
                                        :
                                            <div className='text-slate-400 font1 text-xs font-bold absolute right-14 top-24 'onClick={()=>(loginClose(), loginunchange())}>
                                                <Link to='/registeruser'>
                                                    <span>SIGN UP.</span>
                                                </Link>
                                                <Link to='/Login'> 
                                                    <span>&nbsp;&nbsp;&nbsp;LOGIN</span>
                                                </Link>
                                            </div>
                                    }
                                <ul>
                                    {/* Profile */}
                                    <Ripples color="#fb56c1" className='w-full'>
                                        <li className='text-black font1 px-5 py-4 relative w-full flex'>
                                            {user ? (
                                                <Link to="/dashboard">
                                                    <span className='float-left flex items-center'>
                                                        <FaUserAlt size={20} className='mr-2' /> Profile
                                                    </span>
                                                </Link>
                                            ) : (
                                                <Link to="/Login">
                                                    <span className='float-left'>Login</span>
                                                </Link>
                                            )}
                                        </li>
                                    </Ripples>
                                    <Ripples color="#fb56c1" className='w-full'>
                                        <li className='text-black font1 px-5 py-4 relative w-full flex '>
                                            <Link to="/"><span className='float-left'>Home</span></Link>
                                        </li>
                                    </Ripples>
                                    
                                    {/* <MMen Men={Menul} fun1={handleClose} fun2={classunchange} /> */}
                                    <Ripples color="#fb56c1" className='w-full'>
                                        <li className='text-black font1 px-5 py-4 relative w-full flex ' onClick={() => (setWomen(Women ? (false) : (true)), setMenu2(Menu2 === "hidden" ? "block" : "hidden"))}>
                                            <span className='float-left'>Products</span>
                                            <span className='absolute mx-5 right-0'>{Women ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
                                        </li>
                                    </Ripples>
                                    <MProductsBar showProducts={Menu2}/>
                                    <Ripples color="re" className='w-full'>
                                        <li className='text-black font1 px-5 py-4 relative w-full flex '>
                                            <Link to='/about'><span className='float-left'>About Us</span></Link>
                                        </li>
                                    </Ripples>
                                    <Ripples color="black" className='w-full'>
                                        <li className='text-black font1 px-5 py-4 relative w-full flex ' >
                                            <Link to='/contact'><span className='float-left'>Contact</span></Link>
                                        </li>
                                    </Ripples>
                                    <Mhome Mhome={Menu4} fun1={handleClose} fun2={classunchange}/>
                                </ul>
                                <hr />
                                <div className='px-5 text-[#282c3fd2] text-sm'>
                                    <Link to={"/"}><h1 className='my-5'>Gift&nbsp;Cards</h1></Link>
                                    <Link to={"/contact"}><h1 className='my-5'>Contact&nbsp;Us</h1></Link>
                                    <Link to={"/faq"}><h1 className='my-5'>FAQs</h1></Link>
                                    {/* <h1 className='my-5'>Legal</h1> */}
                                </div>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </animated.div>
                    )}
                </div>

                <div className='h-[100vh] bg-[#64646435] w-auto ' onClick={() => (loginClose(), loginunchange())}></div>
            </div>


        </Fragment >
    )
}

export default MNavbar
