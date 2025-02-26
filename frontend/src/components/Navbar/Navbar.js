import React, { Fragment, useState, useCallback, useEffect } from 'react'
import './Navbar.css'
import { FaHeart, FaUser, FaUserAlt } from 'react-icons/fa'
import { BsHandbag, BsHeart } from 'react-icons/bs'
import Search from './Search.js'
import Profile from './Submenu/Profile'
import {Link} from 'react-router-dom'
import ProductCatView from './Submenu/ProductCatView.js'
import { useDispatch, useSelector } from 'react-redux'
import { getbag, getwishlist } from '../../action/orderaction.js'
import { SearchIcon } from 'lucide-react'
import { useFunctionContext } from '../../Contaxt/FunctionContext.js'
import { getLocalStorageBag, getLocalStorageWishListItem } from '../../config/index.js'
import { useSessionStorage } from '../../Contaxt/SessionStorageContext.js'
import { fetchAllOptions } from '../../action/common.action.js'
import { IoBagRemoveSharp, IoSearch } from 'react-icons/io5'
import SideBarBag from './SideBarBag.js'
import bagCartIcon from '../images/shopping-cart.png'


const Navbar = ({user}) => {
    const dispatch = useDispatch();
    const { state } = useFunctionContext();
    const[currentWishListCount,setWishListCount] = useState(0);
    const[currentBagCount,setBagCount] = useState(0);
    const { sessionData,sessionBagData } = useSessionStorage();
    const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const { product, pro, loading, error, length } = useSelector(state => state.Allproducts)
    const { options } = useSelector((state) => state.AllOptions);
    const [showbagView, setBagShow] = useState(false);
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
            dispatch(getwishlist())
        }
    },[user,dispatch])
    
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const toggleSearchBar = () => {
        setIsSearchVisible(!isSearchVisible);
    };
    const fetchAllWishList = ()=>{
        setTimeout(() => {
            dispatch(getwishlist())
        }, 900);
    }
    useEffect(() => {
        
        fetchAllWishList();
        if(user){
            dispatch(getbag({ userId: user.id }));
        }
    }, [state]);
	useEffect(() => {
	  dispatch(fetchAllOptions());
	}, [dispatch]);
    useEffect(() => {
        setWishListCount(sessionData.length);
        setBagCount(sessionBagData.length);
    }, [sessionData,sessionBagData]);
    return (
        <Fragment>
            <div className="container font-kumbsan sticky top-0 2xl:w-[100%] xl:w-[100%] lg:w-[100%] mx-auto w-screen max-w-[100%] h-[80px] bg-neutral-100 contenthide z-40 ">
                <div className='flex-row flex justify-between items-center w-screen h-full'>
                    <ul className=' h-full flex  font-semibold text-base md:text-[14px] text-[#282c3f] tracking-[.3px] uppercase'>
                        <Link className='w-max px-3 flex items-stretch hover:animate-vibrateScale' to="/">
                            <li className='w-max flex items-stretch'>
                                
                                <div className='w-auto justify-between items-center h-auto flex-row flex rounded-t'>
                                    <Link to='/'> <h1 className='text-[35px] py-1 ml-2 font-extrabold font-kumbsan text-center text-gray-800'>On U</h1></Link>
                                </div>
                                
                            </li>
                        </Link>
                    </ul>
                    <div className='h-full font-bold mt-3 w-fit flex flex-row px-5 items-center justify-end'>
                        <Link onClick={()=> setIsSearchVisible(false)} className='w-max px-3 flex items-stretch hover:animate-vibrateScale mb-5' to="/">
							<li className='w-max flex justify-center items-center border-4 border-transparent cursor-pointer'
								onMouseEnter={() => (setMenu1('block'), setShow1(true))} onMouseLeave={() => (setMenu1('hidden'), setShow1(false))}
							>
								<h1 className='px-3 text-center  text-slate-800'>HOME</h1>
							</li>
                        </Link>
                        <Link to={"/products"} onClick={()=> setIsSearchVisible(false)} className='w-max px-3 flex items-stretch hover:animate-vibrateScale mb-5'>
                            <li className='w-max flex justify-center items-center border-4 border-transparent cursor-pointer'
                                onMouseEnter={() => (setMenu2('block'), setShow2(true))} onMouseLeave={() => (setMenu2('hidden'), setShow2(false))}
                            >
                                <h1 className='px-3 text-center  text-slate-800'>PRODUCTS</h1>
                            </li>
                        </Link>
                        <Link to={'/about'} onClick={()=> setIsSearchVisible(false)} className='w-max px-3 flex items-stretch hover:animate-vibrateScale mb-5'>
                            <li className='w-max flex justify-center items-center border-4 border-transparent cursor-pointer'>
                                <h1 className='px-3 text-center  text-slate-800'>ABOUT</h1>
                            </li>
                        </Link>
                        <Link to={'/contact'} onClick={()=> setIsSearchVisible(false)} className='w-max px-3 flex items-stretch hover:animate-vibrateScale mb-5'>
                            <li className='w-max flex justify-center items-center border-4 border-transparent cursor-pointer'>
                                <h1 className='px-3 text-center  text-slate-800'>CONTACT</h1>
                            </li>
                        </Link>
                        <div className="flex flex-row w-full h-14 space-x-5 mb-5 mx-4">
							{isSearchVisible && <Search toggleSearchBar = {()=>{
								setIsSearchVisible(false);
							}} />
						}
                            <button onClick={toggleSearchBar} className={`text-black border-opacity-90 transition-all duration-300 ease-ease-out-expo ${isSearchVisible ? "z-30 bg-white border-gray-700 border hover:scale-105":"hover:border hover:animate-vibrateScale"} rounded-lg flex flex-col w-12 justify-center items-center`}>
                                <IoSearch strokeWidth={.5} size={25}/>
                            </button>
                        </div>
                        <ul className='flex float-right h-full w-full text-[#282c3f] tracking-[.3px] sent'>
                            <li className='w-max flex justify-center items-center  font-semibold capitalize no-underline text-sm border-4 border-transparent cursor-pointer'
                                onClick={() => (setMenu7(Menu7 === 'block' ? "hidden" : "block"), setShow7(!show7))}
                                onMouseEnter={() => (setMenu7('block'), setShow7(true))} onMouseLeave={() => (setMenu7('hidden'), setShow7(false))}
                            >
                                <div onClick={()=> setIsSearchVisible(false)} className="flex flex-row w-full h-6 mb-5 mx-4 hover:animate-vibrateScale">
                                    <Link to={`${user ? "/dashboard":"/Login"}`}>
                                        <FaUser className='w-full h-full justify-self-center text-slate-800'/>
                                    </Link>
                                </div>
                            </li>
                            <li onClick={()=> setIsSearchVisible(false)} className="w-max flex justify-center items-center  font-semibold capitalize no-underline text-sm border-4 border-transparent relative">
                                {user && wishlist && wishlist.orderItems && wishlist.orderItems.length > 0 && (
                                    <div className="absolute top-0 right-2 bg-gray-900 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                        <span>{wishlist?.orderItems?.length}</span>
                                    </div>
                                )}
                                {!user && currentWishListCount > 0 && (
                                    <div className="absolute top-0 right-2 bg-gray-900 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                        <span>{currentWishListCount}</span>
                                    </div>
                                )}
                                <div onClick={()=> setIsSearchVisible(false)} className="flex flex-row w-full h-6 mb-5 mx-4 hover:animate-vibrateScale">
                                    <Link to="/my_wishlist">
                                        <FaHeart className='w-full h-full justify-self-center text-slate-800'/>
                                    </Link>
                                </div>
                            </li>
                            <li className="w-max flex justify-center items-center pb-1.5  font-semibold font-kumbsan capitalize no-underline text-sm border-4 border-transparent relative">
                                {user && bag && bag.orderItems && bag.orderItems.length > 0 && (
                                    <div className="absolute top-0 right-2 bg-gray-900 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                        <span>{bag.orderItems.length}</span>
                                    </div>
                                )}
                                {!user && currentBagCount > 0 && (
                                    <div className="absolute top-0 right-2 bg-gray-900 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                                        <span>{currentBagCount}</span>
                                    </div>
                                )}
                                <div className="flex flex-row w-full h-7 mb-5 mx-4 hover:animate-vibrateScale">
                                    <div onClick={()=> {
										setIsSearchVisible(false);
										setBagShow(true)
									}}>
										<img
											src={bagCartIcon}
											alt='bag-icon'
											className='w-full h-full justify-self-center text-slate-800'
										/>
                                        {/* <IoBagRemoveSharp size={30} className='w-full h-full justify-self-center text-slate-800'/> */}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                {
                    options && options.length > 0 && <ProductCatView show={show2} CMenu={Menu2} parentCallback={Callbackmenu2} options={options} />
                }
                
                <Profile user={user} show={show7} CMenu={Menu7} parentCallback={Callbackmenu7} /> 
        </div>
		<div>

			{/* Overlay */}
			{showbagView && (
				<div
					className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transition-opacity duration-300"
					onClick={()=> setBagShow(false)}
				></div>
			)}

			{/* Offcanvas */}
			<div
				className={`fixed top-0 right-0 w-[52vw] h-full bg-white shadow-lg z-[60] transform transition-all duration-500 ease-in-out ${showbagView ? 'translate-x-0' : 'translate-x-full'}`}
			>
				<div className="p-1">                    
					<SideBarBag OnChangeing={()=> setBagShow(false)}/>
				</div>
				
			</div>
		</div>
        </Fragment>
    )
}

export default Navbar
