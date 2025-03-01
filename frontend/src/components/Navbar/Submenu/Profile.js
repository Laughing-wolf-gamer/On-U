import React from 'react'
import { useTransition, animated } from 'react-spring'
import {Link} from 'react-router-dom'
import { logout } from '../../../action/useraction'
import { useDispatch} from 'react-redux'
import { useSettingsContext } from '../../../Contaxt/SettingsContext'

const Profile = ({show, CMenu, parentCallback, user}) => {
    const dispatch = useDispatch()
    const {checkAndCreateToast} = useSettingsContext();
    const transitions = useTransition(show, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        delay: 300,
    })

    const logoutBTN = () =>{
        dispatch(logout())
        sessionStorage.removeItem('token')
        checkAndCreateToast("Logout Successfully")
    }
        
    return (
        <div>
            
            {transitions((styles, item) => item && <animated.div style={styles}>
                <div className={`container font-kumbsan absolute  top-14 right-10  z-10 font1 max-w-[25%] w-[25%] h-[340px] ${CMenu}  Mmenu bg-gray-100 text-gray-900 cursor-pointer`}
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
								<Link to={`dashboard`} className='litext list-none py-0.5  hover:font-semibold'>
									<h1>Order & Returns</h1>
								</Link>
								<Link to="/contact">
								<h1 className='litext list-none py-0.5  hover:font-semibold'>Contact Us</h1>
								</Link>
								<Link to={`dashboard`}>
									<h1 className='litext list-none py-0.5  hover:font-semibold'>Saved Addresses</h1>
								</Link>
								<hr className='my-4' />
								<br />

                            {
                            user ? 
                                <button className=' font1 font-smibold text-gray-600 text-sm border-[1px] px-3 py-2 
                                    border-[#d4d5d8] hover:border-[#2d2c2c] ' onClick={logoutBTN}>LOGOUT
                                </button>
                                :
                                ""
                            }
            
                        </div>
                    

                    </div>

                </div>
                </animated.div>
            )}
            
        </div>
    )
}

export default Profile