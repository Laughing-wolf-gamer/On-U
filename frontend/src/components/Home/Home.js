import React, { Fragment, CSSProperties, useEffect, useState, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'
import './home.css'


import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Allproduct, getOptionsByType } from '../../action/productaction'
import { useDispatch, useSelector } from 'react-redux'
import { featchallbanners, fetchAllCategoryBanners } from '../../action/banner.action'
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
import WhatsAppButton from './WhatsAppButton';


const Home = ({user}) => {
    const { product,loading:productLoading} = useSelector(state => state.Allproducts)
    // const { AllOptions} = useSelector(state => state.allOptions)
    const [categoriesOptions,setCategoryOptions] = useState([]);
    const { banners,loading:bannerLoading} = useSelector(state => state.banners)
    const { categoryBanners,loading:CategorybannerLoading} = useSelector(state => state.categoryBanners)
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
		dispatch(fetchAllCategoryBanners());
        dispatch(Allproduct())
        getSingleOptions();
    },[dispatch])
    
    useEffect(() => {
        // document.documentElement.scrollTo = 0;
        window.scrollTo(0,0)
    }, []);
	let WideScreen_Video = {urls:[], header:''};
	let MobileScreen_CategorySlider = {urls:[], header:''};

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
    // let Small_Screen_Section_2 = {urls:[],header:''};
    let Small_Screen_Section_3 = {urls:[],header:''};
    let Small_Screen_Section_4 = {urls:[],header:''};
    let Small_Screen_Section_5 = {urls:[],header:''};

	if(categoryBanners && categoryBanners.length > 0){
		WideScreen_Video.urls = categoryBanners.find((b_cat)=> b_cat?.CategoryType === "WideScreen_Video")?.Url || [];
		MobileScreen_CategorySlider.urls = categoryBanners.find((b_cat)=> b_cat?.CategoryType === "MobileScreen_CategorySlider")?.Url || [];
		WideScreen_Video.header = categoryBanners.find((b_cat)=> b_cat?.CategoryType === "WideScreen_Video")?.Header || "";
		MobileScreen_CategorySlider.header = categoryBanners.find((b_cat)=> b_cat?.CategoryType === "MobileScreen_CategorySlider")?.Header || "";
	}

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

        /* Small_Screen_Section_2.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 2")?.Url || []
        Small_Screen_Section_2.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 2")?.Header || "" */

        Small_Screen_Section_3.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 3")?.Url || []
        Small_Screen_Section_3.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 3")?.Header || ""

        Small_Screen_Section_4.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 4")?.Url || []
        Small_Screen_Section_4.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 4")?.Header || ""

        Small_Screen_Section_5.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 5")?.Url || []
        Small_Screen_Section_5.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 5")?.Header || ""
    }
    
    console.log("All categoryBanners ",WideScreen_Video,MobileScreen_CategorySlider);
    

    const [showComponent, setShowComponent] = useState(null);

    // Randomly decide which component to show
    useEffect(() => {
        const randomComponent = Math.random() < 0.5 ? 'coupon' : 'dialog';
        setShowComponent(randomComponent);
    }, []);
    const scrollableDivRef = useRef(null); // Create a ref to access the div element

    return (
        <div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto justify-start scrollbar bg-slate-200 overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300">
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
                            <h1 className='text-3xl font-bold text-center  tracking-widest text-gray-700 mb-10'>
                                {WideScreen_Video.header}
                            </h1>
                            <div className='w-full justify-center items-center flex'>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 2xl:grid-cols-4 justify-center items-center">
                                    {
                                        CategorybannerLoading || !WideScreen_Video || WideScreen_Video.urls.length <= 0 ? (
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
                                            WideScreen_Video.urls.slice(0, 8).map((url, index) => (
                                                <div
                                                    key={`Index_${index}`}
                                                    className={`h-auto min-w-full relative flex flex-col justify-center items-center hover:shadow-md transform transition-all duration-300 ease-in-out hover:scale-105`}
                                                >
                                                    {
                                                        url && <GridImageView imageToShow={url.url || url} startPlaying = {true} categoriesOptions={categoriesOptions} categoryName = {url.name} />
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
                            <h1 className='text-4xl font-bold text-gray-700 mb-8'>{Wide_Screen_Section_8.header}</h1>
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
                        <div className='w-[100vw] pb-7'>
                            <Carousel
                                preventMovementUntilSwipeScrollTolerance
                                className='' 
                                autoPlay={5000}
                                swipeable
                                infiniteLoop={true}
                                showThumbs={false} 
                                showStatus={false} 
                                showArrows={false} 
                                showIndicators={true} 
                                renderIndicator={(onClickHandler, isSelected, index, label) => indicator(onClickHandler, isSelected, index, label)}>
                                    {!bannerLoading &&  Small_Screen_Section_1 && Small_Screen_Section_1.urls && Small_Screen_Section_1.urls.length > 0 ? (
                                        Small_Screen_Section_1.urls.map((mb, index) => (
                                            <Link key={`mb_banners_${index}`} to='/products'>
                                                <LazyLoadImage effect='blur' src={mb} loading='lazy' width='100%' alt='Banner_Image' className='min-h-[200px]' />
                                            </Link>
                                        ))
                                    ) : (
                                        // Skeleton Loader for the Carousel Items
                                        Array(8).fill(0).map((_, index) => (
                                            <div className='w-full p-1 animate-pulse'>
												<div key={index} className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] bg-gray-300 animate-pulse rounded-lg" />
											</div>
                                        ))
                                    )}
                            </Carousel>
                        </div>
						
                        {/* <div className='px-2'>
                            {!bannerLoading && Small_Screen_Section_2.header && <h1 className='text-2xl px-8 font-extrabold text-center text-gray-700 pb-6 pt-6'>{Small_Screen_Section_2.header}</h1>}
                            <ul className='flex overflow-x-scroll'>
                                {!bannerLoading && Small_Screen_Section_2 && Small_Screen_Section_2.urls.length > 0 ? 
                                    Small_Screen_Section_2.urls.map((d, index) => (
                                        <Link key={`${Small_Screen_Section_2.header}_banners${index}`} to='/products'>
                                            <li className='w-max mr-2'>
                                                <LazyLoadImage effect='blur' loading='lazy' src={d} alt={`${Small_Screen_Section_2.header}_${index}`} className="w-[50vw] min-h-[200px]" />
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
                        </div> */}
						<div className='bg-slate-200 px-2'>{/* Category */}
							<ul className='flex overflow-x-scroll hide-scroll-bar scrollbar-track-black scrollbar-thumb-gray-600'>
								{
									!CategorybannerLoading && MobileScreen_CategorySlider && MobileScreen_CategorySlider.urls.length > 0 ? (
										<div className="flex overflow-x-auto bg-slate-200 pt-6 items-start scrollbar-hide">
											{MobileScreen_CategorySlider.urls.map((image, index) => {
												const handleQueryParmams = () => {
													const queryParams = new URLSearchParams();
													if (image.name) queryParams.set('category', image.name.toLowerCase());
													const url = `/products?${queryParams.toString()}`;
													navigation(url);
												}
												return (
													<li key={`image_icons${index}`} onClick={handleQueryParmams} className="flex-shrink-0 w-24 px-0.5 justify-center items-center"> {/* Fixed width for images */}
														<LazyLoadImage
															effect="blur"
															src={image.url || image}
															alt={`image_icons_${index}`}
															className="w-full h-fit min-h-[110px] object-fill" 
														/>
													</li>
												)
											})}
										</div>
									):(
										<Fragment></Fragment>
									)
								}
							</ul>
						</div>
                        {!productLoading && product && product.length > 0 ? <ProductPreviewFull product={product} user={user}/> : 
                            <div className='w-full justify-center items-center flex pr-3 pl-3 '>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-5 gap-2 justify-center items-center sm:px-1 md:px-2 lg:px-2 px-2">
									{
										Array(6).fill(0).map((_, index) => (
											<div key={`skeleton_${index}`} className="bg-gray-400 w-full sm:w-[140px] md:w-[180px] lg:w-[200px] xl:w-[220px] h-[301px] rounded-md relative flex flex-col justify-between items-center hover:shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 animate-pulse">
												<div className='w-full absolute bottom-2 h-7 bg-gray-700 animate-pulse'>
												</div>
											</div>
										))
									}
								</div>
							</div>

                        }
						{/* <OurMotoData/> */}

                        
                        <div className="w-full flex flex-col justify-center items-center pb-2 space-y-3">
                            <h1 className='text-2xl font-extrabold text-center tracking-widest text-gray-700 py-3'>
                                {WideScreen_Video.header}
                            </h1>
                            <div className='w-screen justify-center items-center flex'>
                                <GridVideoBox bannerLoading={CategorybannerLoading} WideScreen_Video ={WideScreen_Video} categoriesOptions = {categoriesOptions} />
                            </div>
                        </div>
						<div className='px-2'>
                            <h1 className='text-2xl px-8 font-extrabold text-center text-gray-700 pb-6 pt-6'>{Small_Screen_Section_3.header}</h1>
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
                        <div className='mt-1 grid grid-cols-1 min-h-[200px] '>
                            <h1 className='text-2xl font-extrabold text-center text-gray-700 mb-6 mt-6'>{Small_Screen_Section_4.header}</h1>
                            <div className='w-full px-2 flex justify-start items-center'>
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
												<div className="w-[100px] sm:w-[120px] md:w-[150px] lg:w-[170px] xl:w-[200px] 
													h-[150px] sm:h-[170px] md:h-[200px] lg:h-[220px] xl:h-[250px] 
													bg-gray-300 animate-pulse rounded-lg">
												</div>
											</li>

                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className='pt-4 px-2 w-[100vw] '>
                            <Carousel 
                                preventMovementUntilSwipeScrollTolerance
                                autoPlay={5000}
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
            {/* {showComponent === 'dialog' && <FullScreenOverlayDialog products={product}/>} */}
            {showComponent === 'coupon' && <FullScreenOverLayCouponPopUp />}
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef}/>
        </div>
    )
}


const GridVideoBox = ({ bannerLoading, WideScreen_Video, categoriesOptions }) => {
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
    }, [WideScreen_Video?.urls.length]);
  
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
                WideScreen_Video && WideScreen_Video.urls.length > 0 && WideScreen_Video.urls.slice(0, window.screen.width > 1024 ? 8 : 4).map((url, index) => (
                    <div
                        key={`Index_${index}`}
                        ref={(el) => (videoRefs.current[index] = el)} // Set individual ref for each video container
                        className="h-auto min-w-full relative flex flex-col justify-center items-center hover:shadow-md transform transition-all duration-300 ease-in-out focus:scale-95"
                    >
                        {inView[index] ? (
                            <GridImageView imageToShow={url.url} startPlaying = {true} categoriesOptions={categoriesOptions} categoryName = {url?.name} />
                        ) : (
                            <div className="w-[120px] sm:w-[160px] md:w-[200px] lg:w-[250px] xl:w-[300px] 2xl:w-[350px] 
								h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px] 
								bg-gray-200 animate-pulse rounded-lg">
								<div className="w-full h-full relative">
									<div className="min-w-full bg-gray-300 
										h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 2xl:h-18 
										bottom-5 left-0 justify-start absolute animate-pulse items-start px-1 sm:px-2 md:px-3 flex flex-row">
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
        <div className="h-fit w-screen py-10">
            <div className="w-full flex justify-center items-center px-4 md:px-8 h-full">
                <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-10 md:gap-12 xl:gap-12 2xl:gap-12 lg:gap-12">
                    {
                        WebsiteDisclaimer && WebsiteDisclaimer.length > 0 ? WebsiteDisclaimer.map((website, index) => (
                            <div key={`${index}-${website._id}`} className="relative group justify-between md:justify-center sm:justify-center flex flex-col items-center min-w-[140px] p-4 sm:p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                                <img src={website?.iconImage} alt={`Disclaimer_Icon_${index}`} className="w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-150 group-hover:scale-110 mb-4"/>
                                <div>
                                    <h3 className="font-semibold text-center text-base sm:text-sm text-gray-800">{website?.header}</h3>
                                    <p className="font-light text-xs sm:text-sm text-gray-600 text-center">{website?.body}</p>
                                </div>
                                
                                {/* Hover Text */}
                                <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                    <p className="text-center text-xs sm:text-sm">{website?.hoverBody}</p>
                                </div>
                            </div>
                        )) : (
                            <Fragment>
                                {/* First Grid Item - Free Shipping */}
                                <div className="relative group flex flex-col items-center p-4 sm:p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                                    <Truck size={40} className="text-gray-700 transition-transform duration-150 group-hover:scale-110 mb-4" />
                                    <h3 className="font-semibold text-lg sm:text-xl text-gray-800">FREE SHIPPING</h3>
                                    <p className="font-light text-xs sm:text-sm text-gray-600 text-center">On all orders over ₹75.00</p>
                                    
                                    {/* Hover Text */}
                                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                        <p className="text-center text-xs sm:text-sm">Enjoy free shipping on all your orders over ₹75.00.</p>
                                    </div>
                                </div>

                                {/* Second Grid Item - Support 24/7 */}
                                <div className="relative group flex flex-col items-center p-4 sm:p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                                    <Clock size={40} className="text-gray-700 transition-transform duration-150 group-hover:scale-110 mb-4" />
                                    <h3 className="font-semibold text-lg sm:text-xl text-gray-800">SUPPORT 24/7</h3>
                                    <p className="font-light text-xs sm:text-sm text-gray-600 text-center">Available to assist you anytime</p>
                                    
                                    {/* Hover Text */}
                                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                        <p className="text-center text-xs sm:text-sm">Our support team is available 24/7 to assist you with any questions or issues.</p>
                                    </div>
                                </div>

                                {/* Third Grid Item - Money Return */}
                                <div className="relative group flex flex-col items-center p-4 sm:p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                                    <CircleDollarSign size={40} className="text-gray-700 transition-transform duration-150 group-hover:scale-110 mb-4" />
                                    <h3 className="font-semibold text-lg sm:text-xl text-gray-800">MONEY RETURN</h3>
                                    <p className="font-light text-xs sm:text-sm text-gray-600 text-center">Hassle-free returns within 30 days</p>

                                    {/* Hover Text */}
                                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                        <p className="text-center text-xs sm:text-sm">Enjoy hassle-free returns on all your purchases within 30 days.</p>
                                    </div>
                                </div>

                                {/* Fourth Grid Item - Order Discount */}
                                <div className="relative group flex flex-col items-center p-4 sm:p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                                    <BadgeIndianRupee size={40} className="text-gray-700 transition-transform duration-150 group-hover:scale-110 mb-4" />
                                    <h3 className="font-semibold text-lg sm:text-xl text-gray-800">ORDER DISCOUNT</h3>
                                    <p className="font-light text-xs sm:text-sm text-gray-600 text-center">Exclusive discounts on your orders</p>

                                    {/* Hover Text */}
                                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                        <p className="text-center text-xs sm:text-sm">Get exclusive discounts on your orders during special promotions.</p>
                                    </div>
                                </div>

                            </Fragment>
                        )
                    }
                </div>
            </div>
        </div>


    );
};  
export default Home;