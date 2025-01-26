import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTransition, animated } from 'react-spring';
import { fetchAllOptions } from '../../../action/productaction.js';
import { useQueryContext } from '../../../Contaxt/QueryContext.js';

const ProductsBar = ({ show, CMenu, parentCallback }) => {
	const { updateQueryParams, getQueryString } = useQueryContext();
	const navigation = useNavigate(); // Use for navigation (if using React Router)
	const transitions = useTransition(show, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		delay: 200,
	});

	const { options } = useSelector((state) => state.AllOptions);
	const [productsOptions, setProductsOptions] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchAllOptions());
	}, [dispatch]);
	const handelSetQuery = (gender,category) => {
		console.log("Gender: ",gender, "category: ",category)
		// Create the URL with query parameters
		const queryParams = new URLSearchParams();
    
		if (gender) queryParams.set('gender', gender.toLowerCase());
		if (category) queryParams.set('category', category.toLowerCase());
	
		// Construct the URL for the /products page
		const url = `/products?${queryParams.toString()}`;
	
		// Navigate to the new URL (using React Router)
		// history.push(url);
		navigation(url);
	};
	useEffect(() => {
		if (options && options.length > 0) {
			const categories = options.filter((item) => item.type === 'category');
			const subcategories = options.filter((item) => item.type === 'subcategory');
			const genders = options.filter((item) => item.type === 'gender');

			const changedProducts = genders.map((g) => ({
				Gender: g.value,
				category: categories.map((c) => ({
					title: c.value,
					subcategories: subcategories.filter((s) => s.categoryId === c.id).map((s) => s.value),
				})),
			}));

			setProductsOptions(changedProducts);
		}
	}, [options]);

	const getGenderCategories = (gender) =>
	productsOptions.find((p) => p.Gender === gender)?.category || [];

  return (
    <Fragment>
      <div className={`w-[100%] h-screen bg-[#64646435] sticky top-0 ${CMenu} z-10 font1`}>
        {transitions(
          (styles, item) =>
            item && (
				<animated.div style={styles}>
					<div
						className={`container absolute right-10 top-[-30px] w-fit mx-auto h-[480px] ${CMenu} Mmenu bg-gray-50`}
						onMouseEnter={() => parentCallback('block', true)}
						onMouseLeave={() => parentCallback('hidden', false)}
					>
						<div className="grid grid-cols-5 px-8 py-4 cursor-pointer">
							<div className="h-[418px] gap-5">
								<CategorySection
									title="Men"
									categories={getGenderCategories('Men')}
									parentCallback={parentCallback}
									handelSetQuery = {handelSetQuery}
								/>
							<hr className="py-1" />
								<CategorySection
									title="Women"
									categories={getGenderCategories('Women')}
									parentCallback={parentCallback}
									handelSetQuery = {handelSetQuery}
							/>
							</div>
							<div className="h-[418px]">
								<CategorySection
									title="Kids"
									categories={getGenderCategories('Kids')}
									parentCallback={parentCallback}
									handelSetQuery = {handelSetQuery}
								/>
							</div>
						</div>
					</div>
				</animated.div>
            )
        )}
      </div>
    </Fragment>
  );
};

// Reusable Category Section Component
const CategorySection = ({ title, categories, parentCallback ,handelSetQuery}) => (
	<div>
		<h1 className="text-red-600 text-sm font-semibold py-1 mx-2">{title}</h1>
		{categories && categories.slice(0,5).map((category,i) => (
			<div onClick={(e)=> handelSetQuery(title,category.title)} key={i}>
				<li
					className="litext list-none py-0.5 m-2 hover:font-semibold"
					onClick={() => parentCallback('hidden', false)}
				>
					{category.title}
				</li>
			</div>
		))}
	</div>
);

export default ProductsBar;
