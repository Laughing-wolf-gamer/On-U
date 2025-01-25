import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateuser } from "../../../action/useraction";
const UserDetails = ({user}) => {
  const dispatch = useDispatch();
  const [editedUser, setEditedUser] = useState(null);

  // State for editing
  const [isEditing, setIsEditing] = useState(null); // Store which field is being edited
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
  const handleSave = (e) => {
    setIsEditing(false);
    dispatch(updateuser(editedUser));
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user); // Revert to original user data
  };
  useEffect(() => {
    setEditedUser(user);
  }, [user]);
  console.log("User has been updated: ",user);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Your Profile</h2>
  
      {/* Name */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <label className="font-semibold text-lg text-gray-700">Name:</label>
          {isEditing === "name" ? (
            <input
              type="text"
              className="border px-3 py-2 rounded-md mt-2 sm:mt-0 w-full sm:w-72"
              value={tempValue}
              onChange={handleInputChange}
            />
          ) : (
            <span className="text-lg text-gray-800">{editedUser?.name}</span>
          )}
          <button
            className="text-blue-600 ml-2 mt-2 sm:mt-0 hover:underline"
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
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <label className="font-semibold text-lg text-gray-700">Email:</label>
          {isEditing === "email" ? (
            <input
              type="email"
              className="border px-3 py-2 rounded-md mt-2 sm:mt-0 w-full sm:w-72"
              value={tempValue}
              onChange={handleInputChange}
            />
          ) : (
            <span className="text-lg text-gray-800">{editedUser?.email}</span>
          )}
          <button
            className="text-blue-600 ml-2 mt-2 sm:mt-0 hover:underline"
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
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <label className="font-semibold text-lg text-gray-700">Phone:</label>
          {isEditing === "phone" ? (
            <input
              type="text"
              className="border px-3 py-2 rounded-md mt-2 sm:mt-0 w-full sm:w-72"
              value={tempValue}
              onChange={handleInputChange}
            />
          ) : (
            <span className="text-lg text-gray-800">{editedUser?.phoneNumber}</span>
          )}
          <button
            className="text-blue-600 ml-2 mt-2 sm:mt-0 hover:underline"
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
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <label className="font-semibold text-lg text-gray-700">Gender:</label>
          {isEditing === "gender" ? (
            <input
              type="text"
              className="border px-3 py-2 rounded-md mt-2 sm:mt-0 w-full sm:w-72"
              value={tempValue}
              onChange={handleInputChange}
            />
          ) : (
            <span className="text-lg text-gray-800">{editedUser?.gender}</span>
          )}
          <button
            className="text-blue-600 ml-2 mt-2 sm:mt-0 hover:underline"
            onClick={() => {
              setIsEditing("gender");
              setTempValue(editedUser?.gender);
            }}
          >
            Edit
          </button>
        </div>
      </div>
  
      {/* Edit buttons */}
      {isEditing && (
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-4 sm:space-x-6 sm:space-y-0">
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            onClick={handleSave}
          >
            Save
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
