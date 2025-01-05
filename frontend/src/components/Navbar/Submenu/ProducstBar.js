import React,{Fragment, useEffect, useState} from 'react'
import {
	Mens_Category,
	Women_Category,
	Kids_Category
} from '../NavbarSub.js'
import { useTransition, animated } from 'react-spring'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOptions } from '../../../action/productaction.js';

const ProductsBar = ({show, CMenu, parentCallback}) => {
	const transitions = useTransition(show, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		delay: 200,
	})
	let H = window.screen.height 
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
	console.log("Categories: ",productsOptions);
	const menGenderCategories = productsOptions && productsOptions.length > 0 && productsOptions.find(p => p.Gender === "Men")?.category || [];
	const womenGenderCategories = productsOptions && productsOptions.length > 0 && productsOptions.find(p => p.Gender === "Women")?.category || [];
	const kidsGenderCategories = productsOptions && productsOptions.length > 0 && productsOptions.find(p => p.Gender === "Kids")?.category || [];
	return (
	<Fragment>
		<div className={`w-[100%] h-screen bg-[#64646435] sticky top-0 ${CMenu} z-10 font1`}>
			{ transitions((styles, item) => item && <animated.div style={styles}>
				<div className={`container absolute left-28 w-fit mx-auto h-[480px] ${CMenu} Mmenu bg-white `}
					onMouseEnter={() => parentCallback('block', true)} onMouseLeave={() => parentCallback('hidden', false)}
				>
					<div className='grid grid-cols-5 px-8 py-4 cursor-pointer'>

						<div className=" h-[418px] gap-5">
						<h1 className='text-red-600 text-sm font-semibold py-1 mx-2'>Mens</h1>
							{productsOptions && menGenderCategories && menGenderCategories.map((data) =>
								<Link to="/products"><li className='litext list-none py-0.5 m-2 font-thin hover:font-semibold'onClick={()=> parentCallback('hidden', false)}>{data.title}</li></Link>
							)}

							<hr className='py-1' />
							<h1 className='text-red-600 text-sm font-semibold py-1 mx-2'>Women</h1>
							{productsOptions && womenGenderCategories && womenGenderCategories.map((data) =>
								<Link to="/products"><li className='litext list-none py-0.5 m-2 hover:font-semibold'onClick={()=> parentCallback('hidden', false)}>{data.title}</li></Link>
							)}
						</div>
						<div className=" h-[418px] ">
							<h1 className='text-red-600 text-sm  font-semibold py-1 mx-2'>Kids</h1>
							{productsOptions && kidsGenderCategories && kidsGenderCategories.map((data) =>
								<Link to="/products"><li className='litext list-none py-0.5 m-2 hover:font-semibold'onClick={()=> parentCallback('hidden', false)}>{data.title}</li></Link>
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