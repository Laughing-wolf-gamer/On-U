import { sendTermsAndConditions } from "@/store/common-slice";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

const AdminTermsConditionsPage = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        effectiveDate: "",
        acceptanceOfTerms: "",
        useOfWebsite: "",
        productsAndPricing: "",
        ordersAndPayments: "",
        shippingAndDelivery: "",
        returnsAndRefunds: "",
        privacyAndDataProtection: "",
        intellectualProperty: "",
        indemnification: "",
        governingLawAndDispute: "",
        modificationsToTerms: "",
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

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(sendTermsAndConditions(formData));
        // Handle form submission logic, for example an API call to save data.
        console.log("Form Data Submitted:", formData);
    };

    useEffect(() => {
        // Simulate fetching data (for editing purposes)
        const fetchedData = {
            effectiveDate: "January 16, 2025",
            acceptanceOfTerms: "By accessing or using the ON-U website (the 'Site'), you agree to comply with and be bound by these Terms and Conditions, including any future amendments. If you do not agree with any part of these terms, please discontinue using the website.",
            useOfWebsite: "Eligibility: You must be at least 18 years old to use the services on ON-U. If you are under 18, you may use the Site only with the consent and involvement of a parent or legal guardian. Account Responsibility: You are responsible for maintaining the confidentiality of your account information. Prohibited Activities: You agree not to: Use the Site for any unlawful purpose. Attempt to interfere with the Site’s operation or security. Violate any applicable laws.",
            productsAndPricing: "Product Descriptions: ON-U strives to provide accurate descriptions of products, but we do not guarantee that product descriptions, pricing, or availability are free from errors. Pricing: Prices on the Site may change without notice. All prices listed are in [currency], and applicable taxes or shipping fees will be added at checkout.",
            ordersAndPayments: "Order Confirmation: Once an order is placed, you will receive an email confirmation. This email does not constitute an acceptance of your order. Payment Methods: We accept various payment methods, including [credit cards, PayPal, etc.]. Order Cancellation: ON-U reserves the right to cancel orders for any reason, including fraud prevention or errors in product availability or pricing.",
            shippingAndDelivery: "Shipping Rates: Shipping rates are calculated at checkout based on the delivery address and product weight/size. Delivery Times: Estimated delivery times are provided but are not guaranteed. Damaged or Lost Items: In the case of a damaged or lost item, please contact customer service within [timeframe] to report the issue.",
            returnsAndRefunds: "Return Policy: ON-U accepts returns for most products within [X] days of delivery, provided the item is unused and in its original packaging. Refunds: Refunds will be processed to the original payment method after the returned product is inspected. Shipping costs are non-refundable. Exempt Items: Some products may be non-returnable, including but not limited to personalized or perishable items.",
            privacyAndDataProtection: "ON-U respects your privacy and is committed to protecting your personal data. Please refer to our Privacy Policy for details on how we handle your information.",
            intellectualProperty: "Ownership: The content, design, and logos on ON-U are owned by ON-U or its licensors and are protected by copyright and trademark laws. Limited License: You are granted a limited, non-exclusive, non-transferable license to access and use the Site for personal use, subject to these Terms and Conditions.",
            indemnification: "You agree to indemnify and hold ON-U, its affiliates, officers, and employees harmless from any claims, losses, liabilities, or expenses arising from your use of the Site or violation of these Terms and Conditions.",
            governingLawAndDispute: "Governing Law: These Terms and Conditions are governed by the laws of [Jurisdiction]. Dispute Resolution: Any disputes arising under these terms will be resolved through binding arbitration or in the courts of [Jurisdiction], depending on your location.",
            modificationsToTerms: "ON-U reserves the right to update or modify these Terms and Conditions at any time. Any changes will be posted on this page, and the 'Effective Date' will be updated accordingly.",
            contactInfo: "For any questions or concerns about these Terms and Conditions, please contact us at:",
            phoneNumber: "(123) 456-7890",
            businessAddress: "123 ON-U Street, City, Country"
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                Admin Terms & Conditions Editor
            </h1>
            <form onSubmit={handleSubmit} className="space-y-8">
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

                    {/* Acceptance of Terms */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="acceptanceOfTerms">
                        Acceptance of Terms
                    </label>
                    <textarea
                        id="acceptanceOfTerms"
                        name="acceptanceOfTerms"
                        value={formData.acceptanceOfTerms}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                    </div>

                    {/* Use of Website */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="useOfWebsite">
                        Use of Website
                    </label>
                    <textarea
                        id="useOfWebsite"
                        name="useOfWebsite"
                        value={formData.useOfWebsite}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                    </div>

                    {/* Products and Pricing */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="productsAndPricing">
                        Products and Pricing
                    </label>
                    <textarea
                        id="productsAndPricing"
                        name="productsAndPricing"
                        value={formData.productsAndPricing}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                    </div>

                    {/* Orders and Payments */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="ordersAndPayments">
                        Orders and Payments
                    </label>
                    <textarea
                        id="ordersAndPayments"
                        name="ordersAndPayments"
                        value={formData.ordersAndPayments}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                    </div>

                    {/* Shipping and Delivery */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="shippingAndDelivery">
                        Shipping and Delivery
                    </label>
                    <textarea
                        id="shippingAndDelivery"
                        name="shippingAndDelivery"
                        value={formData.shippingAndDelivery}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                    </div>

                    {/* Returns and Refunds */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="returnsAndRefunds">
                        Returns and Refunds
                    </label>
                    <textarea
                        id="returnsAndRefunds"
                        name="returnsAndRefunds"
                        value={formData.returnsAndRefunds}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                    </div>

                    {/* Privacy and Data Protection */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="privacyAndDataProtection">
                        Privacy and Data Protection
                    </label>
                    <textarea
                        id="privacyAndDataProtection"
                        name="privacyAndDataProtection"
                        value={formData.privacyAndDataProtection}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                    </div>

                    {/* Intellectual Property */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="intellectualProperty">
                        Intellectual Property
                    </label>
                    <textarea
                        id="intellectualProperty"
                        name="intellectualProperty"
                        value={formData.intellectualProperty}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                    </div>

                    {/* Indemnification */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="indemnification">
                        Indemnification
                    </label>
                    <textarea
                        id="indemnification"
                        name="indemnification"
                        value={formData.indemnification}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                    </div>

                    {/* Governing Law and Dispute */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="governingLawAndDispute">
                        Governing Law and Dispute Resolution
                    </label>
                    <textarea
                        id="governingLawAndDispute"
                        name="governingLawAndDispute"
                        value={formData.governingLawAndDispute}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                    />
                    </div>

                    {/* Modifications to Terms */}
                    <div className="space-y-2">
                    <label className="text-lg font-medium text-gray-800" htmlFor="modificationsToTerms">
                        Modifications to Terms
                    </label>
                    <textarea
                        id="modificationsToTerms"
                        name="modificationsToTerms"
                        value={formData.modificationsToTerms}
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
                    <textarea
                        id="contactInfo"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                        rows="4"
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
                        Save Terms and Conditions
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminTermsConditionsPage;
