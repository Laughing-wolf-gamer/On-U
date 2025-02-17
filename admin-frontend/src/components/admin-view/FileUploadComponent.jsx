import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, Header } from '@/config';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {File, X } from 'lucide-react';
import UploadOverlay from './UploadOverlay';
import toast from 'react-hot-toast';

const FileUploadComponent = ({
    maxFiles = 5,
    tag,
    sizeTag,
    onSetImageUrls,
    isLoading,
    setIsLoading,
    onReset,
}) => {
    const [files, setFiles] = useState([]); // Array of selected files
    const [loadingStates, setLoadingStates] = useState([]); // Loading state per file
    const inputRef = useRef(null);
    const dropzoneRef = useRef(null);

    const handleFileChange = async (e) => {
        const selectedFiles = e.target.files;
        console.log("Selected Files: ", selectedFiles);

        if (!selectedFiles || selectedFiles.length === 0) return;

        const newFiles = [...files];
        const newLoadingStates = [...loadingStates];

        // Limit the number of files to the maxFiles count
        for (let i = 0; i < selectedFiles.length; i++) {
            if (newFiles.length < maxFiles) {
                newFiles.push(selectedFiles[i]);
                newLoadingStates.push(true); // Set loading state to true when uploading
            }
        }

        // Update state
        setFiles(newFiles);
        setLoadingStates(newLoadingStates);

        // Start uploading files
        handleUploadFiles(newFiles);
    };

    // Function to handle the upload of multiple files (both image and video)
    const handleUploadFiles = async (files) => {
        setIsLoading(true);
        const formData = new FormData();
        // const token = sessionStorage.getItem('token');

        // Append each file to the FormData object
        files.forEach((file) => {
            formData.append('my_files[]', file);
        });

        try {
            const res = await axios.post(`${BASE_URL}/admin/upload-image-all`, formData, Header());
            const urls = res.data?.results || [];
            updateUploadedFileUrls(urls);
            toast.success("Files uploaded successfully");
        } catch (error) {
            // Check if the error is a response error (status codes outside 2xx range)
            if (error.response) {
                // The server responded with a status other than 2xx
                console.log('Error Status Code:', error.response.status);
                console.log('Error Data:', error.response.data); // The JSON error message from the server
                console.log('Error Headers:', error.response.headers);
                toast.error("Error uploading files: " + error.response.data.message);
            } else if (error.request) {
                // The request was made but no response was received
                console.log('No response received:', error.request);
                toast.error("No response received while uploading files");
            } else {
                // Something happened in setting up the request that triggered an error
                console.log('Error Message:', error.message);
                toast.error("Error uploading files: ", error.message);
            }
            console.error('Error while uploading files:', error);
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
        onSetImageUrls(newFiles); // Notify parent about the updated file URLs
    };

    const handleRemoveFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1); // Remove file from array
        setFiles(newFiles);

        const newLoadingStates = [...loadingStates];
        newLoadingStates.splice(index, 1); // Remove loading state for the file
        setLoadingStates(newLoadingStates);
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
        }
    }, [onReset]);

    return (
        <div className="flex flex-col items-center">
            <span className="mb-4">
                Files: {files.filter((file) => file !== '').length} / {maxFiles}
            </span>
           <div
				ref={dropzoneRef}
				className="w-full h-32 border-2 justify-center items-center flex flex-col border-dashed border-gray-400 rounded-md p-4 text-center cursor-pointer transition-colors duration-300 hover:bg-gray-100"
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={(e) => {
                    e.stopPropagation(); // Prevent the event from propagating
                    document.getElementById(`file-upload-${tag}-${sizeTag}`).click();
                }} // Trigger file input click when drop zone is clicked
				>
				<input
                    style={{ pointerEvents: 'none' }}
					type="file"
					id={`file-upload-${tag}-${sizeTag}`}
					className="hidden"
					multiple
					onChange={handleFileChange}
                    onClick = {(event)=> event.stopPropagation()}
					disabled={files.length >= maxFiles}
				/>
				<label
					htmlFor={`file-upload-${tag}-${sizeTag}`}
					className="flex flex-col justify-center items-center cursor-pointer"
				>
					<span className="mb-2 text-lg font-semibold">Drag & Drop or Click to Upload</span>
					<File className="w-10 h-10 text-gray-500" />
				</label>
			</div>


            {isLoading && <span>Please wait while the files are uploading...</span>}

            <div className="mt-4 w-full h-full justify-start items-center flex flex-col">
                {files.map((file, index) => (
                    <div key={index} className="flex justify-between gap-7 items-center p-2 border-b">
                        <div className="flex items-center">
                            <h2 className="text-sm font-medium">File: {index + 1}</h2>
                                {file?.type?.startsWith("video/") ? (
                                    <video width="100" controls>
                                        <source src={file.url} type={file.type} />
                                    </video>
                                ):(
                                    <img src={file.url || URL.createObjectURL(file)} alt="file-preview" className="w-16 h-16 object-cover rounded-md" />
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
            <UploadOverlay isUploading={isLoading}/>
        </div>
    );
};


export default FileUploadComponent;
