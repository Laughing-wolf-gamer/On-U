import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import BulletPointView from './BulletPointView';
import { ChevronUp, Eye, FilePenLine, Minus, Plus, X, XCircle } from 'lucide-react';
import axios from 'axios';
import { addProductsFromElement, BASE_URL, formattedSalePrice, Header } from '@/config';
import SizeSelector from './SizeSelector';
import ColorPresetSelector from '@/pages/admin-view/ColorPresetSelector';
import { useDispatch } from 'react-redux';
import { fetchOptionsByType } from '@/store/common-slice';
import { getProductsById } from '@/store/admin/product-slice';
import BulletPointsForm from './BulletPointsForm';
import ConfirmDeletePopup from '@/pages/admin-view/ConfirmDeletePopup';
import FileUploadComponent from './FileUploadComponent';
import CustomSelect from './CustomSelect';
import toast from 'react-hot-toast';
import RatingDataView from './RatingDataView';
import TextInputArrayCustom from './TextInputArrayCustom';
import TextArrayView from './TextArrayView';

const ProductPreview = ({
	categories,
	subcategories,
	productDataId,
	showPopUp,
	togglePopUp,
	OnDelete,
	UpdateEditedData,
	setCurrentPreviewProduct,
  }) => {
    const [isRatingModalOpen, setRatingIsModalOpen] = useState(false);
    const [productRatings, setProductsRatings] = useState([]);

    const[isConfirmDeleteWindow,setIsConfirmDeleteWindow] = useState(false);
    const [productData, setProductData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);  // New state for editing mode
    const dispatch = useDispatch();

    const fetchProductData = async () => {
        try {
            if (!productDataId) return;
            const response = await dispatch(getProductsById(productDataId));
            // console.log("Product Data: ", response?.payload?.result);
            setProductData(response?.payload?.result || null);
        } catch (error) {
            console.error("Error Fetching Product Data: ", error);
        }
    };
    const addRatingForProduct = async(ratingData)=>{
        try {
            if (!productDataId) return;
            if(!ratingData) return;
            const response = await axios.post(`${BASE_URL}/admin/product/add-rating`, {productId: productDataId, ratingData},Header());
            console.log("Rating Added: ", response.data);
            toast.success("Rating added successfully!");
            setRatingIsModalOpen(false);
            fetchProductData();
        } catch (error) {
            console.error("Error Adding Rating: ", error);
            toast.error("Failed to add rating!");
        }
    }
    const removeRatingForProduct = async(ratingDataId)=>{
        try {
            if (!productDataId) return;
            if(!ratingDataId) return;
            const response = await axios.patch(`${BASE_URL}/admin/product/remove-rating`, {productId: productDataId, ratingId:ratingDataId},Header());
            console.log("Rating Added: ", response.data);
            toast.success("Rating Removed successfully!");
            setRatingIsModalOpen(false);
            fetchProductData();
        } catch (error) {
            console.error("Error Removing Rating: ", error);
            toast.error("Failed to removing rating!");
        }
    }

    useEffect(() => {
        if (productDataId) {
            fetchProductData();
        }
    }, [dispatch, productDataId]);

    // Handle input changes
    const handleInputChange = (e, field) => {
        setProductData({
            ...productData,
            [field]: e.target.value,
        });
    };
    const specialCategory = {options:addProductsFromElement.find(e => e.name === "specialCategory").options};
    const categoryOptions = {options:categories.map(category => ({id:category.value.toLowerCase(),label:category.value}))}
    const subcategoriesOptions = {options:subcategories.map(sub => ({id:sub.value.toLowerCase(),label:sub.value}))}
    
    const renderPopUpContent = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-5 py-12 max-w-4xl w-full h-[94%] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col gap-2">
                        <span>ProductId: {productData?.productId}</span>
                        <h2 className="text-2xl font-bold">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={productData?.title}
                                    onChange={(e) => handleInputChange(e, 'title')}
                                    className="text-2xl font-bold"
                                />
                            ) : (
                                `Title: ${productData?.title}`
                            )}
                        </h2>
                        <h3 className="text-xl font-normal">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={productData?.shortTitle}
                                    onChange={(e) => handleInputChange(e, 'shortTitle')}
                                    className="text-xl font-normal"
                                />
                            ) : (
                                `Short Title: ${productData?.shortTitle}`
                            )}
                        </h3>
                    </div>
                    <XCircle
                        onClick={(e) => {
                            e.preventDefault();
                            togglePopUp();
                            if(setCurrentPreviewProduct){
                                setCurrentPreviewProduct(null);
                            }
                        }}
                    className="w-10 h-10 font-semibold text-gray-500 hover:text-gray-700 cursor-pointer"
                    />
                </div>
                <div className="flex flex-col w-full space-x-4">
                    <h3 className="font-semibold">All Sizes</h3>
                    {productData && (
                        <SizeDisplay
                            productId={productData?._id}
                            SizesArray={productData?.size}
                            OnRefresh={() => {
                                fetchProductData();
                            }}
                        />
                    )}
                    {/* Product details */}
                    <div className="col-span-10 p-6 bg-white rounded-lg shadow-lg">
                        <div className="mb-6 space-y-4">
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="font-semibold text-gray-700 text-lg">Descriptions:</h3>
                                {isEditing ? (
                                    <textarea
                                        type="text"
                                        rows={4}
                                        value={productData?.description}
                                        placeholder='Enter product description'
                                        onChange={(e) => handleInputChange(e, 'descriptions')}
                                        className="text-lg w-2/3 font-medium text-gray-600 border-2"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-gray-600">
                                        {productData?.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="font-semibold text-gray-700 text-lg">Specification:</h3>
                                {isEditing ? (
                                    <textarea
                                        type="text"
                                        rows={4}
                                        value={productData?.specification}
                                        placeholder='Enter product specification'
                                        onChange={(e) => handleInputChange(e, 'specification')}
                                        className="text-lg w-2/3 font-medium text-gray-600 border-2"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-gray-600">
                                        {productData?.specification}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="font-semibold text-gray-700 text-lg">Care Instructions:</h3>
                                {isEditing ? (
                                    <textarea
                                        type="text"
                                        rows={4}
                                        value={productData?.careInstructions}
                                        placeholder='Enter product CareInstructions'
                                        onChange={(e) => handleInputChange(e, 'careInstructions')}
                                        className="text-lg w-2/3 font-medium text-gray-600 border-2"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-gray-600">
                                        {productData?.careInstructions}
                                    </p>
                                )}
                            </div>
                            {/* GST */}
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="font-semibold text-gray-700 text-lg">GST:</h3>
                                {isEditing ? (
                                    <input
                                        type="numeric"
                                        value={productData?.gst}
                                        onChange={(e) => handleInputChange(e, 'gst')}
                                        className="text-lg w-2/3 font-medium text-yellow-600 border-2"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-yellow-600">
                                        {formattedSalePrice(productData?.gst)}%
                                    </p>
                                )}
                            </div>
                            {/* Price and Sale Price */}
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="font-semibold text-gray-700 text-lg">Price:</h3>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={productData?.price}
                                        onChange={(e) => handleInputChange(e, 'price')}
                                        className="text-lg w-2/3 font-medium text-green-600 border-2"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-green-600">
                                        ₹{ productData?.price && formattedSalePrice(productData?.price)}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="font-semibold text-gray-700 text-lg">Sale Price:</h3>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={productData?.salePrice}
                                        onChange={(e) => handleInputChange(e, 'salePrice')}
                                        className="text-lg w-2/3 font-medium text-red-600 border-2"
                                    />
                                ) : (
                                    <p className="text-lg font-medium text-red-600">
                                        ₹{productData?.salePrice && formattedSalePrice(productData?.salePrice)}
                                    </p>
                                )}
                            </div>
							<div onClick={()=>{
								setRatingIsModalOpen(true);
							}} className="flex justify-between items-center border-b pb-4">
                                <h3 className="font-semibold cursor-pointer text-gray-700 text-lg">Average Rating:</h3>
                                <p className="text-lg font-medium text-red-600">
									{productData?.averageRating}
								</p>
                            </div>
                            {/* Category and Subcategory */}
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="font-semibold text-gray-700 text-lg">Category:</h3>
                                
                                {isEditing ? (
                                    <div className='w-2/3'>
                                        <CustomSelect defaultValue={productData?.category} controlItems={categoryOptions} setChangeData={(e)=>{
                                            console.log("Changed category",e);
                                            handleInputChange({target:{value:e}},"category")
                                        }}/>
                                    </div>
                                ) : (
                                    <p className="text-lg text-gray-600">{productData?.category}</p>
                                )}
                            </div>
                            
                            <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="font-semibold text-gray-700 text-lg">Subcategory:</h3>
                                {isEditing ? (
                                    <div className='w-2/3'>
                                        <CustomSelect defaultValue={productData?.subCategory} controlItems={subcategoriesOptions} setChangeData={(e)=>{
                                            console.log("Changed category",e);
                                            handleInputChange({target:{value:e}},"subCategory")
                                        }}/>
                                    </div>
                                ) : (
                                    <p className="text-lg text-gray-600">{productData?.subCategory}</p>
                                )}
                            </div>
                            <div className="flex justify-between items-center border-b pb-4">
                            	<h3 className="font-semibold text-gray-700 text-lg">Special Category:</h3>
                                {isEditing ? (
                                    <div className='w-2/3'>
                                        <CustomSelect defaultValue={productData?.specialCategory} controlItems={specialCategory} setChangeData={(e)=>{
                                            console.log("Changed category",e);
                                            handleInputChange({target:{value:e}},"specialCategory")
                                        }}/>
                                    </div>
                                ) : (
                                    <p className="text-lg text-gray-600">{productData?.specialCategory}</p>
                                )}
                            </div>
                            <h1 className='text-ellipsis font-serif font-bold'>Product Dimension</h1>
                            <div className="flex justify-between items-center border-b pb-4">
								<h3 className="font-semibold text-gray-700 text-lg">Width:</h3>
								{isEditing ? (
									<input
										type="number"
										value={productData?.width}
										onChange={(e) => handleInputChange(e, 'width')}
										className="text-lg w-2/3 text-gray-600 border-2"
									/>
								) : (
									<p className="text-lg text-gray-600">{productData?.width}</p>
								)}
                            </div>
                            <div className="flex justify-between items-center border-b pb-4">
								<h3 className="font-semibold text-gray-700 text-lg">Height:</h3>
								{isEditing ? (
									<input
										type="number"
										value={productData?.height}
										onChange={(e) => handleInputChange(e, 'height')}
										className="text-lg w-2/3 text-gray-600 border-2"
									/>
								) : (
									<p className="text-lg text-gray-600">{productData?.height}</p>
								)}
                            </div>
                            <div className="flex justify-between items-center border-b pb-4">
								<h3 className="font-semibold text-gray-700 text-lg">Breadth:</h3>
								{isEditing ? (
									<input
										type="number"
										value={productData?.breadth}
										onChange={(e) => handleInputChange(e, 'breadth')}
										className="text-lg w-2/3 text-gray-600 border-2"
									/>
								) : (
									<p className="text-lg text-gray-600">{productData?.breadth}</p>
								)}
                            </div>
                            <div className="flex justify-between items-center border-b pb-4">
								<h3 className="font-semibold text-gray-700 text-lg">Length:</h3>
								{isEditing ? (
									<input
										type="number"
										value={productData?.length}
										onChange={(e) => handleInputChange(e, 'length')}
										className="text-lg w-2/3 text-gray-600 border-2"
									/>
								) : (
									<p className="text-lg text-gray-600">{productData?.length}</p>
								)}
								</div>
                            <div className="flex justify-between items-center border-b pb-4">
								<h3 className="font-semibold text-gray-700 text-lg">Weight:</h3>
								{isEditing ? (
									<input
									type="number"
									value={productData?.weight}
									onChange={(e) => handleInputChange(e, 'weight')}
									className="text-lg w-2/3 text-gray-600 border-2"
									/>
								) : (
									<p className="text-lg text-gray-600">{productData?.weight}</p>
								)}
                            </div>
                        </div>
                        {/* Material and Additional Info */}
                        <div className="mb-6 space-y-4">
                            <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="font-semibold text-gray-700 text-lg">Material:</h3>
                            {isEditing ? (
                                <input
                                type="text"
                                value={productData?.material}
                                onChange={(e) => handleInputChange(e, 'material')}
                                className="text-lg w-2/3 text-gray-600"
                                />
                            ) : (
                                <p className="text-lg text-gray-600">{productData?.material}</p>
                            )}
                            </div>
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="font-semibold text-gray-700 text-lg">Gender:</h3>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={productData?.gender}
                                        onChange={(e) => handleInputChange(e, 'gender')}
                                        className="text-lg w-2/3 text-gray-600"
                                    />
                                ) : (
                                    <p className="text-lg text-gray-600">{productData?.gender}</p>
                                )}
                            </div>
                        </div>
						{/* Description and Bullet Points */}
                        <div className="mb-6 space-y-4">
                            {
                                isEditing ? <BulletPointsForm onChange={(e)=>{
                                    // console.log("Editing Bullet Points: ",e);
                                    setProductData({
                                        ...productData,
                                        ["bulletPoints"]: e,
                                    });
                                }}/>:(
                                    <>
                                        {productData?.bulletPoints && productData?.bulletPoints.length > 0 && (
                                            <BulletPointView points={productData?.bulletPoints} />
                                        )}
                                    </>
                                )
                            }
                        </div>
						<div className="mb-6 space-y-4">
                            {
                                isEditing ? <TextInputArrayCustom defualt={productData?.delivaryPoints} onChange={(e)=>{
                                    // console.log("Editing Bullet Points: ",e);
                                    setProductData({
                                        ...productData,
                                        ["delivaryPoints"]: e,
                                    });
                                }}/>:(
                                    <>
                                        {productData?.delivaryPoints && productData?.delivaryPoints.length > 0 && (
                                            <TextArrayView points={productData?.delivaryPoints} />
                                        )}
                                    </>
                                )
                            }
                        </div>
                        {/* Edit and Delete Buttons */}
                        <div className="flex justify-between w-full py-4 space-x-5 px-6 mt-8">
                            <Button
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                                onClick={() => {
                                        if (isEditing) {
                                            UpdateEditedData(productData._id,productData)
                                        }
                                        setIsEditing(!isEditing); // Toggle editing state
                                        if(setCurrentPreviewProduct){
                                            setCurrentPreviewProduct(null);

                                        }
                                }}
                            >
                            {isEditing ? 'Save Product' : 'Edit Product'}
                                </Button>
                                {
                                    isEditing && <Button
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                                        onClick={() => {
                                            setIsEditing(!isEditing); // Toggle editing state
                                        }}
                                    >
                                        Cancel Edit
                                </Button>
                            }
                            
                            <Button
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                                onClick={() => {
                                    setIsConfirmDeleteWindow(!isConfirmDeleteWindow);
                                }}
                            >
                            Remove Product
                            </Button>
                        </div>
                        
                    </div>
                </div>
            </div>
            <ConfirmDeletePopup isOpen={isConfirmDeleteWindow} onCancel={()=>{
                setIsConfirmDeleteWindow(false);	
            }} onConfirm={()=>{
                OnDelete(productData._id);
                togglePopUp();
                if(setCurrentPreviewProduct){
                    setCurrentPreviewProduct(null);
                }
                setIsConfirmDeleteWindow(false);
            }}/>
            <RatingDataView 
                isOpen={isRatingModalOpen} 
                onClose={()=>{
                    setRatingIsModalOpen(false);
                }} 
                ratings={productData?.Rating || []} 
                onDeleteRating={(ratingDataId)=>{
                    removeRatingForProduct(ratingDataId)
                }}
                addNewRating={(data)=>{
                    // console.log("New Rating: ", data);
                    // OnRating(productId, data);
                    addRatingForProduct(data);
                }}
            
            />
        </div>
    );
	
    return <div className="container mx-auto w-screen p-6">{showPopUp && renderPopUpContent()}</div>;
};
  
