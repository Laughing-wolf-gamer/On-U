import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addFeaturesImage, addMultipleImages, delFeatureImage, getFeatureImage } from '@/store/common-slice';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import { X } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import ConfirmDeletePopup from './ConfirmDeletePopup';

const AdminHomeFeatures = () => {
    const[isConfirmDeleteWindow,setIsConfirmDeleteWindow] = useState(false);
    const[resetImageUpload,setResetImageUpload] = useState(false);
    const[toggleUploadMultiple,setToggleMultiple] = useState(false);
    const { featuresList } = useSelector(state => state.common);
    const dispatch = useDispatch();
    const[multipleImages,setMultipleImages] = useState([]);
    const [imageFile, setImageFile] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [imageUrlsCategory, setImageUrlsCategory] = useState('');
    const[imageHeader,setImageHeader] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [imageLoading, setImageLoading] = useState(false);
    const[deletingImageCategory, setDeletingImageCategory] = useState(null)



    const { toast } = useToast();

    useEffect(() => {
        dispatch(getFeatureImage());
    }, [dispatch,resetImageUpload,multipleImages,imageUrlsCategory]);

    const categories = [...new Set(featuresList?.map(item => item?.CategoryType).filter(Boolean))];

    const handleImageUpload = async (url) => {
        try {
            if (!imageUrlsCategory) {
                toast({ title: 'Please select a category to upload or Update.' });
                return;
            }
            const response = await dispatch(
                addFeaturesImage({ url, CategoryType: imageUrlsCategory, Header: imageHeader || '' })
            );
            toast({ title: 'Upload Successful', description: response?.payload?.message });
            setImageHeader('');
            setImageFile('');
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };
    const HandleMultipleImagesUpload = async()=>{
        try {
            console.log('Image Urls: ', multipleImages);
            if(multipleImages.length <= 0){
                toast({ title: 'Please select at least one image to upload.' });
                return;
            }
            const response = await dispatch(addMultipleImages({ images: multipleImages, CategoryType: imageUrlsCategory, Header: imageHeader || '' }));
            toast({ title: 'Upload Successful', description: response?.payload?.message });
            setImageHeader('');
            setImageFile('');
            
        } catch (error) {
            console.error('Error during file upload:', error);
            toast({ title: 'Image Failed Upload', type: 'error' });
        }finally{
            setMultipleImages([]);
            setResetImageUpload(true);
            setTimeout(() => {
                setResetImageUpload(false);
            }, 100);
        }
    }

    const handleDeleteImage = async (id, imageIndex) => {
        try {
            const response = await dispatch(delFeatureImage({ id, imageIndex }));
            toast({ title: 'Image Deleted', description: response?.payload?.message });
            setDeletingImageCategory(null);
        } catch (error) {
            console.error('Error deleting image:', error);
            toast({ title: 'Image Failed Deleted', type: 'warning' });
        }finally{
            setDeletingImageCategory(null);
        }
    };

    const handleSelectedCategory = (e) => {
        setSelectedCategory(e.target.value);
        setImageUrlsCategory(e.target.value);
    };

    const filteredItems = featuresList?.filter(
        item => selectedCategory === '' || item.CategoryType === selectedCategory
    );

    return (
        <div className="flex flex-col items-center w-full space-y-8">
            {/* Image Upload Section */}
            <div className="w-full sm:w-[60%] p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4">
                    Upload Banners
                </h1>
                <div className='w-full h-fit justify-center mx-auto px-4 flex flex-row items-center space-x-5 mb-7'>
                    <h1 className='font-bold text-center text-gray-700'>Upload Multiple</h1>
                    <Input
                        type = "checkbox"
                        checked={toggleUploadMultiple}
                        onChange={()=>setToggleMultiple(!toggleUploadMultiple)}
                        label="Upload Multiple Images"
                        className="w-4 h-4"
                    />

                </div>
                
                {
                    toggleUploadMultiple ? (
                        <>
                            <FileUploadComponent
                                maxFiles={10}
                                tag={`home-carousal-upload`}
                                sizeTag={`carousal-upload ${imageUrlsCategory}`}
                                onSetImageUrls={(urlArray)=>{
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
                        </>

                    ):(
                        <>
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
                        </>
                    )
                }
                <Input
                    type="text"
                    value={imageUrlsCategory}
                    onChange={(e) => setImageUrlsCategory(e.target.value)}
                    placeholder="Enter New Category Name"
                    className="w-full h-12 mt-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Input
                    type="text"
                    value={imageHeader}
                    onChange={(e) => setImageHeader(e.target.value)}
                    placeholder="Enter Header"
                    className="w-full h-12 mt-4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Category Dropdown Section */}
            <div className="w-full sm:w-[60%] p-6 bg-white rounded-lg shadow-md">
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 relative">
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
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No images found for the selected category.</p>
                )}
            </div>
            <ConfirmDeletePopup isOpen={isConfirmDeleteWindow} onCancel={()=>setIsConfirmDeleteWindow(!isConfirmDeleteWindow)} onConfirm={()=>{
                if(deletingImageCategory){
                    handleDeleteImage(deletingImageCategory.itemId, deletingImageCategory.idx)
                }
                setIsConfirmDeleteWindow(!isConfirmDeleteWindow);
            }}/>
        </div>
    );
};

export default AdminHomeFeatures;
