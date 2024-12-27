import React, { useState, useEffect } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getImagesArrayFromProducts, hexToRgba } from "../../config";

const AutoSlidingCarousel = ({ pro }) => {
  const imageArray = getImagesArrayFromProducts(pro)
  const [slideIndex, setSlideIndex] = useState(1); // Default to the first slide
  const [timer, setTimer] = useState(null); // Timer for auto sliding

  // Function to move to the current slide
  const currentSlide = (n) => {
    setSlideIndex(n);
  };

  // Show the slides based on slideIndex
  const showSlides = () => {
    let slides = document.getElementsByClassName(`${pro?._id} fade`);
    let dots = document.getElementsByClassName(`${pro?._id} dot`);

    // Hide all slides and remove 'active' class from dots
    Array.from(slides).forEach((slide) => {
      slide.style.display = "none";
    });

    Array.from(dots).forEach((dot) => {
      dot.classList.remove("active");
    });

    // Show the current slide and mark the dot as active
    if (slides[slideIndex - 1]) {
      slides[slideIndex - 1].style.display = "block";
    }
    if (dots[slideIndex - 1]) {
      dots[slideIndex - 1].classList.add("active");
    }
  };

  // Function to start the auto sliding
  const startAutoSliding = () => {
    const newTimer = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex % imageArray.length) + 1); // Loop through slides
    }, 7000); // Change slide every 3 seconds
    setTimer(newTimer);
  };

  // Function to stop the auto sliding
  const stopAutoSliding = () => {
    clearInterval(timer);
  };

  // UseEffect to initialize the carousel and cleanup the interval on component unmount
  useEffect(() => {
    showSlides();
    startAutoSliding(); // Start auto sliding when the component mounts

    return () => {
      clearInterval(timer); // Cleanup the interval when the component unmounts
    };
  }, [slideIndex, pro._id]); // Depend on slideIndex and pro._id

  return (
    <div
      className="slideshow-container min-h-[150px] relative"
      onMouseEnter={stopAutoSliding}
      onMouseLeave={startAutoSliding}
    >
      {imageArray.map((im, i) => (
        <div
        key={i}
        className={`${pro._id} fade w-full`}
        style={{
          display: i + 1 === slideIndex ? "block" : "none", // Show only the current slide
			}}
        >
          <LazyLoadImage
            src={im}
            className="w-full h-full object-contain"
            width="100%"
            alt="product"
            effect="blur"
          />
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
        {imageArray.map((_, i) => (
          <div
            key={i}
              className={`${pro._id} inline-block w-2 h-2 mx-1 rounded-full bg-white opacity-50 cursor-pointer`}
              onClick={() => currentSlide(i + 1)}
              style={{
                backgroundColor: slideIndex === i + 1 ? hexToRgba('#9AA6B2',0.5) : hexToRgba('#9AA6B2',1),
              }
            }
          >

          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoSlidingCarousel;
