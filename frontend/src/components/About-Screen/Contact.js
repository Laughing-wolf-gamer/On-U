import React, { useEffect, useRef, useState } from "react";
import Footer from "../Footer/Footer";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_API_URL } from "../../config";
import { useToast } from "../../Contaxt/ToastProvider";
import { useLocationContext } from "../../Contaxt/LocationContext";
import { useSettingsContext } from "../../Contaxt/SettingsContext";
import BackToTopButton from "../Home/BackToTopButton";
import WhatsAppButton from "../Home/WhatsAppButton";
import Loader from "../Loader/Loader";

const Contact = () => {
    const scrollableDivRef = useRef(null); // Create a ref to access the div element
    const dispatch = useDispatch();
    const {checkAndCreateToast} = useSettingsContext();
    const [formData, setFormData] = useState({});
    const[sendingFormData,setSendingFormData] = useState({});
    const [sendingMessage,setSendingMessage] = useState('');
    const[sendingMessageLoading,setSendingMessageLoading] = useState(false);
    // State for form handling
    const fetchContactUsPageData = async () => {
        setSendingMessageLoading(true);
        try {
            const res = await axios.get(`${BASE_API_URL}/api/common/website/contact-us`);
            console.log("Contact us Page Data ",res?.data?.result);
            setFormData(res?.data?.result || null);
			// checkAndCreateToast("success","Contact us page data fetched successfully.");
        } catch (error) {
            console.error("Error Fetching About Data: ",error);
			
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
					setSendingFormData({})
					setSendingMessage('')
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
			setSendingMessage('')
			scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
	useEffect(()=>{
		scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
	},[dispatch])

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
        // Handle form submission (e.g., send to a server or display a success message)
        sendContactQuery();
    };
    useEffect(()=>{
        fetchContactUsPageData();
    },[dispatch])
	// console.log("Conatact Data: ",formData);
    return (
        <div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto justify-start scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
            {sendingMessageLoading ? (
                <Loader/>
            ) : (
                <div className="bg-gray-50 py-16 px-6 max-w-screen-2xl justify-self-center lg:px-24">
        
                {/* Header Section */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
						{formData.header ? formData?.header :"Get in Touch with ON-U"}
                    
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    	{formData.subheader ? formData?.subheader :"We would love to hear from you! Whether it's an inquiry, feedback, or support, reach out to us and we will get back"}
                    </p>
                </header>
				<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3 justify-center items-center">
					{/* Contact Form Section */}
					<section className="w-full bg-white p-8 rounded-lg shadow-lg space-y-8">
						<h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Contact Us</h2>
						
						{formData && formData.formDataForContactUs && formData.formDataForContactUs.length > 0 && (
							<form onSubmit={handleSubmit} className="space-y-8">
								<div className="grid grid-cols-1 gap-8">
									{formData.formDataForContactUs.map((field, i) => (
										<div key={i}>
											<label
												htmlFor={field?.fieldName}
												className="block text-sm font-medium relative text-gray-700"
											>
												{field?.fieldName}
												<span className="absolute top-0 left-30 text-red-600">*</span>
											</label>
											{sendingFormData && (
												<div className="">
													<input
														required
														type="text"
														id={`${field?.fieldName}_field ${i}`}
														name={field?.fieldName.toLowerCase()}
														value={sendingFormData[field?.fieldName]}
														onChange={(e) => handleChange({ name: field?.fieldName, value: e.target.value })}
														className="mt-2 p-4 w-full border-2 border-gray-300 rounded-md focus:outline-none hover:border-black focus:ring-2 focus:ring-blue-500 transition-all duration-300"
													/>
													
												</div>
											)}
										</div>
									))}
								</div>
				
								<div className="relative">
									<label
										htmlFor="message"
										className="block text-sm relative font-medium text-gray-700"
									>
										Your Message
										<span className="absolute top-0 left-30 text-red-600">*</span>
									</label>
									<textarea
										placeholder="Please write your message here..."
										id="message"
										name="message"
										value={sendingMessage}
										onChange={(e) => setSendingMessage(e.target.value)}
										rows="6"
										required
										className="mt-2 p-4 w-full border-2 border-gray-300 hover:border-black placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
									/>
									</div>
					
								<div className="flex justify-center">
									<button
										type="submit"
										className="px-8 py-3 bg-black text-white text-lg font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
									>
										Send Message
									</button>
								</div>
							</form>
						)}
					</section>
			
					{/* Contact Details Section */}
					<section className="text-center min-h-full justify-center items-center border-gray-200 flex flex-col border">
						<h3 className="text-3xl font-semibold text-gray-900 mb-6">Our Contact Information</h3>
						<p className="mt-4 text-lg text-gray-600">
						You can also reach us through the following contact details:
						</p>
						<div className="mt-8 text-lg text-gray-700 space-y-4">
							<p className="text-gray-500">
								Email:{" "}
								<a href={`mailto:${formData?.email}`} className="text-gray-800 hover:underline">
								{formData?.email}
								</a>
							</p>
							<p className="text-gray-500">
								Phone:{" "}
								<a href={`tel:${formData?.phoneNumber}`} className="text-gray-800 hover:underline">
								{formData?.phoneNumber}
								</a>
							</p>
							<p className="text-gray-500">{formData?.address}</p>
						</div>
					</section>
				</div>
        
                {/* Map Section */}
                <section className="mt-16 mb-12">
                    <h3 className="text-3xl font-semibold text-gray-900 text-center mb-6">Find Us Here</h3>
                    <div className="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden shadow-lg">
                    {/* Replace iframe with actual map URL */}
                    <iframe
                        src={formData?.mapUrl || "https://www.google.com/maps/embed?pb=...your_map_link_here..."}
                        width="100%"
                        height="100%"
                        frameBorder="2"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        aria-hidden="false"
                        tabIndex="0"
                    ></iframe>
                    </div>
                </section>
                </div>
            )}
            <Footer />
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef}/>
        </div>
    );
  
};

export default Contact;
