import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Footer from '../Footer/Footer';
import BackToTopButton from '../Home/BackToTopButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFAQ } from '../../action/common.action';
import Loader from '../Loader/Loader';
import WhatsAppButton from '../Home/WhatsAppButton';
// Example FAQ Data

const FAQ = () => {
	const{faqs,loading} = useSelector(state => state.faqsArray)
	const dispatch = useDispatch();
	const scrollableDivRef = useRef(null); // Create a ref to access the div element

	const [openFAQ, setOpenFAQ] = useState(null);

	const toggleFAQ = (index) => {
		if (openFAQ === index) {
			setOpenFAQ(null); // Close if it's already open
		} else {
			setOpenFAQ(index); // Open the selected FAQ
		}
	};
	useEffect(()=>{
		scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
	},[])
	useEffect(()=>{
		dispatch(fetchFAQ())
	},[dispatch])
	// console.log("FAQ Options: ",faqs);

	return (
		<div ref={scrollableDivRef} className="w-screen h-screen overflow-y-auto justify-start scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
			<div className="bg-gray-50 py-12 pb-10 px-6 lg:px-24 my-3 h-fit w-full justify-self-center max-w-screen-2xl ">
				{/* Header Section */}
				<header className="text-center mb-12">
					<h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
						Frequently Asked Questions
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Find answers to some of the most common questions about shopping on ON U.
					</p>
				</header>

				{/* FAQ Section */}
				<div className="max-w-4xl min-h-full mx-auto bg-white p-8 rounded-lg shadow-lg pb-10">
				{
					!loading ? <div className="space-y-4">
						{faqs && faqs.length > 0 && faqs.map((faq, index) => (
							<div key={index} className="border-b border-gray-200">
								<button
									onClick={() => toggleFAQ(index)}
									className="w-full text-left py-4 text-lg font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none justify-between items-end flex rounded-md transition-all duration-300"
								>
									{faq.question}
									{
										openFAQ === index ? <ChevronDown/> :<ChevronRight/>
									}
								</button>
								
								{openFAQ === index && (
									<div className="py-4 text-gray-600 pb-7">
										<p>{faq.answer}</p>
									</div>
								)}
							</div>
						))}
					</div>:<Loader/>
				}
					
				</div>
			</div>
			<Footer/>
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef}/>
		</div>
	);
};

export default FAQ;