const SizeDisplay = ({ productId,SizesArray,OnRefresh}) => {
	const[isFileUploadPopUpOpen,setIsFileUploadPopUpOpen] = useState(false);
	const[activeSelectedSize,setActiveSelectedSize] = useState(null);
	const[activeSelectedColor,setActiveSelectedColor] = useState(null);
	const[activeImageColorSize,setActiveImageColorSize] = useState(null);

	const[isConfirmDeleteWindow,setIsConfirmDeleteWindow] = useState(false);
	const[sizeDeletingData,setSizeDeletingData] = useState(null);
	const[colorDeletingData, setColorDeletingData] = useState(null)
	const[toggleEditColor,setToggleEditColorsColor] = useState(false);
	const[toggleAddNewSize,setToggleAddNewSize] = useState(false);
	// State variables
	const [isLoading, setIsLoading] = useState(false);
	const [newSize, setNewSize] = useState(null);
	const [updatingColors, setUpdatingColors] = useState([]);
	const [selectedColorImages, setSelectedColorImages] = useState([]);
	const [colorOptions, setColorOptions] = useState([]);


	// State for size quantities
	const [sizeQuantities, setSizeQuantities] = useState(
		SizesArray.reduce((acc, size) => {
			acc[size._id] = size.quantity;
			size.colors.forEach(color => {
				acc[`${size._id}-${color._id}`] = color.quantity || 0;
			});
			return acc;
		}, {})
	);

	// Toast for displaying messages
	// const { toast } = useToast();
	const dispatch = useDispatch();

	// Fetch color options on component mount
	useEffect(() => {
		fetchColorOptions();
	}, [dispatch]);

	// API call to fetch color options
	const fetchColorOptions = async () => {
		setIsLoading(true);
		try {
			const data = await dispatch(fetchOptionsByType("color"));
			const colorData = data.payload?.result;
			setColorOptions(colorData?.map((s) => ({ _id: s._id, label: s.value,name:s.name })) || []);
		} catch (error) {
			console.error("Error Fetching Size Options: ", error);
		}finally{
			setIsLoading(false);
		}
	};

	// Handle size quantity change
	const handleSizeQuantityChange = async (sizeId, change) => {
		setSizeQuantities(prevQuantities => {
			const newQuantity = prevQuantities[sizeId] + change;
			putHandleUpdateSizeQuantity(sizeId, newQuantity, 'size');
			return {
				...prevQuantities,
				[sizeId]: Math.max(0, newQuantity) // Ensure quantity is not negative
			};
		});
	};

	// Handle color quantity change within a size
	const handleColorQuantityChange = (sizeId, colorId, change) => {
		const id = `${sizeId}-${colorId}`;
		setSizeQuantities(prevQuantities => {
			const newQuantity = prevQuantities[id] + change;
			putHandleUpdateSizeColorQuantity(sizeId, colorId, newQuantity, 'reduce');
			return {
				...prevQuantities,
				[id]: Math.max(0, newQuantity) // Ensure quantity is not negative
			};
		});
	};

	// API call to update size quantity
	const putHandleUpdateSizeQuantity = async (id, change, type) => {
		setIsLoading(true);
		if (!productId) return;
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/updateSizeStock`, {
				productId,
				sizeId: id,
				updatedAmount: change,
			}, Header());
			console.log(`${type} Quantity Updated:`, response.data);
			toast.success("Quantity Updated Successfully");
			// toast({ title: "Quantity Updated", message: "Quantity Updated Successfully", type: "success" });
		} catch (error) {
			console.log(`Error Updating ${type} Quantity:`, error);
		}finally{
			OnRefresh();
			setIsLoading(false);
		}
	};

	// Handle adding new color to size
	const handleAddNewColor = async (sizeId, colors) => {
		setIsLoading(true);
		if (!productId) return;
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/addNewColorToSize`, {
				productId,
				sizeId: sizeId,
				colors: colors,
			}, Header());
			console.log(`Quantity Updated:`, response.data);
			setUpdatingColors([]);
			toast.success("New Color Added Successfully");
			// toast({ title: "New Color Added", message: "New Color Added Successfully", type: "success" });
		} catch (error) {
			console.log(`Error Updating Quantity:`, error.message);
			toast.error(error.message);
			// toast({ title: "Error Updating Quantity", message: error.message, type: "error" });
		}finally{
			setIsLoading(false);
			OnRefresh();
			setUpdatingColors(null);
			setToggleEditColorsColor(false);
			setToggleAddNewSize(false);
		}
	};

	// Handle adding new size
	const handleAddNewSize = async (size) => {
		setIsLoading(true);
		if(newSize === null) return;
		if (!productId || !size) return;
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/addNewSizeStock`, {
				productId,
				size: size
			}, Header());
			console.log(`New Size Added:`, response.data);
			setUpdatingColors([]);
			setNewSize(null);
			setToggleEditColorsColor(false);
			setToggleAddNewSize(false);
			toast.success("New Size Added Successfully");
		} catch (error) {
			console.log(`Error Updating Quantity:`, error);
			toast.error(error.message);
		}finally{
			OnRefresh();
			setIsLoading(false);
			setUpdatingColors([]);
			setNewSize(null);
			setToggleEditColorsColor(false);
			setToggleAddNewSize(false);
		}
	};

	// API call to update color quantity
	const putHandleUpdateSizeColorQuantity = async (sizeId, colorId, change, type) => {
		setIsLoading(true);
		try {
			if (!productId) return;
			const response = await axios.patch(`${BASE_URL}/admin/product/update/updateColorStock`, {
				productId,
				sizeId,
				colorId,
				updatedAmount: change,
			}, Header());
			console.log(`${type} Quantity Updated:`, response.data);
			toast.success("Quantity Updated Successfully");
		} catch (error) {
			console.log(`Error Updating ${type} Quantity:`, error);
			toast.error(error.message);
		}finally{
			OnRefresh();
			setIsLoading(false);
		}
	};

	// Handle color click (to show selected color's images)
	const handleColorClick = (images) => {
		setSelectedColorImages(images);
	};

	const handelRemoveColor = async (sizeId,colorId) => {
		setIsLoading(true);
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/removeColorFromSize`, {
				productId,
				sizeId,
				colorId
			},Header());
			console.log(`Color Removed:`, response.data);
			// toast("Color Removed Successfully","success");
			toast.success("Color Removed Successfully");
		} catch (error) {
			console.log(`Error Removing Color:`, error);
			toast.error("Error Removing Color");
			// toast({title:"Error Removing Color",message:error.message,type:"error"});
		}finally{
			setIsLoading(false);
			OnRefresh();
			setToggleAddNewSize(false);
			setColorDeletingData(null);
		}
	}
	// Helper function to determine if the quantity is low
	const isLowQuantity = (quantity) => {
		const LOW_QUANTITY_THRESHOLD = 5; // Define your threshold
		return quantity <= LOW_QUANTITY_THRESHOLD;
	};
	const handelRemoveSize = async (sizeId) => {
		setIsLoading(true);
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/removeSizeFromProduct`, {
				productId,
				sizeId
			},Header());
			console.log(`Size Removed: `, response.data);
			// toast("Size Removed Successfully","success");
			toast.success("Size Removed Successfully");
		} catch (error) {
			console.log(`Error Removing Size:`, error);
			toast.error("Error Removing Size");
			// toast({title:"Error Removing Size",message:error.message,type:"error"});
		}finally{
			setIsLoading(false);
			OnRefresh();
			setToggleAddNewSize(false);
			setSizeDeletingData(null);
		}
	}
	// console.log("SizesArray: ",sizeQuantities);
	useEffect(()=>{
		console.log("SizesArray: ",SizesArray);
		setSizeQuantities(
			SizesArray.reduce((acc, size) => {
				acc[size._id] = size.quantity;
				size.colors.forEach(color => {
					acc[`${size._id}-${color._id}`] = color.quantity || 0;
				});
				return acc;
			}, {})
		);
	},[SizesArray])
	// Render a warning icon for low quantity
	const renderLowQuantityIndicator = (quantity) => {
		if (isLowQuantity(quantity)) {
			return (
				<span className="text-red-500 ml-2" title="Low Quantity">
					⚠️
				</span>
			);
		}
		return null;
	};

	const updateImageImageBuyColorId = async (colorId,sizeId,imagesArray) => {
		setIsLoading(true);
		try {
			const response = await axios.patch(`${BASE_URL}/admin/product/update/updateImages`, {
				productId,
				sizeId,
				colorId,
				images:imagesArray
			},Header());
			console.log(`Image Updated: `, response?.data?.result);
			const updatedImages = response?.data?.result
			setActiveImageColorSize(sizeId);
			setSelectedColorImages(updatedImages);
			toast.success("Image Updated Successfully");
			// toast("Image Updated Successfully","success");
		} catch (error) {
			toast.error("Image Updated Failed");
			console.error("Error updating: ",error);
			// toast("Image Updated Failed","error");
		}finally{
			setIsLoading(false);
			setActiveSelectedColor(null);
			setActiveSelectedSize(null);
			if(OnRefresh){
				OnRefresh();
			}
		}
	}
	// console.log("Selected Color Images: ",activeImageColorSize);

	const memoizedColorImages = useMemo(() => {
		return selectedColorImages.map((item, index) => {
			const isVideo = item?.url?.includes('video');
			return (
				<div key={index} className="w-24 h-24">
					{isVideo ? (
						<video
							className="w-full h-full object-contain rounded-md border"
							controls
							src={item?.url}
							alt={`Color Video ${index + 1}`}
							loading="lazy" // Lazy load videos
						>
						Your browser does not support the video tag.
						</video>
					) : (
						<img
							src={item?.url}
							alt={`Color Image ${index + 1}`}
							className="w-full h-full object-contain rounded-md border"
							loading="lazy" // Lazy load images
						/>
					)}
				</div>
			);
		});
	  }, [selectedColorImages]); // Memoize only when selectedColorImages change
	return (
		<div className="min-w-full m-7 p-4 flex flex-col gap-7"> {/* Make the container a column layout */}
			<div className='flex justify-center items-center gap-4'>
				<Button
					disabled={isLoading}
					onClick={() => setToggleAddNewSize(!toggleAddNewSize)}
					className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-md"
				>
					{toggleAddNewSize ? "Hide Add New Size":"Show New Size"} 
				</Button>
			</div>
			{
				toggleAddNewSize && <SizeSelector 
					sizeType={"clothingSize"} 
					OnChange={(e) => {
						setNewSize(e.length > 0 ? e : null);
					}} 
				/>
			}
			{toggleAddNewSize && newSize && (
				<Button 
					disabled={!newSize} 
					onClick={() => {

						handleAddNewSize(newSize);
					}}
					className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-md"
				>
					Update New Size
				</Button>
			)}
			{/* Loop through Sizes */}
			{SizesArray && SizesArray.length > 0 && SizesArray.map((size, i) => (
				
				<div key={i} className="border p-4 rounded-md shadow-md w-full relative flex flex-col gap-4"> {/* Flex layout for size box */}
					<h2 className="text-xl font-semibold">Size: {size.label} {renderLowQuantityIndicator(sizeQuantities[size._id])}</h2>
					<p className="text-sm text-gray-500">Quantity: {sizeQuantities[size._id]}</p>
					<div className='flex justify-center items-center gap-4'>
						<Button
							disabled={isLoading}
							onClick={() => setToggleEditColorsColor(!toggleEditColor)}
							className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-md"
						>
							{toggleEditColor ? "Hide Add New Color":"Show New Color"} 
						</Button>
					</div>
					
					
					<div className={`flex justify-center flex-col my-7 space-y-9 items-center ${toggleEditColor ? 'block' : 'hidden'}`}>
						<ColorPresetSelector
							colorOptions={colorOptions}
							sizeTag={size._id}
							sizeTitle={size.label}
							OnChange={(e) => {
								setUpdatingColors({ sizeId: size._id, colors: e });
							}}
							
						/>
						
						{
							updatingColors && updatingColors.sizeId === size._id && (
								<div className={`flex justify-center items-center gap-4 ${updatingColors?.colors?.length > 0 ? 'block' : 'hidden'}`}>

									<Button 
										disabled={updatingColors === null} 
										onClick={() => {
											handleAddNewColor(updatingColors.sizeId, updatingColors.colors);
										}}
										className={`bg-green-500 text-white p-2 rounded-md ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} `}
									>
										Update
									</Button>
								</div>
							)
						}
						
					</div>
					{/* Size Quantity Control */}
					<div className="flex items-center gap-2 mt-4 border justify-between border-gray-500 shadow-md rounded-md p-4 relative">
						<h1 className='font-extrabold text-center text-gray-600'><span className='space-x-4 text-sm font-semibold'>{size.label}</span> Quantity</h1>
						<div className='w-fit h-fit p-1 space-x-6'>

							<Button
								disabled={isLoading}
								onClick={() => handleSizeQuantityChange(size._id, -1)}
								className="bg-gray-300 p-2 rounded-full hover:bg-gray-400"
							>
								<Minus />
							</Button>
							<span className="text-lg text-gray-700 font-extrabold">{sizeQuantities[size._id]}</span>
							<Button
								disabled={isLoading}
								onClick={() => handleSizeQuantityChange(size._id, 1)}
								className="bg-gray-300 p-2 rounded-full hover:bg-gray-400"
							>
								<Plus />
							</Button>
						</div>
					</div>
					{/* Remove Size Button */}
					<Button 
						disabled={isLoading} 
						onClick={() => {
							setSizeDeletingData({sizeId:size._id});
							setIsConfirmDeleteWindow(!isConfirmDeleteWindow);
						}} 
						className="absolute top-2 right-6 text-white p-2 rounded-full bg-red-700"
					>
						Remove Size: {size.label}
					</Button>
					
	
					{/* Color Options */}
					<div className="flex gap-4 mt-4 flex-wrap">
						{size && size.colors && size.colors.length > 0 && size.colors.map((color, index) => (
							<div
								key={index}
								className="flex relative items-center justify-between gap-2 bg-gray-200 p-3 rounded-md shadow-md cursor-pointer flex-wrap"
								onClick={() => {
									setActiveImageColorSize(size._id);
									handleColorClick(color?.images || [])
								}}
							>
								<div
									className="w-10 h-10 rounded-full border-2"
									style={{ backgroundColor: color.label }}
								>
								</div>
									<span className="text-sm text-black font-extrabold">
										{renderLowQuantityIndicator(sizeQuantities[`${size._id}-${color._id}`])}
									</span>
								<span className="text-sm text-black font-extrabold">{color.label}</span>

								{/* Color Quantity Control */}
								<div className="flex items-center gap-2 w-fit px-7">
									<Button
										disabled={isLoading}
										onClick={(e) => {
											e.stopPropagation();
											handleColorQuantityChange(size._id, color._id, -1)
										}}
										className="bg-gray-600 p-2 rounded-full hover:bg-gray-800"
									>
										<Minus />
									</Button>
									<span className="text-gray-800 font-extrabold">{sizeQuantities[`${size._id}-${color._id}`]}</span>
									<Button
										disabled={isLoading}
										onClick={(e) => {
											e.stopPropagation();
											handleColorQuantityChange(size._id, color._id, 1)
										}}
										className="bg-gray-600 p-2 rounded-full hover:bg-gray-800"
									>
										<Plus />
									</Button>
								</div>

								{/* Remove Color Button */}
								<Button
									disabled={isLoading}
									onClick={() => {
										setColorDeletingData({sizeId: size._id, colorId: color._id})
										setIsConfirmDeleteWindow(!isConfirmDeleteWindow);
									}}
									className="text-white w-6 h-6 px-2 absolute top-0 right-0 bg-black p-2 rounded-full"
								>
									<X />
								</Button>

								{/* File Upload Button with Icon */}
								<div className="bottom-0 left-0 p-2">
									<Button onClick = {()=> {
										setActiveSelectedColor(color._id);
										setActiveSelectedSize(size._id)
										setIsFileUploadPopUpOpen(!isFileUploadPopUpOpen);
                                        setSelectedColorImages([]);
									}} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-800">
										<FilePenLine />
									</Button>
								</div>
							</div>
						))}
					</div>
					{activeImageColorSize && activeImageColorSize === size?._id && selectedColorImages && selectedColorImages.length > 0 && (
						<div className="mt-4">
							<ChevronUp className='cursor-pointer' size={30} onClick={()=> {
								setActiveImageColorSize(null);
								setSelectedColorImages([]);
							}}/>
							<div className="flex gap-4 mt-2">
								{memoizedColorImages}
							</div>
						</div>
					)}
				</div>
			))}
			<ConfirmDeletePopup isOpen={isConfirmDeleteWindow} onCancel={()=> {
				setIsConfirmDeleteWindow(false)
				setColorDeletingData(null);
				setSizeDeletingData(null);
			}} onConfirm={()=>{
				if(colorDeletingData){
					handelRemoveColor(colorDeletingData.sizeId, colorDeletingData.colorId);
				}
				if(sizeDeletingData){
					handelRemoveSize(sizeDeletingData.sizeId);
				}
				setIsConfirmDeleteWindow(false);
			}}/>
			<FileUploadPopUpWindow sizeId={activeSelectedSize} colorId={activeSelectedColor} isOpen={isFileUploadPopUpOpen} onCancel={()=> {
				setActiveSelectedColor(null);
				setActiveSelectedSize(null);
				setIsFileUploadPopUpOpen(!isFileUploadPopUpOpen);
			}}
			onConfirm = {(imageArray)=>{
				updateImageImageBuyColorId(activeSelectedColor,activeSelectedSize,imageArray)
				setIsFileUploadPopUpOpen(!isFileUploadPopUpOpen);
			}} />
			
		</div>
	);
	
};
const FileUploadPopUpWindow = ({sizeId,colorId, isOpen, onCancel, onConfirm }) => {
	const[isLoading,setIsLoading] = useState(false);
	const [imageArray,setImageArray] = useState([]);
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-96">
				<div className="justify-end space-y-4 flex flex-col">
					<FileUploadComponent
						maxFiles={8}
						tag={colorId}
						sizeTag={sizeId}
						onSetImageUrls={(e) => {
							setImageArray(e);
						}}
						isLoading = {isLoading}
						setIsLoading={setIsLoading}
					/>
					<Button
						disabled={isLoading}
						onClick={(e)=>{
							onConfirm(imageArray);
						}}
						className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none"
					>
						Confirm
					</Button>
					<Button
						disabled={isLoading}
						onClick={onCancel}
						className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
					>
						Cancel
					</Button>
					
				</div>
			</div>
		</div>
	);
};


export default ProductPreview;
