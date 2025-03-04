import React, { Fragment, useEffect } from 'react';
import Footer from '../Footer/Footer';

const PrivacyPolicy = () => {
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  return (
    <Fragment>
        <div className="p-6 w-screen">
        <div className="bg-white relative h-32 flex flex-col justify-center items-center rounded-md">
          <img
            src="https://indiater.com/wp-content/uploads/2019/10/free-modern-fashion-cover-banner-design-psd-template.jpg"
            alt="banner"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="bg-black absolute inset-0 opacity-50 flex justify-center items-center">
            <h1 className="text-3xl md:text-3xl font-semibold text-center text-white mb-6">
            Privacy Policy
            </h1>
          </div>
        </div>
        <div className="bg-white rounded-lg p-8 space-y-8 w-screen mr-4">
          <p className="text-lg text-gray-700 mb-4">
            <strong>Effective Date: <span className='text-sm font-mono font-bold'>21/01/2024</span></strong> 
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to ON-U. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or use our services. By using our services, you agree to the terms of this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Information We Collect</h2>
              <p className="text-gray-700">
                We collect various types of information, including:
                <ul className="list-disc pl-6">
                  <li><strong>Personal Information:</strong> When you register or make a purchase, we collect personal details such as your name, email address, shipping address, and payment information.</li>
                  <li><strong>Usage Information:</strong> We collect information about your browsing activities, such as your IP address, browser type, and pages visited.</li>
                  <li><strong>Cookies:</strong> We use cookies to improve your experience and analyze how our website is used.</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">3. How We Use Your Information</h2>
              <p className="text-gray-700">
                We use the information we collect for the following purposes:
                <ul className="list-disc pl-6">
                  <li>To process your orders and provide customer support.</li>
                  <li>To personalize your shopping experience.</li>
                  <li>To send you marketing communications (if you have opted in).</li>
                  <li>To improve our website and services.</li>
                  <li>To comply with legal requirements.</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Data Security</h2>
              <p className="text-gray-700">
                We take reasonable precautions to protect your personal information. We use encryption, secure servers, and other measures to safeguard your data. However, no method of transmission over the internet is 100% secure, so we cannot guarantee the absolute security of your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Sharing Your Information</h2>
              <p className="text-gray-700">
                We may share your information with:
                <ul className="list-disc pl-6">
                  <li>Third-party service providers who assist with processing payments, shipping, or marketing.</li>
                  <li>Law enforcement or government authorities if required by law.</li>
                  <li>In the event of a merger, acquisition, or sale of ON-U, your information may be transferred to the new owner.</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Your Rights</h2>
              <p className="text-gray-700">
                You have the following rights regarding your personal information:
                <ul className="list-disc pl-6">
                  <li>Access and update your personal data.</li>
                  <li>Request deletion of your personal data, subject to certain conditions.</li>
                  <li>Opt-out of marketing communications at any time.</li>
                </ul>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700">
                We use cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us analyze usage patterns and personalize content. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">8. Third-Party Links</h2>
              <p className="text-gray-700">
                Our website may contain links to third-party websites. These sites have their own privacy policies, and we are not responsible for their content or practices. Please review the privacy policy of any third-party site you visit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. When we make changes, we will post the updated policy on this page and update the effective date. Please check this page periodically for updates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">10. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="text-gray-700">
                <li>Email: <a href="mailto:support@on-u.com" className="text-blue-500">support@on-u.com</a></li>
                <li>Phone: +91-1234567890</li>
                <li>Address: dummy lane, dummy street, newyork, USA</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer/>
    </Fragment>
  );
};

export default PrivacyPolicy;
