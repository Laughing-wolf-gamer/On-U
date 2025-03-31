import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';

const CarousalView = ({ b_banners, indicator, bannerLoading = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current index
    const [animate, setAnimate] = useState(false); // State to trigger the animation
    const sectionRef = useRef(null); // Ref to track the div that will animate

    const handleBeforeChange = (oldIndex, newIndex) => {
        setAnimate(false); // Reset the animation when the index changes
        setTimeout(() => {
            setAnimate(true); // Trigger animation after the carousel change
        },5000); // Delay to sync with the animation duration
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
            threshold: 0.7, // Trigger when 50% of the element is in view
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
        <div className='w-screen'>
            <Carousel
                showThumbs={false}
                showStatus={false}
                showArrows={false}
                showIndicators={true}
                autoPlay={50000}
                swipeable
                infiniteLoop={true}
                selectedItem={currentIndex}
                onChange={handleBeforeChange}
                renderIndicator={(onClickHandler, isSelected, currentIndex, label) =>
                    indicator(onClickHandler, isSelected, currentIndex, label)
                }
            >
                {
                    bannerLoading ? Array(5).fill(null).map((_, i) => (
                        <div key={`loading_${i}`} className='h-[600px] w-full bg-gray-100 p-4 animate-pulse' >
                            <div className='w-full items-center justify-center flex h-full bg-gray-500 animate-pulse' >

                            </div>
                        </div>
                    )):b_banners.map((b, index) => (
                        <div key={`b_${index} h-full`}>
                            <Link to='/products'>
                                <LazyLoadImage
                                    effect='blur'
                                    src={b}
                                    width='100%'
                                    height="100%"
                                    className='min-h-[480px] bg-gray-300' // Changed to a gray background
                                    alt='Banner_Image'
									onContextMenu={(e)=> e.preventDefault()}
                                />
                            </Link>
                        </div>
                    ))
                }
            </Carousel>
            {/* Left and Right Buttons */}
            <div className='absolute h-32 top-1/2 left-14 transform -translate-y-1/2 z-10'>
                <button
					className='h-full w-full text-white opacity-[90%] transition-color hover:text-black hover:scale-125 duration-300 hover:border'
					onClick={(e) => {
						// e.preventDefault();
						setCurrentIndex((currentIndex - 1 + b_banners.length) % b_banners.length);
					}}
                >
                	<ChevronLeft size={50} />
                </button>
            </div>
            <div className='absolute h-32 top-1/2 right-14 transform -translate-y-1/2 z-10'>
                <button
					className='h-full w-full text-white opacity-[90%] transition-color hover:text-black hover:scale-125 duration-300 hover:border'
					onClick={(e) => {
						// e.preventDefault();
						setCurrentIndex((currentIndex + 1) % b_banners.length);
					}}
                >
                	<ChevronRight size={50} />
                </button>
            </div>
        </div>
    );
};

export default CarousalView;
