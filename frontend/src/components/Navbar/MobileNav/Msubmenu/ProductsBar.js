import React, { Fragment, useEffect, useState } from 'react'
import Ripples from 'react-ripples'
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io'
import {
	M_ProductsDetails,
} from '../../NavbarSub'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOptions } from '../../../../action/productaction';

const MProductsBar = ({showProducts}) => {
	const{options} = useSelector(state => state.AllOptions)
	const[productsOptions,setProductsOptions] = useState([])
	const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [genders, setGenders] = useState([]);

	const dispatch = useDispatch()
	const navigation = useNavigate();
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
	function setProductsFilters(){
		options.map(item => {
			switch (item.type) {
				case 'category':
					setCategories(options.filter(item => item.type === 'category'));
					break;
				case 'subcategory':
					setSubcategories(options.filter(item => item.type === "subcategory"));
					break;
				/* case 'color':
					setColors(options.filter(item => item.type === "color"));
					break;
				case 'size':
					setSizes(options.filter(item => item.type === "size"));
					break; */
				case 'gender':
					setGenders(options.filter(item => item.type === "gender"));
					break;
			}
		})
	}
	useEffect(()=>{
		if(options){
			setProductsFilters();
		}
	},[dispatch,options])
	useEffect(()=>{
		if(genders.length > 0 && categories.length > 0 && subcategories.length > 0){
			const changedProducts = genders.map((g)=>{
				return {
					Gender:g.value,
					category:categories.map((c)=>{
						return{
							title:c.value,
							subcategories:subcategories.map((s)=>{
								return s.value
							})
						}
					})
				}
			})
			setProductsOptions(changedProducts)
		}
	},[categories,subcategories,genders])
	useEffect(()=>{
		dispatch(fetchAllOptions())
	},[dispatch])
	console.log("All Options: ",productsOptions)
	return (
		<div className={`ml-2 w-full ${showProducts}`}>
			{productsOptions && productsOptions.length > 0 && productsOptions.map((product) => (
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
								<Ripples
									className="text-black font-thin px-5 py-4 relative w-full flex "
									onClick={() => toggleCategory(product.Gender, category.title)}
								>
									{category.title}
									<span className='absolute mx-5 right-0'>{activeCategory[`${product.Gender}-${category.title}`] ? <IoIosArrowDown /> : <IoIosArrowForward />}</span>
								</Ripples>

								{/* Subcategories Dropdown */}
								{activeCategory[`${product.Gender}-${category.title}`] && (
									<div className="pl-6 space-y-1">
										{category.subcategories.map((subcategory) => (
											<Ripples onClick={(e)=>{navigation("/products")}} key={subcategory} className="text-black font-extralight px-5 py-4 relative w-full flex ">
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
export default MProductsBar