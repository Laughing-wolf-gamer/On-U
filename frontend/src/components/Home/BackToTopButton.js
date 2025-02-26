import { ChevronUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const BackToTopButton = ({scrollableDivRef}) => {
	const [scrollPosition, setScrollPosition] = useState(0);

	const scrollToTop = () => {
		// Scroll the div to the top smoothly
		if (scrollableDivRef.current) {
			scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			if (scrollableDivRef.current) {
				setScrollPosition(scrollableDivRef.current.scrollTop);
			}
		};

		// Attach the scroll event listener when the component mounts
		const divElement = scrollableDivRef.current;
		divElement.addEventListener('scroll', handleScroll);

		// Clean up the event listener when the component unmounts
		return () => {
			divElement.removeEventListener('scroll', handleScroll);
		};
	}, []);

	// console.log("Scroll position: ", scrollPosition);

	return (
		<div>
			{/* Back to Top Button */}
			<button
			className={`fixed z-50 right-8 2xl:right-20 p-3 bg-black text-white rounded-full shadow-lg transition-opacity duration-300 ${scrollPosition > 20 ? 'opacity-100' : 'opacity-0 pointer-events-none'}
				bottom-16 sm:bottom-20 md:bottom-6 lg:bottom-6 xl:bottom-6 2xl:bottom-10`}
			onClick={scrollToTop}
			aria-label="Back to top"
			>
			<ChevronUp size={20} />
			</button>
		</div>
	);

};

export default BackToTopButton;
