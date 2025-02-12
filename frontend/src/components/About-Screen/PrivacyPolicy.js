import React, { useEffect, useRef } from 'react';
import Footer from '../Footer/Footer';
import BackToTopButton from '../Home/BackToTopButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPrivacyAndPolicy } from '../../action/common.action';
import Loader from '../Loader/Loader';

const PrivacyPolicy = () => {
	const{privacyPolicy,loading} = useSelector(state => state.PrivacyPolicy);
	const dispatch = useDispatch();
	useEffect(()=>{
		dispatch(fetchPrivacyAndPolicy());
	},[])
	const scrollableDivRef = useRef(null); // Create a ref to access the div element
	useEffect(()=>{
		window.scrollTo(0,0)
	},[])
	// console.log("Privacy Policy: ", privacyPolicy);
	return (
		<div ref={scrollableDivRef} className="w-screen h-screen overflow-y-auto justify-start scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300">
		<div className="relative h-32 flex flex-col justify-center items-center rounded-md">
			{/* <img
				src="https://indiater.com/wp-content/uploads/2019/10/free-modern-fashion-cover-banner-design-psd-template.jpg"
				alt="banner"
				className="w-full h-full object-cover rounded-lg"
			/> */}
			<div className="bg-black absolute inset-0 flex justify-center items-center">
				<h1 className="text-3xl sm:text-2xl md:text-4xl font-extrabold text-center text-white">
					Privacy Policy
				</h1>
			</div>
		</div>
		{!loading ? (<div className="bg-white rounded-lg p-8 space-y-8 w-screen mr-4">
			<p className="text-lg text-gray-700 mb-4">
				<strong>Effective Date:</strong> {privacyPolicy?.effectiveDate}
			</p>

			<div className="space-y-6">
				<section>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">1. Introduction</h2>
					<p className="text-gray-700">
					{privacyPolicy?.introduction};
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">2. Information We Collect</h2>
					<p className="text-gray-700">
					{privacyPolicy?.informationCollect}
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">3. How We Use Your Information</h2>
					<p className="text-gray-700">
					{
						privacyPolicy?.usageInfo
					}
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">4. Data Security</h2>
					<p className="text-gray-700">
					{
						privacyPolicy?.dataSecurity
					}
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">5. Sharing Your Information</h2>
					<p className="text-gray-700">
					{
						privacyPolicy?.sharingInfo
					}
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">6. Your Rights</h2>
					<p className="text-gray-700">
					{
						privacyPolicy?.rights
					}
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">7. Cookies and Tracking Technologies</h2>
					<p className="text-gray-700">
					{
						privacyPolicy?.cookiesInfo
					}
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">8. Third-Party Links</h2>
					<p className="text-gray-700">
					{
						privacyPolicy?.thirdPartyLinks
					}
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">9. Changes to This Privacy Policy</h2>
					<p className="text-gray-700">
					{
						privacyPolicy?.changesPolicy
					}
					</p>
				</section>

				<section>
					<h2 className="text-xl font-semibold text-gray-800 mb-2">10. Contact Us</h2>
					<p className="text-gray-700">
					If you have any questions about this Privacy Policy, please contact us at:
					</p>
					<ul className="text-gray-700">
					<li>Email: <a href={`mailto:${privacyPolicy?.contactInfo}`} className="text-gray-500">{privacyPolicy?.contactInfo}</a></li>
					<li>Phone: {privacyPolicy.phoneNumber}</li>
					<li>Address: {privacyPolicy?.businessAddress}</li>
					</ul>
				</section>
			</div>
		</div>):(<Loader/>)}
		<Footer/>
		<BackToTopButton scrollableDivRef={scrollableDivRef} />
		</div>
	);
};

export default PrivacyPolicy;
