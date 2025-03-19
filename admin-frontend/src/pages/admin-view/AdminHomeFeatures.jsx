import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addFeaturesImage, addMultipleImages, delFeatureImage, getFeatureImage, updateFeatureImageIndex } from '@/store/common-slice';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import { X } from 'lucide-react';
import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { RxHamburgerMenu } from 'react-icons/rx';
import ReactPlayer from 'react-player';
import { Badge } from '@/components/ui/badge';
import { useSettingsContext } from '@/Context/SettingsContext';
const allPositions = [
	'Wide Screen Section- 1',
	'Wide Screen Section- 2',
    // 'Wide Screen Section- 3',
    'Wide Screen Section- 4',
    'Wide Screen Section- 5',
    'Wide Screen Section- 6',
	'Wide Screen Section- 7',
    'Wide Screen Section- 8',
    'Wide Screen Section- 9',
    'Wide Screen Section- 10',
    'Wide Screen Section- 11',
    'Small Screen Section- 1',
	// 'Small Screen Section- 2',
    'Small Screen Section- 3',
    'Small Screen Section- 4',
    'Small Screen Section- 5'
];
const AdminHomeFeatures = () => {
    const dispatch = useDispatch();
    const { featuresList } = useSelector(state => state.common);
	const[filteredList,setFilteredList] = useState([]);
    // Boolean State................................................................
    const[isConfirmDeleteWindow,setIsConfirmDeleteWindow] = useState(false);
    const[resetImageUpload,setResetImageUpload] = useState(false);
    const[toggleBulkUpload,setToggleBulkUpload] = useState(true);
    const [imageLoading, setImageLoading] = useState(false);
	// const[allProductsCategory,setAllProductsCategory] = useState([]);

    // String State.............................................................
    const [imageFile, setImageFile] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [imageUrlsCategory, setImageUrlsCategory] = useState('');
    const[imageHeader,setImageHeader] = useState('');
    const[currentImageCategoryName,setCurrentImageCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Array State..............................................................
    const[multipleImages,setMultipleImages] = useState([]);
    const[deletingImageCategory, setDeletingImageCategory] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false);
	const{checkAndCreateToast} = useSettingsContext();
    
    const handleImageUpload = async (url) => {
        try {
            if (!imageUrlsCategory) {
                checkAndCreateToast('error','Please select a category to upload or Update.');
                return;
            }
            const response = await dispatch(
                addFeaturesImage({ url, CategoryType: imageUrlsCategory, Header: imageHeader || '' })
            );
            if(!response){
                throw new Error('Failed to add image');
            }
            checkAndCreateToast('success','Upload Successful');
            setImageHeader('');
            setImageFile('');
        } catch (error) {
            console.error('Error during file upload:', error);
            checkAndCreateToast('error','Image Failed Upload');
        }finally{
			dispatch(getFeatureImage());
			setIsModalOpen(false);
		}
    };
    const HandleMultipleImagesUpload = async()=>{
        try {
            console.log('Image Urls: ', multipleImages);
            if(multipleImages.length <= 0){
                // toast({ title: 'Please select at least one image to upload.' });
                checkAndCreateToast('error','Please select at least one image to upload.');
                return;
            }
            const response = await dispatch(addMultipleImages({ images: multipleImages, CategoryType: imageUrlsCategory, Header: imageHeader || '' }));
            if(!response){
                throw new Error('Failed to add multiple images');
            }
            checkAndCreateToast('success','Upload Successful');
            setImageHeader('');
            setImageFile('');
        } catch (error) {
            console.error('Error during file upload:', error);
            checkAndCreateToast('error','Image Failed Upload');
        }finally{
			dispatch(getFeatureImage());
            setMultipleImages([]);
            setResetImageUpload(true);
            setTimeout(() => {
                setResetImageUpload(false);
            }, 100);
			setIsModalOpen(false);
        }
    }

    const handleDeleteImage = async () => {
        try {
            if(!deletingImageCategory){
                checkAndCreateToast('error','Please select an image to delete.');
                return;
            }
            console.log("Images Deleting: ", deletingImageCategory)
            // return;
            const response = await dispatch(delFeatureImage({ id:deletingImageCategory.itemId, imageIndex:deletingImageCategory.idx }));
            console.log("Images Deleting Response: ", response)
            if(!response){
                throw new Error('Failed to delete image');
            }
            if(!response.payload.Success){
                throw new Error('Failed to delete image');
            }
            checkAndCreateToast('success','Image Deleted ' + response?.payload?.message);
        } catch (error) {
            console.error('Error deleting image:', error);
            checkAndCreateToast('error','Image Failed Deleted');
        }finally{
            setDeletingImageCategory(null);
			dispatch(getFeatureImage());
			setIsModalOpen(false);
        }
    };
	const UpdateCategoryNameIndex = async (data)=>{
		console.log("UpdateCategoryNameIndex: ",data);
		await dispatch(updateFeatureImageIndex(data));
		dispatch(getFeatureImage());
	}
    const handleSelectedCategory = (e) => {
        setSelectedCategory(e.target.value);
        setImageUrlsCategory(e.target.value);
    };
	useEffect(()=>{
		if(featuresList){
			setFilteredList(featuresList.filter(item => selectedCategory === '' || item.CategoryType === selectedCategory));
		}
	},[featuresList])
    /* let filteredItems = [];
    if(featuresList && featuresList.length > 0) {
        filteredItems = featuresList.filter(item => selectedCategory === '' || item.CategoryType === selectedCategory);
    } */
	useEffect(() => {
        dispatch(getFeatureImage());
    }, [dispatch,resetImageUpload,multipleImages,imageUrlsCategory]);
	console.log("Filtered items: " , filteredList)
    return (
        <div className="flex flex-col items-center w-full space-y-8 px-4">
            {/* Image Upload Section */}
            {/* <div className="w-full">
                <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4">
                    Upload / Edit Home Page Banners
                </h1>
                <div className='w-full h-fit justify-center mx-auto px-4 flex flex-row items-center space-x-5 mb-7'>
                    <h1 className='font-bold text-center text-gray-700'>Bulk Upload</h1>
                    <Input
                        type="checkbox"
                        checked={toggleBulkUpload}
                        onChange={() => setToggleBulkUpload(!toggleBulkUpload)}
                        label="Upload Multiple Images"
                        className="w-4 h-4"
                    />
                </div>
                
                {toggleBulkUpload ? (
                    <div className='w-full justify-center items-center flex flex-col'>
                        <FileUploadComponent
                            maxFiles={10}
                            tag={`home-carousal-upload`}
                            sizeTag={`carousal-upload ${imageUrlsCategory}`}
                            onSetImageUrls={(urlArray) => {
                                console.log('Image Urls: ', urlArray);
                                setMultipleImages(urlArray);
                            }}
                            isLoading={imageLoading}
                            onReset={resetImageUpload}
                            setIsLoading={setImageLoading}
                        />
                        <Button
                            disabled={imageLoading}
                            onClick={HandleMultipleImagesUpload}
                            className="w-full h-12 mt-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
                        >
                            Upload All Images
                        </Button>
                    </div>
                ) : (
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
                        <Button
                            disabled={imageLoading}
                            onClick={() => handleImageUpload(imageUrls)}
                            className="w-full h-12 mt-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
                        >
                            Upload
                        </Button>
                    </div>
                )}
				<div className="w-full p-6 bg-white rounded-lg shadow-md">
					<h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4">
						Select a Category Name
					</h1>
					<select
						value={currentImageCategoryName}
						onChange={(e) => setCurrentImageCategoryName(e.target.value)}
						className="w-full h-12 p-3  border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
					>
						<option value="none">All Categoryies Names</option>
							{allProductsCategory.map((category, index) => (
								<option key={index} value={category.label}>
									{capitalizeFirstLetterOfEachWord(category.label)}
								</option>
							))}
					</select>
				</div>
                <Input
                    type="text"
                    value={imageHeader}
                    onChange={(e) => setImageHeader(e.target.value)}
                    placeholder="Enter Header"
                    className="w-full h-12 mt-4 p- border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
				
            </div> */}
			<Button className='px-4 py-3 bg-black text-white' onClick={() => setIsModalOpen(true)}>
				Add New Home Page Image/Video
			</Button>
			<PopupModal
				isOpen={isModalOpen}
				setIsModelOpen = {setIsModalOpen}
				toggleBulkUpload={toggleBulkUpload}
				setToggleBulkUpload = {setToggleBulkUpload}
				imageFile={imageFile}
				setImageFile={setImageFile}
				imageLoading = {imageLoading}
				setImageLoading = {setImageLoading}
				multipleImages = {multipleImages}
				setMultipleImages = {setMultipleImages}
				imageUrls = {imageUrls}
				setImageUrls = {setImageUrls}
				currentImageCategoryName = {currentImageCategoryName}
				setCurrentImageCategoryName = {setCurrentImageCategoryName}
				imageHeader = {imageHeader}
				setImageHeader = {setImageHeader}
				handleImageUpload={handleImageUpload}
				HandleMultipleImagesUpload={HandleMultipleImagesUpload}
				imageUrlsCategory = {imageUrlsCategory}

			/>
    
            {/* Category Dropdown Section */}
            <div className="w-full p-3">
                <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4">
                    Select a Position to View Images/Video
                </h1>
                <select
                    value={selectedCategory}
                    onChange={handleSelectedCategory}
                    className="w-full h-12 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    <option value="">All Positions</option>
                        {allPositions.map((category, index) => (
                            <option key={index} value={category}>
                                {capitalizeFirstLetterOfEachWord(category)}
                            </option>
                        ))}
                </select>
            </div>
    
            {/* Selected Category Display */}
            <div className="w-full ">
                {filteredList && filteredList.length > 0 ? (
                    filteredList.map((item, index) => {
						const active = item;
						return (
							<div key={index} className="mb-8 space-x-2">
								{/* Show category header */}
								<h2 className="text-xl font-semibold text-gray-700 mb-2">
									Category: {capitalizeFirstLetterOfEachWord(active.CategoryType)}
								</h2>
								{active.Header && (
									<h3 className="text-lg font-medium text-gray-600 mb-4">
										Header: {active.Header}
									</h3>
								)}
								
								<GridImageView 
									item={active}
									updateCategoryIndex = {(data)=>{
										UpdateCategoryNameIndex({...data,categoryType:active.CategoryType})
									}}
									setIsConfirmDeleteWindow={setIsConfirmDeleteWindow} 
									isConfirmDeleteWindow={isConfirmDeleteWindow} 
									setDeletingImageCategory={setDeletingImageCategory}
								/>
							</div>
						)
					})
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
const PopupModal = ({ 
	isOpen, 
	setIsModelOpen,
	toggleBulkUpload,
	setToggleBulkUpload,
	imageFile, 
	setImageFile,
	imageLoading,
	setImageLoading,
	multipleImages, 
	setMultipleImages,
	imageUrls, 
	setImageUrls,
	currentImageCategoryName,
	setCurrentImageCategoryName,
	imageHeader,
	setImageHeader,
	handleImageUpload,
	HandleMultipleImagesUpload,
	imageUrlsCategory
}) => {
	const resetImageUpload = () => {
		setImageFile(null);
		setImageUrls([]);
	};

	/* const handleImageUpload = (imageUrls) => {
		// Handle single image upload logic here
	};

	const HandleMultipleImagesUpload = () => {
		// Handle multiple images upload logic here
	}; */

	return (
		isOpen && (
		<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg w-11/12 max-h-[50vw] overflow-y-auto sm:w-3/4 lg:w-2/3 p-6">
			<div className="flex justify-end">
				<button
					onClick={(e)=> setIsModelOpen(false)}
					className="text-gray-600 hover:text-gray-800 font-semibold text-xl"
				>
				&times;
				</button>
			</div>
			<h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4">
				Upload / Edit Home Page Banners
			</h1>

			<div className="w-full h-fit justify-center mx-auto px-4 flex flex-row items-center space-x-5 mb-7">
				<h1 className="font-bold text-center text-gray-700">Bulk Upload</h1>
				<Input
				type="checkbox"
				checked={toggleBulkUpload}
				onChange={() => setToggleBulkUpload(!toggleBulkUpload)}
				label="Upload Multiple Images"
				className="w-4 h-4"
				/>
			</div>

			{toggleBulkUpload ? (
				<div className="w-full justify-center space-y-3 items-center flex flex-col">
					<Badge>Total Images to Upload: {multipleImages?.length}</Badge>
					<FileUploadComponent
						maxFiles={10}
						tag={`home-carousal-upload`}
						sizeTag={`carousal-upload ${imageUrlsCategory}`}
						onSetImageUrls={(urlArray) => {
							console.log('Image Urls: ', urlArray);
							setMultipleImages(urlArray);
						}}
						isLoading={imageLoading}
						onReset={resetImageUpload}
						setIsLoading={setImageLoading}
					/>
					<Button
						disabled={imageLoading}
						onClick={HandleMultipleImagesUpload}
						className="w-full h-12 mt-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
					>
						{imageLoading ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div> :<span>Upload All Images</span>}
					</Button>
				</div>
			) : (
				<div className="w-full justify-center items-center flex flex-col">
				<ImageUpload
					file={imageFile}
					setFile={setImageFile}
					imageLoading={imageLoading}
					setImageLoading={setImageLoading}
					uploadedImageUrl={imageUrls}
					setUploadedImageUrl={setImageUrls}
					newStyling="w-full h-auto bg-slate-200 rounded-lg"
				/>
				<Button
					disabled={imageLoading}
					onClick={() => handleImageUpload(imageUrls)}
					className="w-full h-12 mt-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-200"
				>
					Upload
				</Button>
				</div>
			)}

			{/* <div className="w-full p-6 bg-white rounded-lg shadow-md">
				<h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4">
				Select a Category Name
				</h1>
				<select
				value={currentImageCategoryName}
				onChange={(e) => setCurrentImageCategoryName(e.target.value)}
				className="w-full h-12 p-3 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
				>
				<option value="none">All Category Names</option>
				{allProductsCategory.map((category, index) => (
					<option key={index} value={category.label}>
					{capitalizeFirstLetterOfEachWord(category.label)}
					</option>
				))}
				</select>
			</div> */}

			<Input
				type="text"
				value={imageHeader}
				onChange={(e) => setImageHeader(e.target.value)}
				placeholder="Enter Header"
				className="w-full h-12 mt-4 p- border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
			/>
			</div>
		</div>
		)
	);
};

const GridImageView = ({ item,updateCategoryIndex, setIsConfirmDeleteWindow, isConfirmDeleteWindow, setDeletingImageCategory }) => {
    // Initialize loading states for each item in the Url array, all true initially
    const [loadingStates, setLoadingStates] = useState(item.Url.map(() => true));
    const videoRefs = useRef([]); // References to video elements for lazy loading
    const [items, setItems] = useState([]); // State to manage the order of items

    // Helper function to determine if the file is a video or an image
    const getFileType = useCallback((url) => {
        const fileExtension = url.split('.').pop().toLowerCase();
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

    const handleIntersection = (entries, observer) => {
        entries.forEach((entry) => {
            const index = videoRefs.current.indexOf(entry.target);
            if (entry.isIntersecting) {
                handleMediaLoad(index); // Load media when in view
                observer.unobserve(entry.target); // Stop observing once it's in view
            }
        });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1, // Trigger when 10% of the element is in view
        });

        // Set up the observer for each image/video element
        videoRefs.current.forEach((ref) => {
			if (ref && ref instanceof Element) observer.observe(ref); // Ensure the ref is an Element
        });

        // Cleanup observer on unmount
        return () => {
            videoRefs.current.forEach((ref) => {
                if (ref && ref instanceof Element) observer.unobserve(ref);
            });
        };
    }, [item.Url.length]); // Re-run the observer when URLs change

    // Handle the drag-and-drop reordering logic
    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) return; // If dropped outside the list, do nothing

		updateCategoryIndex({sourceIndex: source.index, destinationIndex:destination.index});
        // Reorder the items array
        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, removed);
        setItems(reorderedItems); // Update state with new order
    };
	useEffect(()=>{
		if(item){
			setItems(item.Url);
		}
	},[item]); // Re-run the observer when URLs change
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {(provided) => (
                    <div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 relative"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {items.length > 0 ? (
                            items.map((url, index) => {
                                const { isImage, isVideo } = getFileType(url);
                                return (
                                    <Draggable key={index} draggableId={String(index)} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="relative group w-full border border-gray-800 bg-gray-50 h-40 rounded-lg overflow-hidden"
                                            >
                                                {loadingStates[index] && (
                                                    <div className="absolute w-full h-full bg-gray-300 animate-pulse rounded-lg">
                                                        <p className="text-black font-bold">Loading...</p>
                                                    </div>
                                                )}
												<RxHamburgerMenu className='absolute top-2 left-2'/>

                                                {/* Image */}
                                                {isImage ? (
                                                    <img
                                                        src={url}
                                                        alt={`Image ${index + 1}`}
                                                        className="w-full h-full object-contain rounded-lg shadow-sm"
                                                        onLoad={() => handleMediaLoad(index)} // Trigger loading state on image load
                                                    />
                                                ) : isVideo ? (
                                                    <ReactPlayer
                                                        ref={(el) => (videoRefs.current[index] = el)} // Assign ref for lazy loading
														url={url} 
														type={`video/${url.split('.').pop()}`} 
                                                        className="w-full h-full object-contain rounded-lg shadow-sm"
                                                        controls
														loading="lazy"
                                                        muted
														width="100%"
                            							height="100%"
                                                        playing={false}
                                                        onReady={() => handleMediaLoad(index)} // Trigger loading state on video load
                                                    />
                                                    
                                                ) : (
                                                    <p>Unsupported file type</p>
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
												{provided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })
                        ) : (
                            <div className="relative group w-full bg-gray-50 h-40 rounded-lg overflow-hidden">
                                <p>No Images Uploaded!</p>
                            </div>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
export default AdminHomeFeatures;
