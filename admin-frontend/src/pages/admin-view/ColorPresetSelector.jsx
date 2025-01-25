import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import UploadMultipleImagesArray from "@/components/admin-view/UploadMultipleImages";
import { ChevronDown, ChevronRight, ChevronUp, Minus, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import FileUploadComponent from "@/components/admin-view/FileUploadComponent";
import ColorToggleViewComponent from "@/components/admin-view/ColorToggleViewComponent";
const ColorPresetSelector = ({colorOptions,sizeTag,sizeTitle,OnChange}) => {
	const[isLoading, setIsLoading] = useState(false);
	const[optionsArray, setOptionsArray] = useState([]);
	const [selectedColorArray, setSelectedColorArray] = useState([]);
	// const [viewMoreState, setViewMoreState] = useState({}); // State to track view more per color ID
	const handelSetImagesByColor = (allImages,color) => {
		if(isLoading) return;
		setSelectedColorArray(selectedColorArray.map((s) => s.id === color.id ? {...s, images:allImages } : s));
		if (OnChange) {
			OnChange(selectedColorArray);
			console.log("Color Images Image Urls:  ",selectedColorArray);
		}
		
	}
	const handleIncrement = (e,color, action) => {
		if(isLoading) return;
		e.preventDefault();
		const alreadyPresent = selectedColorArray.find((s) => s.id === color.id)
		if (action === "increment") {
			// If the size is not already in the array, add it
			if (alreadyPresent === undefined) {
				setSelectedColorArray((prev) => [...prev, color]);
			}
			// Otherwise, increment the quantity of the existing size
			setSelectedColorArray((prev) =>
				prev.map((s) =>
					s.id === color.id ? { ...s, quantity: s.quantity + 1 } : s
				)
			);
			
		} else {
			// If the size is already in the array and its quantity is more than 1, decrement the quantity
			setSelectedColorArray((prev) =>
				prev.map((s) =>
					s.id === color.id 
					? { ...s, quantity: s.quantity - 1 }
					: s
				).filter((s) => s.quantity >= 0) // Remove items with zero quantity
			);
		}
		// console.log("Selected Size Array: ",selectedSizeArray);
		if (OnChange) {
			OnChange(selectedColorArray);
			console.log("Color Images Image Urls:  ",selectedColorArray);
		}
	};

	const handleChangeQuantity = (e, color) => {
		if(isLoading) return;
		const value = parseInt(e.target.value, 10);
		if (!isNaN(value) && value >= 0) {
			setSelectedColorArray((prev) =>
				prev.map((c) =>
					c.id === color.id ? { ...c, quantity: value } : c
				)
			);
		}else{
			setSelectedColorArray((prev) =>
				prev.map((c) =>
					c.id === color.id ? { ...c, quantity: 0 } : c
				)
			);
		}
		if (OnChange) {
			OnChange(selectedColorArray);
			console.log("Color Images Image Urls:  ",selectedColorArray);
		}
	};
	const changeColorLabel = (id,label) =>{
		// console.log("Color Label: ",label,id);
		setOptionsArray(optionsArray.map((s) => s.id === id ? {...s, label:label } : s));
		setSelectedColorArray(selectedColorArray.map((s) => s.id === id ? {...s, label:label } : s));
		if (OnChange) {
			OnChange(selectedColorArray);
			console.log("Color Images Image Urls:  ",selectedColorArray);
		}
	}
	useEffect(()=>{
		if(isLoading) return;
		if(selectedColorArray.length > 0){
			if(optionsArray.length === 0){
				setSelectedColorArray([]);
			}else{
				for (const item of selectedColorArray) {
					const isInOptions = optionsArray.find((s) => s.id === item.id);
					if(!isInOptions){
						setSelectedColorArray(selectedColorArray.filter((s) => s.id !== item.id));
						// setViewMoreState([...viewMoreState,{id:item.id,viewMore:false}]);
						// setViewMoreState()
					}
				}
			}
		}
		OnChange(selectedColorArray);
		console.log("Color Images Image Urls:  ",selectedColorArray);
		
	},[selectedColorArray,setSelectedColorArray,optionsArray]);
	

	// Toggle function to toggle the view more state for specific color
	const [showMore, setShowMore] = useState([]);
	
	const toggleShowMore = (e,index) => {
		e.preventDefault();
		setShowMore((prev) =>
			prev.map((item, idx) =>
				idx === index ? { ...item, value: !item.value } : item
			)
		);
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			{selectedColorArray.length > 0 && (
				<div className="mt-6 mb-5">
					<p className="text-gray-700 font-medium">Selected Colors:</p>
					<div className="flex gap-2 mt-2">
						{selectedColorArray.map((color, index) => (
							<span
								key={index}
								className="w-6 h-6 rounded-full border border-gray-300"
								style={{ backgroundColor: color?.label }}
								aria-label={`Selected color ${color.label}`}
							/>
						))}
					</div>
				</div>
			)}
			<span className="my-6 text-[15px] mt-3 font-normal text-gray-800">
				Add Size Color and Reference Images of the Size {sizeTitle}
			</span>
			<div className="flex items-center justify-center gap-4">
				<span>Total Colors: {selectedColorArray.length}</span>
			</div>
			{/* Color Options */}
			<div className="flex gap-6 mt-6 flex-col">
				{optionsArray?.map((color,i) => (
					<Fragment key={`color_${i}`}>
						<div className="mt-6 flex justify-center">
							<button
								disabled={isLoading}
								onClick={(e) => toggleShowMore(e,i)}
								className="px-4 py-2 text-white bg-gray-400 rounded justify-center items-center flex flex-col focus:outline-none"
							>
								{showMore[i]?.value ? <ChevronDown/> : <ChevronUp/>}
								{
									isLoading && showMore[i]?.value ? <span className="text-xs text-gray-700">Loading...</span> : null
								}
							</button>
						</div>
						<div
							className={`mt-6 ${showMore[i]?.value ? "block" : "hidden"} w-full flex flex-col items-center justify-center space-y-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow`}
						>
							<div className="flex w-full m-6 items-center justify-start gap-4 px-4 relative bg">
								<div className="w-14 h-14 rounded-full mt-3" style={{backgroundColor:color?.label || "#fffff"}}>

								</div>
								{/* Color Picker */}
								<div
									className={`w-20 h-12 relative flex items-center justify-center overflow-hidden rounded-full focus:outline-none transition-transform ${
										selectedColorArray.find((s) => s.id === color.id)?.quantity > 0
										? `bg-[${color.label}] text-white scale-110 shadow-lg`
										: `bg-[${color.label}] text-gray-700 hover:scale-105`
									}`}
									aria-label={`Select color ${color.id}`}
								>
									<select
										disabled={isLoading}
										value={color.label}
										onChange={(e) => {
											e.preventDefault();
											changeColorLabel(color.id, e.target.value);
										}}
										className="w-full h-full text-black m-2"
									>
										<option value="">Select Color</option>
										{colorOptions.map((option) => (
											<option
												key={option.id}
												value={option.label}
												style={{
													backgroundColor: option.label, // Set background color to the hex value
													color: option.label === '#ffffff' ? 'black' : 'white', // Adjust text color for readability
												}}
											>
												<div className="w-full h-full p-1 flex items-center justify-center rounded-full">
													{option.label}
												</div>
											</option>
										))}
										</select>
								</div>


								{/* Remove Color Button */}
								<button
									disabled={isLoading}
									onClick={(e) => {
										e.preventDefault();
										setOptionsArray(optionsArray.filter((s) => s.id !== color.id));
									}}
									className="p-2 text-black hover:text-white bg-white rounded-full absolute top-0 right-0 hover:bg-gray-500 focus:outline-none"
										aria-label="Remove size"
									>
										<X className="w-7 h-7" />
								</button>
							</div>
				
				
							{/* Increment/Decrement Quantity */}
							<div className="flex items-center space-x-2">
								<button
									disabled = {isLoading}
									onClick={(e) => handleIncrement(e, color, "decrement")}
									className="px-3 py-2 text-sm bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none"
									aria-label="Decrease quantity"
								>
									<Minus/>
								</button>
								<Input
									disabled = {isLoading}
									type="number"
									value={
										selectedColorArray.find((c) => c.id === color.id)?.quantity || 0
									}
									onChange={(e) => handleChangeQuantity(e, color)}
									className="w-full h-full text-center border-2 rounded-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
									min="1"
								/>
								<button
									disabled={isLoading}
									onClick={(e) => handleIncrement(e, color, "increment")}
									className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
									aria-label="Increase quantity"
								>
									<Plus/>
								</button>
							</div>
							
							{selectedColorArray.find((s) => s.id === color.id)?.quantity > 0 && (
									<Fragment>
										<span className="font-normal text-gray-500">Add Images For Color</span>
										<FileUploadComponent
											maxFiles={5}
											tag={color.id}
											sizeTag={sizeTag}
											onSetImageUrls={(e) => {
												console.log('Image Urls: ', e);
												// Handle image URLs here, specific to the color
												handelSetImagesByColor(e,color);
											}}
											isLoading = {isLoading}
											setIsLoading={setIsLoading}
										/>
									</Fragment>
								)
							}
						</div>
					</Fragment>
				))}
			</div>
		
			{/* Add Color Button */}
			<div className="mt-6 flex justify-center items-center space-y-3 flex-col">
				<span className="text-left text-sm font-thin hover:text-gray-500 hover:underline underline-offset-4 cursor-pointer">Required</span>
				<button
					disabled={isLoading}
					className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
					onClick={(e) => {
						e.preventDefault();
						setShowMore((prev) => [...prev, { id: optionsArray.length, value: false }]);
							setOptionsArray([
							...optionsArray,
							{ id: optionsArray.length + 1, label: "#ffffff", quantity: 0 },
						]);
					}}
				>
					Add Color For Size: <span className="text-white font-extrabold">{sizeTitle} </span>
				</button>
			</div>
		
			
		</div>
	);
	  
};
export default ColorPresetSelector;
