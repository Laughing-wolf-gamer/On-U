import { capitalizeFirstLetterOfEachWord } from '@/config';
import { resetTokenCredentials } from '@/store/auth-slice';
import { EditIcon, LogOut } from 'lucide-react';
import React, { useState } from 'react';
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
        <div className="mt-10 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
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
const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: user?.address || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);  // Save the edited information
        onClose();  // Close the modal after saving
    };

    if (!isOpen) return null;  // Do not render the modal if it's not open

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            rows="4"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// AdminProfile Component
const AdminProfile = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const handleSave = (updatedData) => {
        // Handle the save action (for example, call an API to save the updated data)
        toast.success("Profile updated successfully");
        console.log("Updated Profile:", updatedData);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);  // Close the modal
    };

    return (
        <div className="h-screen w-full flex justify-center items-center">
            <div className="w-full max-w-4xl p-12 bg-white shadow-xl rounded-3xl border-2 border-gray-200">
                <ProfileHeader admin={user} />
                <ProfileDetails admin={user} />
                <ProfileActions onEdit={handleEdit} onLogout={handleLogOut} />
            </div>

            <EditProfileModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                user={user}
                onSave={handleSave}
            />
        </div>
    );
};

export default AdminProfile;
