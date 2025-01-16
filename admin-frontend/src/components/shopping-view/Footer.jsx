import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">Company Name</h3>
          <p className="text-sm text-gray-400">
            Your company's mission statement or a brief description goes here. Keep it concise and clear.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-300">
            {["Home", "About Us", "Services", "Contact"].map((link, index) => (
              <li key={index}>
                <a href="#" className="hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-bold mb-4">Resources</h4>
          <ul className="space-y-2 text-gray-300">
            {["Blog", "FAQ", "Support", "Terms & Conditions"].map((resource, index) => (
              <li key={index} className="hover:underline">
                {resource}
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-bold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            {[
              { name: "Facebook", path: "M22.5 0h-21a1.5 1.5 ..." },
              { name: "Instagram", path: "M12 0a12 12 0 10 ..." },
              { name: "Twitter", path: "M23.953 4.57a10.004 ..." },
            ].map((social, index) => (
              <a key={index} href="#" className="text-gray-400 hover:text-gray-200">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Company Name. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
