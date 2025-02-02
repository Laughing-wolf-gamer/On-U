import { X } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { sendGetCoupon } from '../../action/common.action';
import { useDispatch } from 'react-redux';
import popUp from '../images/popUp-image.jpg';

const FullScreenOverLayCouponPopUp = () => {
    console.log("Pop Up images: ", popUp);
    const [isOpen, setIsOpen] = useState(true);
    const [name, setName] = useState('');
    const alert = useAlert();
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const [loadingSent, setLoadingSent] = useState(false);

    const handleGetCouponClick = async () => {
        setLoadingSent(true);
        const sentSuccessful = await dispatch(sendGetCoupon({ fullName: name, email: email }));
        console.log("email Sent: ", sentSuccessful);
        if (sentSuccessful?.success) {
            alert.success(sentSuccessful?.message || "Email sent successfully");
            setName('');
            setEmail('');
            setIsOpen(false);
        } else {
            alert.error(sentSuccessful?.message || 'Invalid email or name');
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
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center transition-colors duration-500 ease-in-out"
                    onClick={handleOverlayClick} // Close on click outside
                >
                    <div
                        className="bg-white w-11/12 md:w-1/2 h-[500px] md:h-3/4 2xl:w-[700px] 2xl:h-[600px] grid grid-cols-1 md:grid-cols-2 gap-3 relative overflow-hidden my-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the overlay
                    >
                        <button className='absolute w-10 h-10 text-black md:top-3 top-2 md:left-6 right-2 cursor-pointer' onClick={handleHateCouponClick}>
                            <X />
                        </button>

                        {/* Left Column - Form */}
                        <div className="flex flex-col justify-between p-8 md:p-10 max-h-full">
                            <div className='w-full grid grid-cols-1 gap-3'>
                                <h1 className="text-2xl font-extrabold font-serif">Grab a Coupon</h1>
                                <p className="text-gray-800 flex-wrap text-inherit">
                                    Join us to receive 20% off on your first purchase. Sign up today and get the coupon!
                                </p>

                            </div>

                            {/* Input Fields */}
                            <div className="space-y-3 h-fit">
                                <div>
                                    <label className="block text-gray-600 font-medium">
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
                                    <label className="block text-gray-600 font-medium">
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
                                    disabled={loadingSent}
                                    onClick={handleGetCouponClick}
                                    className="w-full p-2 bg-black text-white hover:bg-gray-800"
                                >
                                    {loadingSent ? "SENDING EMAIL" : "GET MY COUPON"}
                                </button>
                                <button
                                    onClick={handleHateCouponClick}
                                    className="w-full p-2 bg-white text-gray-700 border-2 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    NO THANKS
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Image */}
                        <div className="hidden md:block relative">
                            <img
                                loading='lazy'
                                src={popUp}
                                alt="coupon-image"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Overlay border (optional) */}
                        <div className='absolute inset-0 z-20 bg-transparent border-black border-opacity-50 border-2 m-3 pointer-events-none'>
                        </div>
                    </div>

                </div>
            )}
        </Fragment>
    );
};

export default FullScreenOverLayCouponPopUp;
