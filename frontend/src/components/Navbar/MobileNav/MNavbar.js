import React, { Fragment, useEffect, useState } from 'react'
import './MNavbar.css'
import Ripples from 'react-ripples'
import Mhome from './Msubmenu/Home'
import { Link, useNavigate } from 'react-router-dom'
import {logout} from '../../../action/useraction'
import { useDispatch, useSelector} from 'react-redux'
import {MdPerson} from 'react-icons/md'
import {Allproduct} from '../../../action/productaction'
import MProductsBar from './Msubmenu/ProductsBar'
import { FaHeart } from 'react-icons/fa'
import { getbag, getwishlist } from '../../../action/orderaction'
import { ChevronRight, X } from 'lucide-react'
import { useSessionStorage } from '../../../Contaxt/SessionStorageContext'
import { ImFacebook, ImGoogle, ImInstagram, ImTwitter } from 'react-icons/im'
import SideBarBag from '../SideBarBag'
import { IoMenu, IoSearch } from 'react-icons/io5'
import MKeywoardSerach from './MKeywoardSerach'
import { useLocalStorage } from '../../../Contaxt/LocalStorageContext'
import bagCartIcon from '../../images/shopping-cart.png'

const MNavbar = ({ user }) => {
    const[currentWishListCount,setWishListCount] = useState(0);
    const[currentBagCount,setBagCount] = useState(0);
    const { sessionData,sessionBagData } = useSessionStorage();
    const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
    const dispatch = useDispatch()
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const navigation = useNavigate()
    const [showMenuView, setMenuShow] = useState(false);
    const [showbagView, setBagShow] = useState(false);
    const [Class, setClass] = useState("hidden");
    const [Menul, setMenul] = useState("hidden");
    const [Menu2, setMenu2] = useState("hidden");
    const [Menu3, setMenu3] = useState("hidden");
    const [Menu4, setMenu4] = useState("hidden");
    const [Women, setWomen] = useState(false)
    const classchange = () => setClass("block");
    const classunchange = () => setClass("hidden");
    const handleMenuClose = () => (setMenuShow(false));
    const handleShow = () => setMenuShow(true);    

    const logoutBTN = () =>{
        dispatch(logout())
    }

    const [serdiv, setserdiv] = useState('hidden')
    const [state, setstate] = useState("")
	const{saveSearchKeywoards} = useLocalStorage();

    function searchenter(e) {
        if (e.keyCode == 13) {
            if (state.trim()) {
                navigation(`/products?keyword=${state}`)
                dispatch(Allproduct())
                setserdiv('hidden')
				saveSearchKeywoards(state);
            } else {
                navigation('/products')
                setserdiv('hidden')
            }
            
        }
     
    }

    function searchenters(activeSearch) {
        if (activeSearch.trim()) {
            navigation(`/products?keyword=${activeSearch}`)
			saveSearchKeywoards(activeSearch);
        } else {
            navigation(`/products?keyword=${state}`)
			saveSearchKeywoards(state);
        }
		dispatch(Allproduct())
		setserdiv('hidden')
    }
    useEffect(()=>{
        if(user){
			dispatch(getbag());
			dispatch(getwishlist())
        }
    },[user,dispatch])
    useEffect(() => {
        // Optionally you can trigger updates based on other session storage events here
        // console.log("Nav Bar sessionBagData: ",sessionBagData);
        setWishListCount(sessionData.length);
        setBagCount(sessionBagData.length);
    }, [sessionData,sessionBagData]);
    
    return (
        <Fragment>
            <div className='MNavbar hidden font-kumbsan sticky top-0 bg-white underline-offset-1 overflow-x-hidden h-max z-10' >
                <div className='relative w-full h-full'>
                <div className=' border-b-2 h-14 px-3 py-3 '>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row justify-center items-center'>
                            <IoMenu color='black' className='text-4xl ' onClick={() => (handleShow(), classchange())} />
                            <Link to='/'> <h1 className='text-black px-3 text-3xl text-center font-extrabold'>ON U</h1></Link>
                        </div>

                        <div className='right-2 absolute flex-row justify-center items-center'>
                            <div className='float-right relative m-2 pb-0.5'>
                                {user && bag && bag.orderItems && bag.orderItems.length > 0 && (
                                    <div className="absolute top-[-5px] right-[-5px] bg-gray-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                        <span>{bag.orderItems.length}</span>
                                    </div>
                                )}
                                {!user && currentBagCount > 0 && (
                                    <div className="absolute top-[-5px] right-[-5px] bg-gray-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                        <span>{currentBagCount}</span>
                                    </div>
                                )}
                                <button onClick={()=> {
									setBagShow(!showbagView)
								}}>
									{/* <IoBagRemoveSharp size={26} color='black'/> */}
									<img
										src={bagCartIcon}
										alt='bag-icon'
										className='w-7 h-7'
									/>
								</button>
                            </div>
                            <div className='float-right relative m-2 pb-0.5'>
                                {user && wishlist && wishlist.orderItems && wishlist.orderItems.length > 0 && (
                                    <div className="absolute top-[-5px] right-[-5px] bg-gray-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                        <span>{wishlist.orderItems.length}</span>
                                    </div>
                                )}
                                {!user && currentWishListCount > 0 && (
                                    <div className="absolute top-[-5px] right-[-5px] bg-gray-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                        <span>{currentWishListCount}</span>
                                    </div>
                                )}
                                <Link to='/my_wishlist'><FaHeart size={26} color='black'/></Link>
                            </div>
                            <IoSearch size={25} strokeWidth={.9} color='black' className='float-right m-2' onClick={()=> setserdiv('block')}/>
                        </div>
                    </div>
                    
                </div>
                <div className={`${serdiv} z-20 absolute w-full h-full  top-0 bg-white`}>
                    {/* <div className='grid grid-cols-12 py-3 px-[6px]'>
                        <div className="col-span-1 align-middle text-center flex items-center text-2xl"onClick={()=> setserdiv('hidden')}><MdArrowBack color='black'/></div>
                        <div className="col-span-10">
                        <input type="text" placeholder='Search for products' 
                            className='msearch caret-[#ff2459] w-full h-full bg-white' onChange={(e)=> setstate(e.target.value)} onKeyUp={(e)=>searchenter(e)}/>
                        </div>
                        <div className="col-span-1 flex items-center text-center align-middle" onClick={()=>(searchenters())}><FiSearch color='black' strokeWidth={.9} className='text-2xl text-black' /></div>
                    </div> */}
					<MKeywoardSerach
						setserdiv = {setserdiv}
						state={state}
						setstate={setstate}
						searchenter = {searchenter}
						searchenters = {searchenters}
					/>
                </div>
                </div>
            </div>

			<div>

                {/* Overlay */}
                {showbagView && (
                    <div
                        className="fixed inset-0 bg-gray-800 h-screen bg-opacity-50 z-50 transition-opacity duration-300"
                        onClick={()=> setBagShow(false)}
                    ></div>
                )}

                {/* Offcanvas */}
                <div
                    className={`fixed top-0 right-0 w-[75vw] h-screen bg-white shadow-lg z-[60] border border-gray-700 border-opacity-50 transform transition-all duration-500 ease-in-out ${showbagView ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="py-3 sm:relative">                    
						{/* X Button at Top Left */}
						<button 
							onClick={() => {
								// Implement the function to hide or close the left section (you can set state to toggle visibility)
								setBagShow(false);
							}} 
							className="absolute top-0 left-3 block sm:hidden text-black rounded-full w-8 h-8 items-center justify-center text-lg">
							<X size={24} className='text-3xl' />
						</button>
                        <ul className='min-w-full py-4'>
                            <SideBarBag OnChangeing={()=>{
								setBagShow(false);
							}}/>
                        </ul>
                    </div>
                </div>
            </div>

            <div>

                {/* Overlay */}
                {showMenuView && (
                    <div
                        className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transition-opacity duration-300"
                        onClick={handleMenuClose}
                    ></div>
                )}

                {/* Offcanvas */}
                <div
                    className={`fixed top-0 right-0 w-[75vw] h-screen bg-white shadow-lg z-50 transform transition-all duration-500 ease-in-out ${showMenuView ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="p-4 relative max-h-screen overflow-y-auto">             
                        <ul className=''>
							<button 
								onClick={(e)=>{
									e.stopPropagation();
									handleMenuClose();
								}} 
								className="absolute top-3 left-4 block sm:hidden text-black rounded-full w-8 h-8 items-center justify-center text-lg">
								<X size={24} className='text-3xl justify-self-center' />
							</button>
                            <Ripples color="#2C3930" className="w-full mt-7">
                                <div className=" px-5 justify-start items-center space-x-4 flex-row py-4 relative w-full flex" onClick={(e)=>{
									e.stopPropagation();
									if(user){
										navigation("/dashboard");
									}else{
										navigation('/Login');
									}
									setMenuShow(false);
									setClass("hidden");
								}}>
                                    <div className='w-10 h-10 rounded-full flex justify-center items-center bg-gray-500'>
										{
											user?.user?.profilePic ? <img
												src={user?.user.profilePic}
												alt={user?.user?.name}
												className="w-full h-full rounded-full"
												style={{ objectFit: "cover" }}

											/> : <MdPerson size={24} color='black'/>
										}
										
                                    </div>
                                    <span className="float-left text-black text-[13px] font-bold flex items-center">
                                        {user ? user?.user?.name || user?.name:"Login"}
                                    </span>
                                </div>
                            </Ripples>

                            <Ripples color="#2C3930" className="w-full">
                                <div
                                    className="text-black  px-5 py-4 relative w-full flex"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuShow(false);
                                        setClass("hidden");
                                        navigation("/");
                                    }}
                                >
                                    <span className="float-left">Home</span>
                                </div>
                            </Ripples>

                            <Ripples color="#2C3930" className="w-full">
                                <li
                                    className="text-black px-5 py-4 w-full flex flex-row justify-between items-center"
                                    onClick={() => {
                                        setWomen(!Women);
                                        setMenu2(Menu2 === "hidden" ? "block" : "hidden");
                                    }}
                                >
                                    <span className="">Shop</span>
                                    <ChevronRight size={20} className={` duration-300 transition-all ease-ease-out-expo ${Menu2 === "block"? "rotate-90" : ""}`} />
                                </li>
                            </Ripples>

                            <MProductsBar
                                showProducts={Menu2}
                                onClose={() => {
                                    setMenuShow(false);
                                    setClass("hidden");
                                    setMenu2("hidden");
                                }}
                            />
                            <Ripples color="re" className="w-full">
                                <li
                                    className="text-black  px-5 py-4 relative w-full flex"
                                    onClick={(e) => {
                                        setMenuShow(false);
                                        setClass("hidden");
                                        // Create the URL with query parameters
                                        const queryParams = new URLSearchParams();
                                    
                                        queryParams.set('sortBy', 'newest');
                                    
                                        // Construct the URL for the /products page
                                        const url = `/products?${queryParams.toString()}`;
                                    
                                        // Navigate to the new URL (using React Router)
                                        navigation(url);
                                        // navigation("/about");
                                    }}
                                >
                                    <span className="float-left">New Arrivals</span>
                                </li>
                            </Ripples>
                            <Ripples color="re" className="w-full">
                                <li
                                    className="text-black  px-5 py-4 relative w-full flex"
                                    onClick={(e) => {
                                        setMenuShow(false);
                                        setClass("hidden");
                                        /* // Create the URL with query parameters
                                        const queryParams = new URLSearchParams();
                                    
                                        queryParams.set('onSale', 'true');
                                    
                                        // Construct the URL for the /products page
                                        const url = `/products?${queryParams.toString()}`; */
                                    
                                        // Navigate to the new URL (using React Router)
                                        navigation('/products');
                                        // navigation("/about");
                                    }}
                                >
                                    <span className="float-left">Best Sellers</span>
                                </li>
                            </Ripples>
                            <Ripples color="re" className="w-full">
                                <li
                                    className="text-black  px-5 py-4 relative w-full flex"
                                    onClick={(e) => {
                                        setMenuShow(false);
                                        setClass("hidden");
                                        // Create the URL with query parameters
                                        const queryParams = new URLSearchParams();
                                    
                                        queryParams.set('onSale', 'true');
                                    
                                        // Construct the URL for the /products page
                                        const url = `/products?${queryParams.toString()}`;
                                    
                                        // Navigate to the new URL (using React Router)
                                        navigation(url);
                                        // navigation("/about");
                                    }}
                                >
                                    <span className="float-left">On Sale</span>
                                </li>
                            </Ripples>
                            <Ripples color="re" className="w-full">
                                <li
                                    className="text-black  px-5 py-4 relative w-full flex"
                                    onClick={(e) => {
                                        setMenuShow(false);
                                        setClass("hidden");
                                        navigation("/about");
                                    }}
                                >
                                    <span className="float-left">About Us</span>
                                </li>
                            </Ripples>

                            <Ripples color="black" className="w-full">
                                <li
                                    className="text-black px-5 py-4 relative w-full flex"
                                    onClick={(e) => {
                                        setMenuShow(false);
                                        setClass("hidden");
                                        navigation("/contact");
                                    }}
                                >
                                    <span className="float-left">Contact</span>
                                </li>
                            </Ripples>

                            <Mhome Mhome={Menu4} fun1={handleMenuClose} fun2={classunchange} />
                        </ul>
                        <hr />
                        <div className="px-5 flex-row flex space-x-4 mt-7 text-[#282c3fd2] text-sm">
                            <ImFacebook size={30} className="text-gray-700 hover:text-blue-600 transition duration-300 text-xl" />
                            <ImGoogle size={30} className="text-gray-700 hover:text-red-600 transition duration-300 text-xl" />
                            <ImTwitter size={30} className="text-gray-700 hover:text-blue-400 transition duration-300 text-xl" />
                            <ImInstagram size={30} className="text-gray-700 hover:text-pink-600 transition duration-300 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

        </Fragment >
    )
}


export default MNavbar
