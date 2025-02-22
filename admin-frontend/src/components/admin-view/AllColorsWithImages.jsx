import { fetchOptionsByType } from '@/store/common-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import FileUploadComponent from './FileUploadComponent';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { useSettingsContext } from '@/Context/SettingsContext';

const AllColorsWithImages = ({OnChangeColorsActive}) => {
	const{checkAndCreateToast} = useSettingsContext();
	const dispatch = useDispatch();
	const [allColors, setAllColors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [colorOptions, setColorOptions] = useState([]);
	const [activeColorSelect, setActiveColorSelect] = useState(null);
	const[rest,setOnReset] = useState(false);

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
	const handelSetActiveColorSelect = (color) => {
		if(activeColorSelect) {
			setActiveColorSelect({...activeColorSelect,id:color.id, label: color.label, name: color.name,images:color.images || []});
		}else{
			setActiveColorSelect({...color,images:[]});
		}
	}
	// Add the selected color to the array
	const updateSelectedColorArray = (e) => {
		e.preventDefault();
		if(isLoading || !activeColorSelect || activeColorSelect?.images?.length === 0){
			checkAndCreateToast("error","Please select an image for the color.");
			return;
		}
		if(activeColorSelect){
			const alreadyPresent = allColors.find((s) => s.id === activeColorSelect?.id);
			if(!alreadyPresent) {
				if(activeColorSelect.images !== null && activeColorSelect.images.length > 0) {

				}
				if(activeColorSelect.images !== null && activeColorSelect.images.length > 0) {
					setAllColors([...allColors, activeColorSelect]);
					setActiveColorSelect(null);
				}
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
	console.log("selectedColorArray: ", activeColorSelect);

	return (
		<div className="p-3 w-full bg-white">
			{/* Total Colors Count */}
			<div className="flex items-center text-center text-xl font-bold justify-center">
				<Badge className={"font-bold text-white text-center text-lg"}>All Colors: {allColors.length}</Badge>
			</div>
			<div className="max-w-[400px] my-4 overflow-x-auto flex flex-row space-x-4">
				{allColors.map((color, index) => {
					const active = color;
					return(
						(
							<div key={index} className="relative min-w-56 h-fit border-2 rounded-md border-black shadow-md">
								<div  className='w-full h-full p-1 py-3 space-y-3'>

									{/* Color Preview */}
									<div className='w-full flex flex-wrap flex-row gap-2'>
										<Badge className='text-sm font-semibold text-center'>Model Image: {active?.images.length}</Badge>
										<Badge className='text-sm font-semibold text-center'>Name: {active?.name}</Badge>
										<Badge className='text-sm font-semibold text-center'>HEX Code: {active?.label}</Badge>
									</div>
									<div
										className="w-full justify-center p-3 flex border border-gray-950 shadow-md items-center h-full rounded-md"
										style={{ backgroundColor: active?.label }}
									></div>
								</div>

								{/* Remove Button */}
								<X
									className="absolute top-0 right-0 p-1 text-white text-xs font-semibold bg-black hover:bg-red-600 px-1 cursor-pointer transition-all duration-200 hover:rounded-lg ease-ease-out-expo hover:scale-105"
									onClick={(e) => {
										e.preventDefault();
										removeColorFromAllColors(active.id)
									}} // Call function to remove color
									aria-label={`Remove color ${active.label}`}
									title={active?.images?.length > 0 ? active?.images?.length : "No Images Uploaded"}
								/>
							</div>
						)
					)
				})}
			</div>
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
					<Select
						value={activeColorSelect?.label}
						onValueChange={(e) => {
							const selectedOption = colorOptions.find(option => option.label === e);
							if (selectedOption) {
								console.log("Color Selected: ", selectedOption);
								handelSetActiveColorSelect(selectedOption);
							} else {
								setActiveColorSelect(null);
							}
						}}
						className="w-full h-full text-black font-semibold bg-transparent m-2 rounded-full focus:ring-2 focus:ring-gray-500 transition-all duration-200 ease-in-out"
					>
						<SelectTrigger className="w-full border rounded-md">
							<SelectValue placeholder = {"Create new Color"}/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">
								<p className='text-black'>None</p>
							</SelectItem>
							{colorOptions.map((option,index) => (
								<SelectItem
									key={option.id || index}
									
									value={option.label}
									style={{
										backgroundColor: option.label, // Set background color to the hex value
									}}
									className="w-full border-2 flex text-black my-2 font-bold font-sans items-center gap-4 p-2 cursor-pointer bg-transparent"
								>
									{option?.name || option?.label}
									
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Image Upload for Selected Color */}
				{activeColorSelect && (
					<div className='w-full justify-between items-center flex flex-col space-y-3'>
						<Label className="font-base text-gray-700">Add Images For Color <Label className='font-medium text-black'>{activeColorSelect?.name || activeColorSelect?.label} <Label className = {"text-red-800 text-lg"}>*</Label></Label> </Label>
						<FileUploadComponent
							onRemovingImages={(index)=>{
								console.log('Removing Images: ', index);
                                setActiveColorSelect({ ...activeColorSelect, images: activeColorSelect.images.filter((_, i) => i!== index) });
							}}
							maxFiles={8}
							tag={activeColorSelect.id}
							sizeTag={'allColors'}
							onSetImageUrls={(files) => {
							console.log('Image Urls: ', files);
								setActiveColorSelect({ ...activeColorSelect, images: files });
							}}
							isLoading={isLoading}
							setIsLoading={setIsLoading}
							onReset={rest}
						/>
					</div>
				)}

				{/* Add Color Button */}
				{activeColorSelect && (
					<div className="mt-6 flex w-full justify-center items-center space-y-3 flex-col">
						<Button
							disabled={isLoading || !activeColorSelect || activeColorSelect?.images?.length === 0}
							className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 focus:outline-none"
							onClick={updateSelectedColorArray}
						>
							Add Color {activeColorSelect?.images?.length > 0? `(${activeColorSelect?.images?.length})` : ""}
						</Button>
					</div>
				)}
				</div>
			</div>
		</div>

	);
};


export default AllColorsWithImages
