import React, { useEffect, useState } from 'react';
import HomeProductsPreview from './HomeProductsPreview';
import { calculateDiscountPercentage, formattedSalePrice } from '../../config';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';

const previewHeader = [
  { id: 'topPicks', title: 'Top Picks' },
  { id: 'bestSeller', title: 'Best Sellers' },
  { id: 'luxuryItems', title: 'Luxury Items' }
];

const ProductPreviewFull = ({ product ,user}) => {
    const navigation = useNavigate();
	
    const [previewProducts, setSelectedPreviewProducts] = useState([]);
    const [activePreview, setActivePreviews] = useState('topPicks');
    const [selectedColors, setSelectedColors] = useState({});
    const getRandomArrayOfProducts = (previewProductsTitle) => {
        if (product) {
            const maxProductsAmount = window.screen.width > 1024 ? 5 : 4;
            const itemsOfCategory = product.filter(p => p.specialCategory === previewProductsTitle).slice(0, maxProductsAmount); // filter by bestSeller and take first 6 items
            setSelectedPreviewProducts(itemsOfCategory);
            setActivePreviews(previewProductsTitle);
        }
    };

    const handleColorChange = (productId, colorImages) => {
        setSelectedColors(prevState => ({
            ...prevState,
            [productId]: colorImages
        }));
    };
    const handleMoveToQuery = ()=>{
        const queryParams = new URLSearchParams();
        if (activePreview) queryParams.set('specialCategory', activePreview);
        if(!activePreview) {
            navigation("/products")
            return;
        };
        const url = `/products?${queryParams.toString()}`;
        navigation(url);
        
    }
    useEffect(() => {
        getRandomArrayOfProducts('topPicks');
    }, [product]);
	/* const addToBag = async () => {
		if (isInBagList) {
			navigation("/bag");
			return;
		}
		if (!currentColor) {
			checkAndCreateToast("error", "No Color Selected");
			return;
		}
		if (!currentSize) {
			checkAndCreateToast("error", "No Size Selected");
			return;
		}
		if(currentSize.quantity <= 0){
			checkAndCreateToast("error", "Size Out of Stock");
			return;
		}
		if(currentColor.quantity <= 0){
			checkAndCreateToast("error", "Color Out of Stock");
			return;
		}
		if (user) {
			const orderData = {
				productId: product._id,
				quantity: 1,
				color: currentColor,
				size: currentSize,
				isChecked:true,
			};
			await dispatch(createbag(orderData));
			fetchBag();
		} else {
			// Add to localStorage logic
			const orderData = {
				productId: product._id,
				quantity: 1,
				color: currentColor,
				size: currentSize,
				ProductData: product,
				isChecked:true,
			};
			setSessionStorageBagListItem(orderData, product._id);
		}
		checkAndCreateToast("success", "Product successfully in Bag");
		updateButtonStates();
	};
	const updateButtonStates = () => {
		if (user) {
			// console.log("Updateing wishList: ",wishlist);
			setIsInWishList(wishlist?.orderItems?.some(w => w.productId?._id === product?._id));
			const similarProductsInBag = bag?.orderItems?.filter(item => item.productId?._id === product?._id);
			let isBag = false;

			// If there are similar products in the bag
			if (similarProductsInBag?.length > 0) {
				// If current size and color are provided, find the matching product
				if (currentSize && currentColor) {
					const matchingItem = similarProductsInBag.find(item => 
						item.color?._id === currentColor?._id && item.size?._id === currentSize?._id
					);
					// If matching item found, check its isChecked property
					if (matchingItem) {
						isBag = matchingItem.isChecked;
					}
				} else {
					// If no size or color is selected, check if any similar product is checked
					isBag = similarProductsInBag.some(item => item.isChecked);
				}
			}

			// Set the result in state
			setIsInBagList(isBag);
		} else {
			setIsInWishList(getLocalStorageWishListItem().some(b => b.productId?._id === product?._id));
			const similarProductsInBag = getLocalStorageBag().filter(item => item.productId === product?._id);
			let isBag = false;

			// Check if there are matching items in the bag
			if (similarProductsInBag?.length > 0) {
				// If current size and color are provided, check for matching items with the size and color
				if (currentSize && currentColor) {
					const matchingItem = similarProductsInBag.find(item => 
						item.color?._id === currentColor?._id && item.size?._id === currentSize?._id
					);
					// If matching item is found, set isBag based on its 'isChecked' status
					if (matchingItem) {
						isBag = matchingItem.isChecked;
					}
				} else {
					// If no size/color is specified, check if any product is checked
					isBag = similarProductsInBag.some(item => item.isChecked);
				}
			}
			// Set the result in the state (i.e., update whether the product is in the bag)
			setIsInBagList(isBag);
		}
	};
	const addToWishList = async () => {
		if (user) {
			const response = await dispatch(createwishlist({ productId: product._id }));
			await fetchWishList();
			checkAndCreateToast("success", "Wishlist Updated Successfully",3000);
			if(response){
				setIsInWishList(response);
			}
		} else {
			setWishListProductInfo(product, product._id);
			checkAndCreateToast("success", "Bag is Updated Successfully",3000);
			updateButtonStates();
		}
	
	};
	const handleSetColorImages = (color) => {
		setSelectedSizeColorImageArray(color.images);
	};
	const handleSetNewImageArray = (newSize) => {
		setCurrentSize(newSize);
		setSelectedColor(newSize.colors);
		const isAlreadyPresent = newSize.colors.find(item => item?.label === currentColor?.label);
		if(!isAlreadyPresent){
			setCurrentColor(null);
		}else{
			setCurrentColor(isAlreadyPresent);
		}
	};
		
	useEffect(() => {
		// Check if the user is logged in and other conditions
		if (!loadingWishList && !bagLoading) {
			updateButtonStates();
		}
	}, [user, wishlist, bag, product, loadingWishList, sessionData, sessionBagData]);
	
	useEffect(() => {
		// Check if the product exists before processing size/color
		if (product) {
			const availableSize = product.size.find(item => item.quantity > 0);
			
			if (availableSize) {
				setSelectedColor(availableSize.colors);
				const color = availableSize.colors[0];
				setSelectedSizeColorImageArray(color.images);
			}			
			fetchWishList();
			// dispatch(getwishlist()); // Always fetch wishlist data when the product changes
		}
	}, [product, user, dispatch]); // Added user as a dependency for fetching the bag
	
	useEffect(() => {
		// Only call `updateButtonStates` when `currentSize` or `currentColor` change
		if (currentSize && currentColor) {
			updateButtonStates();
		}
	}, [currentSize, currentColor]); */

    return (
        <div className='max-w-screen-2xl font-kumbsan w-full flex flex-col justify-self-center justify-center items-center bg-slate-200'>
            {/* Preview Headers Section */}
            <div className="min-w-fit flex justify-center items-center gap-3 sm:gap-4 md:gap-5 mb-6 font1 px-6 mt-5 my-2 max-w-full">
                {previewHeader && previewHeader.length > 0 &&
                    previewHeader.map((h, index) => (
                        <button
                            onClick={(e) => {
                                if (h?.id !== activePreview) {
                                    getRandomArrayOfProducts(h?.id);
                                } else {
                                    e.preventDefault();
                                }
                            }}
                            key={index}
                            className={`border-2 border-gray-600 border-opacity-70 p-2 sm:p-3 md:p-4 lg:p-4 xl:p-5 px-5 py-2 sm:px-6 sm:py-3 flex items-center justify-center md:w-[130px] lg:w-[150px] xl:w-[180px] 2xl:w-[200px] sm:w-[120px] sm:h-[35px] h-[40px] transform font-kumbsan transition-transform duration-300 ease-out hover:scale-110 cursor-pointer rounded-full ${activePreview === h.id ? 'bg-black text-white' : 'bg-neutral-50'}`}
                        >
                            <span className="inline-block font-medium text-center text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
                                {h?.title}
                            </span>
                        </button>
                    ))
                }
            </div>
            {/* Product Previews Section */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5 2xl:grid-cols-5 justify-center md:px-12 lg:px-12 2xl:px-12 xl:px-12 px-2 gap-2 md:gap-3 items-center">
                {previewProducts && previewProducts.length > 0 &&
                    previewProducts.map((p, index) => {
                        // const p = previewProducts[0];
                        const selectedColor = selectedColors[p._id] || p.AllColors[0]?.images;
                        return (
                            <div key={`product_${p._id}_${index}`} className={`w-full h-full rounded-md bg-gray-200 relative flex flex-col justify-start items-center hover:shadow-md transition-all duration-300 ease-in-out ${window.screen.width > 1024 ? "hover:scale-105":""}`}>
                                <HomeProductsPreview product={p} selectedColorImages={selectedColor} user={user}/>
                                <div className="w-full h-fit p-2 px-3 bg-white flex flex-col justify-center items-start hover:shadow-md space-y-2">
                                    <h2 className="font1 text-[12px] md:text-base md:font-semibold sm:font-semibold font-normal 2xl:font-semibold xl:font-semibold font-kumbsan text-gray-800 text-left truncate">
                                        {p?.title}
                                    </h2>
                                    
                                    <div className="w-full justify-start gap-y-1 items-center flex flex-row space-x-2">
                                        {/* Sale Price */}
										{p.salePrice > 0 && <div className="text-xs md:text-sm font-light md:font-medium font-kumbsan text-slate-700">
											<span className="text-sm md:text-base font-bold text-gray-900">
												₹{formattedSalePrice(p.salePrice)}
											</span>
                                        </div>}
                                        
                                        {/* Regular Price */}
                                        <div className="text-xs md:text-lg font-light md:font-medium font-kumbsan text-slate-700 hover:animate-bounce">
                                            {p.salePrice && p.salePrice > 0 ? (
                                                <span className="line-through text-gray-500">
                                                    ₹{formattedSalePrice(p.price)}
                                                </span>
                                            ) : (
                                                <span className="text-xs md:text-lg font-normal md:font-bold font-kumbsan">
                                                    ₹{formattedSalePrice(p.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Discount Percentage for small screens */}
									{p.salePrice > 0 && (
										<div className='block md:hidden font-light md:font-semiBold font-kumbsan text-slate-700'>
											<span className="text-xs font-light text-orange-400">
												({calculateDiscountPercentage(p.price, p.salePrice)}% OFF)
											</span>
										</div>
									)}
                                    

                                    {/* Color Options */}
                                    {p.AllColors && p.AllColors.length > 0 && (
                                        <div className="mt-1 w-full flex flex-wrap gap-2 justify-start items-start ">
                                            {p.AllColors
												.slice(0, 7)
												.filter((value, index, self) => 
													index === self.findIndex((t) => (
														t.label === value.label // Checking if the color hex code is already in the array
													))
												)
												.map((color, colorIndex) => (
												<div
													onClick={() => handleColorChange(p._id, color.images)} // Update color for this product
													key={colorIndex}
													type = "button"
													className={`w-3 h-3 md:w-4 md:h-4 shadow-md hover:cursor-pointer rounded-full hover:outline outline-offset-2 outline-gray-900 hover:shadow-md hover:-translate-y-1 transform duration-300 ease-out`}
													style={{
														backgroundColor: color.label, // Assuming color is a hex or RGB string
													}}
												></div>
											))}

                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className='w-full text-center flex flex-row justify-center items-center mt-2 relative transform transition-all py-4'>
                <div onClick={handleMoveToQuery} className='px-10 flex text-sm md:text-lg hover:bg-black focus:bg-black hover:text-white focus:text-white text-gray-800 rounded-lg p-4 cursor-pointer border border-gray-800 hover:border-white focus:border-white hover:border-2 hover:border-opacity-100 border-opacity-50 hover:scale-110 duration-300 hover:animate-shine'>
                    <span className='hover:animate-vibrateScale text-[15px] sm:text-[15px] md:text-[16px]'>View More</span>
                </div>
            </div>
        </div>
    );
};

export default ProductPreviewFull;
