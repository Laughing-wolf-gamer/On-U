import React, { Fragment, CSSProperties, useEffect, useState, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'
import './home.css'


import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Allproduct, getOptionsByType } from '../../action/productaction'
import { useDispatch, useSelector } from 'react-redux'
import { featchallbanners } from '../../action/banner.action'
import { getuser } from '../../action/useraction'
import { BadgeIndianRupee, CircleDollarSign, Clock, Truck } from 'lucide-react'

import ProductPreviewFull from './ProductPreviewFull'
import CarousalView from './CarousalView'
import DraggingScrollView from '../Productpage/DraggableHorizontalScroll'
import DraggableImageSlider from './DraggableImageSlider'
import FullScreenOverLayCouponPopUp from './FullScreenOverLayCouponPopUp'
import Footer from '../Footer/Footer'
import GridImageView from './GridImageView'
import { fetchWebsiteDisclaimer } from '../../action/common.action';
import BackToTopButton from './BackToTopButton';


const Home = ({user}) => {
    const { product,loading:productLoading} = useSelector(state => state.Allproducts)
    // const { AllOptions} = useSelector(state => state.allOptions)
    const [categoriesOptions,setCategoryOptions] = useState([]);
    const { banners,loading:bannerLoading} = useSelector(state => state.banners)
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const indicatorStyles: CSSProperties = {
        background: '#CFCECD',
        width: 7,
        height: 7,
        borderRadius: 50,
        display: 'inline-block',
        margin: '0 4px 0 4px',
        zIndex: 8
    };
    
    
    // #CFCECD
    function indicator(onClickHandler, isSelected, index, label) {
        if (isSelected) {
            return (
                <li
                style={{ ...indicatorStyles, background: '#253529' }}
                aria-label={`Selected: ${label} ${index + 1}`}
                title={`Selected: ${label} ${index + 1}`}
                />
            );
        }

        return (
            <li
                style={{ ...indicatorStyles }}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                value={index}
                key={index}
                role="button"
                tabIndex={0}
                title={`${label} ${index + 1}`}
                aria-label={`${label} ${index + 1}`}
            />
        );
    }
    const getSingleOptions = async ()=>{
        try {
            const catResponse = await dispatch(getOptionsByType({type: 'category'}))
            
            if(catResponse){
                setCategoryOptions(catResponse.map(c => c.value));
            }
        } catch (error) {
            console.error("Error getting: ", error);
        }
    }
    useEffect(()=>{
        dispatch(getuser());
        dispatch(featchallbanners());
        dispatch(Allproduct())
        getSingleOptions();
    },[dispatch])
    
    useEffect(() => {
        // document.documentElement.scrollTo = 0;
        window.scrollTo(0,0)
    }, []);

    // Initialize sections with default values
    /* const sectionNames = [
        'Wide Screen Section- 1', 'Wide Screen Section- 2', 'Wide Screen Section- 3',
        'Wide Screen Section- 4', 'Wide Screen Section- 5', 'Wide Screen Section- 6',
        'Wide Screen Section- 7', 'Wide Screen Section- 8', 'Wide Screen Section- 9',
        'Wide Screen Section- 10', 'Wide Screen Section- 11',
        'Small Screen Section- 1', 'Small Screen Section- 2', 'Small Screen Section- 3',
        'Small Screen Section- 4', 'Small Screen Section- 5'
    ];

    const sections = {};

    // Function to populate section data
    const populateSection = (categoryType) => {
        const foundCategory = banners?.find((b_cat) => b_cat?.CategoryType === categoryType);
        return {
            urls: foundCategory?.Url || [],
            header: foundCategory?.Header || ""
        };
    };

    // Populate all sections for both wide and small screens
    sectionNames.forEach((sectionName) => {
        sections[sectionName] = populateSection(sectionName);
    }); */

    let Wide_Screen_Section_1 = {urls:[], header: ""};
    let Wide_Screen_Section_2 = {urls:[],header:''};
    let Wide_Screen_Section_3 = {urls:[],header:''};
    let Wide_Screen_Section_4 = {urls:[],header:''};
    let Wide_Screen_Section_5 = {urls:[],header:''};
    let Wide_Screen_Section_6 = {urls:[],header:''};
    let Wide_Screen_Section_7 = {urls:[],header:''};
    let Wide_Screen_Section_8 = {urls:[],header:''};
    let Wide_Screen_Section_9 = {urls:[],header:''};
    let Wide_Screen_Section_10 = {urls:[],header:''};
    let Wide_Screen_Section_11 = {urls:[],header:''};
    

    // mobile
    let Small_Screen_Section_1 = {urls:[],header:''};
    let Small_Screen_Section_2 = {urls:[],header:''};
    let Small_Screen_Section_3 = {urls:[],header:''};
    let Small_Screen_Section_4 = {urls:[],header:''};
    let Small_Screen_Section_5 = {urls:[],header:''};

    if(banners){
        Wide_Screen_Section_1.urls = banners.find((b_cat)=> b_cat?.CategoryType === "Wide Screen Section- 1")?.Url || [];
        Wide_Screen_Section_1.header = banners.find((b_cat)=> b_cat?.CategoryType === "Wide Screen Section- 1")?.Header || "";



        Wide_Screen_Section_2.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 2")?.Url || []
        Wide_Screen_Section_2.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 2")?.Header || ""


        Wide_Screen_Section_3.urls = banners.find((b_cat)=> b_cat?.CategoryType === "Wide Screen Section- 3")?.Url || [];
        Wide_Screen_Section_3.header = banners.find((b_cat)=> b_cat?.CategoryType === "Wide Screen Section- 3")?.Header || "";

        Wide_Screen_Section_4.urls = banners.find((b_cat)=> b_cat?.CategoryType === "Wide Screen Section- 4")?.Url || [];
        Wide_Screen_Section_4.header = banners.find((b_cat)=> b_cat?.CategoryType === "Wide Screen Section- 4")?.Header || "";


        Wide_Screen_Section_5.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 5")?.Url || []
        Wide_Screen_Section_5.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 5")?.Header || ""


        Wide_Screen_Section_6.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 6")?.Url || []
        Wide_Screen_Section_6.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 6")?.Header || ""

        Wide_Screen_Section_7.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 7")?.Url || []
        Wide_Screen_Section_7.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 7")?.Header || ""


        Wide_Screen_Section_8.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 8")?.Url || []
        Wide_Screen_Section_8.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 8")?.Header || ""

        Wide_Screen_Section_9.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 9")?.Url || []
        Wide_Screen_Section_9.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 9")?.Header || ""


        Wide_Screen_Section_10.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 10")?.Url || []
        Wide_Screen_Section_10.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 10")?.Header || ""

        Wide_Screen_Section_11.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 11")?.Url || []
        Wide_Screen_Section_11.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Wide Screen Section- 11")?.Header || ""


        // mobile
        Small_Screen_Section_1.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 1")?.Url || []
        Small_Screen_Section_1.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 1")?.Header || ""

        Small_Screen_Section_2.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 2")?.Url || []
        Small_Screen_Section_2.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 2")?.Header || ""

        Small_Screen_Section_3.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 3")?.Url || []
        Small_Screen_Section_3.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 3")?.Header || ""

        Small_Screen_Section_4.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 4")?.Url || []
        Small_Screen_Section_4.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 4")?.Header || ""

        Small_Screen_Section_5.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 5")?.Url || []
        Small_Screen_Section_5.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 5")?.Header || ""
    }
    
    // console.log("All Options: ",AllOptions);
    

    const [showComponent, setShowComponent] = useState(null);

    // Randomly decide which component to show
    useEffect(() => {
        const randomComponent = Math.random() < 0.5 ? 'coupon' : 'dialog';
        setShowComponent(randomComponent);
    }, []);
    const scrollableDivRef = useRef(null); // Create a ref to access the div element

    return (
        <div ref={scrollableDivRef} className="w-screen h-screen overflow-y-auto justify-start scrollbar bg-slate-200 overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
            {
                window.screen.width > 1024 ?
                    <Fragment >
                        <div className='pt-1 min-w-[70%] h-fit relative'>
                            <CarousalView b_banners={Wide_Screen_Section_1.urls} indicator={indicator} bannerLoading = {bannerLoading}/>
                        </div>
                        <OurMotoData/>
                        {!productLoading && product && product.length > 0 ? <ProductPreviewFull product={product} user={user}/> : 
                            <div className='w-full justify-self-center max-w-screen-2xl justify-center items-center flex px-14 '>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-5 2xl:space-x-4 md:space-x-1 sm:space-x-4 gap-2 justify-center items-center sm:px-1 md:px-2 lg:px-2 px-2">
                                    {
                                        Array(5).fill(0).map((_, index) => (
                                            <div key={`skeleton_${index}`} className="bg-gray-400 2xl:w-[344px] 2xl:h-[611px] xl:w-[255px] xl:h-[482px] md:w-[194px] md:h-[395px] w-full h-fit rounded-md relative flex flex-col justify-between items-center hover:shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 animate-pulse">
                                                <div className='w-full absolute bottom-0 h-32 bg-gray-700 animate-pulse'>

                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        }
                        
                        <div className="w-full justify-self-center max-w-screen-2xl h-fit flex flex-col justify-center items-center pb-7 space-y-3 px-14">
                            <h1 className='text-3xl font-bold text-center font1 tracking-widest text-gray-700 mb-10'>
                                {Wide_Screen_Section_3.header}
                            </h1>
                            <div className='w-full justify-center items-center flex'>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 2xl:grid-cols-4 justify-center items-center">
                                    {
                                        bannerLoading || !Wide_Screen_Section_3 || Wide_Screen_Section_3.urls.length <= 0 ? (
                                            Array(8).fill(0).map((_, index) => (
                                                <div key={`skeleton_${index}`} className="w-[300px] h-[520px] flex flex-col justify-start items-center bg-gray-300 rounded-lg animate-pulse">
                                                    <div className="w-full h-full relative">
                                                        <div className="min-w-full bg-gray-400 h-10 bottom-5 left-0 justify-start absolute h-30 animate-pulse items-start px-2 flex flex-row">
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            // Actual content when URLs are available
                                            Wide_Screen_Section_3.urls.slice(0, 8).map((url, index) => (
                                                <div
                                                    key={`Index_${index}`}
                                                    className={`h-auto min-w-full relative flex flex-col justify-center items-center hover:shadow-md transform transition-all duration-300 ease-in-out hover:scale-105`}
                                                >
                                                    {
                                                        url && <GridImageView imageToShow={url} startPlaying = {true} categoriesOptions={categoriesOptions} />
                                                    }
                                                    
                                                </div>
                                            ))
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <DraggableImageSlider images={Wide_Screen_Section_4.urls} headers={Wide_Screen_Section_4.header} bannerLoading = {bannerLoading}/> 
                        <DraggableImageSlider images={Wide_Screen_Section_5.urls} headers={Wide_Screen_Section_5.header} bannerLoading = {bannerLoading}/>
                        <DraggableImageSlider images={Wide_Screen_Section_6.urls} headers={Wide_Screen_Section_6.header} bannerLoading = {bannerLoading}/> 
                        <DraggableImageSlider images={Wide_Screen_Section_7.urls} headers={Wide_Screen_Section_7.header} bannerLoading = {bannerLoading}/>
                        
                        <div className=' w-full max-w-screen-2xl justify-self-center justify-center items-center flex flex-col px-14'>
                            <h1 className='text-3xl font-bold font1 tracking-widest text-gray-700 mb-8'>{Wide_Screen_Section_8.header}</h1>
                            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4'>
                                {
                                    !bannerLoading && Wide_Screen_Section_8 && Wide_Screen_Section_8.urls.length > 0 ? 
                                    Wide_Screen_Section_8.urls.map((j, index) => (
                                        <Link key={`j_banners_${index}`} to='/products' className='m-1'>
                                            <LazyLoadImage effect='blur' src={j} alt={`${Wide_Screen_Section_8.header}_${index}`} className="min-h-[200px] w-full rounded-lg shadow-md"/>
                                        </Link>
                                    )) : (
                                        // Skeleton Loader View when no URLs
                                        Array(8).fill(0).map((_, index) => (
                                            <div key={`skeleton_${index}`} className="w-[300px] h-[700px] relative flex flex-col justify-start items-center bg-gray-300 rounded-lg p-4 animate-pulse">
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        </div>
                        <DraggableImageSlider images={Wide_Screen_Section_9.urls} headers={Wide_Screen_Section_9.header} bannerLoading = {bannerLoading}/>
                        <DraggableImageSlider images={Wide_Screen_Section_10.urls} headers={Wide_Screen_Section_10.header} bannerLoading = {bannerLoading}/>
                        <DraggableImageSlider images={Wide_Screen_Section_11.urls} headers={Wide_Screen_Section_11.header} showArrows={false} bannerLoading = {bannerLoading}/> 
                        <Footer/>
                    </Fragment >
                :
                    <Fragment>
                        <div className='w-[100vw]'>
                            <Carousel
                                preventMovementUntilSwipeScrollTolerance
                                className='' 
                                autoPlay={50000}
                                swipeable
                                infiniteLoop={true}
                                showThumbs={false} 
                                showStatus={false} 
                                showArrows={false} 
                                showIndicators={true} 
                                renderIndicator={(onClickHandler, isSelected, index, label) => indicator(onClickHandler, isSelected, index, label)}>
                                    {!bannerLoading &&  Small_Screen_Section_2 && Small_Screen_Section_2.urls && Small_Screen_Section_2.urls.length > 0 ? (
                                        Small_Screen_Section_2.urls.map((mb, index) => (
                                            <Link key={`mb_banners_${index}`} to='/products'>
                                                <LazyLoadImage effect='blur' src={mb} loading='lazy' width='100%' alt='Banner_Image' className='min-h-[200px]' />
                                            </Link>
                                        ))
                                    ) : (
                                        // Skeleton Loader for the Carousel Items
                                        Array(8).fill(0).map((_, index) => (
                                            <div className='h-[200px] w-full bg-gray-100 p-1 animate-pulse' >
                                                <div key={index} className="w-[98%] h-[90%] bg-gray-300 animate-pulse rounded-lg" />
                                            </div>
                                        ))
                                    )}
                            </Carousel>
                        </div>


                        <div className=''>
                            <h1 className='text-xl px-8 font-bold font1 text-center text-gray-700 pb-6 pt-6'>{Small_Screen_Section_3.header}</h1>
                            <ul className='flex overflow-x-scroll'>
                                {!bannerLoading && Small_Screen_Section_3 && Small_Screen_Section_3.urls.length > 0 ? 
                                    Small_Screen_Section_3.urls.map((d, index) => (
                                        <Link key={`${Small_Screen_Section_3.header}_banners${index}`} to='/products'>
                                            <li className='w-max mr-2'>
                                                <LazyLoadImage effect='blur' loading='lazy' src={d} alt={`${Small_Screen_Section_3.header}_${index}`} className="w-[50vw] min-h-[200px]" />
                                            </li>
                                        </Link>
                                )) : (
                                    Array(6).fill(0).map((_, index) =>(
                                        <div key={index} className='w-[300px] m-1 h-[200px] bg-gray-200 p-1 animate-pulse' >
                                            <div className="w-[280px] h-[90%] bg-gray-400 animate-pulse rounded-lg" />
                                        </div>
                                    ))
                                )}
                            </ul>
                        </div>
                        {/* <OurMotoData/> */}
                        {!productLoading && product && product.length > 0 ? <ProductPreviewFull product={product} user={user}/> : 
                            <div className='w-screen justify-center items-center flex pr-3 pl-3 '>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-5 2xl:space-x-4 md:space-x-1 sm:space-x-4 gap-2 justify-center items-center sm:px-1 md:px-2 lg:px-2 px-2">
                                    {
                                        Array(6).fill(0).map((_, index) => (
                                            <div key={`skeleton_${index}`} className="bg-gray-400 w-[140px] h-[301px] rounded-md relative flex flex-col justify-between items-center hover:shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 animate-pulse">
                                                <div className='w-full absolute bottom-2 h-7 bg-gray-700 animate-pulse'>

                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        }
                        <div className="w-screen h-fit flex flex-col  justify-center items-center pb-7 space-y-3">
                            <h1 className='text-xl font-bold text-center font1 tracking-widest text-gray-700 mb-10'>
                                {Wide_Screen_Section_3.header}
                            </h1>
                            <div className='w-screen justify-center items-center flex'>
                                <GridVideoBox bannerLoading={bannerLoading} Wide_Screen_Section_3 ={Wide_Screen_Section_3} categoriesOptions = {categoriesOptions} />
                            </div>
                        </div>
                        <div className='pt-4 grid grid-cols-1 min-h-[200px] '>
                            <h1 className='text-xl px-8 font-bold font1 text-center text-slate-900 mb-6 mt-6'>{Small_Screen_Section_4.header}</h1>
                            <div className='w-screen flex justify-start items-center'>
                                <ul className='flex flex-row overflow-x-scroll'>
                                    {!bannerLoading && Small_Screen_Section_4 && Small_Screen_Section_4.urls.length > 0 ? Small_Screen_Section_4.urls.map((c, index) => (
                                        <Link key={index} to='/products' className='m-2'>
                                            <li className=''>
                                                <LazyLoadImage effect='blur' loading='lazy' src={c} alt={`${Small_Screen_Section_4.header}_${index}`} className="min-h-[80px] min-w-[120px]" />
                                            </li>
                                        </Link>
                                    )):(
                                        Array(8).fill(0).map((_, index) => (
                                            <li key={`skeleton_${index}`} className='m-2'>
                                                <div className="w-[120px] h-[170px] bg-gray-300 animate-pulse rounded-lg"></div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className='pt-4 w-[100vw] '>
                            <Carousel 
                                preventMovementUntilSwipeScrollTolerance
                                autoPlay={50000}
                                swipeable
                                infiniteLoop={true}
                                showThumbs={false} 
                                showStatus={false} 
                                showArrows={false} 
                                showIndicators={true} 
                                renderIndicator={(onClickHandler, isSelected, index, label) => indicator(onClickHandler, isSelected, index, label)}>
                                {!bannerLoading && Small_Screen_Section_5 && Small_Screen_Section_5.urls.length > 0 ?
                                    Small_Screen_Section_5.urls.map((mc, index) => (
                                        <Link key={`mc_banners_${index}`} to='/products'>
                                            <div>
                                                <LazyLoadImage effect='blur' loading='lazy' src={mc} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                                                <div className='h-[30px]'></div>
                                            </div>
                                        </Link>
                                )) : (
                                    Array(8).fill(0).map((_, index) => (
                                        <div key={index} className='h-[200px] w-full bg-gray-100 p-1 animate-pulse'>
                                            <div className="w-[98%] h-[90%] bg-gray-300 animate-pulse rounded-lg" />
                                        </div>
                                    ))
                                )}
                            </Carousel>
                        </div>

                        <Footer />
                    </Fragment>

            }
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
            {/* {showComponent === 'dialog' && <FullScreenOverlayDialog products={product}/>} */}
            {showComponent === 'coupon' && <FullScreenOverLayCouponPopUp />}
        </div>
    )
}


const GridVideoBox = ({ bannerLoading, Wide_Screen_Section_3, categoriesOptions }) => {
    const [inView, setInView] = useState([]);
    const videoRefs = useRef([]); // This will hold the refs for each video container
  
    useEffect(() => {
        // Set up the IntersectionObserver for each element dynamically
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const index = videoRefs.current.indexOf(entry.target); // Find which video is in view
                if (entry.isIntersecting) {
                    setInView((prevInView) => {
                        const newInView = [...prevInView];
                        newInView[index] = true; // Set this video to in view
                        return newInView;
                    });
                }
            });
        }, { threshold: 0.1 });
    
        // Observe all video containers
        videoRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });
    
        // Cleanup observer when the component is unmounted
        return () => {
            videoRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [Wide_Screen_Section_3?.urls.length]);
  
    return (
        <div className="grid font-kumbsan grid-cols-2 justify-center items-center gap-3 p-2">
            {bannerLoading? (
                // Skeleton Loader View when no URLs
                Array(8).fill(0).map((_, index) => (
                    <div
                        key={`skeleton_${index}`}
                        className="w-[170px] h-[400px] relative flex flex-col justify-start items-center bg-gray-300 rounded-lg p-1 animate-pulse"
                    >
                        <div className="w-full h-full relative">
                            <div className="min-w-full bg-gray-400 h-10 bottom-5 left-0 justify-start absolute h-30 animate-pulse items-start px-2 flex flex-row">
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                // Actual content when URLs are available
                Wide_Screen_Section_3 && Wide_Screen_Section_3.urls.length > 0 && Wide_Screen_Section_3.urls.slice(0, 8).map((url, index) => (
                    <div
                        key={`Index_${index}`}
                        ref={(el) => (videoRefs.current[index] = el)} // Set individual ref for each video container
                        className="h-auto min-w-full relative flex flex-col justify-center items-center hover:shadow-md transform transition-all duration-300 ease-in-out focus:scale-95"
                    >
                        {inView[index] ? (
                            <GridImageView imageToShow={url} startPlaying = {true} categoriesOptions={categoriesOptions} />
                        ) : (
                            <div className="w-[140px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[350px] 2xl:w-[400px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[550px] bg-gray-200 animate-pulse rounded-lg">
                                <div className="w-full h-full relative">
                                    <div className="min-w-full bg-gray-300 h-10 sm:h-12 md:h-14 lg:h-16 xl:h-18 2xl:h-20 bottom-5 left-0 justify-start absolute animate-pulse items-start px-2 flex flex-row">
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>
                ))
            )}
        </div>
    );
};
  
const OurMotoData = () => {
    const{WebsiteDisclaimer} = useSelector(state => state.websiteDisclaimer)
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetchWebsiteDisclaimer())
    },[dispatch])
    console.log("WebsiteDisclaimer options: ", WebsiteDisclaimer)
    return (
        <div className="h-fit w-screen  py-10">
            <div className="w-full flex justify-center items-center px-4 md:px-8 h-full">
                <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {
                        WebsiteDisclaimer && WebsiteDisclaimer.length > 0 ? WebsiteDisclaimer.map((website,index)=>(
                            <div key={`${index}-${website._id}`} className="relative group flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                                {/* <Truck size={40} className="text-gray-700 transition-transform duration-150 group-hover:scale-110 mb-4" /> */}
                                <img src={website?.iconImage} alt={`Disclaimer_Icon_${index}`} className="w-16 h-16 transition-transform duration-150 group-hover:scale-110 mb-4"/>
                                <h3 className="font-semibold text-xl text-gray-800">{website?.header}</h3>
                                <p className="font-light text-sm text-gray-600 text-center">{website?.body}</p>
                                
                                {/* Hover Text */}
                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                    <p className="text-center text-sm">{website?.hoverBody}</p>
                                </div>
                            </div>
                        )):(<Fragment>
                            {/* First Grid Item - Free Shipping */}
                            <div className="relative group flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                                <Truck size={40} className="text-gray-700 transition-transform duration-150 group-hover:scale-110 mb-4" />
                                <h3 className="font-semibold text-xl text-gray-800">FREE SHIPPING</h3>
                                <p className="font-light text-sm text-gray-600 text-center">On all orders over ₹75.00</p>
                                
                                {/* Hover Text */}
                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                    <p className="text-center text-sm">Enjoy free shipping on all your orders over ₹75.00.</p>
                                </div>
                            </div>

                            {/* Second Grid Item - Support 24/7 */}
                            <div className="relative group flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                                <Clock size={40} className="text-gray-700 transition-transform duration-150 group-hover:scale-110 mb-4" />
                                <h3 className="font-semibold text-xl text-gray-800">SUPPORT 24/7</h3>
                                <p className="font-light text-sm text-gray-600 text-center">Available to assist you anytime</p>
                                
                                {/* Hover Text */}
                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                    <p className="text-center text-sm">Our support team is available 24/7 to assist you with any questions or issues.</p>
                                </div>
                            </div>

                            {/* Third Grid Item - Money Return */}
                            <div className="relative group flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                                <CircleDollarSign size={40} className="text-gray-700 transition-transform duration-150 group-hover:scale-110 mb-4" />
                                <h3 className="font-semibold text-xl text-gray-800">MONEY RETURN</h3>
                                <p className="font-light text-sm text-gray-600 text-center">Hassle-free returns within 30 days</p>

                                {/* Hover Text */}
                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                    <p className="text-center text-sm">Enjoy hassle-free returns on all your purchases within 30 days.</p>
                                </div>
                            </div>

                            {/* Fourth Grid Item - Order Discount */}
                            <div className="relative group flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                                <BadgeIndianRupee size={40} className="text-gray-700 transition-transform duration-150 group-hover:scale-110 mb-4" />
                                <h3 className="font-semibold text-xl text-gray-800">ORDER DISCOUNT</h3>
                                <p className="font-light text-sm text-gray-600 text-center">Exclusive discounts on your orders</p>

                                {/* Hover Text */}
                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                    <p className="text-center text-sm">Get exclusive discounts on your orders during special promotions.</p>
                                </div>
                            </div>

                        </Fragment>)
                    }
                </div>
            </div>
        </div>
    );
};  
export default Home;