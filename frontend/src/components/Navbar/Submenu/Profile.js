import React,{Fragment} from 'react'
import { useTransition, animated } from 'react-spring'
import {Link} from 'react-router-dom'
import { logout } from '../../../action/useraction'
import { useDispatch} from 'react-redux'
import { useToast } from '../../../Contaxt/ToastProvider'
import toast from 'react-hot-toast'

const Profile = ({show, CMenu, parentCallback, user}) => {
    const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type,message) => {
        console.log("check Toast: ",type, message,activeToast);
        if(!activeToast){
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
    const dispatch = useDispatch()
    const transitions = useTransition(show, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        delay: 300,
        
    })

    const logoutBTN = () =>{
        dispatch(logout())
        sessionStorage.removeItem('token')
        
        checkAndCreateToast("success",'Logout Successfully')
    }
        
    return (
        <Fragment>
            
            { transitions((styles, item) => item && <animated.div style={styles}>
                <div className={`container absolute  top-14 right-10  z-10 font1 max-w-[25%] w-[25%] h-[480px] ${CMenu}  Mmenu bg-gray-100 text-gray-900 cursor-pointer`}
                onMouseEnter={() => parentCallback('block', true)} onMouseLeave={() => parentCallback('hidden', false)}
                >
                <div className='px-8 py-8 '>
                    <div className=' w-full'>
                        <Link to='/'>
                        <h1 className='font1 font-semibold'>Welcome</h1>
                        </Link>
                    {user ? "" : <h1 className='font1 font-extralight text-sm '>To access account and manage orders  <br /></h1>}
                        
                        {
                        user ? 
                        <div>
                            {`${user?.user?.name}`} <br />
                            <Link to='/dashboard' className='font1 hover:font-semibold'>Dashboard</Link>
                        </div>
                        
                        :
                            
                        <Link className='dec' to="/Login">
                            <button className=' font1 font-semibold text-gray-900 text-sm border-[1px] px-3 py-2 
                            border-slate-500 hover:border-slate-900 '>LOGIN/&nbsp;SIGNUP</button>
                        </Link>
        
                        }
                    
                    
                        <hr className='my-4' />
                        <Link to='/bag' className='litext list-none py-0.5  hover:font-semibold'>Bag</Link>
                        <h1 className='litext list-none py-0.5  hover:font-semibold'>Gift Cards</h1>
                        <Link to="/contact">
                        <h1 className='litext list-none py-0.5  hover:font-semibold'>Contact Us</h1>
                        </Link>
                        <div className='flex'>
                        <h1 className='litext list-none py-0.5  hover:font-semibold'>ONU Insider </h1><div className='bg-gray-700 flex w-max h-max ml-2 mt-2 float-left px-1 text-xs skewnew text-white'>New</div>
                        </div>
                    

                        <hr className='my-4' />
                        <h1 className='litext list-none py-0.5  hover:font-semibold'>ONU Credit</h1>
                        <h1 className='litext list-none py-0.5  hover:font-semibold'>Coupons</h1>
                        <h1 className='litext list-none py-0.5  hover:font-semibold'>Saved Cards</h1>
                        <Link to={`dashboard`}>
                        <h1 className='litext list-none py-0.5  hover:font-semibold'>Saved Addresses</h1>
                        </Link>
                        <br />

                        {
                        user ? 
                        <button className=' font1 font-smibold text-gray-600 text-sm border-[1px] px-3 py-2 
                        border-[#d4d5d8] hover:border-[#2d2c2c] ' onClick={logoutBTN}>LOGOUT</button>
                        :
                        ""
                        }
        
                    </div>
                

                </div>

                </div>
                </animated.div>
            )}
            
        </Fragment>
    )
}

export default Profile