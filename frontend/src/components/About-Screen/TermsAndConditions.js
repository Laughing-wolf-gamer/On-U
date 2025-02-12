import React, { useEffect, useRef } from 'react';
import Footer from '../Footer/Footer';
import BackToTopButton from '../Home/BackToTopButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTermsAndCondition } from '../../action/common.action';
import Loader from '../Loader/Loader';

const TermsAndConditions = () => {
	const{ termsAndCondition,loading } = useSelector(state => state.TermsAndConditions);
	const dispath = useDispatch();
	useEffect(()=>{
		dispath(fetchTermsAndCondition());
	},[dispath])
	const scrollableDivRef = useRef(null); // Create a ref to access the div element
	useEffect(()=>{
		window.scrollTo(0,0)
	},[])
	console.log("termsAndcondition: ",termsAndCondition);
	return (
		<div ref={scrollableDivRef} className="w-screen h-screen overflow-y-auto justify-start scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300">
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
		{
			!loading ? (
				<div className="bg-white rounded-lg p-8 space-y-8 w-screen mr-4">
					<p className="text-lg text-gray-700 mb-4 text-center">
					<strong>Effective Date:</strong> {termsAndCondition?.effectiveDate}
					</p>
					
					<div className="space-y-8">
					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
						<p className="text-gray-700">
							{termsAndCondition?.acceptanceOfTerms};
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">2. Use of the Website</h2>
						<p className="text-gray-700">
							{termsAndCondition?.useOfWebsite}
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">3. Products and Pricing</h2>
						<p className="text-gray-700">
						{termsAndCondition?.productsAndPricing}
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">4. Orders and Payments</h2>
						<p className="text-gray-700">
							{termsAndCondition?.ordersAndPayments}
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">5. Shipping and Delivery</h2>
						<p className="text-gray-700">
						{termsAndCondition?.shippingAndDelivery}
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">6. Returns and Refunds</h2>
						<p className="text-gray-700">
						{termsAndCondition?.returnsAndRefunds}
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">7. Privacy and Data Protection</h2>
						<p className="text-gray-700">
						{termsAndCondition?.privacyAndDataProtection}
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">8. Intellectual Property</h2>
						<p className="text-gray-700">
							{termsAndCondition?.intellectualProperty}
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">9. Indemnification</h2>
						<p className="text-gray-700">
						{termsAndCondition?.indemnification}
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">10. Governing Law and Dispute Resolution</h2>
						<p className="text-gray-700">
						{termsAndCondition?.governingLawAndDispute}
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">11. Modifications to Terms</h2>
						<p className="text-gray-700">
						{termsAndCondition?.modificationsToTerms}
						</p>
					</section>

					<section>
						<h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">12. Contact Us</h2>
						<p className="text-gray-700">
						For any questions or concerns about these Terms and Conditions, please contact us at:
						</p>
						<ul className="text-gray-700 space-y-2">
						<li>Email: <a href={`mailto:${termsAndCondition?.contactInfo}`} className="text-blue-500">{termsAndCondition?.contactInfo}</a></li>
						<li>Phone: {termsAndCondition?.phoneNumber}</li>
						<li>Address: {termsAndCondition?.businessAddress}</li>
						</ul>
					</section>
					</div>
				</div>
			):<Loader />
		}
		<Footer/>
		<BackToTopButton scrollableDivRef={scrollableDivRef} />
		</div>
	);
};

export default TermsAndConditions;
