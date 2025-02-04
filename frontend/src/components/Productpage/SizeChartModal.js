import { Ruler } from 'lucide-react';
import React, { Fragment, useState } from 'react';

// Sample size chart data
/* const sizeChartData = [
  { size: 'S', chest: '34-36"', waist: '28-30"' },
  { size: 'M', chest: '38-40"', waist: '32-34"' },
  { size: 'L', chest: '42-44"', waist: '36-38"' },
  { size: 'XL', chest: '46-48"', waist: '40-42"' },
  { size: 'XXL', chest: '50-52"', waist: '44-46"' },
]; */

const SizeChartModal = ({sizeChartData}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle modal visibility
  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div className='pl-4 md:pl-3 lg:pl-0 2xl:pl-0'>
      {/* Button to open the modal */}
      <button
        onClick={toggleModal}
        className="font1 ml-2 mt-2 font1 lg:font-semibold 2xl:font-semibold md:font-semibold text-[14px] md:text-xl font-thin w-full justify-start items-start flex flex-row space-x-2"
      >
        <h1 className='text-[10px] md:text-xl font-medium'>SIZE CHART: </h1>
        <Ruler strokeWidth={1} size={30}/>
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
                &times;
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
              <button
                onClick={toggleModal}
                className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 sm:text-base text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeChartModal;