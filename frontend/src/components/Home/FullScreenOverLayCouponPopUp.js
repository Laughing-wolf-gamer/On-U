import { X } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react'
import { sendGetCoupon } from '../../action/common.action';
import { useDispatch } from 'react-redux';
import popUp from '../images/popUp-image.jpg'
import { useToast } from '../../Contaxt/ToastProvider';
import toast from 'react-hot-toast';
const FullScreenOverLayCouponPopUp = () => {
    console.log("Pop Up images: ",popUp);
    const [isOpen, setIsOpen] = useState(true);
    const [name, setName] = useState('');
    const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type,message) => {
        console.log("check Toast: ",type, message,activeToast);
        if(!activeToast){
            switch(type){
                case "error":
                    toast.error(message)
                    break;
                case "warning":
                    toast.warning(message)
                    break;
                case "info":
                    toast.info(message)
                    break;
                case "success":
                    toast.success(message)
                    break;
                default:
                    toast.info(message)
                    break;
            }
            showToast(message);
        }
    }
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const[loadingSent,setLoadingSent] = useState(false);
    const handleGetCouponClick =async () => {
        setLoadingSent(true);
        const sentSuccessful = await dispatch(sendGetCoupon({fullName:name, email:email}))
        console.log("email Sent: ",sentSuccessful);
        if(sentSuccessful?.success){
            checkAndCreateToast("success",sentSuccessful?.message || "Email sent successfully");
            setName('');
            setEmail('');
            setIsOpen(false);
        }else{
            checkAndCreateToast("error",sentSuccessful?.message|| 'Invalid email or name');
        }
        setLoadingSent(false);
    };

    const handleHateCouponClick = () => {
        closeDialog();
    };
    // Function to close the dialog
    const closeDialog = () => {
        setIsOpen(false);
    };

    // Close dialog when clicking outside the modal
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeDialog();
        }
    };
    // Disable scrolling on body when dialog is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Disable scroll
        } else {
            document.body.style.overflow = 'auto'; // Re-enable scroll
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);
    return (
        <Fragment>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                    onClick={handleOverlayClick} // Close on click outside
                >
                    <div
                        className="bg-white w-3/4 md:w-1/2 h-3/4 grid grid-cols-1 md:grid-cols-2 gap-3 relative overflow-hidden my-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the overlay
                    >
                        <button className='absolute w-10 h-10 text-black md:top-3 top-2 left-6 cursor-pointer' onClick={handleHateCouponClick}>
                            <X/>
                        </button>
                        {/* Left Column - Form */}
                        <div className="flex flex-col justify-between p-16 md:p-10 max-h-full">
                            <h1 className="text-2xl font-extrabold font-serif">Grab a Coupon</h1>
                            <p className="text-gray-800 flex-wrap">
                                Join us to receive you 20% off
                                on your first purchase. Sign up today and get the coupon!
                            </p>

                            {/* Input Fields */}
                            <div className="md:space-y-3 space-y-2 h-fit">
                                <div>
                                    <label className="block text-gray-600 font-medium" >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full p-2 border-b-2 border-gray-300"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-600 font-medium" >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        className="w-full p-2 border-b-2 border-gray-300"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your Email"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col justify-center gap-2 h-fit">
                                <button
                                    disabled = {loadingSent}
                                    onClick={handleGetCouponClick}
                                    className="w-full p-2 bg-black text-white hover:bg-gray-800"
                                >
                                    {loadingSent ? "SENDING EMAIL":"GET MY COUPON"}
                                </button>
                                <button
                                    onClick={handleHateCouponClick}
                                    className="w-full p-2 bg-white text-gray-500 border-2 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    NO THANKS
                                </button>
                            </div>
                        </div>

                        <div className="hidden md:block relative ">
                            <img
                                src={popUp || "https://th.bing.com/th/id/OIP.lHSX3U-BFmJDteFTZEeFhQHaLH?rs=1&pid=ImgDetMain"} // Replace with your image URL
                                alt="Coupon-Image"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className='absolute inset-0 z-20 bg-transparent border-black border-opacity-50 border-2 m-3 pointer-events-none'>

                        </div>
                    </div>

                </div>
            )}
        </Fragment>
    )
}

export default FullScreenOverLayCouponPopUp