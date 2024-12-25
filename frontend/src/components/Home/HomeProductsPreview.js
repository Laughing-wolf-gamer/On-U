import { ShoppingCart } from 'lucide-react';
import React, { useState } from 'react';
import { calculateDiscount } from '../../config';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const HomeProductsPreview = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
    const[timer,setTimer] = useState(null);
    const handleMouseEnter = (index) => {
        setIsHovered(true);
        setHoveredImageIndex(index);
        const newTimer = setInterval(() => {
            setHoveredImageIndex((prevIndex) => (prevIndex + 1) % product.image.length);
        }, 1000); // change image every 100ms
        setTimer(newTimer);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setHoveredImageIndex(0);
        if(timer){
            clearInterval(timer);
            setTimer(null);
        }

    };
    const amount = product.salePrice && product.salePrice > 0 && product.salePrice < product.price ? calculateDiscount(product?.price, product?.salePrice) : product?.price;
    // console.log("Amount",product.salePrice,product.price);
    return (
        <div
            className="w-[90%] bg-gray-100 my-auto h-[80%] overflow-hidden relative flex flex-col transform transition-all duration-300 ease-in-out hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <div className="min-w-xs h-full bg-gray-100">
                    <div
                        className={`w-full h-full relative transition-opacity duration-500 ease-in-out `}
                    >
                        <LazyLoadImage effect='blur' src={product.image[hoveredImageIndex]} width='100%' className="w-full h-full object-cover" alt={`Product ${hoveredImageIndex}`} />
                    </div>
            </div>

            <div
                className={`absolute bottom-0 left-1/2 transform z-20 -translate-x-1/2 w-full h-10 justify-center items-center flex text-white bg-pink-500 hover:bg-pink-700 text-center font-semibold transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
            >
                <button className="w-full flex flex-row items-center font-bold justify-center space-x-2">
                    <ShoppingCart size={20} /><span>Add to Cart</span>
                </button>
            </div>
            {
                product && product.salePrice && product.salePrice > 0 && product.salePrice < product.price &&(
                    <div
                        className={`absolute right-0 top-4 transform z-20 w-fit rounded-tl-lg rounded-bl-lg h-8 p-3 justify-center items-center flex text-white bg-pink-700 text-center font-semibold transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[30px]'}`}
                    >
                        <span className="text-white font-semibold text-center text-xs">{amount.discountPercentage}% OFF</span>
                    </div>
                )
            }
            
        </div>
    );
}

export default HomeProductsPreview;
