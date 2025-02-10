import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateuser } from "../../../action/useraction";
import { FaPen } from "react-icons/fa"; // Import the React Icon for editing
import { Edit } from "lucide-react";

const EditableField = ({
  label,
  name,
  value,
  onChange,
  isEditing,
  setTempValue,
  tempValue
}) => {
	return (
		<div className="bg-gray-50 border-2 p-4 rounded-lg">
		<div className="flex justify-start space-x-4 items-center relative">
			<label className="font-semibold text-lg text-gray-700">{label}:</label>
			{isEditing ? (
			<input
				type={name === "dob" ? "date" : "text"} // Automatically adjusts input type for dob
				name={name}
				className="border px-3 py-2 rounded-md w-full sm:w-80"
				value={tempValue}
				onChange={onChange}
			/>
			) : (
			<span className="text-lg text-gray-800">{value}</span>
			)}
		</div>
		</div>
	);
};

const UserDetails = ({ user }) => {
	const dispatch = useDispatch();
	const [editedUser, setEditedUser] = useState(null);
	const [isEditingAll, setIsEditingAll] = useState(false); // Flag to toggle editing for all fields
	const [tempValue, setTempValue] = useState(""); // Temporary value for input

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedUser((prevState) => ({
		...prevState,
		[name]: value,
		}));
	};

	const handleSave = () => {
		setIsEditingAll(false);
		dispatch(updateuser(editedUser));
	};

	const handleCancel = () => {
		setIsEditingAll(false);
		setEditedUser(user); // Revert to original user data
	};

	const handleEditAll = () => {
		setIsEditingAll(!isEditingAll);
	};

	useEffect(() => {
		setEditedUser(user);
	}, [user]);

	return (
		<div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg">
			{/* Header Section */}
			<div className="text-center mb-6">
				<h2 className="text-3xl font-bold text-gray-800">{editedUser?.name}</h2>
				<p className="text-gray-500">{editedUser?.email}</p>
			</div>

			{/* "Edit All" Button */}
			{!isEditingAll && (
				<div className="flex justify-end mb-4">
				<button
					className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
					onClick={handleEditAll}
				>
					<Edit/>
				</button>
				</div>
			)}

			{/* Editable Fields */}
			<div className="grid grid-cols-2 gap-6 mb-8">
				{/* Name and Email in a 2x2 grid */}
				<EditableField
				label="Name"
				name="name"
				value={editedUser?.name}
				onChange={handleInputChange}
				isEditing={isEditingAll}
				setTempValue={setTempValue}
				tempValue={tempValue}
				/>

				<EditableField
				label="Email"
				name="email"
				value={editedUser?.email}
				onChange={handleInputChange}
				isEditing={isEditingAll}
				setTempValue={setTempValue}
				tempValue={tempValue}
				/>
			</div>

			<div className="space-y-6 mb-8">
				{/* Other fields in a vertical single column */}
				<EditableField
				label="Phone"
				name="phoneNumber"
				value={editedUser?.phoneNumber}
				onChange={handleInputChange}
				isEditing={isEditingAll}
				setTempValue={setTempValue}
				tempValue={tempValue}
				/>

				<EditableField
					label="Gender"
					name="gender"
					value={editedUser?.gender}
					onChange={handleInputChange}
					isEditing={isEditingAll}
					setTempValue={setTempValue}
					tempValue={tempValue}
				/>
				<EditableField
					label="Country"
					name="conuntry"
					value={'IN'}
					onChange={handleInputChange}
					isEditing={isEditingAll}
					setTempValue={setTempValue}
					tempValue={tempValue}
				/>

				<EditableField
					label="Date of Birth"
					name="dob"
					value={editedUser?.dob}
					onChange={handleInputChange}
					isEditing={isEditingAll}
					setTempValue={setTempValue}
					tempValue={tempValue}
				/>
			</div>

			{/* Save and Cancel buttons */}
			{isEditingAll && (
				<div className="mt-6 flex justify-center items-center space-x-6">
				<button
					className="bg-black w-[50%] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
					onClick={handleSave}
				>
					Save Changes
				</button>
				<button
					className="bg-white text-black w-[50%] px-6 py-3 rounded-lg border-[1px] hover:border-gray-800 border-gray-600 transition-colors"
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
