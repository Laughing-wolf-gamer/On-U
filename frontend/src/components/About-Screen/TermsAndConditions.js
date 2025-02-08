import React, { useEffect, useRef } from 'react';
import Footer from '../Footer/Footer';
import BackToTopButton from '../Home/BackToTopButton';

const TermsAndConditions = () => {
  const scrollableDivRef = useRef(null); // Create a ref to access the div element
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  return (
    <div ref={scrollableDivRef} className="w-screen h-screen overflow-y-auto justify-start scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
      <div className="bg-white relative h-32 flex flex-col justify-center items-center rounded-md">
        <img
          src="https://indiater.com/wp-content/uploads/2019/10/free-modern-fashion-cover-banner-design-psd-template.jpg"
          alt="banner"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="bg-black absolute inset-0 opacity-50 flex justify-center items-center">
          <h1 className="text-3xl md:text-2xl font-semibold text-center text-white mb-6">
            Terms & Conditions
          </h1>
        </div>
      </div>
      <div className="bg-white rounded-lg p-8 space-y-8 w-screen mr-4">
        <p className="text-lg text-gray-700 mb-4 text-center">
          <strong>Effective Date:</strong> [Insert Date]
        </p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing or using the ON-U website (the "Site"), you agree to comply with and be bound by these Terms and Conditions, including any future amendments. If you do not agree with any part of these terms, please discontinue using the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">2. Use of the Website</h2>
            <p className="text-gray-700">
              <strong>Eligibility:</strong> You must be at least 18 years old to use the services on ON-U. If you are under 18, you may use the Site only with the consent and involvement of a parent or legal guardian.
            </p>
            <p className="text-gray-700">
              <strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account information.
            </p>
            <p className="text-gray-700">
              <strong>Prohibited Activities:</strong> You agree not to:
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Site for any unlawful purpose.</li>
                <li>Attempt to interfere with the Site’s operation or security.</li>
                <li>Violate any applicable laws.</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">3. Products and Pricing</h2>
            <p className="text-gray-700">
              <strong>Product Descriptions:</strong> ON-U strives to provide accurate descriptions of products, but we do not guarantee that product descriptions, pricing, or availability are free from errors.
            </p>
            <p className="text-gray-700">
              <strong>Pricing:</strong> Prices on the Site may change without notice. All prices listed are in [currency], and applicable taxes or shipping fees will be added at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">4. Orders and Payments</h2>
            <p className="text-gray-700">
              <strong>Order Confirmation:</strong> Once an order is placed, you will receive an email confirmation. This email does not constitute an acceptance of your order.
            </p>
            <p className="text-gray-700">
              <strong>Payment Methods:</strong> We accept various payment methods, including [credit cards, PayPal, etc.].
            </p>
            <p className="text-gray-700">
              <strong>Order Cancellation:</strong> ON-U reserves the right to cancel orders for any reason, including fraud prevention or errors in product availability or pricing.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">5. Shipping and Delivery</h2>
            <p className="text-gray-700">
              <strong>Shipping Rates:</strong> Shipping rates are calculated at checkout based on the delivery address and product weight/size.
            </p>
            <p className="text-gray-700">
              <strong>Delivery Times:</strong> Estimated delivery times are provided but are not guaranteed.
            </p>
            <p className="text-gray-700">
              <strong>Damaged or Lost Items:</strong> In the case of a damaged or lost item, please contact customer service within [timeframe] to report the issue.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">6. Returns and Refunds</h2>
            <p className="text-gray-700">
              <strong>Return Policy:</strong> ON-U accepts returns for most products within [X] days of delivery, provided the item is unused and in its original packaging.
            </p>
            <p className="text-gray-700">
              <strong>Refunds:</strong> Refunds will be processed to the original payment method after the returned product is inspected. Shipping costs are non-refundable.
            </p>
            <p className="text-gray-700">
              <strong>Exempt Items:</strong> Some products may be non-returnable, including but not limited to personalized or perishable items.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">7. Privacy and Data Protection</h2>
            <p className="text-gray-700">
              ON-U respects your privacy and is committed to protecting your personal data. Please refer to our Privacy Policy for details on how we handle your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">8. Intellectual Property</h2>
            <p className="text-gray-700">
              <strong>Ownership:</strong> The content, design, and logos on ON-U are owned by ON-U or its licensors and are protected by copyright and trademark laws.
            </p>
            <p className="text-gray-700">
              <strong>Limited License:</strong> You are granted a limited, non-exclusive, non-transferable license to access and use the Site for personal use, subject to these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">9. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold ON-U, its affiliates, officers, and employees harmless from any claims, losses, liabilities, or expenses arising from your use of the Site or violation of these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">10. Governing Law and Dispute Resolution</h2>
            <p className="text-gray-700">
              <strong>Governing Law:</strong> These Terms and Conditions are governed by the laws of [Jurisdiction].
            </p>
            <p className="text-gray-700">
              <strong>Dispute Resolution:</strong> Any disputes arising under these terms will be resolved through binding arbitration or in the courts of [Jurisdiction], depending on your location.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">11. Modifications to Terms</h2>
            <p className="text-gray-700">
              ON-U reserves the right to update or modify these Terms and Conditions at any time. Any changes will be posted on this page, and the "Effective Date" will be updated accordingly.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">12. Contact Us</h2>
            <p className="text-gray-700">
              For any questions or concerns about these Terms and Conditions, please contact us at:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>Email: <a href="mailto:support@on-u.com" className="text-blue-500">support@on-u.com</a></li>
              <li>Phone: [Insert Phone Number]</li>
              <li>Address: [Insert Business Address]</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer/>
      <BackToTopButton scrollableDivRef={scrollableDivRef} />
    </div>
  );
};

export default TermsAndConditions;
