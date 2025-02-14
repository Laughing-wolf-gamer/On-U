import { fetchOptionsByType } from '@/store/common-slice';
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import FileUploadComponent from './FileUploadComponent';
import { X } from 'lucide-react';

const AllColorsWithImages = ({OnChangeColorsActive}) => {
	const dispatch = useDispatch();
	const [allColors, setAllColors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [colorOptions, setColorOptions] = useState([]);
	const [activeColorSelect, setActiveColorSelect] = useState(null);

	// Fetch color options from the store on mount
	const fetchColorOptions = async () => {
		try {
			const data = await dispatch(fetchOptionsByType("color"));
			const colorData = data.payload?.result;
			setColorOptions(colorData?.map((s) => ({ id: s._id, label: s.value, name: s.name })) || []);
		} catch (error) {
			console.error("Error Fetching Color Options: ", error);
		}
	};

	// Remove color from the selected colors list
	const removeColorFromAllColors = (id) => {
		setAllColors(allColors.filter((color) => color.id !== id));
	};

	// Add the selected color to the array
	const updateSelectedColorArray = (e) => {
		e.preventDefault();
		const alreadyPresent = allColors.find((s) => s.id === activeColorSelect.id);
		if(!alreadyPresent) {
			if(activeColorSelect.images !== null && activeColorSelect.images.length > 0) {
				setAllColors([...allColors, activeColorSelect]);
				setActiveColorSelect(null);
			}
		}
	};

	// Notify parent component of color selection changes
	useEffect(() => {
		if (OnChangeColorsActive) {
			OnChangeColorsActive(allColors);
		}
	}, [allColors, OnChangeColorsActive]);

	// Fetch color options on component mount
	useEffect(() => {
		fetchColorOptions();
	}, [dispatch]);

	// Log selected colors for debugging purposes
	// console.log("selectedColorArray: ", allColors);

	return (
		<div className="p-3 w-full bg-white">
			{/* Total Colors Count */}
			<div className="flex items-center text-center text-xl font-bold justify-center">
				<span>All Colors: {allColors.length}</span>
			</div>
			{allColors.length > 0 && (
				<div className="flex gap-2 w-full mt-2">
					<div className="mt-6 mb-5 w-full">
						<div className="flex flex-wrap gap-2 mt-2 justify-start">
							{allColors.map((color, index) => (
								<div key={index} className="relative w-20 w- h-12">
									{/* Color Preview */}
									<div
										className="w-full justify-center p-3 flex items-center h-full rounded-full border border-gray-300"
										style={{ backgroundColor: color?.label }}
									>
										{/* <span className='text-xl font-semibold text-center'>{color?.name}</span> */}
									</div>

									{/* Remove Button */}
									<button
										className="absolute top-0 right-0 text-red-500 text-xs font-semibold bg-white rounded-full p-1 hover:bg-gray-200"
										onClick={() => removeColorFromAllColors(color.id)} // Call function to remove color
										aria-label={`Remove color ${color.label}`}
										title={color?.images?.length > 0 ? color?.images?.length : "No Images Uploaded"}
									>
										<X/>
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			<div className="flex gap-6 mt-6 flex-col">
				<div className="w-full flex flex-col items-center justify-center space-y-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
				 <div className="flex w-full items-center justify-start gap-4 px-4 relative">
					{/* Active Color Preview */}
					<div
						className="w-16 h-16 rounded-full mt-3 border-2 border-gray-300 shadow-md transition-transform duration-300 ease-in-out"
						style={{
							backgroundColor: activeColorSelect?.label || "#ffffff",
						}}
					/>

					{/* Color Picker Dropdown */}
					<div
						className={`w-full h-10 py-1 relative flex items-center justify-center overflow-hidden rounded-full focus:outline-none transition-all transform duration-300 ease-in-out 
						bg-[${activeColorSelect?.label}] text-white scale-110 shadow-lg hover:scale-105 hover:shadow-2xl`}
						aria-label={`Select color ${activeColorSelect?.id}`}
					>
						<select
							disabled={isLoading}
							value={activeColorSelect?.label}
							onChange={(e) => {
								// e.preventDefault();
								const selectedOption = colorOptions.find(option => option.label === e.target.value);
								if (selectedOption) {
									console.log("Color Selected: ", selectedOption);
									setActiveColorSelect(selectedOption);
								} else {
									setActiveColorSelect(null);
								}
							}}
							className="w-full h-full text-black font-semibold bg-transparent m-2 rounded-full focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
						>
							<option value="">None</option>
							{colorOptions.map((option) => (
								<option
									key={option.id}
									value={option.label}
									className="w-full flex items-center gap-4 p-2 cursor-pointer bg-transparent"
								>
								{/* Color Circle */}
								<div
									className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-md transition-transform duration-300 ease-in-out"
									style={{
									backgroundColor: option.label, // Set background color to the hex value
									}}
								/>
								
								{/* Color Label */}
								<span
									className="ml-2 text-sm font-semibold"
									style={{
									color: option.label === '#ffffff' ? 'black' : 'white', // Adjust text color based on background color
									}}
								>
									{option?.name || option?.label}
								</span>
								</option>
							))}
							</select>

					</div>
				</div>

				{/* Image Upload for Selected Color */}
				{activeColorSelect && (
					<Fragment>
					<span className="font-base text-gray-700">Add Images For Color <span className='font-medium text-black'>{activeColorSelect?.name || activeColorSelect?.label}</span> </span>
					<FileUploadComponent
						maxFiles={8}
						tag={activeColorSelect.id}
						sizeTag={'allColors'}
						onSetImageUrls={(files) => {
						console.log('Image Urls: ', files);
						setActiveColorSelect({ ...activeColorSelect, images: files });
						}}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
					/>
					</Fragment>
				)}

				{/* Add Color Button */}
				{activeColorSelect && (
					<div className="mt-6 flex justify-center items-center space-y-3 flex-col">
					<span className="text-left text-sm font-thin hover:text-gray-500 hover:underline underline-offset-4 cursor-pointer">
						Required
					</span>
					<button
						disabled={isLoading}
						className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
						onClick={updateSelectedColorArray}
					>
						Add Color
					</button>
					</div>
				)}
				</div>
			</div>
		</div>

	);
};


export default AllColorsWithImages
