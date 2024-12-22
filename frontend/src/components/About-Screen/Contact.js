import React, { useState } from "react";

const Contact = () => {
  // State for form handling
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send to a server or display a success message)
    alert("Message sent! We will get back to you shortly.");
    setFormData({ name: "", email: "", message: "" }); // Reset the form
  };

  return (
    <div className="bg-gray-50 py-12 px-6 lg:px-24">
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
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-lg font-medium text-gray-700">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-gray-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </div>
        </form>
      </section>

      {/* Contact Details Section */}
      <section className="mt-16 text-center">
        <h3 className="text-3xl font-semibold text-gray-800">Our Contact Information</h3>
        <p className="mt-4 text-lg text-gray-600">
          You can also reach us through the following contact details:
        </p>
        <div className="mt-8 text-lg text-gray-700 space-y-4">
          <p>Email: <span className="text-blue-600">support@on-u.com</span></p>
          <p>Phone: <span className="text-blue-600">(123) 456-7890</span></p>
          <p>Address: 123 ON-U St., Suite 100, City, Country</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
