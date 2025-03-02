import React, { Fragment, useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTransition, animated } from 'react-spring';
// import { fetchAllOptions } from '../../../action/productaction.js';

const ProductCatView = ({ show, CMenu, parentCallback ,options}) => {
	const navigation = useNavigate();
	const transitions = useTransition(show, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		delay: 100,
	});
  
	const dispatch = useDispatch();
	
	const [productsOptions, setProductsOptions] = useState([]);
	
	
  
	const memoizedProductsOptions = useMemo(() => {
		if (options && options.length > 0) {
			const categories = options.filter((item) => item.type === 'category');
			const subcategories = options.filter((item) => item.type === 'subcategory');
			const genders = options.filter((item) => item.isActive && item.type === 'gender');
	
			return genders.map((g) => ({
				Gender: g.value,
				category: categories.map((c) => ({
					title: c.value,
					subcategories: subcategories.filter((s) => s.categoryId === c.id).map((s) => s.value),
				})),
			}));
		}
		return [];
	}, [options]);
  
	useEffect(() => {
	  setProductsOptions(memoizedProductsOptions);
	}, [memoizedProductsOptions]);
  
	const handelSetQuery = (gender, category) => {
		const queryParams = new URLSearchParams();
		if (category) queryParams.set('category', category.toLowerCase());
		if (gender) queryParams.set('gender', gender.toLowerCase());
	
		const url = `/products?${queryParams.toString()}`;
		navigation(url);
		window.location.reload();
	};
  
	const getGenderCategories = (gender) => productsOptions.find((p) => p.Gender === gender.Gender)?.category || [];
	// console.log("memoizedProductsOptions: ",memoizedProductsOptions);
	if(!memoizedProductsOptions || memoizedProductsOptions.length <= 0) return null;
	return (
		<div className={`w-[100%] font-kumbsan h-screen bg-[#64646435] sticky top-0 ${CMenu} z-10 font1`}>
		{transitions((styles, item) =>
			item && (
				<animated.div style={styles}>
					<div
						className={`container absolute right-20 top-[-30px] min-w-[600px] w-fit mx-auto h-[480px] ${CMenu} Mmenu bg-neutral-100`}
						onMouseEnter={() => parentCallback('block', true)}
						onMouseLeave={() => parentCallback('hidden', false)}
					>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-w-fit px-8 py-4 gap-5 cursor-pointer">
						{memoizedProductsOptions && memoizedProductsOptions.length > 0 && memoizedProductsOptions.map((genderCurrent,index) => {
							const categories = getGenderCategories(genderCurrent);
							return (
								categories.length > 0 && (
									<div key={index} className="h-fit">
										<CategorySection
											title={genderCurrent.Gender}
											categories={categories}
											parentCallback={parentCallback}
											handelSetQuery={handelSetQuery}
										/>
									</div>
								)
							);
						})}
					</div>
					</div>
				</animated.div>
			)
		)}
		</div>
	);
  };
  

// Reusable Category Section Component
const CategorySection = ({ title, categories, parentCallback, handelSetQuery }) => (
	<div>
		<h1 className="text-gray-900 text-base font-extrabold py-1 mx-2">{title}</h1>
		{categories && categories.slice(0, 4).map((category, i) => (
				<div onClick={(e) => handelSetQuery(title, category.title)} key={i}>
				<li
					className="litext list-none py-0.5 m-2 text-gray-600 hover:font-semibold"
					onClick={() => parentCallback('hidden', false)}
				>
					{category.title}
				</li>
				</div>
			))}
	</div>

);

export default ProductCatView;
