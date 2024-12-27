import React, { Fragment, useEffect } from 'react'
import './Single_product.css'
import { AiFillStar } from 'react-icons/ai'
import { BiRupee } from 'react-icons/bi'
import { IoIosHeartEmpty } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { capitalizeFirstLetterOfEachWord, getImagesArrayFromProducts } from '../../config'
import AutoSlidingCarousel from './AutoSlidingCarousel'



const Single_product = ({ pro }) => {
    const imageArray = getImagesArrayFromProducts(pro)
    console.log('Single Product, Normal Screen', imageArray);

    let slideIndex = 1;

    const currentSlide = (n) => {
        showSlides(slideIndex = n);
    }

    const showSlides = (n) => {
        /* let i;
        let slides = document.getElementsByClassName(`${pro._id}`);
        let dots = document.getElementsByClassName(`${pro._id}1`);
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");

        }

        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active"; */
    }

    const showdiv = () => {
        // let dotsdiv = document.getElementsByClassName(`${pro._id}hover`);
        // dotsdiv[0].className += " 2xl:block lg:block xl:block";
    }

    const notshowdiv = () => {

        // document.querySelector(`.${pro._id}hover`).classList.remove('2xl:block')
        // document.querySelector(`.${pro._id}hover`).classList.remove('lg:block')
        // document.querySelector(`.${pro._id}hover`).classList.remove('xl:block')
    }
    // showSlides(slideIndex);
    var timer;

    /* const changeimg = () => {
        let i = 1;
        timer = setInterval(function () {

            let slides = document.getElementsByClassName(pro._id);
            if (i > slides.length) { i = 0 }
            i++
            currentSlide(i)


        }, 1000);
    }

    function stopchangeimg() {
        clearInterval(timer);
        currentSlide(1)
    } */

    /* useEffect(() => {
        showSlides(slideIndex)
    }, [showSlides]); */

    return (
        <Fragment>
            {
                imageArray && imageArray.length > 0 &&
                <Fragment>
                    <Link to={`/products/${pro._id}`} /* target='_blank'  */>
                        <li className=' w-full border-[1px] border-slate-200 grid-cols-1 2xl:border-none xl:border-none lg:border-none relative ' /* onMouseEnter={() => (showdiv(), changeimg())} onMouseLeave={() => (notshowdiv(), stopchangeimg())} */>
                            <AutoSlidingCarousel pro={pro}/>

                            <div className='relative pb-6'>
                                <p className='font1 text-base px-2'>{capitalizeFirstLetterOfEachWord(pro?.title)}</p>
                                <p className='overflow-hidden px-2 text-xs text-left text-ellipsis h-4 whitespace-nowrap text-slate-400'>{pro?.subCategory}</p>
                                <p className='flex px-2'><span className='flex items-center text-sm font-medium'><BiRupee />{pro?.salePrice ? pro.salePrice : pro?.price}</span >&nbsp;
                                    {
                                        pro.salePrice !== null && (
                                            <>
                                                <span className='flex items-center text-sm font-medium text-slate-400 line-through'><BiRupee />{Math.round(pro?.price)}</span>&nbsp;&nbsp;
                                                <span className='flex items-center text-xs font-medium text-[#f26a10]'>( {-Math.round(pro?.salePrice / pro?.price * 100 - 100)}% OFF )</span>
                                            </>
                                        )   
                                    }
                                </p>
                            </div>

                            <div className={`${pro._id}hover hidden absolute pb-6 bottom-0 w-full bg-[#ffffff]  mx-auto `}>
                                {/* <div className='text-center mb-2'>
                                    {pro && pro.image.length > 0 && pro.image.map((img, i) => (
                                        <span className={`${pro?._id}1 dot `} onClick={() => (currentSlide(i + 1))} ></span>
                                    ))}
                                </div> */}

                                <div className='w-12/12 text-center flex items-center justify-center py-1 font1 border-[1px] border-slate-300 cursor-pointer' >
                                    <IoIosHeartEmpty className='text-lg mr-1' /><span>CART</span></div>
                                <div className='relative '>
                                    <div className='justify-start items-center w-auto h-auto flex-row flex'>
                                        <p className='font1 text-xm px-2 text-[#5f5f5f9e]'>Sizes: </p>
                                        {
                                            pro && pro.size && pro.size.map((item,i)=>(
                                                <span key={i} className='font1 text-xm px-2 text-[#5f5f5f9e]'>{item.label} {i} </span>
                                            ))
                                        }

                                    </div>
                                    <p className='flex px-2'>
                                        <span className='flex items-center text-sm font-medium'>
                                            <BiRupee />{Math.round(pro.price)}
                                        </span>
                                        &nbsp;
                                        {
                                            pro && pro.salePrice && (
                                                <>
                                                    <span className='flex items-center text-sm font-medium text-slate-400 line-through'>
                                                        <BiRupee />{Math.round(pro.price)}
                                                    </span>
                                                    &nbsp;&nbsp;
                                                    <span className='flex items-center text-xs font-medium text-[#f26a10]'>
                                                        ({Math.round(((pro.price - pro.salePrice) / pro.price) * 100)}% OFF)
                                                    </span>
                                                </>
                                            )
                                        }
                                    </p>

                                </div>

                            </div>

                        </li>
                    </Link>


                </Fragment>

            }
        </Fragment>

    )
}

export default Single_product