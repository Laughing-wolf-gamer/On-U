import React,{Fragment} from 'react'
import {
	Mens_Category,
	Women_Category,
	Kids_Category
} from '../NavbarSub.js'
import { useTransition, animated } from 'react-spring'
import { Link } from "react-router-dom";

const ProductsBar = ({show, CMenu, parentCallback}) => {
	const transitions = useTransition(show, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		delay: 300,
	})
	let H = window.screen.height 
	
	return (
	<Fragment>
		<div className={`w-[100%] h-screen bg-[#64646435] sticky top-0 ${CMenu} z-10 font1`}>
			{ transitions((styles, item) => item && <animated.div style={styles}>
				<div className={`container max-w-[90%] w-[90%] mx-auto h-[480px] ${CMenu} Mmenu bg-white `}
					onMouseEnter={() => parentCallback('block', true)} onMouseLeave={() => parentCallback('hidden', false)}
				>
					<div className='grid grid-cols-5 px-8 py-4 cursor-pointer'>

					<div className=" h-[418px]">
					<h1 className='text-red-600 text-sm font-semibold py-1'>Mens</h1>
						{Mens_Category.map((data) =>
							<Link to="/products"><li className='litext list-none py-0.5 font-thin hover:font-semibold'onClick={()=> parentCallback('hidden', false)}>{data.title}</li></Link>
						)}

					<hr className='py-1' />
					<h1 className='text-red-600 text-sm font-semibold py-1'>Women</h1>
						{Women_Category.map((data) =>
							<Link to="/products"><li className='litext list-none py-0.5 hover:font-semibold'onClick={()=> parentCallback('hidden', false)}>{data.title}</li></Link>
						)}
					</div>
					<div className=" h-[418px] ">
					<h1 className='text-red-600 text-sm  font-semibold py-1'>Kids</h1>
						{Kids_Category.map((data) =>
							<Link to="/products"><li className='litext list-none py-0.5  hover:font-semibold'onClick={()=> parentCallback('hidden', false)}>{data.title}</li></Link>
						)}
					</div>
					</div>

				</div>
				</animated.div>
			)}
			</div>
		</Fragment>
	)
}

export default ProductsBar