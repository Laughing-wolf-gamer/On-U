import React, { Fragment, useEffect, useState } from 'react'
import HomeProductsPreview from './HomeProductsPreview'
import { generateArrayOfRandomItems } from '../../config';
const previewHeader = [
  {
    id: 'top-picks',
    title: 'Top Picks',
  },
  {
    id: 'best-sellers',
    title: 'Best Sellers',
  },
  {
    id: 'sale-items',
    title: 'Sale Items',
  }
]
const ProductPreviewFull = ({product}) => {
    const [previewProducts, setSelectedPreviewProducts] = useState([]);
    const[activePreview,setActivePreviews] = useState('top-picks');
    const getRandomArrayOfProducts = (e,previewProductsTitle)=>{
        if(e){
          e.preventDefault();
        }
        if(product){
          setActivePreviews(previewProductsTitle)
          const randomizes = generateArrayOfRandomItems(product, 6); 
          setSelectedPreviewProducts(randomizes)
        }
    }
    useEffect(()=>{
        getRandomArrayOfProducts();
    },[product])
    return (
        <Fragment>
            <div className="w-fit md:w-full gap-x-7 flex flex-row md:flex-1 h-fit p-1 justify-center items-center">
                <div className="w-20 h-0.5 bg-black rounded-xl"></div>
                <p className="text-xl sm:text-sm md:text-[28px] text-black font-bold font1 tracking-widest text-center">
                    DAILY DEALS!
                </p>
                <div className="w-16 md:w-20 h-0.5 bg-black rounded-xl"></div>
            </div>
            <div className='w-fit sm:w-fit md:min-h-fit h-auto justify-center items-center space-x-7 flex flex-wrap md:flex-row'>
                {
                    previewHeader && previewHeader.length > 0 && previewHeader.map((h, index) => (
                        <h3 key={index} className={`text-black text-[20px] font-normal text-center m-2 cursor-pointer hover:text-gray-500 underline-offset-4 tracking-widest ${activePreview === h?.id ? "text-gray-700":''}`}onClick={(e)=> getRandomArrayOfProducts(e,h?.id)}>{h?.title}</h3>
                    ))
                }
            </div>
            <div className="w-screen h-auto justify-center items-center flex flex-row">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 row-span-3 justify-center items-center">
                    {previewProducts && previewProducts.length > 0 && previewProducts.map((p, index) => (
                        <div key={index} className="w-80 m-1 bg-gray-100 h-full relative flex flex-col justify-start items-center">
                            <HomeProductsPreview product={p} />
                            <div className="w-full p-2 bg-white flex flex-col justify-center items-center">
                                <h2 className="font-semiBold text-black text-2xl hover:text-gray-500 transition-colors duration-200 text-center">{p?.title}</h2>
                                <span className="text-sm font-normal">₹ {p.salePrice && p.salePrice > 0 ? p.salePrice : p.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    )
}

export default ProductPreviewFull