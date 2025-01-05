import React, {Fragment} from 'react'
import emptybag from '../images/empty-bag.webp'
import {useNavigate} from 'react-router-dom'

const Emptybag = () => {
    const redirect = useNavigate()

    function handleMoveToShoppingView() {
      redirect('/products')
    }
  return (
    <Fragment>
        <div className='w-full h-full items-center '>
            <div className='h-max text-center w-max mx-auto my-auto pt-[10%]'>
            
            <img src={emptybag} alt="empty_" className='w-[150px] mt-10 mb-10 mx-auto min-h-[150px]' />
            <h1 className='text-[#282c3f] font-bold font1 text-[22px]'>Hey, it feels so light!</h1>
            <h1 className='text-[#a0a3a8] text-[14px] '>There is nothing in your bag. Let's add some items.</h1>
            <button className='py-2 px-4 font1 font-bold text-[14px] text-gray-700 border-[1px] border-gray-500 rounded-sm mt-4' onClick={handleMoveToShoppingView}>CONTINUE SHOPPING</button>
            </div>
               
        </div>
    </Fragment>
  )
}

export default Emptybag