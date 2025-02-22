import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editDisclaimerData, fetchWebsiteDisclaimer, removeDisclaimerData, setDisclaimerData } from "@/store/common-slice";
import FileUploadComponent from "./FileUploadComponent";
import { useSettingsContext } from "@/Context/SettingsContext";

const DisclaimerManager = () => {
	const {checkAndCreateToast} = useSettingsContext();
    const [reset, setIsReset] = useState(false);
    const { DisclaimerData } = useSelector(state => state.common);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    // States for creating and editing disclaimers
    const [form, setForm] = useState({
        header: "",
        body: "",
        hoverBody: "",
        iconImage: "",
    });

    const [disclaimers, setDisclaimers] = useState([]);

    // Handle form input changes
    const handleChange = useCallback((e) => {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    }, []);

    // Consolidated success and error handler
    const handleSuccess = (message) => {
        checkAndCreateToast("success",message);
        dispatch(fetchWebsiteDisclaimer());
        setIsReset(true);
        setTimeout(() => setIsReset(false), 400);
    };

    const handleError = (message) => {
        checkAndCreateToast("error",message);
    };

    // Create or update disclaimer
    const handleCreateOrUpdate = async () => {
        try {
            const action = editingId ? editDisclaimerData : setDisclaimerData;
            const payload = editingId 
                ? { disclaimersId: editingId, disclaimers: form }
                : { websiteDisclaimers: form };
            
            const success = await dispatch(action(payload));
            if (success) {
                const actionMessage = editingId ? "Disclaimer edited successfully" : "Disclaimer created successfully";
                handleSuccess(actionMessage);
                setEditingId(null);
                setForm({ header: "", body: "", hoverBody: "", iconImage: "" }); // Reset form
            } else {
                handleError(editingId ? "Failed to edit disclaimer" : "Failed to create Disclaimer");
            }
        } catch (error) {
            handleError("Something went wrong.");
        }
    };

    // Delete disclaimer
    const handleDelete = async (id) => {
        try {
            const success = await dispatch(removeDisclaimerData({ disclaimersId: id }));
            if (success) {
                handleSuccess("Disclaimer deleted successfully");
            } else {
                handleError("Failed to delete disclaimer");
            }
        } catch (error) {
            handleError("Something went wrong.");
        }
    };

    // Edit disclaimer
    const handleEdit = (id) => {
        setEditingId(id);
        const disclaimerToEdit = disclaimers.find((disclaimer) => disclaimer._id === id);
        setForm(disclaimerToEdit);
    };

    // Fetch disclaimers on initial render or when `DisclaimerData` changes
    useEffect(() => {
        if (DisclaimerData) {
            setDisclaimers(DisclaimerData);
        }
    }, [DisclaimerData]);

    // Fetch disclaimers initially when component mounts
    useEffect(() => {
        dispatch(fetchWebsiteDisclaimer());
    }, [dispatch]);

    return (
        <div className="w-full justify-center items-center flex flex-col border-b border-gray-800">
            <div className="mb-4">
                <h1 className="text-2xl font-semibold">Manage Disclaimers</h1>
            </div>
            <div className="space-y-4 w-full">
                {/* Disclaimer Form */}
                <div className="space-y-2">
                    <input
                        type="text"
                        name="header"
                        value={form.header}
                        onChange={handleChange}
                        placeholder="Header"
                        className="w-full p-2 border rounded-md"
                    />
                    <textarea
                        name="body"
                        value={form.body}
                        onChange={handleChange}
                        placeholder="Body"
                        className="w-full p-2 border rounded-md"
                    />
                    <textarea
                        name="hoverBody"
                        value={form.hoverBody}
                        onChange={handleChange}
                        placeholder="Hover Body"
                        className="w-full p-2 border rounded-md"
                    />
                    <FileUploadComponent
                        maxFiles={1}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        onSetImageUrls={(file) => setForm({ ...form, iconImage: file[0].url })}
                        tag={"iconImageUpload"}
                        sizeTag={"newIcons"}
                        onReset={reset}
                    />
                    <button
                        onClick={handleCreateOrUpdate}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        {editingId ? "Edit Disclaimer" : "Add Disclaimer"}
                    </button>
                </div>

                {/* Disclaimer List */}
                <div className="space-y-4 mt-6">
                    {disclaimers?.length > 0 ? (
                        disclaimers.map((disclaimer) => (
                            <div
                                key={disclaimer._id}
                                className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={disclaimer.iconImage}
                                        alt="icon"
                                        className="w-8 h-8 mr-4 rounded-lg"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{disclaimer.header}</h3>
                                        <p>{disclaimer.body}</p>
                                        <div className="hover:hidden">{disclaimer.hoverBody}</div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(disclaimer._id)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(disclaimer._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No disclaimers available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DisclaimerManager;
