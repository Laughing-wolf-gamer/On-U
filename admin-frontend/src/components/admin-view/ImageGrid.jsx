import React, { useState } from "react";
import ImageUpload from "./image-upload";
import UploadMultipleImagesArray from "./UploadMultipleImages";

const ImageGrid = ({onSetImageUrls,maxFiles}) => {

    return (
		<UploadMultipleImagesArray maxFiles={maxFiles} onSetImageUrls = {(e) =>{
			onSetImageUrls(e);
			console.log(e);
		}}/>
        
    );
};

export default ImageGrid;
