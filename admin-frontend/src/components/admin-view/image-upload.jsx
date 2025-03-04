import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';
import { BASE_URL } from '@/config';
import UploadOverlay from './UploadOverlay';

const ImageUpload = ({currentIndex = -1,file,setFile,Header,uploadedImageUrl,setUploadedImageUrl,imageLoading,setImageLoading,isEditingMode,isCustomStyling,newStyling}) => {
	const inputRef = useRef(null);
    // console.log("Selected file for index:", currentIndex);
    const handleImageFileChange = async (e) => {    
        try {
            // Get the selected file from the input
            const selectedFile = e.target.files?.[0];
    
            if (!selectedFile) {
                console.error("No file selected.");
                return;
            }
    
            // Set the selected file in state
            setFile(selectedFile);
    
            // Upload the image and get the URL
            const url = await handleUploadImage(selectedFile);
    
            if (url) {
                console.log("Image uploaded successfully: ", url);
                setUploadedImageUrl(url);
            } else {
                console.error("Image upload failed.");
            }
        } catch (error) {
            console.error("Error during file upload:", error);
        }
    };
    
	const handleDragOver = (e)=>{
		e.preventDefault();
        e.stopPropagation();
	}
	const handleDrop = (e) => {
		e.preventDefault();
        e.stopPropagation();
        const selectedFile = e.dataTransfer?.files?.[0];
        if(selectedFile) setFile(selectedFile);
	}
	const handleRemoveImage = (e) => {
		e.preventDefault();
        setFile(null);
        setUploadedImageUrl("");
		if(inputRef.current){
			inputRef.current.value = '';
		}
    }
    const handleUploadImage = async (file) => {
        setImageLoading(true);
        try {
            const formData = new FormData();
            formData.append('my_file', file);
            const token = sessionStorage.getItem('token');
            console.log(token);
            const res = await axios.post(`${BASE_URL}/admin/upload-image`,formData,{
                withCredentials:true,
                headers: {
                    Authorization:`Bearer ${token}`,
                    "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
                },
            });
            // console.log(res.data);
            if(res){
                return res.data?.result
            };
            return '';
        } catch (error) {
            console.error('An error occurred while uploading: ',error);
        }finally{
            setImageLoading(false);
        }
        
    }
    /* useEffect(()=>{
        if(imageFile){
            handleUploadImage();
        }
    },[imageFile]) */
	return (
		<div className={`${newStyling ? newStyling : `bg-white w-full mt-4 ${isCustomStyling ? 'mx-auto':'max-w-md'}`}`}>
			<label className='text-lg font-semibold mb-2 '>{Header ? Header:"Upload Image"}</label>
			<div onDragOver={handleDragOver} onDrop={handleDrop} className={`border-2 border-dashed font-bold ${isEditingMode ? "opacity-60":''}`}>
				<Input id = "image-upload" type = "file" className = "hidden" ref={inputRef} onChange = {handleImageFileChange} disabled = {isEditingMode}/>
				{
					!file ? <Label htmlFor = "image-upload" className = {`flex flex-col justify-center items-center h-32 ${isEditingMode ? "cursor-not-allowed":'cursor-pointer'}`}>
						<UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-2'/>
						<span className='text-sm text-muted-foreground px-3 text-center'>Drag & drop or Click an Image to Upload</span>
					</Label>:(
                        imageLoading ? <Skeleton className={"bg-gray-100 h-10"}/>: (
                            <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <FileIcon className='w-10 h-10 text-muted'/>
                            </div>
                            <p className='text-sm font-medium'>{file?.name}</p>
                                <Button variant = "ghost" size = "icon" className = "hover:text-foreground" onClick = {handleRemoveImage}>
                                    <XIcon className='w-4 h-4'/>
                                    <span className='sr-only'>Remove File</span>
                                </Button>
                            </div>
                        )
                    )
				}
			</div>
            <UploadOverlay isUploading={imageLoading}/>
		</div>
	)
}

export default ImageUpload