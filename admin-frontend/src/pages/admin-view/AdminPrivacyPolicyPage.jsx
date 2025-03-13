import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchFAQSWebstis, fetchPrivacyPolicyWebsite, setPrivacyPolicyWebsite } from "@/store/common-slice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminPrivacyPolicyPage = () => {
	const dispatch = useDispatch();
	const{privacyPolicy} = useSelector(state => state.common);
    const [formData, setFormData] = useState({
        effectiveDate: "",
        introduction: "",
        informationCollect: "",
        usageInfo: "",
        dataSecurity: "",
        sharingInfo: "",
        rights: "",
        cookiesInfo: "",
        thirdPartyLinks: "",
        changesPolicy: "",
        contactInfo: "",
        phoneNumber: "",
        businessAddress: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
			...prevState,
			[name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
		await dispatch(setPrivacyPolicyWebsite(formData))
		toast.success("Your privacy policy has been updated");
        // You can add API calls here to save the data
        console.log("Form Data Submitted:", formData);
    };

    useEffect(() => {
        // Simulate fetching data (for editing purposes)
		dispatch(fetchPrivacyPolicyWebsite());
    }, []);
	useEffect(()=>{
		// Check if privacy policy has been updated and display a notification if so
        if(privacyPolicy){
            // toast.info("Your privacy policy has been updated");
			setFormData(privacyPolicy);
        }
	},[dispatch,privacyPolicy])
	console.log("Fetched Dat: ",privacyPolicy);
    return (
        <div className="w-full mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            Admin Privacy Policy Editor
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8 px-3">
            {/* Effective Date */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="effectiveDate">
                Effective Date
            </Label>
            <Input
                type="date"
                id="effectiveDate"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>

            {/* Introduction */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="introduction">
                Introduction
            </Label>
            <Textarea
                id="introduction"
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="6"
                required
            />
            </div>

            {/* Information We Collect */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="informationCollect">
                Information We Collect
            </Label>
            <Textarea
                id="informationCollect"
                name="informationCollect"
                value={formData.informationCollect}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
            />
            </div>

            {/* How We Use Your Information */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="usageInfo">
                How We Use Your Information
            </Label>
            <Textarea
                id="usageInfo"
                name="usageInfo"
                value={formData.usageInfo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
            />
            </div>

            {/* Data Security */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="dataSecurity">
                Data Security
            </Label>
            <Textarea
                id="dataSecurity"
                name="dataSecurity"
                value={formData.dataSecurity}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
            />
            </div>

            {/* Sharing Your Information */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="sharingInfo">
                Sharing Your Information
            </Label>
            <Textarea
                id="sharingInfo"
                name="sharingInfo"
                value={formData.sharingInfo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
            />
            </div>

            {/* Your Rights */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="rights">
                Your Rights
            </Label>
            <Textarea
                id="rights"
                name="rights"
                value={formData.rights}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
            />
            </div>

            {/* Cookies and Tracking Technologies */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="cookiesInfo">
                Cookies and Tracking Technologies
            </Label>
            <Textarea
                id="cookiesInfo"
                name="cookiesInfo"
                value={formData.cookiesInfo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
            />
            </div>

            {/* Third-Party Links */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="thirdPartyLinks">
                Third-Party Links
            </Label>
            <Textarea
                id="thirdPartyLinks"
                name="thirdPartyLinks"
                value={formData.thirdPartyLinks}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
            />
            </div>

            {/* Changes to This Policy */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="changesPolicy">
                Changes to This Privacy Policy
            </Label>
            <Textarea
                id="changesPolicy"
                name="changesPolicy"
                value={formData.changesPolicy}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
            />
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="contactInfo">
                Contact Information
            </Label>
            <Input
                id="contactInfo"
                name="contactInfo"
				type="email"
                value={formData.contactInfo}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="phoneNumber">
                Phone Number
            </Label>
            <Input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>

            {/* Business Address */}
            <div className="space-y-2">
            <Label className="text-lg font-medium text-gray-800" htmlFor="businessAddress">
                Business Address
            </Label>
            <Input
                type="text"
                id="businessAddress"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                required
            />
            </div>

            {/* Submit Button */}
            <div>
				<Button
					type="submit"
					className="w-full py-3 px-6 text-white text-lg font-semibold rounded-md shadow-sm"
				>
					Save Privacy Policy
				</Button>
            </div>
        </form>
        </div>
    );
};

export default AdminPrivacyPolicyPage;
