import React, { useEffect, useState } from 'react';
import { updateuser } from '../../../action/useraction';
import { useDispatch } from 'react-redux';

const UserDetails = ({ user }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    console.log('Edited user:', editedUser);
    dispatch(updateuser(editedUser));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user); // Revert to original user data
  };

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 text-white shadow-xl rounded-lg mt-8 space-y-6">
      <h2 className="font-semibold text-3xl mb-6 text-center text-gray-100">User Details</h2>

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-lg text-gray-300">Full Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedUser?.name || ''}
              onChange={handleEditChange}
              className="mt-2 p-4 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 bg-gray-800 text-white placeholder-gray-500"
              placeholder="Enter your full name"
            />
          ) : (
            <p className="mt-2 text-gray-400">{editedUser?.name || 'Not Available'}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-lg text-gray-300">Mobile Number:</label>
          {isEditing ? (
            <input
              type="text"
              name="phonenumber"
              value={editedUser?.phonenumber || ''}
              onChange={handleEditChange}
              className="mt-2 p-4 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 bg-gray-800 text-white placeholder-gray-500"
              placeholder="Enter your mobile number"
            />
          ) : (
            <p className="mt-2 text-gray-400">{editedUser?.phoneNumber || 'Not Available'}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-lg text-gray-300">Email ID:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editedUser?.email || ''}
              onChange={handleEditChange}
              className="mt-2 p-4 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 bg-gray-800 text-white placeholder-gray-500"
              placeholder="Enter your email"
            />
          ) : (
            <p className="mt-2 text-gray-400">{editedUser?.email || 'Not Available'}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-lg text-gray-300">Gender:</label>
          {isEditing ? (
            <input
              type="text"
              name="gender"
              value={editedUser?.gender || ''}
              onChange={handleEditChange}
              className="mt-2 p-4 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 bg-gray-800 text-white placeholder-gray-500"
              placeholder="Enter your gender"
            />
          ) : (
            <p className="mt-2 text-gray-400">{editedUser?.gender || 'Not Set'}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-lg text-gray-300">Date of Birth:</label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={editedUser?.DOB || ''}
              onChange={handleEditChange}
              className="mt-2 p-4 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 bg-gray-800 text-white placeholder-gray-500"
            />
          ) : (
            <p className="mt-2 text-gray-400">{editedUser?.DOB || 'Not Set'}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-6 mt-6 justify-center">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 transform hover:scale-105"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-8 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 transform hover:scale-105"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
