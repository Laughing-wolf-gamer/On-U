import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import b2 from '../images/banner2.webp'
const CarousalView = ({b_banners,indicator}) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current index
    const [animate, setAnimate] = useState(false); // State to trigger the animation
    const sectionRef = useRef(null); // Ref to track the div that will animate
    const handleBeforeChange = (oldIndex, newIndex) => {
      setAnimate(false); // Reset the animation when the index changes
      setTimeout(() => {
        // setCurrentIndex(newIndex); // Update the current index after animation
        setAnimate(true); // Trigger animation after the carousel change
      },700); // Delay to sync with the animation duration
    };
    const handleIntersection = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setAnimate(true); // Trigger the animation when the element is in the viewport
      } else {
        setAnimate(false); // Optionally reset animation when out of view
      }
    };
    useEffect(() => {
      const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.5, // Trigger when 50% of the element is in view
      });
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
  
      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current); // Clean up observer
        }
      };
    }, []);
  return (
    <Fragment>
      <Carousel
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        showIndicators={true}
        autoPlay={600}
        swipeable
        infiniteLoop={true}
        selectedItem={currentIndex}
        onChange={handleBeforeChange}
        renderIndicator={(onClickHandler, isSelected, currentIndex, label) => indicator(onClickHandler, isSelected, currentIndex, label)}
      >
        {b_banners.map((b, index) => (
              <div key={`b_${index}`}>
                <Link to='/products'>
                  <LazyLoadImage effect='blur' src={b} width='100%' className='min-h-[420px] bg-purple-500' alt='Banner_Image' />
                </Link>
                <div className='h-[80px]'/>
              </div>
          )) 
        }
      </Carousel>
        <div
          ref={sectionRef}
          className={`absolute top-20 left-32 transform z-20 transition-all duration-700 ease-in-out ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex flex-col space-y-4 justify-center items-start">
            <h3 className="text-xl px-8 font-medium font1 tracking-widest text-slate-800 mt-8">Smart Products</h3>
            <div className="flex flex-col space-y-2">
              <h1 className="text-[42px] px-8 font-bold tracking-widest text-slate-800">Winter Offers</h1>
              <h2 className="text-[42px] px-8 font-semibold tracking-widest text-slate-800">2024 Collections</h2>
            </div>
            <Link to={"/products"} className="border-[1px] text-center flex justify-center items-center border-slate-400 hover:bg-slate-800 ml-8 text-black hover:text-white mt-9 w-44 h-16">
              <button className="text-sm font1 font-thin tracking-widest">SHOP NOW</button>
            </Link>
          </div>
        </div>
        {/* Left and Right Buttons */}
        <div className='absolute h-32 top-1/2 left-14 transform -translate-y-1/2 z-10'>
          <button
            className={`flex my-auto text-gray-700 opacity-[50%] hover:text-gray-900`}
            onClick={(e) => {
              e.preventDefault();
              console.log("Change Index: ", currentIndex);
              setCurrentIndex((currentIndex - 1 + b_banners.length) % b_banners.length)
            }}
          >
            <ChevronLeft  size={50}/>
          </button>
        </div>
        <div className='absolute h-32  top-1/2 right-14 transform -translate-y-1/2 z-10'>
          <button
            className={`h-full w-full text-gray-700 opacity-[50%] transition-color hover:text-gray-900 hover:scale-110 duration-500`}
            onClick={(e) => {
              e.preventDefault();
              console.log("Change Index: ", currentIndex);
              setCurrentIndex((currentIndex + 1) % b_banners.length)
            }}
          >
            
            <ChevronRight size={50}/>
          </button>
        </div>
    </Fragment>
  )
}

export default CarousalView