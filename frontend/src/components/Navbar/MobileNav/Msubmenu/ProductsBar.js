import React, { useEffect, useState, useMemo } from 'react';
import Ripples from 'react-ripples';
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOptions } from '../../../../action/productaction';
import Loader from '../../../Loader/Loader';

const MProductsBar = ({ showProducts, onClose }) => {
	const { options } = useSelector((state) => state.AllOptions);
	const [activeGender, setActiveGender] = useState(null);
	const [activeCategory, setActiveCategory] = useState({});

	const dispatch = useDispatch();
	const navigation = useNavigate();

	// Function to handle the query update when a user selects a subcategory
	const handleSetQuery = (gender, subcategory, category) => {
		const queryParams = new URLSearchParams();
		if (gender) queryParams.set('gender', gender.toLowerCase());
		if (category) queryParams.set('category', category.toLowerCase());
		if (subcategory) queryParams.set('subcategory', subcategory.toLowerCase());

		// Construct the URL for the /products page and navigate
		navigation(`/products?${queryParams.toString()}`);
		onClose && onClose();
	};

	// Memoizing options filtering to avoid unnecessary recomputations
	const categories = useMemo(
		() => (options ? options.filter((item) => item.type === 'category') : []),
		[options]
	);
	const subcategories = useMemo(
		() => (options ? options.filter((item) => item.type === 'subcategory') : []),
		[options]
	);
	const genders = useMemo(
		() => (options ? options.filter((item) => item.isActive && item.type === 'gender') : []),
		[options]
	);

	const productsOptions = useMemo(
		() =>
		genders.map((gender) => ({
			Gender: gender.value,
			category: categories.map((category) => ({
			title: category.value,
			subcategories: subcategories
				.map((subcategory) => subcategory.value),
			})),
		})),
		[genders, categories, subcategories]
	);

	// Toggle gender visibility
	const toggleGender = (gender) => {
		setActiveGender((prev) => (prev === gender ? null : gender));
	};

	// Toggle category visibility
	const toggleCategory = (gender, category) => {
		setActiveCategory((prev) => ({
		...prev,
		[`${gender}-${category}`]: prev[`${gender}-${category}`] ? null : true,
		}));
	};

	useEffect(() => {
		dispatch(fetchAllOptions());
	}, [dispatch]);

	// If options are not loaded yet, return a loading state or nothing
	if (!options) {
		return <Loader/>; // You can replace this with a spinner or any other loading indicator
	}
	// console.log("productsOptions: ",productsOptions);
	return (
		<div className={`ml-2 font-kumbsan w-full ${showProducts}`}>
		{productsOptions.length > 0 &&
			productsOptions.map((product) => (
				<div key={product.Gender} className="space-y-2">
					<Ripples
						className="text-black font-normal px-5 py-4 relative w-full flex"
						onClick={() => toggleGender(product.Gender)}
					>
					{product.Gender}
						<span className="absolute mx-5 right-0">
							{activeGender === product.Gender ? (
								<IoIosArrowDown />
							) : (
							<	IoIosArrowForward />
							)}
						</span>
					</Ripples>

					{/* Categories Dropdown */}
					{activeGender === product.Gender && (
						<div className="pl-4 space-y-2">
							{product.category.map((category, i) => (
								<div key={i} className="space-y-2">
									<Ripples
										className="text-black font-normal px-5 py-4 relative w-full flex"
										onClick={() => toggleCategory(product.Gender, category.title)}
									>
									{category.title}
									<span className="absolute mx-5 right-0">
										{activeCategory[`${product.Gender}-${category.title}`] ? (
											<IoIosArrowDown />
										) : (
											<IoIosArrowForward />
										)}
									</span>
									</Ripples>

									{/* Subcategories Dropdown */}
									{activeCategory[`${product.Gender}-${category.title}`] && (
										<div className="pl-6 space-y-1">
											{category.subcategories.map((subcategory) => (
											<Ripples
												key={subcategory}
												onClick={() => handleSetQuery(activeGender, subcategory, category.title)}
												className="text-black font-extralight px-5 py-4 relative w-full flex"
											>
												<span>{subcategory}</span>
											</Ripples>
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

export default MProductsBar;
