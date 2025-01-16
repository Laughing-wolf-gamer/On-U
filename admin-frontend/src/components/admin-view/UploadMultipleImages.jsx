import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { BASE_URL } from "@/config";

const UploadMultipleImagesArray = ({
  maxFiles = 4,
  onSetImageUrls,
  tag,
  sizeTag,
  customeStyling = 'space-y-4',
  isLoading,
  setIsLoading,
}) => {
  const [files, setFiles] = useState(Array(maxFiles).fill(null)); // Holds files for all slots
  const [uploadedImageUrls, setUploadedImageUrls] = useState(Array(maxFiles).fill(""));
  const [loadingStates, setLoadingStates] = useState(Array(maxFiles).fill(false)); // Loading state per file
  const inputRefs = useRef([]);
  const dropzoneRefs = useRef([]);

  const handleImageFileChange = async (index, e) => {
    e.preventDefault();
    try {
      
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      updateFile(index, selectedFile);

      const url = await handleUploadImage(selectedFile, index);
      if (url) updateUploadedImageUrl(index, url);
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  const handleUploadImage = async (file, index) => {
    setLoadingState(index, true);
    try {
      const formData = new FormData();
      formData.append("my_file", file);

      const token = sessionStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/admin/upload-image`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, must-revalidate, proxy-revalidate",
        },
      });

      return res.data?.result || "";
    } catch (error) {
      console.error("Error while uploading image:", error);
    } finally {
      setLoadingState(index, false);
    }
  };

  const updateFile = (index, file) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const updateUploadedImageUrl = (index, url) => {
    const newUrls = [...uploadedImageUrls];
    newUrls[index] = url;
    setUploadedImageUrls(newUrls);
    onSetImageUrls(newUrls);
  };

  const setLoadingState = (index, state) => {
    const newLoadingStates = [...loadingStates];
    newLoadingStates[index] = state;
    setLoadingStates(newLoadingStates);
    setIsLoading(state);
  };

  const handleRemoveImage = (index) => {
    updateFile(index, null);
    updateUploadedImageUrl(index, "");
    if (inputRefs.current[index]) {
      inputRefs.current[index].value = "";
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRefs.current[index]) {
      dropzoneRefs.current[index].classList.add('bg-gray-200');
    }
  };

  const handleDragLeave = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRefs.current[index]) {
      dropzoneRefs.current[index].classList.remove('bg-gray-200');
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRefs.current[index]) {
      dropzoneRefs.current[index].classList.remove('bg-gray-200');
    }

    const file = e.dataTransfer.files[0];
    if (file) {
      updateFile(index, file);
      handleUploadImage(file, index).then((url) => {
        if (url) updateUploadedImageUrl(index, url);
      });
    }
  };

  return (
        <div className={customeStyling}>
            <div className="flex items-center justify-center">
              <span> Images: {uploadedImageUrls.filter(i => i !== '').length}/ {uploadedImageUrls.length} </span>
              
            </div>
            <div className="flex items-center justify-center">
              {
                isLoading && <span>Please Wait While the Image is Loading...</span>
              }
            </div>
            {files.map((file, index) => (
                <div
                  disabled = {isLoading}
                  key={index}
                  className="w-full border-2 border-dashed rounded-md p-4"
                  ref={(el) => (dropzoneRefs.current[index] = el)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={(e) => handleDragLeave(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                    <input
                        disabled={isLoading}
                        id={`image-upload-${index}-${tag}-${sizeTag}`}
                        type="file"
                        className="hidden"
                        ref={(el) => (inputRefs.current[index] = el)}
                        onChange={(e) => handleImageFileChange(index, e)}
                    />
                    {!file ? (
                        <Label
                          disabled = {isLoading}
                          htmlFor={`image-upload-${index}-${tag}-${sizeTag}`}
                          className="flex flex-col justify-center items-center h-32 cursor-pointer"
                        >
                          <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">
                              Drag & drop or Click an Image to Upload
                          </span>
                        </Label>
                    ) : loadingStates[index] ? (
                        <Skeleton className="bg-gray-100 h-10" />
                    ) : (
                        <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FileIcon className="w-10 h-10 text-muted" />
                            <p className="ml-2 text-sm font-medium">{file?.name}</p>
                        </div>
                            <Button
                                disabled = {isLoading}
                                variant="ghost"
                                size="icon"
                                className="hover:text-foreground"
                                onClick={() => handleRemoveImage(index)}
                            >
                                <XIcon className="w-4 h-4" />
                                <span className="sr-only">Remove File</span>
                            </Button>
                        </div>
                    )}
                    
                </div>
            ))}
            
        </div>
  );
};

export default UploadMultipleImagesArray;
