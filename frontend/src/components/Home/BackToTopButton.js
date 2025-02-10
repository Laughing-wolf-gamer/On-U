import { ChevronUp } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

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

	console.log("Scroll position: ", scrollPosition);

	return (
		<div>
			{/* Back to Top Button */}
			<button
				className={`fixed bottom-6 z-50 right-8 p-3 bg-gray-600 text-white rounded-full shadow-lg transition-opacity duration-300 ${scrollPosition > 20 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
				onClick={scrollToTop}
				aria-label="Back to top"
			>
				<ChevronUp size={20}/>
			</button>
		</div>
  	);
};

export default BackToTopButton;
