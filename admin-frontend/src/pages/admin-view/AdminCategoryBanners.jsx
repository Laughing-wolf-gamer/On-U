import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addCategoryNameBanner, fetchAllCategoryNameBanners, fetchOptionsByType, removeCategoryBanners } from '@/store/common-slice';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import { X } from 'lucide-react';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
const allPositions = [
	'WideScreen_Video',
	'MobileScreen_CategorySlider',
];
const AdminCategoryBanners = () => {
	const { CategoryNameBanners } = useSelector(state => state.common);
    const dispatch = useDispatch();


    // Boolean State................................................................
    const[isConfirmDeleteWindow,setIsConfirmDeleteWindow] = useState(false);
    const[resetImageUpload,setResetImageUpload] = useState(false);
    const[toggleBulkUpload,setToggleBulkUpload] = useState(true);
    const [imageLoading, setImageLoading] = useState(false);
	const[allProductsCategory,setAllProductsCategory] = useState([]);

    // String State.............................................................
    const [imageFile, setImageFile] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [imageUrlsCategory, setImageUrlsCategory] = useState('');
    const[imageHeader,setImageHeader] = useState('');
    const[currentImageCategoryName,setCurrentImageCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Array State..............................................................
    // const[filteredItems,setFilteredItems] = useState([]);
    const[multipleImages,setMultipleImages] = useState([]);
    const[deletingImageCategory, setDeletingImageCategory] = useState(null)
    // const[categories,setCategories] = useState([]);



    useEffect(() => {
        dispatch(fetchAllCategoryNameBanners());
		fetchCategoryOptions();
    }, [dispatch,resetImageUpload,multipleImages,imageUrlsCategory]);
    /* let categories = [];
    if(CategoryNameBanners && CategoryNameBanners.length > 0){
        categories = [...new Set(CategoryNameBanners.map(item => item?.CategoryType).filter(Boolean))];
    } */
	console.log("allProductsCategory: ",allProductsCategory);
	const fetchCategoryOptions = async () => {
		try {
			const data = await dispatch(fetchOptionsByType("category"));
			const categoryData = data.payload?.result;
			console.log("Category Options: ",categoryData)
			setAllProductsCategory(categoryData?.map((s) => ({ id: s._id, label: s.value })) || []);
		} catch (error) {
			console.error("Error Fetching Category Options: ", error);
		}
	};
    const handleImageUpload = async (url) => {
        try {
            if (!imageUrlsCategory) {
                // toast({ title: 'Please select a category to upload or Update.' });
                toast.error('Please select a category to upload or Update.');
                return;
            }
            const response = await dispatch(
                addCategoryNameBanner({ url:{url,name:currentImageCategoryName}, CategoryType: imageUrlsCategory, Header: imageHeader || '', })
            );
            // toast({ title: 'Upload Successful', description: response?.payload?.message });
            if(!response){
                throw new Error('Failed to add image');
            }
            toast.success('Upload Successful');
            setImageHeader('');
            setImageFile('');
			setCurrentImageCategoryName('');
			dispatch(fetchAllCategoryNameBanners());
            
        } catch (error) {
            console.error('Error during file upload:', error);
            toast.error('Image Failed Upload');
        }
    };

    const handleDeleteImage = async () => {
        try {
            if(!deletingImageCategory){
                toast.error('Please select an image to delete.');
                return;
            }
            console.log("Images Deleting: ", deletingImageCategory)
            // return;
            const response = await dispatch(removeCategoryBanners({ id:deletingImageCategory.itemId, imageIndex:deletingImageCategory.idx }));
            console.log("Images Deleting Response: ", response)
            if(!response){
                throw new Error('Failed to delete image');
            }
            if(!response?.payload?.Success){
                throw new Error('Failed to delete image');
            }
            toast.success('Image Deleted ' + response?.payload?.message);
            dispatch(fetchAllCategoryNameBanners());
        } catch (error) {
            console.error('Error deleting image:', error);
            // toast({ title: 'Image Failed Deleted', type: 'warning' });
            toast.error('Image Failed Deleted');
        }finally{
            setDeletingImageCategory(null);
        }
    };

    const handleSelectedCategory = (e) => {
		console.log("Selected Category: ",e.target.value)
        setSelectedCategory(e.target.value);
        setImageUrlsCategory(e.target.value);
    };
    let filteredItems = [];
    if(CategoryNameBanners && CategoryNameBanners.length > 0) {
        filteredItems = CategoryNameBanners.filter(
            item => selectedCategory === '' || item.CategoryType === selectedCategory
        );
    }
	const [openModel,setOpenModel] = useState(false);
	// console.log("currentImageCategoryName: ",currentImageCategoryName);
    return (
        <div className="flex flex-col items-center w-full space-y-8 px-4">
			{/* Category Dropdown Section */}
			<div className="w-full">
				<Label className="text-xl sm:text-2xl font-bold text-center relative text-gray-900 mb-4 flex items-center justify-center">
					Select Position to View Images/Video 
					<span className="ml-2 text-red-600">*</span> {/* You can apply a different color for the asterisk */}
				</Label>

				<select
					value={selectedCategory}
					onChange={handleSelectedCategory}
					className="w-full h-12 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">All Positions</option>
						{allPositions.map((category, index) => (
							<option key={index} value={category}>
								{capitalizeFirstLetterOfEachWord(category)}
							</option>
						))}
				</select>
				<div className='w-fit mt-3 justify-start items-center flex text-center font-bold'>
					<Button 
						disabled = {selectedCategory === ''} 
						onClick={()=> {
						if(!selectedCategory){
							toast.error('Please select a Position to create a New Image/Video');
							return;
						}
						setOpenModel(!openModel)
					}}>
						Add Image/Video
					</Button>
				</div>
			</div>
				
            {
				openModel && <PopUpFormForHomeCategoryBanners
					setImageHeader = {setImageHeader}
					imageHeader = {imageHeader}
					imageFile = {imageFile}
					setImageFile = {setImageFile}
					imageLoading = {imageLoading}
					setImageLoading = {setImageLoading}
					imageUrls = {imageUrls}
					setImageUrls = {setImageUrls}
					allProductsCategory = {allProductsCategory}
					currentImageCategoryName = {currentImageCategoryName}
					setCurrentImageCategoryName = {setCurrentImageCategoryName}
					handleSelectedCategory = {handleSelectedCategory}
					handleImageUpload = {handleImageUpload}
					selectedCategory = {selectedCategory}
					setOpenModel = {setOpenModel}
				/>
			}
            
			{/* Selected Category Display */}
			<div className="w-full p-6">
				{filteredItems && filteredItems.length > 0 ? (
					filteredItems.map((item, index) => (
						<div key={index} className="mb-8">
							{/* Show category header */}
							<h2 className="text-xl font-semibold text-gray-700 mb-2">
								Category: {capitalizeFirstLetterOfEachWord(item.CategoryType)}
							</h2>
							{item.Header && (
								<h3 className="text-lg font-medium text-gray-600 mb-4">
									Header: {item.Header}
								</h3>
							)}
							
							<GridImageView 
								item={item} 
								setIsConfirmDeleteWindow={setIsConfirmDeleteWindow} 
								isConfirmDeleteWindow={isConfirmDeleteWindow} 
								setDeletingImageCategory={setDeletingImageCategory}
							/>
						</div>
					))
				) : (
					<p className="text-center text-gray-600">No images found for the selected category.</p>
				)}
			</div>
            {/* Confirm Delete Popup */}
            <ConfirmDeletePopup 
                isOpen={isConfirmDeleteWindow} 
                onCancel={() => setIsConfirmDeleteWindow(!isConfirmDeleteWindow)} 
                onConfirm={() => {
                    if (deletingImageCategory) {
                        handleDeleteImage();
                        setIsConfirmDeleteWindow(!isConfirmDeleteWindow);
                    }
                }}
            />
        </div>
    );
    
};
const PopUpFormForHomeCategoryBanners = ({
	setImageHeader,
	imageHeader,
	imageFile,
	setImageFile,
	imageLoading,
	setImageLoading,
	imageUrls,
	setImageUrls,
	allProductsCategory,
	currentImageCategoryName,
	setCurrentImageCategoryName,
	handleImageUpload,
	selectedCategory,
	setOpenModel,

})=>{
	return(
		<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
				<Button onClick = {()=> setOpenModel(false)} className='absolute z-10 top-4 right-4'>
					X
				</Button>
				<div className="w-full space-y-6">
					<Label className="text-xl sm:text-2xl font-bold text-center relative text-gray-900 mb-4 flex items-center justify-center">
						Add Header (Optionl) <span className="ml-2 text-blue-600">*</span> 
					</Label>
					<Input
						type="text"
						value={imageHeader}
						onChange={(e) => setImageHeader(e.target.value)}
						placeholder="Enter Header"
						className="w-full h-12 mt-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
					/>
					<Label className="text-xl sm:text-2xl font-bold text-center relative text-gray-900 mb-4 flex items-center justify-center">
						Upload Images for {selectedCategory || 'All Categories'} <span className="ml-2 text-red-600">*</span> 
					</Label>
					<div className='w-full justify-center items-center flex flex-col'>
						<ImageUpload
							file={imageFile}
							setFile={setImageFile}
							imageLoading={imageLoading}
							setImageLoading={setImageLoading}
							uploadedImageUrl={imageUrls}
							setUploadedImageUrl={setImageUrls}
							newStyling="w-full h-auto bg-slate-200 rounded-lg"
						/>
						
					</div>
					<div className="w-full">
						<Label className="text-xl sm:text-2xl font-bold text-center relative text-gray-900 mb-4 flex items-center justify-center">
							Selecte a Product Category for the Image
							<span className="ml-2 text-red-600">*</span> {/* You can apply a different color for the asterisk */}
						</Label>
						<select
							value={currentImageCategoryName}
							onChange={(e) => setCurrentImageCategoryName(e.target.value)}
							className="w-full h-12 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
						>
							<option value="none">All Categoryies Names</option>
								{allProductsCategory.map((category, index) => (
									<option key={index} value={category.label}>
										{capitalizeFirstLetterOfEachWord(category.label)}
									</option>
								))}
						</select>
					</div>
					<Button
						disabled={imageLoading || !imageUrls.length ||!currentImageCategoryName}
						onClick={() => handleImageUpload(imageUrls)}
						className="w-full h-12 mt-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
					>
						Upload
					</Button>
					
					{/* <Input
						type="text"
						value={currentImageCategoryName}
						onChange={(e) => setCurrentImageCategoryName(e.target.value)}
						placeholder="Enter Category Name"
						className="w-full h-12 mt-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/> */}
					
				</div>
			</div>
		</div>
	)
}
const GridImageView = memo(({ item, setIsConfirmDeleteWindow, isConfirmDeleteWindow, setDeletingImageCategory }) => {
    const [loadingStates, setLoadingStates] = useState(item.Url.map(() => true));
    const videoRefs = useRef([]); // References to video elements for lazy loading

    // Helper function to determine if the file is a video or an image
    const getFileType = useCallback((url) => {
        const fileExtension = url?.url.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension);
        return { isImage, isVideo };
    }, []);

    // Lazy load images and videos when they come into view
    const handleMediaLoad = (index) => {
        setLoadingStates((prevState) => {
            const updatedStates = [...prevState];
            updatedStates[index] = false; // Set loading state to false for the specific item
            return updatedStates;
        });
    };

    // IntersectionObserver callback to load media when in view
    const handleIntersection = useCallback((entries, observer) => {
        entries.forEach((entry) => {
            const index = videoRefs.current.indexOf(entry.target);
            if (entry.isIntersecting) {
                handleMediaLoad(index); // Load media when in view
                observer.unobserve(entry.target); // Stop observing once it's in view
            }
        });
    }, []);

    // Set up IntersectionObserver on mount and clean up on unmount
    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1, // Trigger when 10% of the element is in view
        });

        // Set up the observer for each image/video element
        videoRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        // Cleanup observer on unmount
        return () => {
            videoRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [item.Url.length, handleIntersection]); // Re-run the observer when URLs change

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 relative">
            {item.Url && item.Url.length > 0 ? (
                item.Url.map((url, index) => {
                    const { isImage, isVideo } = getFileType(url);

                    return (
                        <div
                            key={index}
                            ref={(el) => (videoRefs.current[index] = el)} // Assign ref for lazy loading
                            className="relative group w-full bg-gray-50 h-40 rounded-lg overflow-hidden"
                        >
                            {loadingStates[index] && (
                                <div className="absolute w-full h-full bg-gray-300 animate-pulse rounded-lg">
                                    <p className="text-black font-bold">Loading...</p>
                                </div>
                            )}
							{/* Title */}
                            <div className='w-full justify-center flex items-center'>
                                <h1 className='text-lg font-bold'>
                                    {url?.name}
                                </h1>
                            </div>

                            {/* Image */}
                            {isImage ? (
                                <img
                                    src={url.url}
                                    alt={`Image ${index + 1}-${url?.name}`}
                                    className="w-full h-full object-contain rounded-lg shadow-sm"
                                    onLoad={() => handleMediaLoad(index)} // Trigger loading state on image load
                                />
                            ) : isVideo ? (
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)} // Assign ref for lazy loading
                                    className="w-full h-full object-contain rounded-lg shadow-sm"
                                    controls
                                    muted
                                    autoPlay={false}
                                    onLoadedData={() => handleMediaLoad(index)} // Trigger loading state on video load
                                >
                                    <source src={url.url} type={`video/${url.url.split('.').pop()}`} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <p>Unsupported file type {url?.name}</p>
                            )}
                            
                            

                            {/* Delete Button */}
                            <Button
                                onClick={() => {
                                    setIsConfirmDeleteWindow(!isConfirmDeleteWindow);
                                    setDeletingImageCategory({ itemId: item._id, idx: index });
                                }}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-400 text-white w-5 h-5 rounded-full shadow-lg"
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    );
                })
            ) : (
                <div className="relative group w-full bg-gray-50 h-40 rounded-lg overflow-hidden">
                    <p>No Images Uploaded!</p>
                </div>
            )}
        </div>
    );
});

export default AdminCategoryBanners
