import React, { useState, useEffect } from 'react';
import { BsShieldFillCheck } from 'react-icons/bs';
import { GrClose } from 'react-icons/gr';
import { useSelector, useDispatch } from 'react-redux';
import { getbag, getqtyupdate, deletebag } from '../../action/orderaction';
import { getAddress, getuser, updateAddress } from "../../action/useraction";
import { useAlert } from 'react-alert';
import { useNavigate, Link } from 'react-router-dom';
import './bag.css';
import { Select } from '@mui/material';
import AddAddressPopup from './AddAddressPopup';
import PaymentProcessingPage from '../Payments/PaymentProcessingPage';

const Bag = () => {
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const { loading: userLoading, user, isAuthentication } = useSelector(state => state.user);
    const {allAddresses} = useSelector(state => state.getAllAddress)
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const [mrp, setMrp] = useState(0);
    // const [sp, setSp] = useState(0);
    const [ds, setDs] = useState(0);
    const [id, setId] = useState('');
    const [initialized, setInitialized] = useState(false);

    const [address, setAddress] = useState(null);

    const [isAddressFilled, setIsAddressFilled] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const handleOpenPopup = () => setIsAddressPopupOpen(true);
    const handleClosePopup = () => setIsAddressPopupOpen(false);
    const handleSaveAddress = async (newAddress) => {
        // const updatedAddresses = [...user.user.addresses, newAddress];
        // Assuming you have a function to update the user's address in the backend
        await dispatch(updateAddress(newAddress));
        await dispatch(getuser());
        alert.success('Address added successfully');
    };

    useEffect(() => {
        if (!user) {
            dispatch(getuser());
        }
        if (user) {

            if (!isAuthentication) {
                alert.info('Log in to access BAG');
            } else {
                dispatch(getbag({ userId: user.id }));
                dispatch(getAddress())
            }
            setAddress(user?.user?.addresses[0]);
        }
    }, [dispatch, user, isAuthentication, alert]);

    useEffect(() => {
        if (bag?.orderItems) {
            let totalMRP = 0, totalSP = 0, totalDiscount = 0;
            bag.orderItems.forEach(item => {
                // Check if salePrice is available, else fallback to price
                const currentMrp = item.productId.salePrice || item.productId.price; 
                // Add the total price (either salePrice or regular price)
                totalMRP += currentMrp * item.quantity; // Regular price multiplied by quantity
                // totalSP += salePrice * item.quantity;// Sale price (or regular price) multiplied by quantity
            });

            // Calculate the total discount
            totalDiscount = totalMRP - totalSP;

            // Set the calculated values
            setMrp(totalMRP);
            // setSp(totalSP);
            setDs(totalDiscount);
            console.log("Bag: ", bag);
        }
    }, [bag]);

    const updateQty = async (e, itemId) => {
        console.log("Item ID: ", itemId);
        console.log("Qty Value: ", e.target.value);
        await dispatch(getqtyupdate({ id: itemId, qty: Number(e.target.value) }));
        dispatch(getbag({ userId: user.id }));
    };

    const handleDeleteBag = (productId) => {
        dispatch(deletebag({ product: productId, user: user.id }));
    };

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleAddressSubmit = () => {
        if (Object.values(address).every(value => value.trim() !== '')) {
            setIsAddressFilled(true);
            alert.success('Address added successfully');
        } else {
            alert.error('Please fill out all the fields');
        }
    };

    const handleAddressSelection = (address) => {
        setSelectedAddress(address);
    };
    const [showPayment,setShowPayment] = useState(false);

    const placeOrder = () => {
        if (selectedAddress) {
            // navigate('/processPayment');
            setShowPayment(true);
        } else {
            alert.error('Please select a delivery address');
        }
    };
    console.log("Users Address: ",bag);

    return (
        <>
            {isAuthentication ? (
                <div>
                    {!bagLoading && bag?.orderItems?.length > 0 ? (
                        <div className="relative max-w-screen-lg mx-auto">
                            <div className="flex justify-between items-center mt-6">
                                <div className="flex space-x-2 text-[#696B79]">
                                    <span className="font-semibold text-[#0db7af]">BAG</span>
                                    <span>--------</span>
                                    {/* <span className="font-semibold">ADDRESS</span>
                                    <span>--------</span> */}
                                    <span className="font-semibold">PAYMENT</span>
                                </div>
                                <div className="flex items-center">
                                    <BsShieldFillCheck className="text-[#0db7af] text-3xl" />
                                    <span className="ml-2 text-[#535766] text-xs">100% SECURE</span>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row mt-4 gap-6">
                                <div className="flex-1">
                                    {bag && bag.orderItems && bag.orderItems.length > 0 && bag.orderItems.map((item,i) => (
                                        <div key={i} className="flex items-center border-b py-4">
                                            <Link to={`/products/${item.productId?._id}`}>
                                                <img src={item?.color?.images[0].url} alt={item?.productId?.title} className="w-24 h-24 object-contain" />
                                            </Link>
                                            <div className="ml-4 flex-1">
                                                <h3 className="font-semibold">{item?.productId?.title}</h3>
                                                <p className="text-sm">Size: {item.size.label}</p>
                                                <div className="flex items-center space-x-2 text-sm text-[#0db7af]">
                                                    <span>₹{Math.round(item.productId.salePrice)}</span>
                                                    <span className="line-through text-[#94969f]">₹{item.productId.price}</span>
                                                    <span className="text-[#f26a10]">₹{-Math.round(item.productId.price - item.productId.salePrice)} OFF</span>
                                                </div>
                                                <div className="mt-2">
                                                    Qty:
                                                    <select
                                                        value={item.quantity}
                                                        onChange={(e) => updateQty(e, item.productId._id)}
                                                        // onBlur={(e) => } // Optional: to update on blur
                                                        className="ml-2 h-10 w-14 px-2 border rounded"
                                                    >
                                                        {/* Create options from 1 to item.size.quantity */}
                                                        {[...Array(item.size.quantity).keys()].map(num => (
                                                            <option key={num + 1} value={num + 1}>
                                                                {num + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                            </div>
                                            <GrClose
                                                className="text-xl text-red-500 cursor-pointer"
                                                onClick={() => handleDeleteBag(item.productId._id)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">PRICE DETAILS ({bag.orderItems.length} items)</h3>
                                    <div className="flex justify-between mb-2">
                                        <span>Total MRP</span>
                                        <span>₹{mrp}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Discount</span>
                                        <span>-₹{Math.round(ds)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Coupon Discount</span>
                                        <span>Apply Coupon</span>
                                    </div>
                                    <div className="flex justify-between mb-4">
                                        <span>Convenience Fee</span>
                                        <span className="line-through">₹99</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-xl">
                                        <span>Total</span>
                                        <span>₹{Math.round(mrp)}</span>
                                    </div>
                                    {/* <button
                                        onClick={placeOrder}
                                        className="w-full bg-[#0db7af] text-white py-2 mt-4 rounded-lg"
                                    >
                                        Proceed to Payment
                                    </button> */}
                                </div>
                            </div>

                            {/* Address List */}
                            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Your Addresses</h3>
                                <div className="space-y-4">
                                    {user && user.user && allAddresses && allAddresses.length > 0 ? (
                                        allAddresses.map((addr, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 border rounded-lg ${selectedAddress === addr ? 'bg-gray-500 text-white' : 'bg-white'}`}
                                                onClick={() => handleAddressSelection(addr)}
                                            >
                                                <div className="font-semibold">{addr.address1} {addr.address2}, {addr.citystate}</div>
                                                <div>{addr.pincode}, India</div>
                                                {selectedAddress === addr && <span className="text-xs text-white ">Default Address</span>}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No addresses available. Please add an address.</p>
                                    )}
                                </div>
                            </div>
                            {/* Payment Checkout Section */}
                            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-semibold mb-4 text-center">Payment Checkout</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>Order Total:</span>
                                        <span className="font-semibold text-xl">₹ {Math.round(mrp)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Selected Address:</span>
                                        <span className="text-sm">
                                            {selectedAddress ? `${selectedAddress.address1}, ${selectedAddress.citystate}, ${selectedAddress.pincode}`
                                                : "No address selected"}
                                        </span>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() => {
                                                if (selectedAddress) {
                                                    placeOrder();
                                                } else {
                                                    alert.error('Please select a delivery address');
                                                }
                                            }}
                                            className="w-full bg-gray-700 hover:bg-gray-400 text-white py-2 rounded-lg"
                                        >
                                            Proceed to Payment
                                        </button>
                                        <button
                                            onClick={handleOpenPopup}
                                            className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg"
                                        >
                                            Add New Address
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <AddAddressPopup
                                isOpen={isAddressPopupOpen}
                                onClose={handleClosePopup}
                                onSave={handleSaveAddress}
                            />
                            
                            
                        </div>
                    ) : (
                        <div className="text-center py-6">Your bag is empty! Add items to your bag.</div>
                    )}
                </div>
            ) : (
                <div className="text-center py-6">Please log in to access your bag</div>
            )}
            {showPayment && <PaymentProcessingPage totalAmount={mrp} closePopup={() => setShowPayment(false)} />}
        </>
    );
};

export default Bag;
