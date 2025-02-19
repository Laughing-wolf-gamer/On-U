import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTermsAndCondition } from '../../action/common.action';

const WhatsAppButton = ({ scrollableDivRef }) => {
	const{ termsAndCondition } = useSelector(state => state.TermsAndConditions);
	const dispatch = useDispatch();
	const [phoneNumber,setPhoneNumber] = useState('916294053401'); // replace with your phone number
	const message = 'Hi'; // replace with your message
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
	useEffect(()=>{
		if(termsAndCondition){
			setPhoneNumber(termsAndCondition?.phoneNumber);
		}
	},[termsAndCondition])
	useEffect(()=>{
		dispatch(fetchTermsAndCondition());
	},[])
	
	const handleClick = () => {
		const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
		window.open(url, '_blank');
	};

	return (
		<button
			onClick={handleClick}
			className={`fixed bottom-20 z-50 right-8 p-3 bg-green-600 text-white rounded-full shadow-lg transition-all duration-500 hover:scale-105`}
		>
			<FaWhatsapp size={20}/>
		</button>
	);
};

export default WhatsAppButton;
