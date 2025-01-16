import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import { sendContactUsPage } from '@/store/common-slice';

const AdminContactPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // State variables for Contact Us form
  const [header, setHeader] = useState('');
  const [subHeader, setSubHeader] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [formDataForContactUs, setFormData] = useState([]);
  const[newField,setNewField] = useState('');
  // Handle adding a new Team Member
  const handelAddNewField = (e) => {
    if(newField){
      const updatedFormData = [...formDataForContactUs, { fieldName: newField}];
      setFormData(updatedFormData);
    }
  };

  // Handle removing a Team Member
  const handelRemoveField = (fieldName) => {
    setFormData(formDataForContactUs.filter(e => e.fieldName !== fieldName));
  };

  // Handle saving the form data
  const handleSave = async () => {
    console.log({
      header,
      subHeader,
      email,
      phoneNumber,
      address,
      mapLink,
      formData: formDataForContactUs,
    });
    await handleSetContactData();

    alert('Contact Us page details saved successfully!');
  };

  const handleImageUpload = (index, imageUrl) => {
    setFormData((prev) => {
      prev[index].image = imageUrl;
      return prev;
    });
  };

  // Function to send the data to the backend
  const handleSetContactData = async () => {
    await dispatch(sendContactUsPage({
      header,
      subHeader,
      email,
      phoneNumber,
      address,
      mapLink,
      formDataForContactUs,
    }))
    /* await dispatch(sendContactData({
      header,
      subHeader,
      email,
      phoneNumber,
      address,
      mapLink,
      formData,
    })); */
    toast({ title: 'Contact Us Data Saved Successfully' });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin: Contact Us Page Management</h1>

      {/* Header */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Header</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          placeholder="Enter Header"
        />
      </div>

      {/* SubHeader */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">SubHeader</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={subHeader}
          onChange={(e) => setSubHeader(e.target.value)}
          placeholder="Enter SubHeader"
        />
      </div>

      {/* Email */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Contact Email</h2>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Contact Email"
        />
      </div>

      {/* Phone Number */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Phone Number</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter Contact Phone Number"
        />
      </div>

      {/* Address */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Address</h2>
        <textarea
          className="w-full p-2 border rounded h-32"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Contact Address"
        ></textarea>
      </div>

      {/* Map Link */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Map Link</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={mapLink}
          onChange={(e) => setMapLink(e.target.value)}
          placeholder="Enter Google Map Link"
        />
      </div>

      {/* Team Members */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Form Field </h2>
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          value={newField}
          onChange={(e)=> setNewField(e.target.value)}
          placeholder="Form Field Name"
        />
        <button
          className="bg-gray-900 text-white px-6 py-3 rounded"
          onClick={handelAddNewField}
        >
          Add New Field
        </button>
        {formDataForContactUs.map((fieldName, index) => (
          <div key={index} className="mb-4 justify-between items-center flex flex-row">
            <h1>{fieldName.fieldName}</h1>
=            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => handelRemoveField(fieldName.fieldName)}
            >
              Remove Field
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          onClick={handleSave}
        >
          Save Contact Details
        </button>
      </div>
    </div>
  );
};

export default AdminContactPage;
