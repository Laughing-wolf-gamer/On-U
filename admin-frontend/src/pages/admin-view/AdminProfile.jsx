import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BASE_URL, capitalizeFirstLetterOfEachWord, Header } from '@/config';
import { useSettingsContext } from '@/Context/SettingsContext';
import { checkAuth, resetTokenCredentials, updateUserData } from '@/store/auth-slice';
import axios from 'axios';
import { Edit, EditIcon, LogOut } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ProfileHeader Component
const ProfileHeader = ({ admin }) => {
    return (
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6 mb-8">
            <img
                src={admin?.profilePic}
                alt="admin-Profile"
                className="w-32 h-32 rounded-full border-4 border-primary shadow-lg"
            />
            <div className="text-center md:text-left">
                <h2 className="text-5xl font-semibold text-gray-800">{admin?.name || "Admin"}</h2>
                <p className="text-xl text-gray-500">{capitalizeFirstLetterOfEachWord(admin?.role)}</p>
            </div>
        </div>
    );
};

// ProfileDetails Component
const ProfileDetails = ({ admin }) => {
    return (
        <div className="space-y-8 mt-6">
            <div>
                <h3 className="text-3xl font-semibold text-gray-800">Contact Information</h3>
                <p className="text-xl text-gray-600">Email: {admin?.email}</p>
            </div>

            <div>
                <h3 className="text-3xl font-semibold text-gray-800">Address</h3>
                <p className="text-xl text-gray-600">{admin?.address}</p>
            </div>
        </div>
    );
};

// ProfileActions Component
const ProfileActions = ({ onEdit, onLogout }) => {
    return (
        <div className="mt-10 w-full flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
            <button
                onClick={onEdit}
                className="flex items-center bg-primary text-white py-4 px-8 rounded-lg shadow-lg hover:bg-primary-dark transition-all w-full md:w-auto"
            >
                <EditIcon className="mr-4" /> Edit Profile
            </button>
            <button
                onClick={onLogout}
                className="flex items-center bg-gray-200 text-black py-4 px-8 rounded-lg shadow-lg hover:bg-danger-dark transition-all w-full md:w-auto"
            >
                <LogOut className="mr-4" /> Logout
            </button>
        </div>
    );
};

