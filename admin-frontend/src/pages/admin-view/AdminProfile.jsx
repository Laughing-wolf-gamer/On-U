import { capitalizeFirstLetterOfEachWord } from '@/config';
import { EditIcon, LogOut } from 'lucide-react';
import React from 'react';

// ProfileHeader Component
const ProfileHeader = ({ admin }) => {
    return (
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <img
                src={admin?.profilePicture}
                alt="admin-Profile"
                className="w-24 h-24 rounded-full border-4 border-gray-300"
            />
            <div>
                <h2 className="text-3xl font-semibold text-gray-800">{admin?.name || "Admin"}</h2>
                <p className="text-gray-600">{capitalizeFirstLetterOfEachWord(admin?.role)}</p>
            </div>
        </div>
    );
};

// ProfileDetails Component
const ProfileDetails = ({ admin }) => {
    return (
        <div className="space-y-4 mt-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
                <p className="text-gray-600">Email: {admin?.email}</p>
                <p className="text-gray-600">Phone: {admin?.phone}</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800">Address</h3>
                <p className="text-gray-600">{admin?.address}</p>
            </div>
        </div>
    );
};

// ProfileActions Component
const ProfileActions = ({ onEdit, onLogout }) => {
    return (
        <div className="mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <button
                onClick={onEdit}
                className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full md:w-auto"
            >
                <EditIcon className="mr-2" /> Edit Profile
            </button>
            <button
                onClick={onLogout}
                className="flex items-center bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 w-full md:w-auto"
            >
                <LogOut className="mr-2" /> Logout
            </button>
        </div>
    );
};

// AdminProfile Component
const AdminProfile = ({ user }) => {
    console.log("Profile User: ", user);

    const admin = {
        name: "John Doe",
        role: "Administrator",
        email: "johndoe@example.com",
        phone: "+1 (555) 123-4567",
        address: "1234 Admin Street, Admin City, Admin Country",
        profilePicture: "https://via.placeholder.com/150",
    };

    const handleEdit = () => {
        // Handle edit profile action
        alert("Edit Profile Clicked");
    };

    const handleLogout = () => {
        // Handle logout action
        alert("Logout Clicked");
    };

    return (
        <div className="w-full h-full mx-auto p-6 bg-white shadow-lg rounded-lg">
            <ProfileHeader admin={user} />
            <ProfileDetails admin={user} />
            <ProfileActions onEdit={handleEdit} onLogout={handleLogout} />
        </div>
    );
};

export default AdminProfile;
