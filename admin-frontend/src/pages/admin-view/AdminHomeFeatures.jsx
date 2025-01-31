import React, { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addFeaturesImage, addMultipleImages, delFeatureImage, getFeatureImage } from '@/store/common-slice';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import { X } from 'lucide-react';
import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import toast from 'react-hot-toast';

const AdminHomeFeatures = () => {
    const { featuresList } = useSelector(state => state.common);
    const dispatch = useDispatch();


    // Boolean State................................................................
    const[isConfirmDeleteWindow,setIsConfirmDeleteWindow] = useState(false);
    const[resetImageUpload,setResetImageUpload] = useState(false);
    const[toggleBulkUpload,setToggleBulkUpload] = useState(true);
    const [imageLoading, setImageLoading] = useState(false);

    // String State.............................................................
    const [imageFile, setImageFile] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [imageUrlsCategory, setImageUrlsCategory] = useState('');
    const[imageHeader,setImageHeader] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Array State..............................................................
    const[filteredItems,setFilteredItems] = useState([]);
    const[multipleImages,setMultipleImages] = useState([]);
    const[deletingImageCategory, setDeletingImageCategory] = useState(null)
    const[categories,setCategories] = useState([]);



    useEffect(() => {
        dispatch(getFeatureImage());
    }, [dispatch,resetImageUpload,multipleImages,imageUrlsCategory]);
    useEffect(()=>{
        if(featuresList){
            if(featuresList.length > 0){
                console.log("featuresList: ",featuresList);
                setCategories([...new Set(featuresList.map(item => item?.CategoryType).filter(Boolean))]);
            }
        }
    },[featuresList])

    // const categories = [...new Set(featuresList?.map(item => item?.CategoryType).filter(Boolean))];

    const handleImageUpload = async (url) => {
        try {
            if (!imageUrlsCategory) {
                // toast({ title: 'Please select a category to upload or Update.' });
                toast.error('Please select a category to upload or Update.');
                return;
            }
            const response = await dispatch(
                addFeaturesImage({ url, CategoryType: imageUrlsCategory, Header: imageHeader || '' })
            );
            // toast({ title: 'Upload Successful', description: response?.payload?.message });
            if(!response){
                throw new Error('Failed to add image');
            }
            toast.success('Upload Successful');
            setImageHeader('');
            setImageFile('');
            
        } catch (error) {
            console.error('Error during file upload:', error);
            toast.error('Image Failed Upload');
        }
    };
    const HandleMultipleImagesUpload = async()=>{
        try {
            console.log('Image Urls: ', multipleImages);
            if(multipleImages.length <= 0){
                // toast({ title: 'Please select at least one image to upload.' });
                toast.error('Please select at least one image to upload.');
                return;
            }
            const response = await dispatch(addMultipleImages({ images: multipleImages, CategoryType: imageUrlsCategory, Header: imageHeader || '' }));
            if(!response){
                throw new Error('Failed to add multiple images');
            }
            // toast({ title: 'Upload Successful', description: response?.payload?.message });
            toast.success('Upload Successful');
            setImageHeader('');
            setImageFile('');
            
        } catch (error) {
            console.error('Error during file upload:', error);
            // toast({ title: 'Image Failed Upload', type: 'error' });
            toast.error('Image Failed Upload');
        }finally{
            setMultipleImages([]);
            setResetImageUpload(true);
            setTimeout(() => {
                setResetImageUpload(false);
            }, 100);
        }
    }

    const handleDeleteImage = async () => {
        try {
            if(!deletingImageCategory){
                toast.error('Please select an image to delete.');
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
            toast.success('Image Deleted ' + response?.payload?.message);
            dispatch(getFeatureImage());
        } catch (error) {
            console.error('Error deleting image:', error);
            // toast({ title: 'Image Failed Deleted', type: 'warning' });
            toast.error('Image Failed Deleted');
        }finally{
            setDeletingImageCategory(null);
        }
    };

    const handleSelectedCategory = (e) => {
        setSelectedCategory(e.target.value);
        setImageUrlsCategory(e.target.value);
    };
    useEffect(()=>{
        if(featuresList){
            if(featuresList.length > 0){
                setFilteredItems(featuresList.filter(
                    item => selectedCategory === '' || item.CategoryType === selectedCategory
                ));
            }
        }
    },[featuresList])
    return (
        <div className="flex flex-col items-center w-full space-y-8 px-4">
            {/* Image Upload Section */}
            <div className="w-full sm:w-[60%] md:w-[50%] p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4">
                    Upload Banners
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
                            className="w-full h-12 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Upload Multiple Images
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
                            className="w-full h-12 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Upload
                        </Button>
                    </div>
                )}
                <Input
                    type="text"
                    value={imageHeader}
                    onChange={(e) => setImageHeader(e.target.value)}
                    placeholder="Enter Header"
                    className="w-full h-12 mt-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
    
            {/* Category Dropdown Section */}
            <div className="w-full sm:w-[60%] md:w-[50%] p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4">
                    Select a Category to View Images
                </h1>
                <select
                    value={selectedCategory}
                    onChange={handleSelectedCategory}
                    className="w-full h-12 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {capitalizeFirstLetterOfEachWord(category)}
                            </option>
                        ))}
                </select>
            </div>
    
            {/* Selected Category Display */}
            <div className="w-full sm:w-[90%] md:w-[80%] p-6 bg-white rounded-lg shadow-md">
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
const GridImageView = memo(({ item, setIsConfirmDeleteWindow, isConfirmDeleteWindow, setDeletingImageCategory }) => {
    // Initialize loading states for each item in the Url array, all true initially
    const [loadingStates, setLoadingStates] = useState(item.Url.map(() => true));
    const videoRefs = useRef([]); // References to video elements for lazy loading

    // Helper function to determine if the file is a video or an image
    const getFileType = (url) => {
        const fileExtension = url.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension);
        return { isImage, isVideo };
    };

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
            if (ref) observer.observe(ref);
        });

        // Cleanup observer on unmount
        return () => {
            videoRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [item.Url.length]); // Re-run the observer when URLs change

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

                            {/* Image */}
                            {isImage ? (
                                <img
                                    src={url}
                                    alt={`Image ${index + 1}`}
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
                                    <source src={url} type={`video/${url.split('.').pop()}`} />
                                    Your browser does not support the video tag.
                                </video>
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


/* { <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 relative">
{item.Url && item.Url.length > 0 ? item.Url?.map((url, idx) => (
    <div
        key={idx}
        className="relative group w-full bg-gray-50 h-40 rounded-lg overflow-hidden"
    >
        <LazyLoadImage
            src={url}
            alt={`Image ${idx + 1}`}
            className="w-full h-full object-contain rounded-lg shadow-sm"
        />
        <Button
            onClick={() => {
                setIsConfirmDeleteWindow(!isConfirmDeleteWindow);
                // handleDeleteImage(item._id, idx)
                setDeletingImageCategory({itemId: item._id,idx: idx});
            }}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-400 text-white w-5 h-5 rounded-full shadow-lg "
        >
            <X size={16} />
        </Button>
    </div>
)):(
    <div className='relative group w-full bg-gray-50 h-40 rounded-lg overflow-hidden'>
        <p>No Images Uploaded!</p>
    </div>
)}
</div> } */
export default AdminHomeFeatures;
