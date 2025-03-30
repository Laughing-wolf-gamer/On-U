import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { fetchOrderById, sendExchangeRequest, sendOrderCancel, sendOrderReturn } from '../../../action/orderaction';
import DeliveryStatus from './DeliveryStatus';
import Loader from '../../Loader/Loader';
import { capitalizeFirstLetterOfEachWord, formattedSalePrice, ORDER_ENCRYPTION_SECREAT_KEY } from '../../../config';
import Footer from '../../Footer/Footer';
import BackToTopButton from '../../Home/BackToTopButton';
import { ChevronLeft, ChevronRight, MapIcon } from 'lucide-react';
import WhatsAppButton from '../../Home/WhatsAppButton';
import { useSettingsContext } from '../../../Contaxt/SettingsContext';
import { useEncryptionDecryptionContext } from '../../../Contaxt/EncryptionContext';
import ReturnsOptionsWindow from './ReturnsOptionsWindow';
import { getRandomArrayOfProducts } from '../../../action/productaction';
import SingleProduct from '../../Product/Single_product';

// Helper function to format the date
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

const OrderItem = ({ item }) => {
	const {encrypt,decrypt} = useEncryptionDecryptionContext();
	const productEncryption = encrypt(item?.productId?._id);
	return (
		<div key={item._id} className="border-b pb-6">
			<div className="flex w-full flex-row space-x-4 justify-start items-center">
				<Link to={`/products/${productEncryption}`}>
					<img
						src={item?.color.images[0].url}
						alt="Product"
						className="w-28 h-28 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
					/>
				</Link>
				<div className="space-y-1 w-min">
					<h3 className="text-lg font-semibold text-gray-800 truncate hover:text-blue-500 cursor-pointer">
						{capitalizeFirstLetterOfEachWord(item?.productId?.title)}
					</h3>
					
					<div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
						<span className="font-semibold">Color:</span>
						<span
							className="w-5 h-5 border-2 rounded-full"
							style={{backgroundColor: item?.color?.name}}
							title={`Color: ${item?.color?.name}`}
						/>
					</div>
					<div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
						<span className="font-semibold">Size:</span>
						<span className="ml-2 w-10 h-5 border-2 text-center flex items-center justify-center rounded-md bg-gray-100">
							{item.size}
						</span>
					</div>
					<strong className="text-lg font-semibold text-gray-800 mt-2">₹ {formattedSalePrice(item.productId?.salePrice || item.productId?.price)}</strong>
				</div>
			</div>
		</div>
	);
}

const AddressSection = ({ address, userName }) => (
    <div className="mb-6 border p-2 rounded-md">
        <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
        <div className="py-2 w-full space-y-2">
            {Object.entries(address).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-2 text-sm text-gray-600">
                    <span className="font-medium text-base text-right">{capitalizeFirstLetterOfEachWord(key)}:</span>
                    <span className="font-normal text-xs text-left">{value}</span>
                </div>
            ))}
        </div>
    </div>
);