// EditProfileModal Component
const EditProfileModal = ({  user, onSave }) => {
    const [formData, setFormData] = useState(null);
	const[isLoadingImage,setImageLoading] = useState(false);
	const handleUploadImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append('my_file', file);
            // const token = sessionStorage.getItem('token');
            // console.log(token);
            const res = await axios.post(`${BASE_URL}/admin/upload-image`,formData,Header());
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);  // Save the edited information
    };
	const setRandomImage = ()=>{
		const randomNm = Math.floor(Math.random() * 100 + 1); //
        setFormData({...formData, profilePic: `https://avatar.iran.liara.run/public/${randomNm}`});
	}
	const handleProfilePicChange = async (e) => {
		setImageLoading(true);
		const file = e.target.files[0];
		if (file) {
			const newProfileImage = await handleUploadImage(file);
			if(newProfileImage){
				setFormData({...formData,profilePic: newProfileImage});
				setImageLoading(false);
			}else{
				setImageLoading(false);
			}
		}else{
			setImageLoading(false);
		}
	};
	useEffect(()=>{
		if(user){
			setFormData({
				userId:user._id,
				profilePic:user?.profilePic || '',
				name: user?.name || '',
				email: user?.email || '',
				prevPassword: user?.password || '',
				newPassword: user?.password || '',
			})
		}
	},[user])

	console.log("formData", formData)

    return (
		<DialogContent>
			<DialogTitle className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</DialogTitle>
			<div className="bg-white max-h-fit overflow-y-auto w-full">
				<div className="flex justify-center items-center space-y-2 my-2 flex-col mt-5 mb-6">
					<Button className='rounded-md h-10 px-2' 
						onClick={()=> {
							setRandomImage();
						}}
					>
						Random Avatar
					</Button>
					<div className="relative">
						{
							isLoadingImage ? <div className="w-32 h-32 justify-center flex items-center bg-opacity-40 rounded-full bg-gray-300 border border-gray-300">
								<div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
							</div>:(
								<img
									src={formData?.profilePic} // Fallback to default image if no profile picture
									alt="Profile"
									loading='lazy'
									className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
								/>
							)
						}
						
						<div
							disabled = {isLoadingImage}
							onClick={() => {
								document.getElementById("profile-pic-input").click()
							}}
							className="absolute bottom-0 right-0 bg-gray-500 text-white rounded-full p-2 hover:bg-gray-600 transition"
						>
							<Edit size={16} />
						</div>
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
				<form onSubmit={handleSubmit}>
					<div className="mb-4 space-y-2">
						<Label className="block text-gray-700" htmlFor="name">Name</Label>
						<Input
							type="text"
							id="name"
							name="name"
							value={formData?.name}
							onChange={handleChange}
							className="w-full p-3 border border-gray-300 rounded-lg"
							required
						/>
					</div>
					<div className="mb-4 space-y-2">
						<Label className="block text-gray-700" htmlFor="email">Email</Label>
						<Input
							type="email"
							id="email"
							name="email"
							value={formData?.email}
							onChange={handleChange}
							className="w-full p-3 border border-gray-300 rounded-lg"
							required
						/>
					</div>
					<div className="mb-4 space-y-2">
						<Label className="block text-gray-700" htmlFor="prevPassword">Previous Password</Label>
						<Input
							id="prevPassword"
							name="prevPassword"
							type='password'
							value={formData?.prevPassword}
							onChange={handleChange}
							className="w-full p-3 border border-gray-300 rounded-lg"
						/>
					</div>
					<div className="mb-4 space-y-2">
						<Label className="block text-gray-700" htmlFor="newPassword">New Password</Label>
						<Input
							id="newPassword"
							name="newPassword"
							type='password'
							value={formData?.newPassword}
							onChange={handleChange}
							className="w-full p-3 border border-gray-300 rounded-lg"
						/>
					</div>
					<Button
						type="submit"
						className="px-6 py-2 w-full text-center flex rounded-lg"
					>
						Save
					</Button>
				</form>
			</div>
		</DialogContent>
    );
};

// AdminProfile Component
const AdminProfile = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
	const{checkAndCreateToast} = useSettingsContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEdit = () => {
        setIsModalOpen(true);  // Open the modal when Edit button is clicked
    };

    const handleLogOut = async (e) => {
        e.preventDefault();
        dispatch(resetTokenCredentials());
        sessionStorage.clear();
        navigate('/auth/login');
    };

    const handleSave = async (updatedData) => {
        // Handle the save action (for example, call an API to save the updated data)
		const response =  await dispatch(updateUserData(updatedData))
        console.log("Updated Profile:", response?.payload);
		if(response?.payload?.Success){
			console.log("User Updated Successfully")
			checkAndCreateToast('success',response?.payload?.message || "User Updated Successfully");  // Show a success message after saving the updated data
            setIsModalOpen(false);  // Close the modal after saving
			dispatch(checkAuth());
		}else{
			console.log("Failed to Update User")
			checkAndCreateToast('error',response?.payload?.message || "Failed to Update User"); // Show a
            setIsModalOpen(true);  // Show the modal again if update fails, for example, show an error message or display the updated data in the modal.
		}
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);  // Close the modal
    };

    return (
        <div className="h-screen w-full flex justify-center items-center">
            <div className="w-full h-full p-12 bg-white rounded-3xl border-2 border-gray-200">
                <ProfileHeader admin={user} />
                <ProfileDetails admin={user} />
                <ProfileActions onEdit={handleEdit} onLogout={handleLogOut} />
            </div>
			<Dialog open = {isModalOpen && user !== null} onOpenChange={handleCloseModal}>
				<EditProfileModal
					user={user}
					onSave={handleSave}
				/>
				
			</Dialog>
            
        </div>
    );
};

export default AdminProfile;
