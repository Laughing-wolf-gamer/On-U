import { useState, Fragment } from 'react';
import UploadMultipleImagesArray from './UploadMultipleImages';
import UploadFeatureImagesArray from './UploadFeatureImagesArray';
import FileUploadComponent from './FileUploadComponent';

const ColorToggleViewComponent = ({
    selectedColorArray,
    color,
    sizeTag,
    handelSetImagesByColor,
    isLoading,
    setIsLoading
  }) => {
    const [viewMore, setViewMore] = useState(false);  // State to toggle visibility
  
    const toggleViewMore = (e) => {
        e.preventDefault();
        setViewMore((prevState) => !prevState);  // Toggle the viewMore state
    };
  
    return (
      <div>
        {selectedColorArray.find((s) => s.id === color.id)?.quantity > 0 && (
          <Fragment>
            <span className="font-normal text-gray-500">Add Images For Color</span>
  
            {/* View More / View Less Button */}
            {viewMore ? (
              <div>
                <FileUploadComponent
                    maxFiles={5}
                    tag={color.id}
                    sizeTag={sizeTag}
                    onSetImageUrls={(e) => {
                        console.log('Image Urls: ', e);
                        // Handle image URLs here, specific to the color
                        handelSetImagesByColor(e,color);
                    }}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
              </div>
            ) : null}
  
            {/* Toggle button */}
            <div className="w-full text-center mt-4">
              <button
                onClick={toggleViewMore}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
              >
                {viewMore ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </Fragment>
        )}
      </div>
    );
  };
  

export default ColorToggleViewComponent