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
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-xl rounded-lg mt-8 space-y-6">
      <h2 className="font-semibold text-3xl text-gray-800 mb-6">User Details</h2>

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-lg text-gray-700">Full Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedUser?.name || ''}
              onChange={handleEditChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.name || 'Not Available'}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-lg text-gray-700">Mobile Number:</label>
          {isEditing ? (
            <input
              type="text"
              name="phonenumber"
              value={editedUser?.phonenumber || ''}
              onChange={handleEditChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.phoneNumber || 'Not Available'}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-lg text-gray-700">Email ID:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editedUser?.email || ''}
              onChange={handleEditChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.email || 'Not Available'}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-lg text-gray-700">Gender:</label>
          {isEditing ? (
            <input
              type="text"
              name="gender"
              value={editedUser?.gender || ''}
              onChange={handleEditChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.gender || 'Not Set'}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-lg text-gray-700">Date of Birth:</label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={editedUser?.DOB || ''}
              onChange={handleEditChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.DOB || 'Not Set'}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-6 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
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
