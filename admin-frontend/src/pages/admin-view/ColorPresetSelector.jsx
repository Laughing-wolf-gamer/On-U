import React, { Fragment, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, Minus, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import FileUploadComponent from "@/components/admin-view/FileUploadComponent";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
const ColorPresetSelector = ({colorOptions,sizeTag,sizeTitle,OnChange,editingMode = false}) => {
	const[isLoading, setIsLoading] = useState(false);
	const[optionsArray, setOptionsArray] = useState([]);
	const [selectedColorArray, setSelectedColorArray] = useState([]);
	// const [viewMoreState, setViewMoreState] = useState({}); // State to track view more per color ID
	const handelSetImagesByColor = (allImages,color) => {
		if(isLoading) return;
		setSelectedColorArray(selectedColorArray.map((s) => s.id === color.id ? {...s, images:allImages } : s));
		if (OnChange) {
			OnChange(selectedColorArray);
			// console.log("Color Images Image Urls:  ",selectedColorArray);
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
			// console.log("Color Images Image Urls:  ",selectedColorArray);
		}
	};
	const handleChangeSKU = (e,color)=>{
		if(isLoading) return;
        const value = e.target.value;
        setSelectedColorArray((prev) =>
            prev.map((c) =>
                c.id === color.id ? {...c, sku: value } : c
            )
        );
        if (OnChange) {
            OnChange(selectedColorArray);
            // console.log("Color Images Image Urls:  ",selectedColorArray);
        }
	}

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
			// console.log("Color Images Image Urls:  ",selectedColorArray);
		}
	};
	const changeColorLabel = (id,selectedColor) =>{
		// console.log("Color Label: ",label,id);
		
		setOptionsArray(optionsArray.map((s) => s.id === id ? {...s, label:selectedColor.label,name:selectedColor.name, images:selectedColor.images} : s));
		setSelectedColorArray(selectedColorArray.map((s) => s.id === id ? {...s, label:selectedColor.label,name:selectedColor.name, images:selectedColor.images} : s));
		if (OnChange) {
			OnChange(selectedColorArray);
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
		// console.log("Color Images Image Urls:  ",selectedColorArray);
		
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
	// console.log("colorOptions: ",colorOptions)

	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			{/* Selected Colors Section */}
			<div className="mt-6 mb-5">
				<p className="text-gray-700 font-medium">Selected Colors:</p>
				<div className="flex gap-2 mt-2">
					{selectedColorArray.map((color, index) => (
						<div key={index} className="rounded-full w-10 p-1 h-10 shadow-md border-2 border-black">
							<div
								style={{ backgroundColor: color?.label }}
								className="w-full h-full rounded-full"
								aria-label={`Selected color ${color.label}`}
							></div>
						</div>
					))}
				</div>
			</div>

			{/* Total Colors Count */}
			<div className="flex text-lg font-bold items-center justify-center gap-4">
				<h1>Total Colors: {selectedColorArray.length}</h1>
			</div>

			{/* Color Options */}
			<div className="flex gap-6 mt-6 flex-col">
				{optionsArray?.map((color, i) => (
				<Fragment key={`color_${i}`}>
					<div className="mt-6 flex justify-between w-full items-center">
						<button
							disabled={isLoading}
							onClick={(e) => toggleShowMore(e, i)}
							className="text-white bg-black justify-between flex flex-row rounded hover:bg-gray-600 items-center px-1"
						>
							<ChevronRight size={30} className={` transition-all duration-300 ease-ease-out-expo ${showMore[i]?.value ? " rotate-90":""}`}/>
						</button>
						{/* Remove Color Button */}
						<Button
							disabled={isLoading}
							onClick={(e) => {
								e.preventDefault();
								setOptionsArray(optionsArray.filter((s) => s.id !== color.id));
							}}
							className="p-2 text-white hover:text-gray-50 bg-black rounded-full hover:bg-gray-500 focus:outline-none"
							aria-label="Remove size"
						>
							<X className="w-7 h-7" />
							Remove: {color?.name || color?.label}
						</Button>
					</div>

					{/* Color Details Section */}
					<div
						className={`mt-6 ${showMore[i]?.value ? "block" : "hidden"} w-full flex flex-col items-center justify-center space-y-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow`}
					>
					<Select
						disabled={isLoading}
						value={color.label}
						onValueChange={(value) => {
							if(value === 'none'){
								toast.info(`Please select a Valid Color Preset before adding colors Which Is Not = ${value}`);
								return;
							}
							const selectedOption = colorOptions.find((option) => option.label === value);
							if (selectedOption) {
								changeColorLabel(color.id, selectedOption);
							}
						}}
						className="w-full h-full text-black m-2"
					>
						<SelectTrigger className="w-full border border-gray-300 rounded-md">
							<SelectValue className="text-black" placeholder = {"Select Color"}/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value = {"none"}>None</SelectItem>
							{colorOptions.map((option) => (
								<SelectItem
									key={option.id}
									value={option.label}
									className = {"p-2 border-2 flex w-full justify-center "}
									style={{
										backgroundColor: option.label,
										color: option.label === "#ffffff" ? "black" : "white",
									}} 
								>
									<div style={{
										backgroundColor: option.label,
										color: option.label === "#ffffff" ? "black" : "white",
									}} className="min-w-min h-full p-1 flex items-center justify-center">
										{option?.name || option?.label}
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Input
						disabled = {isLoading}
						type = 'text'
						value = {selectedColorArray.find((s) => s.id === color.id)?.sku || ""}
						onChange={(e) => handleChangeSKU(e, color)}
						className="w-full h-full text-center border-2 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none"
						placeholder = {"SKU"}
					/>
					{/* Increment/Decrement Quantity */}
					<div className="flex items-center space-x-2">
						<Button
							disabled={isLoading}
							onClick={(e) => handleIncrement(e, color, "decrement")}
							className="text-white w-full font-bold bg-black p-2 rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300 ease-ease-out-expo"
							aria-label="Decrease quantity"
						>
							<Minus />

						</Button>

						<Input
							disabled={isLoading}
							type="number"
							value={selectedColorArray.find((c) => c.id === color.id)?.quantity || 0}
							onChange={(e) => handleChangeQuantity(e, color)}
							className="w-full h-full text-center border-2 rounded-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
							min="1"
						/>
						

						<Button
							disabled={isLoading}
							onClick={(e) => handleIncrement(e, color, "increment")}
							className="text-white w-full font-bold bg-black p-2 rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300 ease-ease-out-expo"
							aria-label="Increase quantity"
						>
							<Plus />
						</Button>
					</div>

						{/* Image Upload Section */}
						{editingMode && selectedColorArray.find((s) => s.id === color.id)?.quantity > 0 && (
							<Fragment>
							<span className="font-normal text-gray-500">Add Images For Color</span>
								<FileUploadComponent
									maxFiles={8}
									tag={color.id}
									sizeTag={sizeTag}
									onSetImageUrls={(e) => {
										console.log("Image Urls: ", e);
										handelSetImagesByColor(e, color);
									}}
									isLoading={isLoading}
									setIsLoading={setIsLoading}
								/>
							</Fragment>
						)}
					</div>
				</Fragment>
				))}
			</div>

			{/* Add Color Button */}
			<div className="mt-6 flex justify-center items-center space-y-3 flex-col">
				<Button
					disabled={isLoading}
					className="px-6 py-3 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 focus:outline-none"
					onClick={(e) => {
						e.preventDefault();
						setShowMore((prev) => [...prev, { id: optionsArray.length, value: true }]);
						setOptionsArray([
							...optionsArray,
							{ id: optionsArray.length + 1, label: "#ffffff", quantity: 0 },
						]);
					}}
				>
				Add New Color For Size: <span className="text-white font-extrabold">{sizeTitle}</span>
				</Button>
			</div>
			</div>

	);
	  
};
export default ColorPresetSelector;
