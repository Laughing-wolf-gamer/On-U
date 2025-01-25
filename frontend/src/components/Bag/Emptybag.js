import React from "react";
import emptybag from '../images/empty-bag.webp';
import { useNavigate } from "react-router-dom";

const EmptyBag = () => {
  const redirect = useNavigate()

  function handleMoveToShoppingView() {
    redirect('/products')
  }
  return (
    <div className="flex flex-col w-full h-screen items-center justify-center bg-gray-50 text-center px-6 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-lg">
        <img
          src={emptybag} // Replace with your actual image path
          alt="Empty Bag"
          className="mx-auto mb-8 w-36 h-36 object-contain"
        />
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">Oops! Your Bag is Empty</h2>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">It looks like you haven't added anything yet. Browse our collection and start shopping now!</p>
        <button onClick={handleMoveToShoppingView} className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 text-lg shadow-md">
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default EmptyBag;
