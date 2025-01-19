import React, { Fragment, useEffect, useState } from 'react';
import HomeProductsPreview from './HomeProductsPreview';
import { generateArrayOfRandomItems } from '../../config';

const previewHeader = [
  { id: 'top-picks', title: 'Top Picks' },
  { id: 'best-sellers', title: 'Best Sellers' },
  { id: 'sale-items', title: 'Sale Items' }
];

const ProductPreviewFull = ({ product }) => {
  const [previewProducts, setSelectedPreviewProducts] = useState([]);
  const [activePreview, setActivePreviews] = useState('top-picks');

  const getRandomArrayOfProducts = (e, previewProductsTitle) => {
    if (e) {
      e.preventDefault();
    }
    if (product) {
      setActivePreviews(previewProductsTitle);
      const randomizes = generateArrayOfRandomItems(product, 6);
      setSelectedPreviewProducts(randomizes);
    }
  };

  useEffect(() => {
    getRandomArrayOfProducts();
  }, [product]);

  const renderStars = (p) => {
    let rating = Math.floor(Math.random() * 5) + 1;
    if (p && p.Rating && p.Rating.length) {
      const totalStars = p.Rating.reduce((acc, review) => acc + review.rating, 0);
      const avgStars = totalStars / p.Rating.length;
      const roundedAvg = Math.round(avgStars * 10) / 10;
      rating = roundedAvg;
    }
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${i <= rating ? 'text-gray-900' : 'text-slate-400'} hover:animate-vibrateScale`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 17.75l-5.47 3.06 1.43-6.12L2.5 9.75l6.26-.52L12 2l2.74 6.23 6.26.52-4.42 4.94 1.43 6.12z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <Fragment>
      {/* Title Section */}
      <div className="w-fit md:w-full gap-x-7 flex flex-row md:flex-1 h-fit p-1 justify-center items-center mb-6">
        <div className="w-20 h-0.5 bg-gray-700 rounded-xl"></div>
        <p className="text-xl sm:text-sm md:text-[28px] text-gray-700 font-bold font1 tracking-widest text-center">
          DAILY DEALS!
        </p>
        <div className="w-16 md:w-20 h-0.5 bg-gray-700 rounded-xl"></div>
      </div>

      {/* Preview Headers Section */}
      <div className="w-fit sm:w-fit md:min-h-fit h-auto justify-center items-center space-x-7 flex flex-wrap md:flex-row mb-6">
        {previewHeader && previewHeader.length > 0 &&
          previewHeader.map((h, index) => (
            <h3
              key={index}
              className={`text-black text-[20px] transition-transform duration-150 hover:animate-vibrateScale font-normal text-center m-2 cursor-pointer hover:text-gray-400 underline-offset-4 tracking-widest ${activePreview === h?.id ? 'text-gray-300' : ''}`}
              onClick={(e) => getRandomArrayOfProducts(e, h?.id)}
            >
              {h?.title}
            </h3>
          ))
        }
      </div>

      {/* Product Previews Section */}
      <div className="w-screen h-auto justify-center items-center flex flex-row bg-slate-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 row-span-2 justify-center items-center">
          {previewProducts && previewProducts.length > 0 &&
            previewProducts.map((p, index) => (
              <div key={index} className="md:w-80 w-44 m-1 h-full rounded-md bg-white relative flex flex-col justify-start items-center hover:shadow-md transform transition-all duration-300 ease-in-out hover:scale-105">
                <HomeProductsPreview product={p} />
                <div className="w-full p-2 bg-white flex flex-col justify-center items-start hover:shadow-md rounded-md space-y-2">
                  <h2 className="font1 text-base font-normal md:font-semibold font-sans text-gray-800 text-left">
                    {p?.title?.length > 26 ? `${p?.title.slice(0, 26)}` : p?.title}
                    {/* {p?.title} */}
                  </h2>
                  {/* Rating Section */}
                  <div className="flex flex-row justify-center items-center">
                    {renderStars(p)}
                  </div>
                  <div className='flex flex-row justify-start items-center w-full'>
                    <span className="font1 text-base text-slate-700">
                      {p.salePrice && p.salePrice > 0 ? (
                        <span className="line-through text-sm md:text-xl font-light md:font-medium font-sans text-slate-700 hover:animate-bounce">
                          ₹ {p.price}
                        </span>
                      ) : (
                        <span className="text-sm md:text-xl font-light md:font-medium font-sans text-slate-700 hover:animate-bounce">
                          ₹ {p.price}
                        </span>
                      )}
                    </span>
                    {p.salePrice && p.salePrice > 0 && (
                      <span className="ml-2 text-sm md:text-xl font-light md:font-medium font-sans text-[#f26a10] hover:animate-vibrateScale">
                        ₹ {p.salePrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </Fragment>
  );
};

export default ProductPreviewFull;
