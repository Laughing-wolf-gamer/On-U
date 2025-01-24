import React, { Fragment, useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_API_URL } from "../../config";
import LoadingOverlay from "../../utils/LoadingOverLay";
import { useToast } from "../../Contaxt/ToastProvider";
import toast from "react-hot-toast";

const Contact = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const[sendingFormData,setSendingFormData] = useState({});
    const [sendingMessage,setSendingMessage] = useState('');
    const[sendingMessageLoading,setSendingMessageLoading] = useState(false);
    const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type,message) => {
        // console.log("check Toast: ",type, message,activeToast);
        if(!activeToast){
            switch(type){
                case "error":
                    toast.error(message)
                    break;
                case "warning":
                    toast.warning(message)
                    break;
                case "info":
                    toast.info(message)
                    break;
                case "success":
                    toast.success(message)
                    break;
                default:
                    toast.info(message)
                    break;
            }
            showToast(message);
        }
    }
    // State for form handling
    const fetchContactUsPageData = async () => {
        setSendingMessageLoading(true);
        try {
            const res = await axios.get(`${BASE_API_URL}/api/common/website/contact-us`);
            console.log("Contact us Page Data ",res?.data?.result);
            setFormData(res?.data?.result || null);
        } catch (error) {
            console.error("Error Fetching About Data: ",error);
            checkAndCreateToast("error","Failed to fetch contact us page data. Please try again later.");
            setFormData({});
        }finally{
            setSendingMessageLoading(false);
        }
    }
    const sendContactQuery = async()=>{
        setSendingMessageLoading(true);
        try {
            const res = await axios.post(`${BASE_API_URL}/api/common/website/send-contact-query`,{contactDetails:sendingFormData,message:sendingMessage});
            console.log("Success: ",res.data);
            if(res){
                if(res.data.Success){
                    checkAndCreateToast("success","Message sent! We will get back to you shortly.");
                }
            }else{
                checkAndCreateToast("error","Failed to send message. Please try again later.");
            }
        } catch (error) {
            console.error("Error Sending Contact Query: ",error);
            checkAndCreateToast("error","Failed to send message. Please try again later.");
        }finally{
            setSendingMessageLoading(false);
            setSendingFormData({});
        }
    }

    const handleChange = (data) => {

        const { name, value } = data;
        setSendingFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit Form: ",sendingFormData);
        checkAndCreateToast("success","Message sent! We will get back to you shortly.");
        // Handle form submission (e.g., send to a server or display a success message)
        // alert.info("Message sent! We will get back to you shortly.");
        sendContactQuery();
    };
    useEffect(()=>{
        window.scrollTo(0,0)
    },[])
    useEffect(()=>{
        fetchContactUsPageData();
    },[dispatch])
    console.log("Contact us page loaded: ",sendingFormData);

    return (
        <Fragment>
            {sendingMessageLoading ? (
                <LoadingOverlay isLoading={sendingMessageLoading} />
            ) : (
                <div className="bg-slate-100 py-16 px-6 lg:px-24">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl">
                        Get in Touch with ON-U
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        We’d love to hear from you! Feel free to contact us with any questions or feedback.
                    </p>
                </header>
        
                {/* Map Section */}
                <div className="w-full mx-auto bg-slate-200 p-10 rounded-xl shadow-2xl transition-all">
                    <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
                        Contact Us
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 gap-5 transform transition-all">
                        <div className="w-full h-full justify-center items-center flex hover:scale-110 duration-300 ease-in-out">
                            <iframe
                                title="Location Map"
                                className="w-full h-full rounded-lg"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114084.435365314!2d92.71320744717394!3d26.67604922960301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3744c20b7dfbbb95%3A0x12c7aa98abf85080!2sTezpur%2C%20Assam!5e0!3m2!1sen!2sin!4v1737715098951!5m2!1sen!2sin"
                                allowFullScreen
                            ></iframe>
                        </div>
            
                        {/* Form Section */}
                        <div className="w-full h-full flex justify-center items-center">
                            {formData && formData.formDataForContactUs && formData.formDataForContactUs.length > 0 && (
                                <form onSubmit={handleSubmit} className="space-y-2 w-full">
                                    <div className="flex flex-col justify-start items-start w-full h-fit p-6">
                                        {formData.formDataForContactUs.map((field, i) => (
                                            <div key={i} className="w-full">
                                                <div className="w-full justify-start items-center relative">
                                                    <label
                                                        htmlFor={field?.fieldName}
                                                        className="block text-lg font-medium text-gray-700"
                                                    >
                                                        {field?.fieldName}
                                                        <label className="text-red-600 absolute top-0 left-50">*</label>
                                                    </label>
                                                </div>
                                                {sendingFormData && (
                                                    <input
                                                        required
                                                        type="text"
                                                        id={`${field?.fieldName}_field ${i}`}
                                                        name={field?.fieldName.toLowerCase()}
                                                        value={sendingFormData[field?.fieldName]}
                                                        onChange={(e) => {
                                                            handleChange({
                                                                name: field?.fieldName,
                                                                value: e.target.value,
                                                            });
                                                        }}
                                                        className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                
                                    <div className="w-full px-6">
                                        <div className="w-full justify-start items-center relative">
                                            <label htmlFor="message" className="block text-lg font-medium text-gray-700">
                                                Your Message
                                                <label className="text-red-600 absolute top-0 left-50">*</label>
                                            </label>
                                        </div>
                                        <textarea
                                            placeholder="Please Write Your Message..."
                                            id="message"
                                            name="message"
                                            value={sendingMessage}
                                            onChange={(e) => {
                                                setSendingMessage(e.target.value);
                                            }}
                                            rows="6"
                                            required
                                            className="mt-2 p-4 w-full border border-gray-300 placeholder:text-gray-600 placeholder:font-sans placeholder:font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                        />
                                    </div>
                
                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-black text-gray-200 text-lg font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
        
                {/* Contact Details Section */}
                <section className="mt-16 text-center">
                    <h3 className="text-3xl font-semibold text-slate-100 mb-4">Our Contact Information</h3>
                    <p className="mt-4 text-lg text-gray-100">
                        You can also reach us through the following contact details:
                    </p>
                    <div className="mt-8 text-lg text-gray-700 space-y-4">
                        <p className="text-gray-500">
                            Email:{" "}
                            <span className="text-slate-800 hover:underline">{formData?.email}</span>
                        </p>
                        <p className="text-gray-500">
                            Phone:{" "}
                            <span className="text-slate-800 hover:underline">{formData?.phoneNumber}</span>
                        </p>
                    <p className="text-slate-400">{formData?.address}</p>
                    </div>
                </section>
                </div>
            )}
            <Footer />
        </Fragment>
    );
      
};

export default Contact;
