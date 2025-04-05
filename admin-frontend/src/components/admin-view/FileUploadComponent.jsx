import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, Header } from '@/config';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {File, Upload, X } from 'lucide-react';
import UploadOverlay from './UploadOverlay';
import { Badge } from '../ui/badge';
import { useSettingsContext } from '@/Context/SettingsContext';
import ReactPlayer from 'react-player';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


const FileUploadComponent = ({
    maxFiles = 5,
    tag,
    sizeTag,
    onSetImageUrls,
    isLoading,
    setIsLoading,
    onReset,
    onRemovingImages,
}) => {
    const { checkAndCreateToast } = useSettingsContext();
    const [files, setFiles] = useState([]); // Array of selected files
    const [loadingStates, setLoadingStates] = useState([]); // Loading state per file
    const [isUploadReady, setIsUploadReady] = useState(false); // To control when upload starts
    const dropzoneRef = useRef(null);

    const handleFileChange = async (e) => {
        const selectedFiles = e.target.files;

        if (!selectedFiles || selectedFiles.length === 0) return;

        const newFiles = [...files];
        const newLoadingStates = [...loadingStates];

        // Limit the number of files to the maxFiles count
        for (let i = 0; i < selectedFiles.length; i++) {
            if (newFiles.length < maxFiles) {
                newFiles.push(selectedFiles[i]);
                newLoadingStates.push(false); // Set loading state to false initially
            }
        }

        // Update state
        setFiles(newFiles);
        setLoadingStates(newLoadingStates);
        setIsUploadReady(true); // Set ready to upload when new files are selected
    };

    // Function to handle the upload of multiple files (both image and video)
    const handleUploadFiles = async () => {
        if (files.length === 0) return;

        setIsLoading(true);
        const formData = new FormData();
        
        // Append each file to the FormData object
        files.forEach((file) => {
            formData.append('my_files[]', file);
        });

        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.post(
                `${BASE_URL}/admin/upload-image-all`, 
                formData, 
                {
                    withCredentials:true,
                    headers: {
                        Authorization:`Bearer ${token}`,
                        "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
                    },
                }
            );
			
            const urls = res.data?.results || [];
            updateUploadedFileUrls(urls);
            checkAndCreateToast("success", "Files uploaded successfully");
        } catch (error) {
            if (error.response) {
                console.log('Error Status Code:', error.response.status);
                console.log('Error Data:', error.response.data);
                checkAndCreateToast("error", "Error uploading files: " + error.response.data.message);
            } else {
                console.log('Error Message:', error.message);
                checkAndCreateToast("error", "Error uploading files: " + error.message);
            }
            updateUploadedFileUrls([]);
        } finally {
            setIsLoading(false);
            setLoadingStates(Array(files.length).fill(false)); // Reset loading states
        }
    };

    // Function to update uploaded file URLs
    const updateUploadedFileUrls = (urls) => {
        const newFiles = [...files];
        urls.forEach((url, index) => {
            newFiles[index] = { ...newFiles[index], url }; // Attach URL to file
        });
        setFiles(newFiles);
		// console.log("Upload Image Urls: ",newFiles);
        onSetImageUrls(newFiles); // Notify parent about the updated file URLs
    };

    const handleRemoveFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1); // Remove file from array
        setFiles(newFiles);

        const newLoadingStates = [...loadingStates];
        newLoadingStates.splice(index, 1); // Remove loading state for the file
        setLoadingStates(newLoadingStates);
        if (onRemovingImages) {
            onRemovingImages(index);
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropzoneRef.current) {
            dropzoneRef.current.classList.add('bg-gray-200');
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropzoneRef.current) {
            dropzoneRef.current.classList.remove('bg-gray-200');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (dropzoneRef.current) {
            dropzoneRef.current.classList.remove('bg-gray-200');
        }

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleFileChange({ target: { files: droppedFiles } });
        }
    };

    useEffect(() => {
        if (onReset) {
            setFiles([]);
            setLoadingStates([]);
            setIsUploadReady(false); // Reset the upload state when reset is triggered
        }
    }, [onReset]);

    return (
        <div className="flex flex-col items-center min-w-full">
            <Label className="mb-4">
                Selected Files: {files.filter((file) => file !== '').length} / {maxFiles}
            </Label>
            <div
                ref={dropzoneRef}
                className="w-full h-32 border-2 justify-center items-center flex flex-col border-dashed border-gray-400 rounded-md p-4 text-center cursor-pointer transition-colors duration-300 hover:bg-gray-100"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById(`file-upload-${tag}-${sizeTag}`).click();
                }}
            >
                <input
                    style={{ display: 'none' }}
                    type="file"
                    id={`file-upload-${tag}-${sizeTag}`}
                    accept=".jpg, .jpeg, .png, .gif, .mp4, .mov, .avi, .mkv, .webp"
                    multiple
                    onChange={handleFileChange}
                    onClick={(event) => event.stopPropagation()}
                    disabled={files.length >= maxFiles}
                />
                <div className="flex flex-col justify-center cursor-pointer hover:scale-105 transition-all duration-500 ease-ease-in-out-expo items-center">
                    <Label className="mb-2 text-lg font-semibold">Drag & Drop or Click to Upload</Label>
                    <File className="w-10 h-10 text-gray-500" />
                </div>
            </div>

            {isLoading && <Badge className={"mt-2"}>Please wait while the files are uploading...</Badge>}

            <div className="mt-4 w-full h-full justify-start items-center flex flex-col">
                {files.map((file, index) => (
                    <div key={index} className="flex justify-between gap-7 items-center p-2 border-b">
                        <div className="flex items-center space-x-2 justify-center">
                            <h2 className="text-sm font-medium">File: {index + 1}</h2>
                            {file?.type?.startsWith("video/") ? (
                                <ReactPlayer 
									url={URL.createObjectURL(file)} 
									type={file.type} 
									width={"100px"}
									height={'100px'}
									className = {"object-cover rounded-md"}
									controls
									muted
									playing
								/>
                            ) : (
                                <LazyLoadImage
									effect="blur"
									useIntersectionObserver
									loading="lazy"
									wrapperProps={{
										// If you need to, you can tweak the effect transition using the wrapper style.
										style: {transitionDelay: "1s"},
									}}
                                    src={file.url || URL.createObjectURL(file)}
                                    alt="file-preview"
                                    className="w-[100px] h-[100px] object-cover rounded-md"
                                />
                            )}
                        </div>
                        {loadingStates[index] ? (
                            <Label className="text-gray-500">Uploading...</Label>
                        ) : (
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemoveFile(index);
                                }}
                                className="text-white w-8 h-8 rounded-full"
                            >
                                <X />
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            {isUploadReady && files.length > 0 && (
                <Button
                    onClick={handleUploadFiles}
                    className="mt-4 bg-red-500 hover:bg-red-800 justify-center w-full items-center text-white"
                    disabled={isLoading}
                >
                    <Upload/><span>Create Link</span>
                </Button>
            )}

            <UploadOverlay isUploading={isLoading} />
        </div>
    );
};


export default FileUploadComponent;
