import { X } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getRandomItem } from '../../config';

const FullScreenOverlayDialog = ({ products }) => {
    const [isOpen, setIsOpen] = useState(true);

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

        // Clean up when the component is unmounted or the dialog closes
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    console.log("Overlay Products: ", products);

    return (
        <Fragment>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center transition-colors ease-in-out"
                    onClick={handleOverlayClick} // Close on click outside
                >
                    {/* Dialog Content */}
                    <div className={`relative w-[90%] sm:w-[80%] lg:w-[70%] h-[90%] sm:h-[80%] lg:h-[70%] bg-white rounded-lg flex flex-col opacity-0 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <div
                            className="absolute top-[-14px] right-[-14px] p-2 w-12 h-12 rounded-full shadow-lg flex justify-center items-center z-20 cursor-pointer bg-white"
                            onClick={closeDialog}
                        >
                            <X className="w-full h-full text-black" />
                        </div>
                        {/* Content Section */}
                        <div className="flex flex-col lg:flex-row w-full h-full">
                            
                            {/* Left Section: Image and Overlay */}
                            <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full bg-opacity-10 bg-red-500">
                                <img
                                    className="w-full h-full object-cover"
                                    src="https://www.ukmodels.co.uk/wp-content/uploads/2015/08/shutterstock_266498825.jpg"
                                    alt="model"
                                />
                                {/* Black Transparent Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-30 z-10">
                                    <div className="flex flex-col justify-center items-center bg-transparent p-6 text-center text-white">
                                        <h1 className="font-bold text-3xl mb-4">Wait Before You Leave...</h1>
                                        <h2 className="font-thin text-slate-50 mb-6">Get 50% off on your first order</h2>

                                        {/* Promo Code Section */}
                                        <div className="outline outline-white outline-2 mt-6 w-auto h-auto p-2 flex justify-center items-center rounded-md">
                                            <p className="text-white font-thin text-center">Copy15Code</p>
                                        </div>

                                        {/* Additional Information */}
                                        <div className="mt-6 px-2">
                                            <p className="text-white font-thin text-center">
                                                Use the above code to get 15% discount on your first order
                                            </p>
                                        </div>

                                        {/* Call to Action Button */}
                                        <button className="bg-blue-500 rounded-full w-auto h-auto p-2 mt-8">
                                            <p className="text-white font-semibold text-center w-full h-full">
                                                GRAB THE DISCOUNT
                                            </p>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section: Redemanded Products */}
                            <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full bg-white flex flex-col p-4 overflow-y-auto scrollbar">
                                {/* Header Section */}
                                <div className="flex flex-col justify-center items-start h-auto bg-white text-center py-2">
                                    <h1 className="font-bold text-2xl text-black">Redemanded Products...</h1>
                                    <div className="h-0.5 w-full bg-black bg-opacity-20 px-1" />
                                </div>

                                {/* Scrollable Product List */}
                                <div className="w-full max-h-[70%] sm:max-h-[80%] lg:max-h-[90%] pb-9 overflow-y-auto gap-y-9">
                                    {products && products.length > 0 && products.slice(0,6).map((product, i) => (
                                        <div key={i} className="bg-white m-2 max-w-full h-auto p-2 flex flex-row items-center gap-4 rounded-md">
                                            <LazyLoadImage
                                                src={getRandomItem(product?.AllColors[0].images)?.url || "https://i.pinimg.com/originals/9c/91/cb/9c91cb83ce4b3c97c1d550aba9d0d4f1.jpg"}
                                                alt="model"
                                                className="w-20 h-20 object-contain rounded-md bg-slate-300"
                                            />
                                            <div className="flex flex-col justify-center">
                                                <h3 className="text-black text-wrap font-medium text-lg">{product?.title}</h3>
                                                <span className="text-black font-thin text-sm">₹ {product?.salePrice ? product?.salePrice : product?.price}</span>
                                                <p className="text-black text-wrap text-sm">{product?.description || "Description or details about the product "}</p>
                                                <div className='flex w-full flex-row justify-start items-center mt-2'>
                                                    {
                                                        product?.AllColors && product?.AllColors.length > 0 && product?.AllColors.map((c,i)=>( 
                                                            <div
                                                                key={i}
                                                                className="w-4 h-4 bg-red-500 rounded-full m-2 outline outline-1 outline-offset-1"
                                                                style={{ outlineColor: 'rgba(156, 163, 175, 0.5)' ,backgroundColor:c?.label}}
                                                            ></div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default FullScreenOverlayDialog;
