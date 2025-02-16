import React, { Fragment, useEffect, useMemo, useState } from "react";
import g1 from "../images/googleplay.png";
import g2 from "../images/appleplay.png";
import { AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { ImTwitter, ImInstagram } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUp, ChevronUp, Navigation } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTermsAndCondition } from "../../action/common.action";
import { fetchAllOptions } from "../../action/productaction";

const Footer = () => {
	const dispath = useDispatch();
	const navigation = useNavigate();
	const { options } = useSelector((state) => state.AllOptions);
	const [productsOptions, setProductsOptions] = useState([]);
	const{ termsAndCondition,loading } = useSelector(state => state.TermsAndConditions);
	const [openDropdown, setOpenDropdown] = useState({});


	const handelSetQuery = (gender, category) => {
		// return;
		const queryParams = new URLSearchParams();
		if (category) queryParams.set('category', category.toLowerCase());
		if (gender) queryParams.set('gender', gender.toLowerCase());
	
		const url = `/products?${queryParams.toString()}`;
		console.log("Gender Query: ", gender, " Category Query: ", category,"Url: ",url);
		navigation(url);
		// window.location.reload();
	};
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
	
	const toggleDropdown = (section) => {
		setOpenDropdown((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};
	useEffect(()=>{
		dispath(fetchTermsAndCondition());
		dispath(fetchAllOptions());
	},[dispath])
	useEffect(() => {
		setProductsOptions(memoizedProductsOptions);
	}, [memoizedProductsOptions]);
	// console.log("memoizedProductsOptions: ",memoizedProductsOptions);
    return (
        <div className="w-screen min-h-fit border-t-[1px] border-t-gray-300 bg-white font-kumbsan">
            <div className="w-full max-w-screen-2xl justify-self-center p-14 py-10 max-h-fit">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-black border-b border-gray-200 pb-10">
					<div className="md:border-r hidden sm:block lg:border-r xl:border-r 2xl:border-r border-gray-200 space-y-3">
							<h1 className="text-lg font-bold mb-4 text-gray-800">SHOP</h1>
							<ul className="text-sm space-y-4 mt-3">
								<ul className="text-sm space-y-4 mt-3 justify-start items-start flex flex-col w-full">
									{
										memoizedProductsOptions && memoizedProductsOptions.length > 0 && memoizedProductsOptions.map((gender,index)=>{
											// console.log("Gender Data: ",gender);
											return(
												<Fragment>
													<h3 key={index} className="hover:underline text-gray-600 font-bold">{gender?.Gender}</h3>
													{
														gender?.category && gender?.category.length > 0 && gender?.category.map((category,subCatIndex)=><li key={subCatIndex} onClick={()=> handelSetQuery(gender?.Gender,category?.title)} className="hover:underline text-gray-600">{category?.title}</li>)
													}
												</Fragment>
											)
										})
									}
								</ul>
							</ul>
					</div>
					<div className="md:border-r block sm:hidden lg:border-r xl:border-r 2xl:border-r border-gray-200 space-y-3">
						<div
							onClick={() => toggleDropdown("shop")}
							className="w-full justify-start p-2 border-t border-b border-gray-200 flex flex-col items-center"
						>
							<div className="w-full justify-between flex flex-row items-center">
								<h1 className="text-lg font-bold text-gray-800">SHOP</h1>
								<ChevronUp
									className={`${openDropdown["shop"] ? "rotate-180" : ""} transition-transform duration-300 ease-in-out`}
								/>
							</div>

							{openDropdown["shop"] && (
							<ul
								className={`text-sm space-y-4 mt-3 justify-start items-start flex flex-col w-full transition-all duration-300 ease-in-out opacity-100 transform translate-y-0 max-h-[1000px] overflow-hidden ${
								openDropdown["shop"] ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0"
								}`}
							>
								{memoizedProductsOptions &&
									memoizedProductsOptions.length > 0 &&
									memoizedProductsOptions.map((gender, index) => {
										return (
										<Fragment key={index}>
											<h3 className="hover:underline text-gray-600 font-bold">
											{gender?.Gender}
											</h3>
											{gender?.category &&
											gender?.category.length > 0 &&
											gender?.category.map((category, subCatIndex) => (
												<li
												key={subCatIndex}
												onClick={() =>
													handelSetQuery(gender?.Gender, category?.title)
												}
												className="hover:underline text-gray-600"
												>
												{category?.title}
												</li>
											))}
										</Fragment>
										);
									})}
							</ul>
							)}
						</div>
						</div>
                    {/* Online Shopping */}
                    <div className="md:border-r hidden sm:block lg:border-r xl:border-r 2xl:border-r border-gray-200 space-y-3">
                        <h1 className="text-lg font-bold mb-4 text-gray-800">ON-U</h1>
                        <ul className="text-sm space-y-4 mt-3">
							<p className="text-sm hover:underline text-gray-600">Owner: On-U</p>
							<div className="flex flex-row justify-start space-x-1 cursor-pointer hover:text-indigo-400 items-center">
								<Link to={'/contact'}><h2 className="text-xl font-bold">GET DIRECTION</h2></Link>
								<ArrowUp className="rotate-45" />
							</div>
							<p className="text-sm hover:underline text-gray-600">Company: On-U</p>
							<p className="text-sm hover:underline text-gray-600">Address: {termsAndCondition?.businessAddress}</p>
							<p className="text-sm hover:underline text-gray-600">Phone: {termsAndCondition?.phoneNumber}</p>
							<a href={`mailto:${termsAndCondition?.contactInfo}`} className="text-sm hover:underline text-gray-600">Email: {termsAndCondition?.contactInfo}</a>
						</ul>
                    </div>
					<div className="md:border-r block sm:hidden lg:border-r xl:border-r 2xl:border-r border-gray-200 space-y-3">
						<div onClick={()=> toggleDropdown("information")} className="w-full justify-start p-2 border-t border-b border-gray-200 flex flex-col items-center">
							<div className="w-full justify-between flex flex-row items-center">
								<h1 className="text-lg font-bold text-gray-800">INFO</h1> <ChevronUp className={`${openDropdown["information"] ? " rotate-180":""} transition-transform duration-300 ease-in-out`}/>
							</div>
							{
								openDropdown["information"] && (
									<ul className="text-sm space-y-4 mt-3 justify-start items-start flex flex-col w-full">
										<p className="text-sm hover:underline text-gray-600">Owner: On-U</p>
										<div className="flex flex-row justify-start space-x-1 cursor-pointer hover:text-indigo-400 items-center">
											<Link to={'/contact'}><h2 className="text-xl font-bold">GET DIRECTION</h2></Link>
											<ArrowUp className="rotate-45" />
										</div>
										<p className="text-sm hover:underline text-gray-600">Company: On-U</p>
										<p className="text-sm hover:underline text-gray-600">Address: {termsAndCondition?.businessAddress}</p>
										<p className="text-sm hover:underline text-gray-600">Phone: {termsAndCondition?.phoneNumber}</p>
										<a href={`mailto:${termsAndCondition?.contactInfo}`} className="text-sm hover:underline text-gray-600">Email: {termsAndCondition?.contactInfo}</a>
									</ul>
								)
							}
						</div>
					</div>

                    {/* Customer Services */}
                    <div className="md:border-r hidden sm:block lg:border-r xl:border-r 2xl:border-r border-gray-200 pr-4">
                        <h1 className="text-lg font-bold text-gray-800 mb-4">USEFULL LINKS</h1>
                        <ul className="text-sm space-y-4">
                            <Link to="/dashboard">
                                <li className="hover:underline text-gray-600">Shipping</li>
                            </Link>
                            <Link to="/about">
                                <li className="hover:underline text-gray-600">About Us</li>
                            </Link>
                            <Link to="/faq">
                                <li className="hover:underline text-gray-600">FAQ</li>
                            </Link>
                            <Link to="/contact">
                                <li className="hover:underline text-gray-600">Contact Us</li>
                            </Link>
                            <Link to="/tc">
                                <li className="hover:underline text-gray-600">Terms And Conditions</li>
                            </Link>
                            <Link to="/privacyPolicy">
                                <li className="hover:underline text-gray-600">Privacy Policy</li>
                            </Link>
                        </ul>
                    </div>


					<div className="md:border-r block sm:hidden lg:border-r xl:border-r 2xl:border-r border-gray-200 space-y-3">
						<div onClick={()=> toggleDropdown("services")} className="w-full justify-start p-2 border-t border-b border-gray-200 flex flex-col items-center">
							<div className="w-full justify-between flex flex-row items-center">
								<h1 className="text-lg font-bold text-gray-800">USEFULL LINKS</h1> <ChevronUp className={`${openDropdown["services"] ? " rotate-180":""} transition-transform duration-300 ease-in-out`} />
							</div>
							{
								openDropdown["services"] && (
									<ul className="text-sm space-y-4 mt-3 justify-start items-start flex flex-col w-full">
										<Link to="/dashboard">
										<li className="hover:underline text-gray-600">Shipping</li>
									</Link>
									<Link to="/about">
										<li className="hover:underline text-gray-600">About Us</li>
									</Link>
									<Link to="/faq">
										<li className="hover:underline text-gray-600">FAQ</li>
									</Link>
									<Link to="/contact">
										<li className="hover:underline text-gray-600">Contact Us</li>
									</Link>
									<Link to="/tc">
										<li className="hover:underline text-gray-600">Terms And Conditions</li>
									</Link>
									<Link to="/privacyPolicy">
										<li className="hover:underline text-gray-600">Privacy Policy</li>
									</Link>
									</ul>
								)
							}
						</div>
					</div>

                    {/* App and Social Media */}
                    <div className="md:border-r lg:border-r xl:border-r 2xl:border-r border-gray-200 pr-4">
                        <h1 className="text-lg font-bold mb-4 text-gray-800">EXPERIENCE ON-U APP</h1>
                        <div className="grid grid-cols-2 gap-4 mb-6 w-52 md:w-auto">
                            <img src={g1} alt="Google Play" className="object-contain w-full h-full" />
                            <img src={g2} alt="Apple Store" className="object-contain w-full h-full" />
                        </div>
                    </div>

                    {/* Features */}
                    <div className="flex w-full flex-col justify-start items-start">
						<h1 className="text-lg font-bold text-gray-800 mb-4">KEEP IN TOUCH</h1>

						{/* Social Media Icons */}
						<div className="flex space-x-6 text-3xl text-gray-800 mb-6">
							<AiFillFacebook className="transition-transform transform hover:scale-110 hover:text-blue-600" />
							<ImTwitter className="transition-transform transform hover:scale-110 hover:text-blue-400" />
							<AiFillYoutube className="transition-transform transform hover:scale-110 hover:text-red-600" />
							<ImInstagram className="transition-transform transform hover:scale-110 hover:text-pink-600" />
						</div>

						{/* Email Input and Agreement Section */}
						<div className="flex w-full max-w-md border border-gray-300 rounded-full space-x-3 p-3 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
							<input
								type="email"
								placeholder="Get Cool Coupons To your mail"
								className="rounded-full w-full text-black placeholder:text-gray-400 outline-none transition-all duration-300 ease-in-out"
							/>
							<button className="bg-black p-3 hover:bg-gray-700 transition-all duration-300 ease-in-out text-white rounded-full transform hover:rotate-45 focus:outline-none">
								<ArrowUp />
							</button>
						</div>
					</div>


                </div>

                <div className="mt-6 h-[100px] justify-end items-center flex flex-col text-center text-gray-500 text-md">
                    <span>&copy; 2025 www.theOnu.com. All rights reserved.</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
