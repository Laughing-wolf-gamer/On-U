import React, {Fragment} from 'react'
import emptywish from '../images/emptywish.PNG'
import {useNavigate} from 'react-router-dom'

const Nowishlist = () => {
    const redirect = useNavigate()

    function re() {
        redirect('/Login')
    }
  return (
    <Fragment>
        <div className='w-full h-full items-center '>
            <div className='h-max text-center w-max mx-auto my-auto pt-[10%]'>
            <h1 className='text-[#282c3f] font-bold font1 text-[20px]'>PLEASE LOG IN</h1>
            <h1 className='mt-4 text-[#94989f] text-[18px] font1'>Login to view items in your wishlist.</h1>
            <img src={emptywish} alt="" className='w-[150px] mt-10 mb-10 mx-auto min-h-[150px]' />
            <button className='py-2 px-8 font1 font-bold text-[20px] text-[#3466e8] border-[1px] border-[#3466e8] rounded-md' onClick={re}>LOGIN</button>
            </div>
               
        </div>
    </Fragment>
  )
}

/* const redirect = useNavigate()

  function handleMoveToShoppingView() {
    redirect('/products')
  }
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center text-center px-6 py-12">
      <div className="w-full max-w-md p-10 rounded-xl shadow-lg">
        <img
          src={shoppingbag} // Replace with your actual image path
          alt="Empty Bag"
          className="mx-auto mb-8 w-36 h-36 object-contain"
        />
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">Oops! Your Bag is Feels Light</h2>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">It looks like you haven't added anything yet. Browse our collection and start shopping now!</p>
        <button onClick={handleMoveToShoppingView} className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300 text-lg shadow-md">
          Continue Shopping
        </button>
      </div>
    </div>
  ); */

export default Nowishlist