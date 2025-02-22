import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";

const ConfirmDeletePopup = ({ isOpen, onCancel, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
				<Label className = {"text-xs text-gray-600 text-center"}>Note: Once Deleted You Have to Re-Create this Item</Label>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Are you sure you want to delete this item?
                </h3>
                <div className="flex justify-end space-x-4">
                    <Button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeletePopup;
