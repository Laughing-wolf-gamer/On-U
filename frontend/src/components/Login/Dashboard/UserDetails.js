import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateuser } from "../../../action/useraction";
import { Calendar, Edit, Mail, MapPin, Phone, User } from "lucide-react";
import { FaMars, FaVenus } from "react-icons/fa";
import { BASE_API_URL, headerConfig } from "../../../config";
import axios from "axios";
import { useSettingsContext } from "../../../Contaxt/SettingsContext";
import Loader from "../../Loader/Loader";

const EditableField = ({
  label,
  name,
  value,
  onChange,
  isEditing,
  setTempValue,
  tempValue,
  Icon
}) => {
	console.log("tempValue:", value);
	return (
		<div className="bg-gray-50 border-2 p-4 w-full rounded-lg">
			<div className="flex justify-start space-x-4 items-center relative overflow-x-auto">
				<Icon className="text-gray-500" size={20} />
				<label className="font-semibold text-lg sm:text-base text-gray-700">{label}:</label>
				{isEditing ? (
					<input
						type={name === "DOB" ? "date" : "text"} // Automatically adjusts input type for dob
						name={name}
						className="border px-3 py-2 rounded-md w-full sm:w-80"
						value={value}
						onChange={onChange}
					/>
				) : (
					<span className="text-lg sm:text-base text-gray-800">
						{label === 'Date of Birth' ? new Date(value).toLocaleDateString() : value}
					</span>
				)}
			</div>
		</div>

	);
};

const UserDetails = ({ user }) => {
	const dispatch = useDispatch();
	const[isLoadingImage,setImageLoading] = useState(false);
	const {checkAndCreateToast} = useSettingsContext();
	const [editedUser, setEditedUser] = useState(null);
	const [isEditingAll, setIsEditingAll] = useState(false); // Flag to toggle editing for all fields
	const [tempValue, setTempValue] = useState(""); // Temporary value for input
	const [profilePic, setProfilePic] = useState(user?.profilePic || ""); // Store Profile Pic URL

	const handleUploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('my_file', file);
            // const token = sessionStorage.getItem('token');
            // console.log(token);
            const res = await axios.post(`${BASE_API_URL}/admin/upload-image`,formData,headerConfig());
            console.log("REsponse",res.data);
			if(res.data?.result){
				return res.data?.result;
			}
            // toast.success("Image uploaded successfully");
            return '';
        } catch (error) {
            console.error('An error occurred while uploading: ',error);
            // Check if the error is a response error (status codes outside 2xx range)
            if (error.response) {
                // The server responded with a status other than 2xx
                console.log('Error Status Code:', error.response.status);
                console.log('Error Data:', error.response.data); // The JSON error message from the server
                console.log('Error Headers:', error.response.headers);
                // toast.error("Error uploading files: " + error.response.data.message);
            } else if (error.request) {
                // The request was made but no response was received
                console.log('No response received:', error.request);
                // toast.error("No response received while uploading files");
            } else {
                // Something happened in setting up the request that triggered an error
                console.log('Error Message:', error.message);
                // toast.error("Error uploading files: ", error.message);
            }
			return '';
        }
        
    }
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedUser((prevState) => ({
			...prevState,
			[name]: value,
		}));
		console.log("Edited User:", editedUser);
	};
	const handleProfilePicChange = async (e) => {
		setImageLoading(true);
		const file = e.target.files[0];
		if (file) {
			const newProfileImage = await handleUploadImage(file);
			console.log("New Profile Pic: ", newProfileImage);
			if(newProfileImage){
				// setProfilePic(newProfileImage);
				await dispatch(updateuser({...editedUser,profilePic:newProfileImage}));
				setProfilePic(newProfileImage);
				setImageLoading(false);
			}else{
				setImageLoading(false);
			}
		}else{
			setImageLoading(false);
		}
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
	console.log("Edited User:", user);
	return (
		<div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg">
			{/* Profile Picture Section */}
			<div className="flex justify-center mb-6">
			<div className="relative">
				{
					isLoadingImage ? <div className="w-32 h-32 justify-center flex items-center bg-opacity-40 rounded-full bg-gray-300 border border-gray-300">
						<div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
					</div>:(
						<img
							src={profilePic || editedUser?.profilePic} // Fallback to default image if no profile picture
							alt="Profile"
							className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
						/>
					)
				}
				
				<button
					disabled = {isLoadingImage}
					onClick={() => document.getElementById("profile-pic-input").click()}
					className="absolute bottom-0 right-0 bg-gray-500 text-white rounded-full p-2 hover:bg-gray-600 transition"
				>
					<Edit size={16} />
				</button>
				<input
					disabled = {isLoadingImage}
					type="file"
					id="profile-pic-input"
					className="hidden"
					accept="image/*"
					onChange={handleProfilePicChange}
				/>
			</div>
		</div>

			{/* Header Section */}
			<div className="text-center mb-6">
				<h2 className="text-3xl sm:text-2xl font-bold text-gray-800">{editedUser?.name}</h2>
				<p className="text-gray-500 text-sm sm:text-base">{editedUser?.email}</p>
			</div>

			{/* "Edit All" Button */}
			{!isEditingAll && (
				<div className="flex justify-end mb-4">
				<button
					className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
					onClick={handleEditAll}
				>
					<Edit />
				</button>
				</div>
			)}

			{/* Editable Fields */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
				<EditableField
					label="Name"
					name="name"
					value={editedUser?.name}
					onChange={handleInputChange}
					isEditing={isEditingAll}
					setTempValue={setTempValue}
					tempValue={tempValue}
					Icon={User}
				/>

				<EditableField
				label="Email"
				name="email"
				value={editedUser?.email}
				onChange={handleInputChange}
				isEditing={isEditingAll}
				setTempValue={setTempValue}
				tempValue={tempValue}
				Icon={Mail}
				/>
			</div>

			<div className="space-y-6 mb-8">
				<EditableField
				label="Phone"
				name="phoneNumber"
				value={editedUser?.phoneNumber}
				onChange={handleInputChange}
				isEditing={isEditingAll}
				setTempValue={setTempValue}
				tempValue={tempValue}
				Icon={Phone}
				/>

				<EditableField
					label="Gender"
					name="gender"
					value={editedUser?.gender}
					onChange={handleInputChange}
					isEditing={isEditingAll}
					setTempValue={setTempValue}
					tempValue={tempValue}
					Icon={editedUser?.gender === "Male" ? FaMars : FaVenus}
				/>
				<EditableField
					label="Country"
					name="country"
					value={"India"}
					onChange={handleInputChange}
					isEditing={isEditingAll}
					setTempValue={setTempValue}
					tempValue={tempValue}
					Icon={MapPin}
				/>

				<EditableField
					label="Date of Birth"
					name="DOB"
					value={editedUser?.DOB}
					onChange={handleInputChange}
					isEditing={isEditingAll}
					setTempValue={setTempValue}
					tempValue={tempValue}
					Icon={Calendar}
				/>
			</div>

			{/* Save and Cancel buttons */}
			{isEditingAll && (
				<div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-x-0 sm:space-x-6">
					<button
						className="bg-black w-full sm:w-[48%] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
						onClick={handleSave}
					>
						Save Changes
					</button>
					<button
						className="bg-white text-black w-full sm:w-[48%] px-6 py-3 rounded-lg border-[1px] hover:border-gray-800 border-gray-600 transition-colors mt-4 sm:mt-0"
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
