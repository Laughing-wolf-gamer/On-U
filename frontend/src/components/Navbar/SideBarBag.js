import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';
import { getAddress, getConvinceFees, getuser } from '../../action/useraction';
import { deleteBag, getbag, getqtyupdate, itemCheckUpdate } from '../../action/orderaction';
import { getRandomArrayOfProducts } from '../../action/productaction';
import { Minus, Plus, Trash } from 'lucide-react';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { calculateDiscountPercentage, formattedSalePrice, getOriginalAmount } from '../../config';
import ProductCardSkeleton from '../Product/ProductCardSkeleton';
import SideBarBagProductItem from '../Product/SideBarBagProductItem';

const SideBarBag = ({OnChangeing}) => {
	const{deleteBagResult} = useSelector(state => state.deletebagReducer)
    const { sessionBagData,updateBagQuantity,toggleBagItemCheck,removeBagSessionStorage,sessionRecentlyViewProducts } = useSessionStorage();
    const { user, isAuthentication } = useSelector(state => state.user);
    const { randomProducts,loading:RandomProductLoading, error } = useSelector(state => state.RandomProducts);
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const {allAddresses} = useSelector(state => state.getAllAddress)
    const {checkAndCreateToast} = useSettingsContext();
    const navigation = useNavigate()
    const dispatch = useDispatch();

    const[convenienceFees,setConvenienceFees] = useState(-1);
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [totalProductSellingPrice, setTotalProductSellingPrice] = useState(0);
    const[totalSellingPrice,setTotalMRP] = useState(0)
    const [discountedAmount, setDiscountAmount] = useState(0);
    const [allgst, setTotalGST] = useState(0);
    const [address, setAddress] = useState(null);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showPayment,setShowPayment] = useState(false);


    const handleOpenPopup = () => setIsAddressPopupOpen(true);
    const handleClosePopup = () => {
        setIsAddressPopupOpen(false)
        dispatch(getbag({ userId: user.id }));
        dispatch(getAddress())
    };
    /* const handleSaveAddress = async (newAddress) => {
        await dispatch(updateAddress(newAddress));
        dispatch(getuser());
        checkAndCreateToast("success",'Address added successfully');
    }; */

    useEffect(() => {
        if (bag) {
            if (bag?.orderItems) {
                let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
                let totalMRP = 0,totalGst = 0;
        
                bag.orderItems.forEach(item => {
                    const { productId, quantity,isChecked } = item;
					if(isChecked){
						const { salePrice, price,gst } = productId;
						const priceWithoutGst = getOriginalAmount(gst,price);
						// Use salePrice if available, else fallback to regular price
						const productSellingPrice = salePrice || price;
			
						// Calculate the total sale price (totalSP) based on salePrice or regular price
						const itemTotalPrice = (salePrice > 0 ? salePrice : price) * quantity;
						totalSP += itemTotalPrice;
			
						// Calculate the discount only if there is a sale price
						if (salePrice && price > 0) {
							const discount = price - salePrice;
							totalDiscount += discount * quantity; // Multiply discount by quantity to account for multiple items
						}
			
						// Total product selling price includes salePrice or regular price
						totalProductSellingPrice += productSellingPrice * quantity;
			
						// Calculate the total MRP (Maximum Retail Price) based on regular price
						totalMRP += price * quantity;
						totalGst += gst;
					}
                });
        
                // Add convenience fees to the total product selling price (only once, not for each item)
                totalProductSellingPrice += (bag?.ConvenienceFees || 0);
        
                // console.log("Before Coupon Total Product Selling Price: ", totalProductSellingPrice);
                if (bag.Coupon) {
                    const coupon = bag.Coupon;
                    const { CouponType, Discount, MinOrderAmount } = coupon;
        
                    const applyCouponDiscount = () => {
                        if (CouponType === "Percentage") {
                            totalProductSellingPrice -= totalProductSellingPrice * (Discount / 100);
                        } else {
                            totalProductSellingPrice -= Discount;
                        }
                    };
        
                    // Apply coupon discount only if applicable
                    if (MinOrderAmount > 0) {
                        if (totalProductSellingPrice >= MinOrderAmount) {
                            applyCouponDiscount();
                        }
                    } else {
                        applyCouponDiscount();
                    }
        
                    // Apply free shipping discount (only if coupon is valid)
                    if (bag.Coupon.FreeShipping && totalProductSellingPrice >= MinOrderAmount) {
                        totalProductSellingPrice -= bag?.ConvenienceFees || 0; // Remove convenience fees if coupon applies free shipping
                    }
                }
        
                // Set the final values for the product selling price, discount, and MRP
                setTotalProductSellingPrice(totalProductSellingPrice);
                setDiscountAmount(totalDiscount);
                setTotalMRP(totalMRP);
				setTotalGST(totalGst);
            }
        } else if (sessionBagData) {
            let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
            let totalMRP = 0,totalGst = 0;
            if(sessionBagData){
                sessionBagData.forEach(item => {
                    const { ProductData, quantity, isChecked} = item;
					if(isChecked){
						const { salePrice, price,gst} = ProductData;
						const priceWithoutGst = getOriginalAmount(gst,price);
						
						// Use salePrice if available, else fallback to regular price
						const productSellingPrice = salePrice || price;
				
						// Calculate the total sale price (totalSP) based on salePrice or regular price
						const itemTotalPrice = (salePrice > 0 ? salePrice : price) * quantity;
						totalSP += itemTotalPrice;
				
						// Calculate the discount only if there is a sale price
						if (salePrice && price > 0) {
							const discount = price - salePrice;
							totalDiscount += discount * quantity; // Multiply discount by quantity to account for multiple items
						}
				
						// Total product selling price includes salePrice or regular price
						totalProductSellingPrice += productSellingPrice * quantity;
				
						// Calculate the total MRP (Maximum Retail Price) based on regular price
						totalMRP += price * quantity;
						totalGst += gst;
					}
                });
				console.log("Price WithouGst; ",allgst,totalMRP);
                // Add convenience fees to the total product selling price (only once, not for each item)
                totalProductSellingPrice += (sessionBagData?.ConvenienceFees || 0);
            
                // console.log("Before Coupon Total Product Selling Price: ", totalProductSellingPrice);
                setTotalProductSellingPrice(totalProductSellingPrice);
                setDiscountAmount(totalDiscount || 0);
                setTotalMRP(totalMRP);
				setTotalGST(totalGst);
            }
        }
        
    }, [bag,sessionBagData]);


    const updateQty = async (e, itemId,size,color) => {
        console.log("Update Quatity Data: ", itemId,size,color,e.target.value);
        if(isAuthentication){
            await dispatch(getqtyupdate({ id: itemId,size,color, qty: Number(e.target.value) }));
            dispatch(getbag({ userId: user.id }));
        }else{
            updateBagQuantity(itemId,size,color, e.target.value)
        }
    };
    const updateChecked = async (e, itemId,size,color) => {
        console.log("Upadting Checked Item ", itemId,size,color);
		e.stopPropagation();
        // console.log("Is Checked Value: ", e.target.checked);
        if(isAuthentication){
			await dispatch(itemCheckUpdate({ id: itemId ,size,color}));
			dispatch(getbag({ userId: user.id }));
		}else{
			// updateBagQuantity(itemId, e.target.value)
			toggleBagItemCheck(itemId,size,color)
		}
    };

    const handleDeleteBag = async (productId,bagOrderItemId,size,color) => {
        if(isAuthentication){
            await dispatch(deleteBag({productId,bagOrderItemId,size,color}));
            dispatch(getbag({ userId: user.id }));
        }else{
            removeBagSessionStorage(productId,size,color)
        }
		checkAndCreateToast("success",'Item removed from BAG');
    };

    useEffect(() => {
        if (!user) {
            dispatch(getuser());
        }
        if (user) {

            if (!isAuthentication) {
                checkAndCreateToast("info",'Log in to access BAG');
            } else {
                dispatch(getbag({ userId: user.id }));
                dispatch(getAddress())
            }
            setAddress(user?.user?.addresses[0]);
        }
        dispatch(getRandomArrayOfProducts());
    }, [dispatch,deleteBagResult, user, isAuthentication]);

    const handleOnChange = ()=>{
		if(OnChangeing){
			OnChangeing();
		}
	}
	const HandleTryCheckOut = ()=>{
		if (isAuthentication) {
			if(!bag){
				checkAndCreateToast("error","Bag is empty");
                return;
			}
			if(bag?.orderItems.length === 0){
				checkAndCreateToast("error","Bag is empty");
                return;
			}
			const totalCheckingOutItems = bag.orderItems.filter(item=>item.isChecked);
			if(totalCheckingOutItems.length === 0){
				checkAndCreateToast("error","No items selected for checkout");
                return;
			}
			navigation("/bag/checkout");
		} else {
			checkAndCreateToast("error",'Log in to checkout');
			navigation('/Login');
		}
		handleOnChange();
	}
	const HandleGoToBag = ()=>{
		if(isAuthentication){
			if(!bag){
				checkAndCreateToast("error","Bag is empty");
                return;
			}
			if(bag?.orderItems.length === 0){
				checkAndCreateToast("error","Bag is empty");
                return;
			}
			const totalCheckingOutItems = bag.orderItems.filter(item=>item.isChecked);
			if(totalCheckingOutItems.length === 0){
				checkAndCreateToast("error","No items selected for checkout");
                return;
			}
			navigation('/bag');
			handleOnChange();
		}else{

			if(!sessionBagData){
				checkAndCreateToast("error","No Bag Found! Please add items to your bag");
			}
			if(sessionBagData.length === 0){
				checkAndCreateToast("error","Bag is empty");
				return;
			}
			const totalCheckingOutItems = sessionBagData.filter(item=>item.isChecked);
			if(totalCheckingOutItems.length === 0){
				checkAndCreateToast("error","No items selected for checkout");
				return;
			}
			navigation('/bag');
			handleOnChange();
		}
		
	}
    const handleConvenienceFeesChange = async () => {
        try {
            const fees = await dispatch(getConvinceFees())
            setConvenienceFees(fees);
        } catch (error) {
            console.error("Error Fetching Convenience Data: ",error);
        }
    };
    useEffect(()=> {
        // verifyAnyOrdersPayment();
        handleConvenienceFeesChange();
    },[dispatch])
    useEffect(()=>{
        if(allAddresses){
            if(allAddresses.length > 0){
                // setSelectedAddress(allAddresses[0]);
            }
        }
    },[allAddresses,dispatch])
	console.log("Bag: ",bag);
	
	return (
		<div className="flex w-full flex-row font1 justify-start items-start min-h-screen gap-2 px-2 pt-1">
			{/* Left Section (Product Listing) */}
			<div className="md:w-[43%] border-r border-gray-300 border-opacity-60 flex-col items-center max-h-screen min-h-full justify-between hidden md:flex pb-3">
				<div className="flex flex-col overflow-hidden items-center w-full">
					<h1 className="text-center font-bold text-xl sm:text-xl whitespace-nowrap text-gray-800 uppercase">You May Like</h1>
					{RandomProductLoading ? (
						<div className="grid grid-cols-1 gap-3 w-full max-h-screen overflow-y-auto py-2">
							{
								// Render 10 skeleton placeholders
								Array(10).fill(null).map((_, index) => (
									<li key={index} className="min-h-[500px] flex-grow flex-col flex-shrink-0 flex-nowrap">
										<div className="w-full h-full my-3 font-kumbsan sm:w-[180px] md:w-full md:h-[290px] lg:w-full lg:h-[420px] 2xl:w-full 2xl:h-[470px] sm:h-[360px] border border-gray-600 border-opacity-25 shadow-lg rounded-lg relative overflow-hidden animate-pulse bg-gray-300">
											<div className="w-full h-full flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-gray-300 animate-spin"></div>
                                            </div>
										</div>
									</li>
								))
							}
						</div>
					) : (
						<Fragment>
							{randomProducts && randomProducts.length > 0 && (
								<ul className="grid grid-cols-1 w-full max-h-screen px-2 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
									{randomProducts.map((pro, index) => (
										<SideBarBagProductItem pro={pro} user={user} key={index} refreshTwice = {true} />
									))}
								</ul>
							)}
						</Fragment>
					)}
				</div>
			</div>

			{/* Right Section (Bag Content) */}
			<div className="w-full flex flex-col relative h-full justify-between items-center px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 pt-1">
				{/* Order Details Header */}
				<h1 className="font-bold text-lg sm:text-xl uppercase font-kumbsan md:text-xl text-gray-800 text-left w-full mb-3">
				{
					isAuthentication && bag && bag?.orderItems && bag?.orderItems?.length > 0 ? (
						<span className='text-center flex justify-start items-center space-x-2'>
							<span>
								Cart
							</span>
							<span className='text-gray-600 text-base'>
								{`[${bag.orderItems.length}]`}
							</span>
							<span>
								items
							</span>
						</span>
					):(
						<span className='text-center flex justify-start items-center space-x-2'>
							<span>Cart</span> 
							<span className='text-gray-600 text-base'>
								{`[${sessionBagData.length}]`}
							</span> 
							<span>items</span>
						</span>
					)
				}
				</h1>
				{
					isAuthentication && user ? (
						<ul className={`w-full flex flex-col flex-grow ${bag && bag?.orderItems && bag?.orderItems.length > 0 ? "overflow-y-scroll":""} max-h-[calc(85vh-185px)] min-h-[calc(90vh-190px)] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}>
							{
								<ProductListingComponent
									bag={bag}
									updateQty={updateQty}
									handleDeleteBag={handleDeleteBag}
									updateChecked = {updateChecked}
									user={user}
								
								/>
							}
						</ul>
					):(
						<ul className={`w-full flex flex-col flex-grow ${sessionBagData && sessionBagData.length > 0 ? "overflow-y-scroll":""} max-h-[calc(85vh-185px)] min-h-[calc(80vh-180px)] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-3`}>
							{sessionBagData && sessionBagData.length > 0 ? (
								<OfflineBagContent
									sessionBagData={sessionBagData}
									updateQty={updateQty}
									updateChecked = {updateChecked}
									handleDeleteBag={handleDeleteBag}
								/>
							):(
								<div className="flex min-h-[470px] font-medium text-base sm:text-base md:text-base justify-start items-start text-left">
									<p className="text-gray-800">
										Your shopping bag is empty. Add some items to continue.
									</p>
								</div>
							)}
						</ul>

					)
				}

				{/* Center content section (scrollable) */}

				{/* Subtotal and Button Section (Always at the bottom) */}
				<div className="min-w-full space-y-1 bg-gray-50 px-4 font1 min-h-fit justify-center flex items-center">
					<div className="w-full h-fit">
						<div className="space-y-2 w-full">
							{/* Subtotal */}
							<div className="flex justify-between font-bold border-b border-b-gray-600 border-opacity-30 py-2 text-lg sm:text-xl md:text-xl text-gray-900">
								<span>SubTotal</span>
								<span>₹ {Math.round(totalProductSellingPrice)}</span>
							</div>
							<br />
							{/* Button Section */}
							<div className="grid grid-cols-2 gap-2">
								<button
									onClick={HandleGoToBag}
									className="w-full h-12 border border-black hover:border-opacity-40 text-black py-3 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-[14px] md:text-lg xl:text-lg sm:text-sm"
								>
									View Bag
								</button>

								<button
									onClick={() => {
										HandleTryCheckOut();
									}}
									className="w-full bg-black h-12 text-white  py-3 shadow-lg shadow-gray-400 transition-all duration-300 ease-in-out whitespace-nowrap transform hover:scale-105 text-[14px] md:text-lg xl:text-lg sm:text-sm"
								>
									{isAuthentication? "Checkout" : "Login"}
								</button>
							</div>
						</div>

						{/* Continue Shopping */}
						<div
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								navigation('/products');
								window.scrollTo(0, 0);
								handleOnChange();
							}}
							className="w-full cursor-pointer text-black mt-4 py-1 hover:underline text-center transition-all duration-300 ease-in-out transform hover:scale-105 text-[14px] md:text-lg xl:text-lg sm:text-sm"
						>
							Continue Shoppping
						</div>
					</div>
				</div>
			</div>
		</div>
	);

}
const OfflineBagContent = ({ sessionBagData,updateChecked, updateQty, handleDeleteBag }) => {
	const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

	// Check if the URL is a valid image
	const isValidImage = (url) => {
		return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
	};

	// Get the first valid image URL from the product's color images
	const getImageExtensionsFile = (color) => {
		return color?.images?.find((image) => image.url && isValidImage(image.url));
	};

	return (
		<div className="flex flex-col space-y-4 w-full">
			{sessionBagData.map((item, i) => {
				const active = item;
				const validImage = getImageExtensionsFile(active?.color);
				return (
					<div key={i}  className={`flex flex-col items-start justify-self-start ${i >= sessionBagData.length - 1 ? "border-b":""} py-3 space-y-4 sm:space-x-4 sm:space-y-0`}>
						{/* Product Item */}
						<div className="flex flex-row w-full justify-between items-center py-4 space-x-2 sm:space-x-4">
							<div className="flex flex-row justify-start items-start space-x-2">
								{/* Product Image */}
								<div className="w-16 h-16 sm:w-24 sm:h-24 relative bg-black border-2 rounded-lg flex-shrink-0">
									<Link to={`/products/${active?.ProductData?._id}`} className="block w-full h-full">
										<div className="relative w-full h-full">
											<img
												src={validImage?.url}
												alt={active?.ProductData?.shortTitle}
												className="object-cover w-full h-full bg-gray-50 transition-all duration-500 ease-in-out hover:scale-105"
											/>
											<div onClick={(e) => {
												updateChecked(e, active.ProductData?._id,active.size,active.color);
											}} className="absolute top-2 left-2 w-5 h-5">
												<input
													type="checkbox"
													className="w-full h-full cursor-pointer"
													defaultChecked={active.isChecked} // Set checkbox checked if it's selected in the URL
													// onChange={(e) => {}}
												/>
											</div>
										</div>
									</Link>
									<div
										className="absolute top-[-10px] right-[-10px] text-white bg-black p-1 rounded-full cursor-pointer sm:hidden"
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteBag(active.ProductData._id, active._id,active.size,active.color)
										}}
									>
										<Trash size={15} />
									</div>
								</div>

									{/* Product Info */}
								<div className="flex-1 space-y-1 text-left sm:text-left">
									<h3 className="font-semibold space-x-1 text-lg sm:text-sm md:text-base text-gray-800">
										<span>{active?.color?.name}</span><span>{active?.ProductData?.title}</span>
									</h3>
									<p className="text-[10px] sm:text-base md:text-lg text-gray-600">Size: {active?.size?.label}</p>
									<p className="text-[10px] sm:text-base md:text-lg text-gray-600">Color: {active?.color?.name}</p>

									{/* Price Section */}
									<div className="flex items-center justify-start space-x-2 text-[10px] sm:text-base md:text-lg text-red-500 mt-1">
										{active?.ProductData?.salePrice ? (
											<Fragment>
												<span>₹{Math.round(formattedSalePrice(active?.ProductData?.salePrice))}</span>
												<span className="line-through text-gray-400">
													₹{Math.round(formattedSalePrice(active.ProductData.price))}
												</span>
												{/* <span className="text-gray-700">
													({calculateDiscountPercentage(active.ProductData?.price, active.ProductData?.salePrice)}% OFF)
												</span> */}
											</Fragment>
										) : (
											<span>₹ {Math.round(formattedSalePrice(active.ProductData.price))}</span>
										)}
									</div>

									{/* Quantity Selector */}
									<div className="mt-2 flex w-fit items-center space-x-2 sm:space-x-3 justify-center shadow-sm rounded-full border-gray-700 border-opacity-40 hover:border-opacity-75 border">
										<div className="flex w-fit px-2 items-center space-x-3 justify-between">
											<button
												onClick={() => updateQty({ target: { value: Math.max(active?.quantity - 1, 1) } }, active.ProductData._id,active.size,active.color)}
												className="h-fit rounded-full text-black disabled:text-gray-300"
												disabled={active?.quantity <= 1}
											>
												<Minus className='justify-self-center' strokeWidth={1.5} />
											</button>
											<span className="text-xs sm:text-sm md:text-base">{active?.quantity}</span>
											<button
												onClick={() => updateQty({ target: { value: active?.quantity + 1 } }, active.ProductData._id,active.size,active.color)}
												className="h-fit rounded-full text-black disabled:text-gray-300"
												disabled={active?.quantity >= active?.size?.quantity}
											>
												<Plus className='justify-self-center' strokeWidth={1.5} />
											</button>
										</div>
									</div>
								</div>
							</div>

							{/* Delete Button */}
							<Trash
								size={20}
								className="text-xs sm:text-sm text-black sm:block hidden cursor-pointer hover:scale-105 mr-3"
								onClick={() => handleDeleteBag(active.ProductData._id, active._id,active.size,active.color)}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
};


const ProductListingComponent = ({ bag, updateQty,updateChecked, handleDeleteBag, user, setCoupon, applyCoupon, coupon,bagLoading }) => (
	<div className="flex flex-col space-y-4 w-full">
		{bag?.orderItems?.map((item, i) => {
			const active = item;
			const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
			const isValidImage = (url) => imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));

			const getImageExtensionsFile = () => active?.color?.images && active?.color?.images.length > 0 && active?.color?.images.find((image) => image.url && isValidImage(image.url));

			const validImage = getImageExtensionsFile();

			return (
				<div key={i}  className={`flex flex-col md:px-4 lg:px-3 2xl:px-4 px-1 items-start justify-self-start ${i >= bag?.orderItems?.length - 1 ? "border-b":""} pb-3 pt-1 space-y-4 sm:space-x-4 sm:space-y-0`}>
					{/* Product Image */}
					<div className="flex flex-row w-full justify-between items-center py-4 space-x-2 sm:space-x-4">
						<div className="flex flex-row justify-start items-start space-x-2">
						
							<div className="w-16 h-16 sm:w-24 sm:h-24 relative bg-black border-2 rounded-lg flex-shrink-0">
								<Link to={`/products/${active.productId?._id}`} className="relative">
									{validImage ? (
										<div className="relative">
											<img
												src={validImage?.url}
												alt={active?.productId?.title}
												className="object-cover w-full h-full bg-gray-50 transition-all duration-500 ease-in-out hover:scale-105"
											/>
											{/* Checkbox positioned at the top-right corner */}
											<div onClick={(e)=>{
												updateChecked(e, active?.productId?._id,active?.size,active?.color);
											}} className={`absolute top-1 left-1 w-5 cursor-pointerbg-black h-5 ${bagLoading ? "pointer-events-none":""}`}>
												<input
													type="checkbox"
													className={`w-full h-full cursor-pointer ${bagLoading ? "pointer-events-none":""}`}
													defaultChecked={active?.isChecked} // Set checkbox checked if it's selected in the URL
													// onChange={(e) => {
													// 	// updateChecked(e, active.productId?._id);
													// 	// console.log("")
													// }} // We can add the change handler if needed, or leave empty
												/>
											</div>
										</div>
									) : (
										<p>No valid image available</p>
									)}
									<div
										className="absolute top-[-10px] right-[-10px] text-white bg-black p-1 rounded-full cursor-pointer sm:hidden"
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteBag(active?.productId._id, active?._id,active?.size, active?.color)
										}}
									>
									<Trash size={15} />
									</div>
								</Link>
							</div>

							{/* Product Info */}
							<div className="flex-1 space-y-1 text-left whitespace-nowrap sm:text-left">
								<h3 className="font-semibold space-x-1 text-xs sm:text-sm md:text-base text-gray-800"><span>{active?.color?.name}</span><span>{active?.productId?.title}</span></h3>
								<p className="text-[10px] sm:text-base md:text-lg text-gray-600">Size: {active?.size?.label}</p>
								<p className="text-[10px] sm:text-base md:text-lg text-gray-600">Color: {active?.color?.name}</p>

								{/* Price and Discount Info */}
								<div className="flex items-center justify-start space-x-2 whitespace-nowrap text-[10px] sm:text-base md:text-lg text-red-600 mt-1">
									{active?.productId?.salePrice ? (
										<Fragment>
											<span>₹ {formattedSalePrice(active?.productId?.salePrice)}</span>
											<span className="line-through text-gray-400">₹{formattedSalePrice(active.productId?.price)}</span>
											<span className="text-gray-700 font-normal">(₹{calculateDiscountPercentage(active?.productId?.price, active?.productId?.salePrice)}% OFF)</span>
										</Fragment>
									) : (
										<span>₹ {formattedSalePrice(active?.productId?.price)}</span>
									)}
								</div>

								{/* Quantity Selector */}
								<div className="mt-2 flex w-fit items-center space-x-2 shadow-sm rounded-full border-gray-700 border-opacity-40 hover:border-opacity-75 border">
									<div className="flex w-fit px-2 items-center space-x-3 justify-between">
										{/* Decrease Button */}
										<button
											onClick={() => updateQty({ target: { value: Math.max(active?.quantity - 1, 1) } }, active?.productId._id,active?.size,active?.color)}
											className="h-fit rounded-full text-black disabled:text-gray-300"
											disabled={active?.quantity <= 1}
										>
											<Minus strokeWidth={1.5} />
										</button>

										{/* Display Current Quantity */}
										<span className="text-xs sm:text-sm md:text-base">{active?.quantity}</span>

										{/* Increase Button */}
										<button
											onClick={() => updateQty({ target: { value: active?.quantity + 1 } }, active?.productId?._id,active?.size,active?.color)}
											className="h-fit rounded-full text-black disabled:text-gray-300"
											disabled={active?.quantity >= active?.size?.quantity}
										>
											<Plus strokeWidth={1.5} />
										</button>
									</div>
								</div>
							</div>
						
						</div>

						{/* Delete Button for larger screens */}
						<Trash
							size={20}
							className="text-black cursor-pointer sm:block hidden hover:scale-105 mr-3"
							onClick={(e) => handleDeleteBag(active?.productId._id, active?._id,active?.size, active?.color)}
						/>
					</div>
				</div>
			);
		})}

		{/* Coupon Section */}
		{/* <div className="mt-6 space-y-2">
			<label className="block text-xs sm:text-sm md:text-base font-semibold">Have a coupon?</label>
			<div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-x-2 sm:space-y-0">
				<input
					type="text"
					value={coupon}
					onChange={(e) => setCoupon(e.target.value)}
					className="w-full h-12 border border-gray-300 bg-gray-50 text-black rounded-md px-2 focus:ring-black text-sm sm:text-base"
					placeholder="Add Voucher Code."
				/>

				<button
					onClick={applyCoupon}
					className="w-full sm:w-[20%] h-12 bg-black text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-black"
				>
					<span className="whitespace-nowrap text-[10px] sm:text-sm md:text-base text-center">Apply Coupon</span>
				</button>
			</div>
		</div>

		<CouponsDisplay user={user} /> */}
	</div>
);

export default SideBarBag
