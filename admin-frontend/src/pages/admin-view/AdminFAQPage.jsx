import { fetchFAQSWebstis, removeFAQById, setFAQSWebstis } from '@/store/common-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminFAQPage = () => {
	const{faqsWebsite,isLoading} = useSelector(state=> state.common);
	const dispatch = useDispatch();
	// const [faqs, setFaqs] = useState([]);
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');

	// Handle form submission to add FAQ
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (question && answer) {
			/* setFaqs([
				...faqs,
				{ question: question.trim(), answer: answer.trim() },
			]); */
			setQuestion('');
			setAnswer('');
			await dispatch(setFAQSWebstis({question,answer}));
			dispatch(fetchFAQSWebstis());
			toast.success('FAQ added successfully.');
		} else {
			toast.error('Please provide both question and answer.');
		}
	};
	const removeFAQ = async (id)=>{
        await dispatch(removeFAQById({faqId:id}));
        dispatch(fetchFAQSWebstis());
        toast.success('FAQ removed successfully.');
	}
	useEffect(()=>{
		dispatch(fetchFAQSWebstis());
	},[dispatch])
	console.log("FAQ Webstis: ",faqsWebsite);

	return (
		<div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
		<h2 className="text-2xl font-semibold mb-4">FAQ Admin Dashboard</h2>

		{/* FAQ Form */}
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="question" className="block text-sm font-medium text-gray-700">
					Question
				</label>
				<input
					type="text"
					id="question"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					placeholder="Enter your question"
					className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>

			<div>
				<label htmlFor="answer" className="block text-sm font-medium text-gray-700">
					Answer
				</label>
				<textarea
					id="answer"
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					placeholder="Enter the answer"
					rows="4"
					className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
				/>
			</div>

			<button
				type="submit"
				className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			>
			Add FAQ
			</button>
		</form>

			{faqsWebsite && faqsWebsite.length > 0 && (
			<div className="mt-8">
			<h3 className="text-xl font-semibold mb-4">FAQ List</h3>
			<div className="space-y-4">
				{faqsWebsite.map((faq, index) => (
				<div
					key={index}
					className="bg-gray-100 p-4 rounded-lg shadow-md relative"
				>
					<button
					onClick={() => removeFAQ(faq?._id)}
					className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
					>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
					</button>
					<p className="font-semibold text-lg">{faq.question}</p>
					<p className="text-gray-700">{faq.answer}</p>
				</div>
				))}
			</div>
			</div>
		)}
		</div>
	);
}

export default AdminFAQPage
