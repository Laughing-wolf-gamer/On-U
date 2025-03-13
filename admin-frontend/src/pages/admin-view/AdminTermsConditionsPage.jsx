import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchTermsAndCondition, setTermsAndCondition } from "@/store/common-slice";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const AdminTermsConditionsPage = () => {
	const dispatch = useDispatch();
	const{termsAndCondition} = useSelector(state => state.common);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
		await dispatch(setTermsAndCondition(formData));
		dispatch(fetchTermsAndCondition());
        // Handle form submission logic, for example an API call to save data.
        console.log("Form Data Submitted:", formData);
		toast.success("Your terms and conditions have been updated");
    };

    useEffect(() => {
		dispatch(fetchTermsAndCondition());
    }, []);
	useEffect(()=>{
		if(termsAndCondition){
			setFormData(termsAndCondition)
		}
	},[dispatch,termsAndCondition])
	console.log("Fetched Dat: ",formData);

    return (
        <div className="w-full mx-auto px-6 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                Admin Terms & Conditions Editor
            </h1>
            <form onSubmit={handleSubmit} className="space-y-8">
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

                {/* Acceptance of Terms */}
                <div className="space-y-2">
                <Label className="text-lg font-medium text-gray-800" htmlFor="acceptanceOfTerms">
                    Acceptance of Terms
                </Label>
                <Textarea
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
                <Label className="text-lg font-medium text-gray-800" htmlFor="useOfWebsite">
                    Use of Website
                </Label>
                <Textarea
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
                <Label className="text-lg font-medium text-gray-800" htmlFor="productsAndPricing">
                    Products and Pricing
                </Label>
                <Textarea
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
                <Label className="text-lg font-medium text-gray-800" htmlFor="ordersAndPayments">
                    Orders and Payments
                </Label>
                <Textarea
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
                <Label className="text-lg font-medium text-gray-800" htmlFor="shippingAndDelivery">
                    Shipping and Delivery
                </Label>
                <Textarea
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
                <Label className="text-lg font-medium text-gray-800" htmlFor="returnsAndRefunds">
                    Returns and Refunds
                </Label>
                <Textarea
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
                <Label className="text-lg font-medium text-gray-800" htmlFor="privacyAndDataProtection">
                    Privacy and Data Protection
                </Label>
                <Textarea
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
                <Label className="text-lg font-medium text-gray-800" htmlFor="intellectualProperty">
                    Intellectual Property
                </Label>
                <Textarea
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
                <Label className="text-lg font-medium text-gray-800" htmlFor="indemnification">
                    Indemnification
                </Label>
                <Textarea
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
                <Label className="text-lg font-medium text-gray-800" htmlFor="governingLawAndDispute">
                    Governing Law and Dispute Resolution
                </Label>
                <Textarea
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
                <Label className="text-lg font-medium text-gray-800" htmlFor="modificationsToTerms">
                    Modifications to Terms
                </Label>
                <Textarea
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
                    rows="4"
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
						className="w-full py-6 px-6 text-white text-lg font-semibold rounded-md shadow-sm"
					>
						Save Terms and Conditions
					</Button>
                </div>
            </form>
        </div>
    );
};

export default AdminTermsConditionsPage;
