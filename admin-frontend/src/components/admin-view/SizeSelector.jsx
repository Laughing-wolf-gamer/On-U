import React, { Fragment, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ColorPresetSelector from "@/pages/admin-view/ColorPresetSelector";
import { ChevronDown, ChevronRight, Minus, Plus, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchOptionsByType } from "@/store/common-slice";

const SizeSelector = ({ sizeType, OnChange }) => {
	const [sizeOptions, setSizeOptions] = useState([]);
	const [colorOptions, setColorOptions] = useState([]);
	const [optionsArray, setOptionsArray] = useState([]);
	const [selectedSizeArray, setSelectedSizeArray] = useState([]);
	const [showMore, setShowMore] = useState([]);
	const dispatch = useDispatch();

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
			setColorOptions(colorData?.map((s) => ({ id: s._id, label: s.value })) || []);
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

	const handleAddSize = () => {
		setShowMore((prev) => [...prev, { id: optionsArray.length, value: false }]);
		setOptionsArray([
			...optionsArray,
			{ id: optionsArray.length + 1, label: `New Size`, quantity: 1 },
		]);
	};

	return (
		<div className="p-4 mx-auto w-full bg-gray-100">
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
						<div className="mt-6 flex justify-center">
							<button
								onClick={(e) => toggleShowMore(e,i)}
								className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-600 focus:outline-none"
							>
								{showMore[i]?.value ? <ChevronDown/> : <ChevronRight/>}
							</button>
						</div>

						<div
							className={`mt-6 ${showMore[i]?.value ? "block" : "hidden"} w-full flex flex-col items-center justify-center space-y-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow`}
						>
							<div className="flex w-full items-center justify-between gap-4 relative bg">
								<div
									className={`w-20 h-12 flex items-center justify-center rounded-full transition-transform ${
									selectedSizeArray.find((s) => s.id === size.id)?.quantity > 0
										? 'bg-gray-200 text-white scale-110 shadow-lg'
										: 'bg-gray-200 text-white hover:scale-105'
									}`}
									role="button"
									aria-label={`Select size ${size.label}`}
								>
									<select
									value={size.label}
									onChange={(e) => {
										e.preventDefault();
										changeSizeLabel(size.id, e.target.value);
									}}
									className="w-full h-full text-black outline-1"
									>
									<option value="">Select Size</option>
										{sizeOptions.map((option) => (
											<option key={option.id} value={option.label}>
												{option.label}
											</option>
										))}
									</select>
								</div>

								<button
									onClick={(e) => {
										e.preventDefault();
										setOptionsArray(optionsArray.filter((s) => s.id !== size.id));
									}}
									className="p-2 text-black hover:text-white bg-white rounded-full absolute top-0 right-0 hover:bg-gray-500 focus:outline-none"
									aria-label="Remove size"
								>
									<X className="w-4 h-4" />
								</button>
								</div>

								<span className="text-gray-700 text-sm font-bold">Quantity:</span>
								<div className="flex items-center space-x-2">
								<button
									onClick={(e) => {
										e.preventDefault();
										handleIncrement(size, 'decrement');
									}}
									className="px-3 py-2 text-white bg-gray-400 rounded hover:bg-gray-600 focus:outline-none"
									aria-label="Decrement quantity"
								>
									<Minus />
								</button>
								<input
									type="number"
									value={selectedSizeArray.find((s) => s.id === size.id)?.quantity || 0}
									onChange={(e) => handleChangeQuantity(e, size)}
									className="w-16 text-center text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									min="0"
								/>
								<button
									onClick={(e) => {
										e.preventDefault();
										handleIncrement(size, 'increment');
									}}
									className="px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
									aria-label="Increment quantity"
								>
									<Plus />
								</button>
								</div>

								{selectedSizeArray.length > 0 && (
								<div className="mt-4 w-full">
									<ColorPresetSelector
										sizeTitle={size.label}
										colorOptions={colorOptions}
										sizeTag={size.id}
										OnChange={(e) => handelSetImagesByColor(size, e)}
									/>
								</div>
								)}
								{selectedSizeArray.length === 0 && (
									<Fragment>
										<span>You need to have at least one size quantity to set colors</span>
									</Fragment>
								)}
						
						</div>
					</Fragment>
				))}
			</div>

			<div className="mt-6 flex justify-center">
				<Button
					className="w-full md:w-1/2 bg-black text-white py-2 rounded-lg focus:outline-none"
					onClick={handleAddSize}
				>
					Add Size
				</Button>
			</div>
		</div>
	);
};

export default SizeSelector;
