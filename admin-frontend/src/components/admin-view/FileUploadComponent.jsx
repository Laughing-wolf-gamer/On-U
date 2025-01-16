import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, Header } from '@/config';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { X } from 'lucide-react';

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
    const token = sessionStorage.getItem('token');

    // Append each file to the FormData object
    files.forEach((file) => {
      formData.append('my_files[]', file);
    });

    try {
      const res = await axios.post(`${BASE_URL}/admin/upload-image-all`, formData, Header());

      const urls = res.data?.results || [];
      updateUploadedFileUrls(urls);
    } catch (error) {
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
        className="w-full h-40 border-2 border-dashed rounded-md p-4 text-center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={`file-upload-${tag}-${sizeTag}`} 
          className="hidden"
          multiple
          ref={inputRef}
          onChange={handleFileChange}
          disabled={files.length >= maxFiles} 
        />
        <label
          htmlFor={`file-upload-${tag}-${sizeTag}`} 
          className="flex flex-col justify-center items-center cursor-pointer"
        >
          <div className="mb-2">Drag & Drop or Click to Upload</div>
          <button className="btn btn-primary">Upload Files</button>
        </label>
      </div>

      {isLoading && <span>Please wait while the files are uploading...</span>}

      <div className="mt-4 w-full h-full justify-start items-center flex flex-col">
        {files.map((file, index) => (
          <div key={index} className="flex justify-between gap-7 items-center p-2 border-b">
            <div className="flex items-center">
              <p className="text-sm font-medium">File: {index + 1}</p>
              {file?.type?.startsWith("video/") && (
                <video width="100" controls>
                  <source src={file.url} type={file.type} />
                </video>
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
    </div>
  );
};

export default FileUploadComponent;
