import React, { Fragment, useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import axios from "axios";
import { BASE_API_URL } from "../../config";

const Contact = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(null);
  const[sendingFormData,setSendingFormData] = useState(null);
  const alert = useAlert();
  // State for form handling
  const fetchContactUsPageData = async () => {
		try {
			const res = await axios.get(`${BASE_API_URL}/api/common/website/contact-us`);
			console.log("Contact us Page Data ",res?.data?.result);
			setFormData(res?.data?.result || null);
		} catch (error) {
			console.error("Error Fetching About Data: ",error);
			setFormData(null);
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
    // Handle form submission (e.g., send to a server or display a success message)
    alert.info("Message sent! We will get back to you shortly.");
  };
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  useEffect(()=>{
    fetchContactUsPageData();
  },[dispatch])
  console.log("Contact us page loaded: ",sendingFormData);

  return (
    <div className="bg-gray-50 py-16 px-6 lg:px-24">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Get in Touch with ON-U
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We’d love to hear from you! Feel free to contact us with any questions or feedback.
        </p>
      </header>

      {/* Contact Form Section */}
      <section className="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-2xl transition-all hover:scale-105 transform duration-300 ease-in-out">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {formData && formData.formDataForContactUs && formData.formDataForContactUs.length > 0 && formData.formDataForContactUs.map((field,i) => (
              <Fragment key={i}>
                <div>
                  <label
                    htmlFor= {field.fieldName}
                    className="block text-lg font-medium text-gray-700"
                  >
                    {field.fieldName}
                  </label>
                  <input
                    type="text"
                    id= {`${field.fieldName}_field ${i}`}
                    name={field.fieldName}
                    value={sendingFormData[field.fieldName]}
                    onChange={(e)=>{
                      handleChange({name: field.fieldName, value:e.target.value})
                    }}
                    className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
              </Fragment>
            ))}

            {/* <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={sendingFormData?.email}
                onChange={handleChange}
                required
                className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div> */}

            {/* <div>
              <label
                htmlFor="phoneNumber"
                className="block text-lg font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"  // Corrected input type
                id="phoneNumber"
                name="phoneNumber"
                value={sendingFormData?.phoneNumber}
                onChange={handleChange}
                required
                className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div> */}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-lg font-medium text-gray-700"
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={sendingFormData?.message}
              onChange={handleChange}
              rows="6"
              required
              className="mt-2 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-gray-600 text-white text-lg font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
            >
              Send Message
            </button>
          </div>
        </form>
      </section>

      {/* Contact Details Section */}
      <section className="mt-16 text-center">
        <h3 className="text-3xl font-semibold text-gray-800 mb-4">
          Our Contact Information
        </h3>
        <p className="mt-4 text-lg text-gray-600">
          You can also reach us through the following contact details:
        </p>
        <div className="mt-8 text-lg text-gray-700 space-y-4">
          <p>
            Email:{" "}
            <span className="text-blue-600 hover:underline">{formData?.email}</span>
          </p>
          <p>
            Phone:{" "}
            <span className="text-blue-600 hover:underline">{formData?.phoneNumber}</span>
          </p>
          <p>
            {formData?.address}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
