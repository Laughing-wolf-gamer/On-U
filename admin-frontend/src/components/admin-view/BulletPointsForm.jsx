import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dot, Plus, XIcon } from "lucide-react";

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
		const filletedData = bulletPoints.filter(b => b.header !== '' && b.body !== "");
		if (onChange) {
		onChange(filletedData);
		}
	};

	return (
		<form className="w-full h-auto justify-start items-center flex flex-col gap-y-9">
			{bulletPoints && bulletPoints.length > 0 && bulletPoints.map((point, index) => (
				<div key={index} style={{ marginBottom: "10px" }} className="justify-center items-center grid grid-cols-2 gap-2 relative border border-gray-700">
					<div className="justify-center items-center max-w-full p-2 h-auto">
						<div className="flex gap-5 flex-col justify-between items-start">
							<span className="text-center font-bold">
								Header:
								{point?.header === "" && (
									<Label className="text-red-500 text-xl">*</Label> // Display star if header is empty
								)}
							</span>
							<div className="flex items-center space-x-2">
								<Textarea
									type="text"
									rows="5"
									value={point?.header}
									onChange={(e) =>
										handleInputChange(index, "header", e.target.value)
									}
									placeholder="Enter header"
									required
									className="border focus:border-gray-900 border-black p-2 rounded-md"
								/>
							</div>
						</div>
					</div>
					<div className="justify-center items-center max-w-full h-auto">
						<div className="flex gap-5 flex-col justify-between items-start">
							<span className="text-center font-bold">
								Body:
								{point?.body === "" && (
									<Label className="text-red-500 text-xl">*</Label> // Display star if header is empty
								)}
							</span>
							<Textarea
								value={point?.body}
								onChange={(e) =>
									handleInputChange(index, "body", e.target.value)
								}
								placeholder="Enter body"
								rows="6"
								required
								className="border p-2 focus:border-gray-900 border-black rounded-md"
							/>
						</div>
					</div>
					<Button
						type="button"
						className="w-4 h-5 absolute top-0 right-0 justify-center items-center flex-row flex"
						onClick={() => removeBulletPoint(index)}
					>
						<XIcon />
					</Button>
				</div>
			))}
			<Button
				type="button"
				className="bg-slate-800 font-bold justify-center items-center w-full space-x-8 h-auto p-2"
				onClick={addBulletPoint}
			>
				Add New Bullet Point <Plus strokeWidth={5}/>
			</Button>
		</form>
	);
};


export default BulletPointsForm;
