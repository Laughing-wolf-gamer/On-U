import React, { Fragment, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ColorPresetSelector from "@/pages/admin-view/ColorPresetSelector";
import { ChevronRight, Minus, PencilRuler, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchOptionsByType } from "@/store/common-slice";
import AllColorsWithImages from "./AllColorsWithImages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { useSettingsContext } from "@/Context/SettingsContext";

const SizeSelector = ({ sizeType, OnChange }) => {
	const{checkAndCreateToast} = useSettingsContext();
	const [sizeOptions, setSizeOptions] = useState([]);
	const [colorOptions, setColorOptions] = useState([]);
	const [optionsArray, setOptionsArray] = useState([]);
	const [selectedSizeArray, setSelectedSizeArray] = useState([]);
	const [showMore, setShowMore] = useState([]);
	const dispatch = useDispatch();
	const[availableColors, setAvailableColors] = useState([]);
	// Handle Increment and Decrement of Quantity
	const handleIncrement = (size, action) => {
		const alreadyPresent = selectedSizeArray.find((s) => s.id === size.id);
		if (action === "increment") {
			if (alreadyPresent === undefined) {
				setSelectedSizeArray((prev) => [...prev, { ...size, quantity: 1 }]);
			} else {
				setSelectedSizeArray((prev) =>
					prev.map((s) =>
						s.id === size.id ? { ...s, quantity: s.quantity + 1 } : s
					)
				);
			}
		} else {
			setSelectedSizeArray((prev) =>
				prev
					.map((s) =>
						s.id === size.id ? { ...s, quantity: s.quantity - 1 } : s
					)
					.filter((s) => s.quantity > 0) // Remove sizes with zero quantity
			);
		}

		if (OnChange) {
			OnChange(selectedSizeArray);
		}
	};

	// Handle Manual Quantity Input
	const handleChangeQuantity = (e, size) => {
		e.preventDefault();
		const value = parseInt(e.target.value, 10);
		if (!isNaN(value) && value >= 0) {
			setSelectedSizeArray((prev) =>
				prev.map((s) =>
					s.id === size.id ? { ...s, quantity: value } : s
				)
			);
		} else {
			setSelectedSizeArray((prev) =>
				prev.map((s) =>
					s.id === size.id ? { ...s, quantity: 0 } : s
				)
			);
		}
		if (OnChange) {
			OnChange(selectedSizeArray);
		}
	};

	const changeSizeLabel = (id, label) => {
		if(label === 'none'){
			checkAndCreateToast("error",`Please select a Valid Size, Which Is Not = ${label}`)
			return;
		}
		setOptionsArray((prev) =>
			prev.map((s) => (s.id === id ? { ...s, label: label } : s))
		);
		setSelectedSizeArray((prev) =>
			prev.map((s) => (s.id === id ? { ...s, label: label } : s))
		);
	};

	const handelSetImagesByColor = (size, colorsArray) => {
		setSelectedSizeArray((prev) =>
			prev.map((s) =>
				s.id === size.id ? { ...s, colors: colorsArray } : s
			)
		);
	};

	// Effect to sync selected sizes with options
	useEffect(() => {
		if (selectedSizeArray.length > 0) {
			if (optionsArray.length === 0) {
				setSelectedSizeArray([]);
			} else {
				for (const item of selectedSizeArray) {
					const isInOptions = optionsArray.find((s) => s.id === item.id);
					if (!isInOptions) {
						setSelectedSizeArray((prev) =>
							prev.filter((s) => s.id !== item.id)
						);
					}
				}
			}
		}
		if (OnChange) {
			OnChange(selectedSizeArray);
		}
	}, [selectedSizeArray, setSelectedSizeArray, optionsArray]);

	const fetchSizeOptions = async () => {
		try {
			console.log("Fetching Size Options: ", sizeType);
			const data = await dispatch(fetchOptionsByType(sizeType));
			const sizeData = data.payload?.result;
			setSizeOptions(sizeData?.map((s) => ({ id: s.value.toLowerCase(), label: s.value })) || []);
		} catch (error) {
			console.error("Error Fetching Size Options: ", error);
		}
	};

	const fetchColorOptions = async () => {
		try {
			const data = await dispatch(fetchOptionsByType("color"));
			const colorData = data.payload?.result;
			setColorOptions(colorData?.map((s) => ({ id: s._id, label: s.value,name:s.name })) || []);
		} catch (error) {
			console.error("Error Fetching Size Options: ", error);
		}
	};

	useEffect(() => {
		if (sizeType) {
			fetchSizeOptions();
			fetchColorOptions();
		}
	}, [dispatch, sizeType]);

	// Toggle the "Show More" for a specific index
	const toggleShowMore = (e,index) => {
		e.preventDefault();
		setShowMore((prev) =>
			prev.map((item, idx) =>
				idx === index ? { ...item, value: !item.value } : item
			)
		);
	};

	const handleAddSize = (e) => {
		e.preventDefault();
		setShowMore((prev) => [...prev, { id: optionsArray.length, value: false }]);
		setOptionsArray([
		...optionsArray,
			{ id: optionsArray.length + 1, label: `New Size`, quantity: 1 },
		]);
	};
	// console.log("Availbale Options Array: ", availableColors);
	// console.log("All Options Array: ", colorOptions);
	return (
		<div className="p-4 mx-auto w-full bg-gray-100">
			<AllColorsWithImages
				OnChangeColorsActive={(changedFiles)=>{
					setAvailableColors(changedFiles);
				}}
			/>
			<h2 className="mb-4 text-lg font-bold text-gray-700">Select a Size</h2>
			{selectedSizeArray.length > 0 && (
				<div className="mt-6">
					<p className="text-gray-700 text-sm mb-2">Selected Sizes:</p>
					<div className="flex flex-wrap gap-2">
						{selectedSizeArray.map((size, index) => (
							<div
								key={index}
								className="px-3 py-1 flex items-center justify-center text-sm font-medium text-white bg-black rounded-full"
							>
								<span>{size?.label || size?.id}</span>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="mt-6">
				{optionsArray.map((size, i) => (
					<Fragment key={size.id}>
						<div className="mt-6 flex justify-between w-full items-center">
							<Button
								onClick={(e) => toggleShowMore(e,i)}
								className="text-white bg-black rounded hover:bg-gray-600 focus:outline-none"
							>
								<ChevronRight size={30} className={` transition-all duration-300 ease-ease-out-expo ${showMore[i]?.value ? " rotate-90":""}`}/>
							</Button>
							<Button
								onClick={(e) => {
									e.preventDefault();
									setOptionsArray(optionsArray.filter((s) => s.id !== size.id));
								}}
								className="p-2 text-white hover:text-gray-50 bg-black rounded-full hover:bg-gray-500 focus:outline-none"
								aria-label="Remove size"
							>
								Remove: {size?.label}
							</Button>
						</div>

						<div
							className={`mt-6 ${showMore[i]?.value ? "block" : "hidden"} w-full flex flex-col items-center justify-center space-y-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow`}
						>
							<div className="flex w-full items-center justify-between gap-4 relative bg">
								{/* <div
									className={`w-20 h-12 flex items-center justify-center rounded-full transition-transform ${
									selectedSizeArray.find((s) => s.id === size.id)?.quantity > 0
										? ' scale-110 shadow-lg'
										: ' hover:scale-105'
									}`}
									role="button"
									aria-label={`Select size ${size.label}`}
								>
								</div> */}
								<Select
									value={size.label}
									onValueChange={(value) => {
										// e.preventDefault();
										changeSizeLabel(size.id, value);
									}}
								>
									<SelectTrigger className="w-full border border-gray-300 rounded-md">
										<SelectValue placeholder = {"Select Size"}/>
									</SelectTrigger>
									<SelectContent>
									<SelectItem value = "none">None</SelectItem>
										{sizeOptions.map((option) => (
											<SelectItem key={option.id} value={option.label}>
												<span className="text-black">{option.label}</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								

								
							</div>

							<Label className="text-gray-700 text-sm font-bold">Update ({size?.label}) Quantity:</Label>
							<div className="flex items-center justify-between w-full space-x-2">
								<Button
									onClick={(e) => {
										e.preventDefault();
										handleIncrement(size, 'decrement');
									}}
									className="text-white w-full bg-black p-2 rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300 ease-ease-out-expo"
									aria-label="Decrement quantity"
								>
									<Minus />
								</Button>
								<Input
									type="number"
									value={selectedSizeArray.find((s) => s.id === size.id)?.quantity || 0}
									onChange={(e) => handleChangeQuantity(e, size)}
									className="w-auto text-center text-lg border-2 rounded-lg focus:ring-gray-500 hover:scale-105 transition-all duration-300 ease-ease-out-expo"
									min="0"
								/>
								<Button
									onClick={(e) => {
										e.preventDefault();
										handleIncrement(size, 'increment');
									}}
									className="text-white w-full bg-black p-2 rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300 ease-ease-out-expo"
									aria-label="Increment quantity"
								>
									<Plus />
								</Button>
							</div>

							<div className="w-full">
								<ColorPresetSelector
									sizeTitle={size.label}
									colorOptions={availableColors}
									sizeTag={size.id}
									OnChange={(e) => handelSetImagesByColor(size, e)}
								/>
							</div>
							{selectedSizeArray.length === 0 && (
								<span>You need to have at least one size quantity to set colors</span>
							)}
						
						</div>
					</Fragment>
				))}
			</div>

			<div className="mt-6 flex justify-center">
				<Button
					className="w-full bg-black text-white py-2 rounded-lg focus:outline-none"
					onClick={handleAddSize}
				>
					<PencilRuler />
					Add Size
				</Button>
			</div>
		</div>
	);
};

export default SizeSelector;
