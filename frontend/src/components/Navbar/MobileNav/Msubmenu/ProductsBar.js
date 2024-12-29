import React, { Fragment, useState } from 'react'
import Ripples from 'react-ripples'
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io'

import {
	M_ProductsDetails,
} from '../../NavbarSub'

const MProductsBar = ({showPrducts}) => {
	const [activeGender, setActiveGender] = useState(null);
	const [activeCategory, setActiveCategory] = useState({});

	// Toggle visibility of gender categories
	const toggleGender = (gender) => {
		setActiveGender(activeGender === gender ? null : gender);
	};

	// Toggle visibility of category subcategories
	const toggleCategory = (gender, category) => {
		setActiveCategory((prev) => ({
			...prev,
			[`${gender}-${category}`]: prev[`${gender}-${category}`] ? null : true,
		}));
	};
	return (
		<div className={`ml-2 w-full ${showPrducts}`}>
			{M_ProductsDetails.map((product) => (
				<div key={product.Gender} className="space-y-2">
					<Ripples
						className="text-black font-normal px-5 py-4 relative w-full flex "
						onClick={() => toggleGender(product.Gender)}
					>
						{product.Gender}
						<span className='absolute mx-5 right-0'>{activeGender === product.Gender ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
					</Ripples>

					{/* Categories Dropdown */}
					{activeGender === product.Gender && (
						<div className="pl-4 space-y-2">
							{product.category.map((category,i) => (
								<div key={i} className="space-y-2">
								{/* Category Section */}
								<div
									className="text-black font-thin px-5 py-4 relative w-full flex "
									onClick={() => toggleCategory(product.Gender, category.title)}
								>
									{category.title}
									<span className='absolute mx-5 right-0'>{activeCategory[`${product.Gender}-${category.title}`] ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
								</div>

								{/* Subcategories Dropdown */}
								{activeCategory[`${product.Gender}-${category.title}`] && (
									<div className="pl-6 space-y-1">
										{category.subcategories.map((subcategory) => (
											<div key={subcategory} className="text-black font-extralight px-5 py-4 relative w-full flex ">
												{subcategory}
											</div>
										))}
									</div>
								)}
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
};
export default MProductsBar