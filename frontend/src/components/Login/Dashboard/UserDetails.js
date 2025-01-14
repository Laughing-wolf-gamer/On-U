import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateuser } from "../../../action/useraction";
/* const dispatch = useDispatch();
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
    dispatch(updateuser(editedUser));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user); // Revert to original user data
  };

  useEffect(() => {
    setEditedUser(user);
  }, [user]); */
const UserDetails = ({user}) => {
  const dispatch = useDispatch();
  // Initial profile data
  /* const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    gender: "Male",
  }); */
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
    <div className="w-full h-full mx-auto bg-white p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Your Profile</h2>
      
      {/* Name */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <label className="font-semibold text-lg">Name:</label>
        {isEditing === "name" ? (
          <input
            type="text"
            className="border px-3 py-2 rounded mt-2 sm:mt-0 w-full sm:w-auto"
            value={tempValue}
            onChange={handleInputChange}
          />
        ) : (
          <span className="text-lg">{editedUser?.name}</span>
        )}
        <button
          className="text-gray-900 ml-2 mt-2 sm:mt-0"
          onClick={() => {
            setIsEditing("name");
            setTempValue(editedUser?.name);
          }}
        >
          Edit
        </button>
      </div>

      {/* Email */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <label className="font-semibold text-lg">Email:</label>
        {isEditing === "email" ? (
          <input
            type="email"
            className="border px-3 py-2 rounded mt-2 sm:mt-0 w-full sm:w-auto"
            value={tempValue}
            onChange={handleInputChange}
          />
        ) : (
          <span className="text-lg flex-wrap">{editedUser?.email}</span>
        )}
        <button
          className="text-gray-900 ml-2 mt-2 sm:mt-0"
          onClick={() => {
            setIsEditing("email");
            setTempValue(editedUser?.email);
          }}
        >
          Edit
        </button>
      </div>

      {/* Phone */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <label className="font-semibold text-lg">Phone:</label>
        {isEditing === "phone" ? (
          <input
            type="text"
            className="border px-3 py-2 rounded mt-2 sm:mt-0 w-full sm:w-auto"
            value={tempValue}
            onChange={handleInputChange}
          />
        ) : (
          <span className="text-lg">{editedUser?.phoneNumber}</span>
        )}
        <button
          className="text-gray-900 ml-2 mt-2 sm:mt-0"
          onClick={() => {
            setIsEditing("phone");
            setTempValue(editedUser?.phoneNumber);
          }}
        >
          Edit
        </button>
      </div>

      {/* Gender */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <label className="font-semibold text-lg">Gender:</label>
        {isEditing === "gender" ? (
          <input
            type="text"
            className="border px-3 py-2 rounded mt-2 sm:mt-0 w-full sm:w-auto"
            value={tempValue}
            onChange={handleInputChange}
          />
        ) : (
          <span className="text-lg">{editedUser?.gender}</span>
        )}
        <button
          className="text-gray-900 ml-2 mt-2 sm:mt-0"
          onClick={() => {
            setIsEditing("gender");
            setTempValue(editedUser?.gender);
          }}
        >
          Edit
        </button>
      </div>

      {/* Edit buttons */}
      {isEditing && (
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-4 sm:space-x-6 sm:space-y-0">
          <button
            className="bg-green-500 text-white px-6 py-3 rounded"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-red-500 text-white px-6 py-3 rounded"
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



/* 


*/