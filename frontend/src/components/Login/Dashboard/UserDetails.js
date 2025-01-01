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
    // You can handle the save logic here (e.g., make an API call to update the user)
    setIsEditing(false);
    console.log('Edited user user:', editedUser);
    dispatch(updateuser(editedUser))
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user); // Revert to original user data
  };
  console.log("Saved User:",user);
  useEffect(()=>{
    setEditedUser(user)
  },[user])
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="font-semibold text-2xl text-gray-800 mb-4">User Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Full Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedUser?.name || ''}
              onChange={handleEditChange}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.name || 'Not Available'}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Mobile Number:</label>
          {isEditing ? (
            <input
              type="text"
              name="phonenumber"
              value={editedUser?.phonenumber || ''}
              onChange={handleEditChange}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.phoneNumber || 'Not Available'}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Email ID:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editedUser?.email || ''}
              onChange={handleEditChange}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.email || 'Not Available'}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Gender:</label>
          {isEditing ? (
            <input
              type="text"
              name="gender"
              value={editedUser?.gender || ''}
              onChange={handleEditChange}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.gender || 'Not Set'}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700">Date of Birth:</label>
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={editedUser?.DOB || ''}
              onChange={handleEditChange}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.DOB || 'Not Set'}</p>
          )}
        </div>

        {/* <div>
          <label className="block text-gray-700">Location:</label>
          {isEditing ? (
            <input
              type="text"
              name="citystate"
              value={editedUser?.address?.citystate || ''}
              onChange={(e) => {
                setEditedUser((prevState) => ({
                  ...prevState,
                  address: {
                    ...prevState.address,
                    citystate: e.target.value,
                  },
                }));
              }}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-2 text-gray-600">{editedUser?.address?.citystate || 'Not Set'}</p>
          )}
        </div> */}

        <div className="flex space-x-4 mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
