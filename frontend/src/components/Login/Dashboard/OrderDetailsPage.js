import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchOrderById, sendOrderCancel, sendOrderReturn } from '../../../action/orderaction';
import DeliveryStatus from './DeliveryStatus';
import Loader from '../../Loader/Loader';
import { capitalizeFirstLetterOfEachWord, formattedSalePrice, ORDER_ENCRYPTION_SECREAT_KEY } from '../../../config';
import Footer from '../../Footer/Footer';
import BackToTopButton from '../../Home/BackToTopButton';
import { ChevronLeft, MapIcon } from 'lucide-react';
import WhatsAppButton from '../../Home/WhatsAppButton';
import { useSettingsContext } from '../../../Contaxt/SettingsContext';
import { useEncryptionDecryptionContext } from '../../../Contaxt/EncryptionContext';
import ReturnsOptionsWindow from './ReturnsOptionsWindow';
import { fetchTermsAndCondition } from '../../../action/common.action';
import { IoIosCall } from 'react-icons/io';
import { FaWhatsapp } from 'react-icons/fa';
import RandomProductsDisplay from './RandomProductsDisplay';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useServerAuth } from '../../../Contaxt/AuthContext';

// Helper function to format the date

const OrderItem = ({ item }) => {
	const {encrypt} = useEncryptionDecryptionContext();
	const productEncryption = encrypt(item?.productId?._id);
	return (
		<div key={item._id} className="border-b pb-6">
			<div className="flex w-full flex-row space-x-4 justify-start items-center">
				<Link to={`/products/${productEncryption}`}>
					<LazyLoadImage
						effect='blur'
						useIntersectionObserver
							wrapperProps={{
							// If you need to, you can tweak the effect transition using the wrapper style.
							style: {transitionDelay: "1s"},
						}}
						placeholder = {<div className="w-full h-full bg-gray-200 animate-pulse"></div>}	
						loading='lazy'
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

const AddressSection = ({ address }) => (
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

const OrderDetailsPage = () => {
	const{checkAuthUser,user,userLoading,isAuthentication} = useServerAuth();
    const [orderItems, setOrderItems] = useState([]);
    const scrollableDivRef = useRef(null);
    const params = useParams();
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
	const{ termsAndCondition } = useSelector(state => state.TermsAndConditions);
	const [phoneNumber,setPhoneNumber] = useState('919326727797'); // replace with your phone number
	const message = 'Hi!, I Have a Query?'; // replace with your message
	const{decryptWithKey} = useEncryptionDecryptionContext();
    const { checkAndCreateToast } = useSettingsContext();
    const { orderbyid, loading } = useSelector(state => state.getOrderById);
	
	const[openReturnOptionWindow,setOpenReturnOptionWindow] = useState(false);
	useEffect(()=>{
		if(!user && !userLoading && !isAuthentication){
			navigate('/');
		}
	},[user,userLoading,isAuthentication])
    useEffect(() => {
        if (params) {
            dispatch(fetchOrderById(decryptWithKey(params.orderId,ORDER_ENCRYPTION_SECREAT_KEY)))
        } else {
            navigate(-1);
        }
    }, [dispatch]);

    useEffect(() => {
        if (orderbyid) {
            setOrderItems(orderbyid.orderItems);
        }
    }, [orderbyid]);
	

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
	const createCancelOrder = async()=>{
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


    const handleBackButtonClick = () => {
        navigate(-1); 
    };
	useEffect(()=>{
		if(termsAndCondition){
			setPhoneNumber(termsAndCondition?.phoneNumber);
		}
	},[termsAndCondition])
	useEffect(()=>{
		scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		dispatch(fetchTermsAndCondition());
	},[])
	const handleOpenWhatsAppClick = () => {
		const checkedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '')
		const url = `https://wa.me/${checkedPhoneNumber}?text=${encodeURIComponent(message)}`;
		window.open(url, '_blank');
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
										className="text-gray-600 animate-pulse hover:underline font-medium flex gap-2"
									>
										Click here to track your order <MapIcon className=' animate-pulse'/>
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
								<div className="space-y-2 flex flex-col">
									<strong className="text-xl font-semibold text-gray-800">Delivery Status</strong>
									<span className='animate-pulse'>{orderbyid?.status}</span>
								</div>
								<div className="space-y-2 flex flex-col">
									<strong className="text-xl font-semibold text-gray-800">Payment Mode</strong>
									<span>{orderbyid?.paymentMode}</span>
								</div>
								{
									orderbyid?.etd && <div className="space-y-2 flex flex-col">
										<strong className="text-xl font-semibold text-gray-800">ETD (Estimated Time Delivery)</strong>
										<span>{new Date(orderbyid?.etd).toDateString()}</span>
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
									<p className="font-semibold text-gray-800">Shipping Cost:</p>
									<p className="text-base text-gray-600">{orderbyid.ConveenianceFees > 0 ? `₹${formattedSalePrice(orderbyid?.ConveenianceFees)}` : "Free"}</p>
								</div>
								{/* Customer Contact Section */}
								<div className="mt-6 p-4 bg-gray-100 rounded-lg text-center sm:p-6 md:p-8 lg:p-10">
									<h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700">Having an issue?</h3>
									<p className="text-xs sm:text-sm md:text-base text-gray-500 mt-2">
										If any issue arises, feel free to reach out to our support team.
									</p>
									<div className='gap-2 w-full flex md:flex-row flex-col justify-between items-center'>
										<Link 
											to="/contact" 
											className="mt-4 space-x-2 justify-center items-center flex w-full whitespace-nowrap bg-gray-800 text-white py-2 px-6 hover:rounded-lg transition-all duration-300 ease-ease-out-expo text-lg hover:bg-gray-600 sm:text-base md:text-lg lg:text-xl"
										>
											<IoIosCall size={20}/>
											<span>Contact Us</span>
										</Link>
										<button
											onClick={handleOpenWhatsAppClick}
											className="mt-4 space-x-2 justify-center items-center flex w-full whitespace-nowrap bg-gray-800 text-white py-2 px-6 hover:rounded-lg transition-all duration-300 ease-ease-out-expo text-lg hover:bg-gray-600 sm:text-base md:text-lg lg:text-xl"
										>
											<FaWhatsapp size={20}/>
											<span>Whats App</span>
										</button>
									</div>
								</div>
								
							</div>
							<div className="space-y-2">
								{
									orderbyid?.status === 'Delivered' ? (
										<button
											disabled={!orderbyid || orderbyid?.IsReturning}
											onClick={()=> setOpenReturnOptionWindow(!openReturnOptionWindow)}
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
					<RandomProductsDisplay label = {'You may also like'}/> 
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

export default OrderDetailsPage;
