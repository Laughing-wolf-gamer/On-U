import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Plus, XIcon } from "lucide-react";
import { Label } from "../ui/label";

const BulletPointsForm = ({ onChange,defaultPoinst = [] }) => {
	const [bulletPoints, setBulletPoints] = useState(defaultPoinst);

	const handleInputChange = (index, field, value) => {
		const updatedPoints = [...bulletPoints];
		updatedPoints[index][field] = value;
		setBulletPoints(updatedPoints);
		const filletedData = bulletPoints.filter(b => b.header !== '' && b.body !== "");
		if (onChange) {
			onChange(filletedData);
		}
	};

	const addBulletPoint = () => {
		setBulletPoints([...bulletPoints, { header: "", body: "" }]);
		const filletedData = bulletPoints.filter(b => b.header !== '' && b.body !== "");
		if (onChange) {
			onChange(filletedData);
		}
	};

	const removeBulletPoint = (index) => {
		const updatedPoints = bulletPoints.filter((_, i) => i !== index);
		setBulletPoints(updatedPoints);
		const filletedData = updatedPoints.filter(b => b.header !== '' && b.body !== "");
		if (onChange) {
			onChange(filletedData);
		}
	};

	return (
		<form className="w-full h-auto flex flex-col gap-y-9 items-center px-4 py-8">
			{/* Bullet Points Section */}
			{bulletPoints && bulletPoints.length > 0 && bulletPoints.map((point, index) => (
				<div key={index} className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-300 rounded-lg shadow-sm">
				<div className="flex flex-col gap-3">
					{/* Header Input */}
					<Label className="font-semibold text-lg">Header:
						{point?.header === "" && (
							<Label className="text-red-500 text-xl ml-1">*</Label> // Star for missing header
						)}
					</Label>
					<Textarea
						type="text"
						rows="5"
						value={point?.header}
						onChange={(e) => handleInputChange(index, "header", e.target.value)}
						placeholder="Enter header"
						required
						className="border-2 border-gray-400 focus:border-gray-900 p-3 rounded-md"
					/>
				</div>

				<div className="flex flex-col gap-3">
					{/* Body Input */}
					<Label className="font-semibold text-lg">Body:
						{point?.body === "" && (
							<span className="text-red-500 text-xl ml-1">*</span> // Star for missing body
						)}
					</Label>
					<Textarea
						value={point?.body}
						onChange={(e) => handleInputChange(index, "body", e.target.value)}
						placeholder="Enter body"
						rows="5"
						required
						className="border-2 border-gray-400 focus:border-gray-900 p-3 rounded-md"
					/>
				</div>

				{/* Remove Button */}
					<Button
						type="button"
						className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
						onClick={() => removeBulletPoint(index)}
					>
						<XIcon className="w-5 h-5" />
					</Button>
				</div>
			))}

			{/* Add New Bullet Point Button */}
			<Button
				type="button"
				className="mt-4 bg-gray-600 font-bold text-white py-3 px-6 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
				onClick={addBulletPoint}
			>
				Add New Bullet Point <Plus className="ml-2" strokeWidth={5} />
			</Button>
		</form>

	);
};


export default BulletPointsForm;
