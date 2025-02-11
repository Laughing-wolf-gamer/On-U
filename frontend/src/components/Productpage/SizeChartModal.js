import { Ruler, X } from 'lucide-react';
import React, { useState } from 'react';

const SizeChartModal = ({sizeChartData}) => {
	const [isOpen, setIsOpen] = useState(false);

	// Toggle modal visibility
	const toggleModal = () => setIsOpen(!isOpen);

	return (
		<div className='pl-4 font-kumbsan md:pl-3 lg:pl-0 2xl:pl-0'>
		{/* Button to open the modal */}
		<button
			onClick={toggleModal}
			className="ml-2 mt-2 lg:font-semibold 2xl:font-semibold md:font-semibold text-[14px] md:text-xl font-thin w-full justify-start items-start flex flex-row space-x-2"
		>
			<div className='text-[12px] text-gray-500 flex space-x-2 md:text-base font-medium hover:underline sm:underline'><Ruler/> <span className='font-bold'>SIZE CHART</span></div>
		</button>

		{/* Modal */}
		{isOpen && (
			<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-lg max-w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl w-full">
				<div className="flex justify-between items-center mb-4">
				<h2 className="text-sm sm:text-2xl font-bold text-gray-800">Size Chart</h2>
				<button
					onClick={toggleModal}
					className="text-gray-600 hover:text-gray-800 text-xl"
				>
					<X/>
				</button>
				</div>
				<div className="overflow-x-auto">
				<table className="min-w-full table-auto">
					<thead>
					<tr>
						<th className="px-4 py-2 text-left border-b">Size</th>
						<th className="px-4 py-2 text-left border-b">Chest</th>
						<th className="px-4 py-2 text-left border-b">Waist</th>
					</tr>
					</thead>
					<tbody>
					{sizeChartData.map((item, index) => (
						<tr key={index} className="border-b hover:bg-gray-100">
						<td className="px-4 py-2 text-gray-800">{item.size}</td>
						<td className="px-4 py-2 text-gray-800">{item.chest}</td>
						<td className="px-4 py-2 text-gray-800">{item.waist}</td>
						</tr>
					))}
					</tbody>
				</table>
				</div>
				<div className="mt-4">
				</div>
			</div>
			</div>
		)}
		</div>
	);
};

export default SizeChartModal;