const OrderDetailsPage = ({ user }) => {
    const params = useParams();
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
	const{decryptWithKey} = useEncryptionDecryptionContext();
    const { checkAndCreateToast } = useSettingsContext();
    const { orderbyid, loading } = useSelector(state => state.getOrderById);
	const { randomProducts } = useSelector(state => state.RandomProducts);
	const[openReturnOptionWindow,setOpenReturnOptionWindow] = useState(false);
    const scrollableDivRef = useRef(null);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        if (params) {
            dispatch(fetchOrderById(decryptWithKey(params.orderId,ORDER_ENCRYPTION_SECREAT_KEY)))
        } else {
            navigate(-1);
        }
    }, [dispatch, params]);

    useEffect(() => {
        if (orderbyid) {
            setOrderItems(orderbyid.orderItems);
        }
    }, [orderbyid]);
	useEffect(()=>{
		dispatch(getRandomArrayOfProducts());
	},[])

    const createOrderReturn = async (refundOptionsData) => {
        if (!orderbyid?.IsReturning) {
            const response = await dispatch(sendOrderReturn({orderId: orderbyid._id,refundOptionsData }));
			if(response){
            	await dispatch(fetchOrderById(decryptWithKey(params.orderId,ORDER_ENCRYPTION_SECREAT_KEY)));
				if (orderbyid?.IsReturning) {
					checkAndCreateToast("success", 'Order Returned Successfully');
				} else {
					checkAndCreateToast("success", 'Order Exchanged Successfully');
				}
			}else{
				checkAndCreateToast('error','Failed to Return Order')
			}
        } else {
            checkAndCreateToast('error', 'Order is already in return process');
        }
		setOpenReturnOptionWindow(false);
    }
	const createCancelOrder = async(e)=>{
		if(!orderbyid?.IsCancelled){
			const response = await dispatch(sendOrderCancel({ orderId: orderbyid._id }));
            await dispatch(fetchOrderById(decryptWithKey(params.orderId,ORDER_ENCRYPTION_SECREAT_KEY)));
			if(response){
				if (orderbyid?.IsCancelled) {
					checkAndCreateToast("success", 'Order Cancelled Successfully');
				} else {
					checkAndCreateToast("success", 'Order Refunded Successfully');
				}
			}else{
				checkAndCreateToast('error','Failed to Cancel Order')
			}
		}
	}

    const createOrderExchange = async (e) => {
        if (!orderbyid?.IsInExcnage) {
            await dispatch(sendExchangeRequest({ orderId: orderbyid._id }));
            await dispatch(fetchOrderById(decryptWithKey(params.orderId,ORDER_ENCRYPTION_SECREAT_KEY)));
            if (orderbyid?.IsInExcnage) {
                checkAndCreateToast("success", 'Order Exchanged Successfully');
            } else {
                checkAndCreateToast("success", 'Order Returned Successfully');
            }
        } else {
            checkAndCreateToast('error', 'Order is already in exchange process');
        }
    }

    const handleBackButtonClick = () => {
        navigate(-1); 
    };

    return (
        <div ref={scrollableDivRef} className="w-full min-h-screen overflow-y-auto bg-gray-50 font-sans scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300">
            {!loading && orderbyid ? (
                <div className="max-w-screen-2xl w-full mx-auto py-8 px-2 sm:px-6">
					<h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>

					{/* Back Button */}
					<button
						onClick={handleBackButtonClick}
						className="text-sm hover:underline font-semibold text-gray-600 mb-6 flex items-center space-x-2"
					>
						<ChevronLeft />
						<span>Back to Orders</span>
					</button>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
						<div className="col-span-1 lg:col-span-8 bg-white rounded-lg p-2 sm:p-3 md:p-6 xl:p-5 2xl:p-6 space-y-6 border border-gray-600">
							{/* Order Created Date */}
							{orderbyid?.createdAt && (
								<div className="space-y-2">
									<h2 className="text-xl font-semibold text-gray-800">Order Date</h2>
									<p className="text-lg text-gray-600">{new Date(orderbyid.createdAt).toDateString()}</p>
								</div>
							)}
							{/* Order Items Section */}
							<div className={`space-y-4 max-h-[400px] overflow-y-auto ${orderItems?.length > 5 ? "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200":''}`}>
								<h2 className="text-xl font-semibold text-gray-800">Order Items</h2>
								{orderItems?.length > 0 && orderItems.map((item, index) => (
									<OrderItem key={item._id || index} item={item} />
								))}
							</div>

							{/* Delivery Status */}
							<DeliveryStatus status={orderbyid?.status} />
							{/* Tracking URL Section */}
							{orderbyid?.trackingUrl && (
								<div className="space-y-2 ">
									<h2 className="text-xl font-semibold text-gray-800">Track Your Order</h2>
									<a
										href={orderbyid?.trackingUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500 hover:underline font-medium flex gap-2"
									>
										Click here to track your order <MapIcon/>
									</a>
								</div>
							)}
							{/* Total Amount Section */}
							<div className="space-y-2">
								<h2 className="text-xl font-semibold text-gray-800">Total Amount</h2>
								<p className="text-lg font-bold text-gray-800">₹ {formattedSalePrice(orderbyid?.TotalAmount)}</p>
							</div>

							{/* Payment and Delivery Status */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								<div className="space-y-2">
									<h2 className="text-xl font-semibold text-gray-800">Delivery Status</h2>
									<p>{orderbyid?.status}</p>
								</div>
								<div className="space-y-2">
									<h2 className="text-xl font-semibold text-gray-800">Payment Mode</h2>
									<p>{orderbyid?.paymentMode}</p>
								</div>
								{
									orderbyid?.etd && <div className="space-y-2">
										<h2 className="text-xl font-semibold text-gray-800">ETD (Estimated Time Delivery)</h2>
										<p>{new Date(orderbyid?.etd).toDateString()}</p>
									</div>
								}
								
							</div>
						</div>

						{/* Sidebar - Order Summary */}
						<div className="col-span-1 lg:col-span-4 justify-between flex flex-col bg-white p-2 sm:p-3 md:p-6 xl:p-5 2xl:p-6 rounded-lg space-y-6 border border-gray-600">
							<div className="rounded-md space-y-4 flex-1 flex-col">
								<h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
								{orderbyid?.address && <AddressSection address={orderbyid.address} userName={user?.user?.name} />}
								<div className="space-y-2 justify-between flex items-center">
									<p className="font-semibold text-gray-800">Total Items:</p>
									<p className="text-base text-gray-600 font-extrabold">{orderbyid?.orderItems?.length}</p>
								</div>
								
								<div className="space-y-2 justify-between flex items-center">
									<p className="font-semibold text-gray-800">Total Amount:</p>
									<p className="text-base text-gray-600">₹{formattedSalePrice(orderbyid?.TotalAmount)}</p>
								</div>
								<div className="space-y-2 justify-between flex items-center">
									<p className="font-semibold text-gray-800">Shipping:</p>
									<p className="text-base text-gray-600">{orderbyid.ConveenianceFees > 0 ? `₹${formattedSalePrice(orderbyid?.ConveenianceFees)}` : "Free"}</p>
								</div>
								
							</div>
							<div className="space-y-2">
								{
									orderbyid?.status === 'Delivered' ? (
										<button
											disabled={!orderbyid || orderbyid?.IsReturning}
											onClick={(e)=> setOpenReturnOptionWindow(!openReturnOptionWindow)}
											className="w-full py-4 bg-gray-800 text-white rounded-md active:shadow-md hover:shadow-xl transition-all disabled:bg-gray-400"
										>
											{orderbyid?.IsReturning ? "Return Request in Process" : "Request To Return"}
										</button>
									) : (
										<button
											disabled={!orderbyid || orderbyid?.IsCancelled}
											onClick={createCancelOrder}
											className="w-full py-4 bg-gray-800 text-white rounded-md active:shadow-md hover:shadow-xl transition-all disabled:bg-gray-400"
										>
											{orderbyid?.IsCancelled ? "Cancel Request in Process" : "Request Cancel Order"}
										</button>
									)
								}
							</div>
						</div>
						{/* Address Section */}
					</div>
					<RandomProductsDisplay randomProducts={randomProducts}/>
				</div>

            ) : (
                <Loader />
            )}
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
            <WhatsAppButton scrollableDivRef={scrollableDivRef} />
            <Footer />
			{
				openReturnOptionWindow && <ReturnsOptionsWindow OnSubmit={(data)=>{
					createOrderReturn(data);
				}} OnClose={()=> setOpenReturnOptionWindow(false)}/>
			}
			
        </div>
    );
};
const RandomProductsDisplay = ({ randomProducts }) => {
	const [isMouseDown, setIsMouseDown] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);
	const scrollContainerRef = useRef(null);

	const handleMouseDown = (e) => {
		setIsMouseDown(true);
		setStartX(e.pageX - e.target.offsetLeft);
		setScrollLeft(e.target.scrollLeft);
	};

	const handleMouseLeave = () => {
		setIsMouseDown(false);
	};

	const handleMouseUp = () => {
		setIsMouseDown(false);
	};

	const handleMouseMove = (e) => {
		if (!isMouseDown) return;
		e.preventDefault();
		e.stopPropagation();
		const x = e.pageX - e.target.offsetLeft;
		const walk = (x - startX) * 2; // Adjust multiplier for scrolling speed
		e.target.scrollLeft = scrollLeft - walk;
	};

	const scrollLeftHandler = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' }); // Change 300 to adjust scroll speed
		}
	};

	const scrollRightHandler = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' }); // Change 300 to adjust scroll speed
		}
	};

	return (
		randomProducts && randomProducts.length > 0 && (
		<div className="mt-2 mb-7 w-full pb-6 pt-4 px-4">
			<div className="w-full justify-center items-center flex px-1 py-2">
			<h1 className="flex text-center mt-4 font-semibold">MORE YOU LIKE</h1>
			</div>

			<div className="relative">
			<button
				onClick={scrollLeftHandler}
				className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full z-10"
			>
				<ChevronLeft/>
			</button>

			<div
				ref={scrollContainerRef}
				className="justify-center items-start overflow-x-auto"
				onMouseDown={handleMouseDown}
				onMouseLeave={handleMouseLeave}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
				style={{ cursor: 'grab',userSelect: 'none'  }}
			>
				<ul className="flex gap-4 py-2 sm:gap-2 md:gap-8 lg:gap-6">
				{randomProducts.map((pro, index) => (
					<li key={pro?._id || index} className="flex-shrink-0 w-[200px] md:w-max lg:w-max">
					<SingleProduct pro={pro} />
					</li>
				))}
				</ul>
			</div>

			<button
				onClick={scrollRightHandler}
				className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full z-10"
			>
				<ChevronRight/>
			</button>
			</div>
		</div>
		)
	);
};

export default OrderDetailsPage;
