import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAddress, getConvinceFees, getuser } from '../../action/useraction';
import { deleteBag, getbag, getqtyupdate } from '../../action/orderaction';
import { getRandomArrayOfProducts } from '../../action/productaction';
import CouponsDisplay from '../Bag/CouponDisplay';
import { Minus, Plus, Trash } from 'lucide-react';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { calculateDiscountPercentage, formattedSalePrice, getOriginalAmount } from '../../config';
import SingleProduct from '../Product/Single_product';
import ProductCardSkeleton from '../Product/ProductCardSkeleton';

const SideBarBag = () => {
	const{deleteBagResult} = useSelector(state => state.deletebagReducer)
    const { sessionBagData,updateBagQuantity,removeBagSessionStorage,sessionRecentlyViewProducts } = useSessionStorage();
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
                    const { productId, quantity } = item;
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
                    const { ProductData, quantity } = item;
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


    const updateQty = async (e, itemId) => {
        console.log("Item ID: ", itemId);
        console.log("Qty Value: ", e.target.value);
        if(isAuthentication){
            await dispatch(getqtyupdate({ id: itemId, qty: Number(e.target.value) }));
            dispatch(getbag({ userId: user.id }));
        }else{
            updateBagQuantity(itemId, e.target.value)
        }
    };

    const handleDeleteBag = async (productId,bagOrderItemId) => {
        if(isAuthentication){
            await dispatch(deleteBag({productId,bagOrderItemId}));
            dispatch(getbag({ userId: user.id }));
        }else{
            removeBagSessionStorage(productId)
        }
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

    
    /* const verifyAnyOrdersPayment = async()=>{
        if(!sessionStorage.getItem("checkoutData")) return;
        try {
            const data = JSON.parse(sessionStorage.getItem("checkoutData"))
            const response = await axios.post(`${BASE_API_URL}/api/payment/razerypay/paymentVerification`,data,headerConfig())
            console.log("Verifying Order Response: ",response.data);
            sessionStorage.removeItem("checkoutData")
            if(response?.data.success){
                checkAndCreateToast("success","Payment Successful");
                if(user){
                    setTimeout(() => {
                        dispatch(getbag({ userId: user.id }));
                    }, 1000);
                }
            }else{
                checkAndCreateToast("error","Payment Failed");
            }
            
        } catch (error) {
            console.error(`Error Verifying order: `,error);
        }
    } */
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
	console.log("Bag: ",user);
	return (
		<div className="flex flex-row font-kumbsan justify-start items-start min-h-screen gap-4 p-3">
			{/* Left Section (Product Listing) */}
			<div className="md:w-[32%] px-3 border-r border-gray-800 flex-col items-center hidden md:flex pb-10">
				{randomProducts && randomProducts.length > 0 && (
					<div className="flex flex-col items-center w-full my-auto pb-8">
						<h1 className="text-center mt-4 font-medium text-xl text-gray-800">YOU MAY LIKE</h1>
						<ul className="grid grid-cols-1 gap-3 w-full max-h-screen overflow-y-auto pb-20">
							{RandomProductLoading ? (
								<ProductCardSkeleton />
							) : (
								<Fragment>
									{randomProducts.map((pro) => (
										<SingleProduct pro={pro} user={user} key={pro._id} />
									))}
								</Fragment>
							)}
						</ul>
					</div>
				)}
			</div>

			{/* Right Section (Bag Content) */}
			<div className="md:w-[68%] xl:w-[68%] 2xl:w-[68%] w-full flex bg-slate-100 max-h-screen justify-self-start flex-col h-full justify-start items-center">
				<h3 className="font-bold text-xl sm:text-lg md:text-xl text-gray-800 text-left">
					ORDER DETAILS ({sessionBagData.length} items)
				</h3>

				<div className="w-full max-h-full py-2 overflow-y-auto">
					{sessionBagData && sessionBagData.length > 0 && (
						<OfflineBagContent
							sessionBagData={sessionBagData}
							updateQty={updateQty}
							handleDeleteBag={handleDeleteBag}
						/>
					)}
				</div>

				<div className="w-full min-h-[270px] space-y-3 justify-center bg-white flex items-center md:p-4">
					<div className="w-full max-w-xl p-2 sm:p-4">
						<div className="space-y-2">
							<div className="flex justify-between font-semibold text-xl sm:text-2xl text-gray-900">
								<span>SubTotal</span>
								<span>₹{Math.round(totalProductSellingPrice)}</span>
							</div>
							<br />

							<div className="flex flex-col justify-between text-xs sm:text-sm text-gray-700 border-b border-gray-300 md:pb-2">
							{/* Button Section */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 md:px-3 xl:px-4">
								<button
									onClick={() => {
										if (isAuthentication) {
											navigation("/Login");
										} else {
											navigation('/bag');
										}
									}}
									className="w-full bg-gray-50 border border-black hover:border-opacity-60 text-black hover:text-white py-3 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
								>
									View Bag
								</button>

								<button
									onClick={() => {
										if (isAuthentication) {
											navigation("/bag/checkout");
										} else {
											navigation('/Login');
										}
									}}
									className="w-full bg-black text-white py-3 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
								>
									Checkout
								</button>
							</div>
							<br />
						</div>
						<div className='w-full justify-center md:mt-4 flex items-center'>
							<span className="text-xs sm:text-sm">or Continue Shopping</span>
						</div>

						</div>
					</div>
				</div>
			</div>
		</div>


	);

}
const OfflineBagContent = ({ sessionBagData, updateQty, handleDeleteBag }) => {
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
		<div className="w-full flex flex-col space-y-4">
		{[1, 2, 3, 4, 5, 5].map((item, i) => {
			const active = sessionBagData[0];
			const validImage = getImageExtensionsFile(active?.color);

			return (
				<div key={i} className="flex flex-col items-start border-b py-4 space-y-2 sm:space-x-4 sm:space-y-0">
					{/* Product Item */}
					<div className="flex flex-row w-full justify-between items-center py-4 space-x-2 sm:space-x-4">
					<div className="flex flex-row justify-start items-start space-x-2">
						{/* Product Image */}
						<div className="w-16 h-16 sm:w-24 sm:h-24 relative bg-black border-2 rounded-lg flex-shrink-0">
							<Link to={`/products/${active?.ProductData?._id}`} className="block w-full h-full">
								<img
									src={validImage?.url}
									alt={active?.ProductData?.shortTitle}
									className="object-cover w-full h-full bg-gray-50 transition-all duration-500 ease-in-out hover:scale-105"
								/>
							</Link>
						</div>

						{/* Product Info */}
						<div className="flex-1 space-y-1 text-left sm:text-left">
						<h3 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-800">{active?.ProductData?.title}</h3>
						<p className="text-xs sm:text-sm lg:text-sm text-gray-600">Size: {active?.size?.label}</p>

						{/* Price Section */}
						<div className="flex items-center justify-start space-x-2 text-xs sm:text-sm lg:text-base text-blue-500 mt-1">
							{active?.ProductData?.salePrice ? (
								<Fragment>
									<span>₹{Math.round(formattedSalePrice(active?.ProductData?.salePrice))}</span>
									<span className="line-through text-gray-400">₹{Math.round(formattedSalePrice(active.ProductData.price))}</span>
									<span className="text-gray-700">({calculateDiscountPercentage(active.ProductData?.price, active.ProductData?.salePrice)}% OFF)</span>
								</Fragment>
							) : (
								<span>₹ {Math.round(formattedSalePrice(active.ProductData.price))}</span>
							)}
						</div>

						{/* Quantity Selector */}
						<div className="mt-2 flex w-32 sm:w-40 md:w-48 items-center space-x-2 sm:space-x-3 shadow-sm rounded-full border-gray-700 border">
							<div className="flex w-full px-2 items-center space-x-1 justify-between">
								<button
								onClick={() => updateQty({ target: { value: Math.max(active?.quantity - 1, 1) } }, active.ProductData._id)}
								className="h-8 w-8 sm:h-9 sm:w-9 px-2 rounded-full text-xs sm:text-sm disabled:text-gray-300"
								disabled={active?.quantity <= 1}
								>
								<Minus strokeWidth={3} />
								</button>
								<span className="text-xs sm:text-sm lg:text-base">{active?.quantity}</span>
								<button
									onClick={() => updateQty({ target: { value: active?.quantity + 1 } }, active.ProductData._id)}
									className="h-8 w-8 sm:h-9 sm:w-9 px-2 rounded-full text-xs sm:text-sm disabled:text-gray-300"
									disabled={active?.quantity >= active?.size?.quantity}
								>
								<Plus strokeWidth={3} />
								</button>
							</div>
						</div>

						</div>
					</div>

					{/* Delete Button */}
					<Trash
						className="text-lg text-gray-900 hover:text-gray-500 cursor-pointer mt-2 sm:mt-0"
						onClick={() => handleDeleteBag(active.ProductData._id, active._id)}
					/>
					</div>
				</div>
			);
		})}
		</div>
	);
};


const ProductListingComponent = ({ bag, updateQty, handleDeleteBag, user, setCoupon, applyCoupon, coupon }) => (
	<div className="flex-1 font-kumbsan space-y-6 border-r-[1px] border-r-gray-800 border-opacity-20 pr-5">
		{bag?.orderItems?.map((item, i) => {
			const active = item;
			const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
			const isValidImage = (url) => imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));

			const getImageExtensionsFile = () => active?.color?.images.find((image) => image.url && isValidImage(image.url));

			const validImage = getImageExtensionsFile();

			return (
				<div key={i} className="relative flex flex-col sm:flex-row items-center border-b py-6 space-y-6 sm:space-y-0 sm:space-x-6">
					{/* Product Image */}
					<div className="w-fit h-28 sm:w-40 sm:h-40 relative bg-black border-2 rounded-lg">
						<Link to={`/products/${active.productId?._id}`}>
							{validImage ? (
								<img
									src={validImage?.url}
									alt={active?.productId?.title}
									className="w-full h-full object-cover transition-all duration-500 ease-in-out hover:scale-105"
								/>
							) : (
								<p>No valid image available</p>
							)}
						</Link>
						{/* Delete Button on the Image (Mobile) */}
						<div
							className="absolute top-[-10px] right-[-10px] text-white bg-black p-1 rounded-full cursor-pointer sm:hidden"
							onClick={(e) => {
								e.stopPropagation();
								handleDeleteBag(active.productId._id, active._id);
							}}
						>
							<Trash size={15} />
						</div>
					</div>

					{/* Product Info */}
					<div className="ml-6 flex-1 w-full justify-center items-start flex-col">
						<h3 className="font-semibold text-lg text-gray-800 truncate">{active?.productId?.title}</h3>
						<p className="text-sm text-gray-600">Size: {active?.size?.label}</p>

						{/* Price and Discount Info */}
						<div className="flex items-center space-x-4 text-sm text-blue-400 mt-2">
							{active?.productId?.salePrice ? (
								<>
									<span>₹ {formattedSalePrice(active?.productId?.salePrice)}</span>
									<span className="line-through text-gray-400">₹{formattedSalePrice(active.productId.price)}</span>
									<span className="text-gray-700 font-normal">(₹{calculateDiscountPercentage(active.productId?.price, active.productId?.salePrice)}% OFF)</span>
								</>
							) : (
								<span>₹ {formattedSalePrice(active?.productId?.price)}</span>
							)}
						</div>

						{/* Quantity Selector */}
						<div className="mt-4 flex w-fit items-center space-x-4 px-5 shadow-md justify-center rounded-full border-gray-700 border border-opacity-40 p-1">
							{/* Decrease Button */}
							<button
								onClick={() => updateQty({ target: { value: Math.max(active?.quantity - 1, 1) } }, active.productId._id)}
								className="h-10 w-10 px-2 rounded-full disabled:text-gray-300"
								disabled={active?.quantity <= 1}
							>
								<Minus />
							</button>

							{/* Display Current Quantity */}
							<span className="text-sm">{active?.quantity}</span>

							{/* Increase Button */}
							<button
								onClick={() => updateQty({ target: { value: active?.quantity + 1 } }, active.productId._id)}
								className="h-10 w-10 px-2 rounded-full disabled:text-gray-300"
								disabled={active?.quantity >= active?.size?.quantity}
							>
								<Plus />
							</button>
						</div>
					</div>

					{/* Delete Button for larger screens */}
					<Trash
						className="text-xl text-gray-700 hover:text-gray-500 cursor-pointer sm:block hidden mt-4 sm:mt-0"
						onClick={(e) => handleDeleteBag(active.productId._id, active._id)}
					/>
				</div>
			);
		})}

		{/* Coupon Section */}
		<div className="mt-6 space-y-2">
			<label className="block text-xs sm:text-sm md:text-base font-semibold">Have a coupon?</label>
			<div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-x-2 sm:space-y-0">
				{/* Coupon Input */}
				<input
					type="text"
					value={coupon}
					onChange={(e) => setCoupon(e.target.value)}
					className="w-full h-12 border border-gray-300 bg-gray-50 text-black rounded-md px-2 focus:ring-black text-sm sm:text-base"
					placeholder="Add Voucher Code."
				/>

				{/* Apply Coupon Button */}
				<button
					onClick={applyCoupon}
					className="w-full sm:w-[20%] h-12 bg-black text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-black"
				>
					<span className="whitespace-nowrap text-[10px] sm:text-sm md:text-base text-center">Apply Coupon</span>
				</button>
			</div>
		</div>

		{/* Display Coupons */}
		<CouponsDisplay user={user} />
	</div>
);

export default SideBarBag
