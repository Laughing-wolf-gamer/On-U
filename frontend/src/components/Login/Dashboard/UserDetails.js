import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateuser } from "../../../action/useraction";

const UserDetails = ({ user }) => {
	const dispatch = useDispatch();
	const [editedUser, setEditedUser] = useState(null);
	const [isEditing, setIsEditing] = useState(null);
	const [tempValue, setTempValue] = useState("");

	// Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedUser((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	// Handle save changes
	const handleSave = () => {
		setIsEditing(false);
		dispatch(updateuser(editedUser));
	};

	// Handle cancel edit
	const handleCancel = () => {
		setIsEditing(false);
		setEditedUser(user); // Revert to original user data
	};

	// Handle profile picture update
	const handleProfilePictureChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setEditedUser((prevState) => ({
				...prevState,
				profilePicture: URL.createObjectURL(file),
			}));
		}
	};

	useEffect(() => {
		setEditedUser(user);
	}, [user]);

	return (
		<div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
		{/* Header Section with Profile Image */}
		<div className="text-center mb-6">
			<h2 className="text-3xl font-bold text-gray-800">{editedUser?.name}</h2>
			<p className="text-gray-500">{editedUser?.email}</p>
		</div>

		{/* Personal Information Section */}
		<div className="space-y-6 mb-8">
			{/* Name */}
			<div className="bg-gray-50 p-4 rounded-lg shadow-sm">
			<div className="flex justify-between items-center">
				<label className="font-semibold text-lg text-gray-700">Name:</label>
				{isEditing === "name" ? (
				<input
					type="text"
					name="name"
					className="border px-3 py-2 rounded-md w-full sm:w-80"
					value={tempValue}
					onChange={handleInputChange}
				/>
				) : (
				<span className="text-lg text-gray-800">{editedUser?.name}</span>
				)}
				<button
				className="text-blue-600 hover:underline"
				onClick={() => {
					setIsEditing("name");
					setTempValue(editedUser?.name);
				}}
				>
				Edit
				</button>
			</div>
			</div>

			{/* Email */}
			<div className="bg-gray-50 p-4 rounded-lg shadow-sm">
			<div className="flex justify-between items-center">
				<label className="font-semibold text-lg text-gray-700">Email:</label>
				{isEditing === "email" ? (
				<input
					type="email"
					name="email"
					className="border px-3 py-2 rounded-md w-full sm:w-80"
					value={tempValue}
					onChange={handleInputChange}
				/>
				) : (
				<span className="text-lg text-gray-800">{editedUser?.email}</span>
				)}
				<button
				className="text-blue-600 hover:underline"
				onClick={() => {
					setIsEditing("email");
					setTempValue(editedUser?.email);
				}}
				>
				Edit
				</button>
			</div>
			</div>

			{/* Phone */}
			<div className="bg-gray-50 p-4 rounded-lg shadow-sm">
			<div className="flex justify-between items-center">
				<label className="font-semibold text-lg text-gray-700">Phone:</label>
				{isEditing === "phone" ? (
				<input
					type="text"
					name="phoneNumber"
					className="border px-3 py-2 rounded-md w-full sm:w-80"
					value={tempValue}
					onChange={handleInputChange}
				/>
				) : (
				<span className="text-lg text-gray-800">{editedUser?.phoneNumber}</span>
				)}
				<button
				className="text-blue-600 hover:underline"
				onClick={() => {
					setIsEditing("phone");
					setTempValue(editedUser?.phoneNumber);
				}}
				>
				Edit
				</button>
			</div>
			</div>

			{/* Gender */}
			<div className="bg-gray-50 p-4 rounded-lg shadow-sm">
			<div className="flex justify-between items-center">
				<label className="font-semibold text-lg text-gray-700">Gender:</label>
				{isEditing === "gender" ? (
				<input
					type="text"
					name="gender"
					className="border px-3 py-2 rounded-md w-full sm:w-80"
					value={tempValue}
					onChange={handleInputChange}
				/>
				) : (
				<span className="text-lg text-gray-800">{editedUser?.gender}</span>
				)}
				<button
				className="text-blue-600 hover:underline"
				onClick={() => {
					setIsEditing("gender");
					setTempValue(editedUser?.gender);
				}}
				>
				Edit
				</button>
			</div>
			</div>
			{/* Date of Birth */}
			<div className="bg-gray-50 p-4 rounded-lg shadow-sm">
			<div className="flex justify-between items-center">
				<label className="font-semibold text-lg text-gray-700">Date of Birth:</label>
				{isEditing === "dob" ? (
				<input
					type="date"
					name="dob"
					className="border px-3 py-2 rounded-md w-full sm:w-80"
					value={tempValue}
					onChange={handleInputChange}
				/>
				) : (
				<span className="text-lg text-gray-800">{editedUser?.dob}</span>
				)}
				<button
				className="text-blue-600 hover:underline"
				onClick={() => {
					setIsEditing("dob");
					setTempValue(editedUser?.dob);
				}}
				>
				Edit
				</button>
			</div>
			</div>
		</div>

		{/* Save and Cancel buttons */}
		{isEditing && (
			<div className="mt-6 flex justify-end space-x-6">
			<button
				className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
				onClick={handleSave}
			>
				Save Changes
			</button>
			<button
				className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
				onClick={handleCancel}
			>
				Cancel
			</button>
			</div>
		)}
		</div>
	);
};

export default UserDetails;
