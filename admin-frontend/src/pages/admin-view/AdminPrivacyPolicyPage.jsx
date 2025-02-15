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
        /* const fetchedData = {
			effectiveDate: "January 16, 2025",
			introduction: "Welcome to ON-U. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or use our services. By using our services, you agree to the terms of this Privacy Policy.",
			informationCollect: "We collect various types of information, including: Personal Information: When you register or make a purchase, we collect personal details such as your name, email address, shipping address, and payment information. Usage Information: We collect information about your browsing activities, such as your IP address, browser type, and pages visited. Cookies: We use cookies to improve your experience and analyze how our website is used.",
			usageInfo: "We use the information we collect for the following purposes: To process your orders and provide customer support. To personalize your shopping experience. To send you marketing communications (if you have opted in). To improve our website and services. To comply with legal requirements.",
			dataSecurity: "We take reasonable precautions to protect your personal information. We use encryption, secure servers, and other measures to safeguard your data. However, no method of transmission over the internet is 100% secure, so we cannot guarantee the absolute security of your information.",
			sharingInfo: "We may share your information with: Third-party service providers who assist with processing payments, shipping, or marketing. Law enforcement or government authorities if required by law. In the event of a merger, acquisition, or sale of ON-U, your information may be transferred to the new owner.",
			rights: "You have the following rights regarding your personal information: Access and update your personal data. Request deletion of your personal data, subject to certain conditions. Opt-out of marketing communications at any time.",
			cookiesInfo: "We use cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us analyze usage patterns and personalize content. You can control cookies through your browser settings.",
			thirdPartyLinks: "Our website may contain links to third-party websites. These sites have their own privacy policies, and we are not responsible for their content or practices. Please review the privacy policy of any third-party site you visit.",
			changesPolicy: "We may update this Privacy Policy from time to time. When we make changes, we will post the updated policy on this page and update the effective date. Please check this page periodically for updates.",
			contactInfo: "If you have any questions about this Privacy Policy, please contact us at:",
			phoneNumber: "(123) 456-7890",
			businessAddress: "123 ON-U Street, City, Country"
        };

        setFormData(fetchedData); */
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
            <label className="text-lg font-medium text-gray-800" htmlFor="effectiveDate">
                Effective Date
            </label>
            <input
                type="text"
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
            <label className="text-lg font-medium text-gray-800" htmlFor="introduction">
                Introduction
            </label>
            <textarea
                id="introduction"
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
            />
            </div>

            {/* Information We Collect */}
            <div className="space-y-2">
            <label className="text-lg font-medium text-gray-800" htmlFor="informationCollect">
                Information We Collect
            </label>
            <textarea
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
            <label className="text-lg font-medium text-gray-800" htmlFor="usageInfo">
                How We Use Your Information
            </label>
            <textarea
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
            <label className="text-lg font-medium text-gray-800" htmlFor="dataSecurity">
                Data Security
            </label>
            <textarea
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
            <label className="text-lg font-medium text-gray-800" htmlFor="sharingInfo">
                Sharing Your Information
            </label>
            <textarea
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
            <label className="text-lg font-medium text-gray-800" htmlFor="rights">
                Your Rights
            </label>
            <textarea
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
            <label className="text-lg font-medium text-gray-800" htmlFor="cookiesInfo">
                Cookies and Tracking Technologies
            </label>
            <textarea
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
            <label className="text-lg font-medium text-gray-800" htmlFor="thirdPartyLinks">
                Third-Party Links
            </label>
            <textarea
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
            <label className="text-lg font-medium text-gray-800" htmlFor="changesPolicy">
                Changes to This Privacy Policy
            </label>
            <textarea
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
            <label className="text-lg font-medium text-gray-800" htmlFor="contactInfo">
                Contact Information
            </label>
            <input
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
            <label className="text-lg font-medium text-gray-800" htmlFor="phoneNumber">
                Phone Number
            </label>
            <input
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
            <label className="text-lg font-medium text-gray-800" htmlFor="businessAddress">
                Business Address
            </label>
            <input
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
            <button
                type="submit"
                className="w-full py-3 px-6 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
                Save Privacy Policy
            </button>
            </div>
        </form>
        </div>
    );
};

export default AdminPrivacyPolicyPage;
