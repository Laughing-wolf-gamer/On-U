import React, { Fragment, useState, useEffect } from 'react'
import img from '../images/login.webp'
import './Login.css'
import { useDispatch, useSelector } from 'react-redux'
import { loginmobile } from '../../action/useraction'
import { Link, useNavigate } from 'react-router-dom'
import {useAlert} from 'react-alert'

const Login = () => {
  const [mobileno, setmobileno] = useState('')
  const Redirect = useNavigate()
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.loginuser)
  const Alert = useAlert()
  let par = document.getElementById('error')

  const continues = async () => {
 
    if (mobileno.length > 10) {
      par.innerHTML = 'Error: Pls note you enter wrong mobile no'
    }
    if (mobileno.length === 10) {
      await dispatch(loginmobile({phonenumber:mobileno}))
      if(user){
        Alert.success('Login Successfully')
        Redirect('/')
      }
    }
  }
  if(user){
    console.log("User: ",user)
    Redirect('/')
  }

  /* useEffect(() => {  
    if(user){
      console.log("User: ",user)
      Redirect('/')
    }
  }, [Redirect]); */
  return (

    <Fragment>
      <div className={`w-[100%] h-screen bg-[#fcecf4] py-10`}>
        <div className='h-[500px] bg-white mx-auto w-[100vw] sm:w-[430px] md:w-[430px] lg:w-[430px] xl:w-[430px] 2xl:w-[430px]'>
          <img src={img} alt="login" className='w-auto min-h-[150px]' />
          <div className='mx-auto w-[330px] my-8'>

            <h1 className='font1 text-2xl font-medium mb-5'>Login <span className='text-lg'>or</span> SignUp</h1>

            <input type="number" name="phonenumber" className='w-full h-10 border-[1px] 
                focus:border-[#353535] focus:border-[1px] focus:outline-none border-[#6a696993] p-2 web appearance-none'
              onChange={(e) => setmobileno(e.target.value)} placeholder='+91 | Mobile Number*' />
            <p id='error' className='text-xs text-red-500 '></p>

            <h1 className='font1 text-sm mt-5'>By Continuing, I agree to the <span className='text-[#ee5f73]'>Terms of Use</span>  & <span className='text-[#ee5f73]'> Privacy Policy</span></h1>
            <button type='submit' onClick={continues} className='bg-[#ee5f73] text-white w-full font-semibold text-lg py-[6px] my-5'>LOG IN</button>
            <Link to='/registeruser' className='text-[#ee5f73] text-center block'>New User? Register</Link>
            {/* <h1 className='font1 text-sm'>No Account? <span className='text-[#ee5f73]'>Register User</span></h1> */}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Login