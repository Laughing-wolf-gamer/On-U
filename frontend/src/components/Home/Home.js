import React, { Fragment, CSSProperties, useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'
import './home.css'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Allproduct } from '../../action/productaction'
import { useDispatch, useSelector } from 'react-redux'
import { BadgeIndianRupee, CircleDollarSign, Clock, Truck } from 'lucide-react'

import ProductPreviewFull from './ProductPreviewFull'
import CarousalView from './CarousalView'
import DraggableImageSlider from './DraggableImageSlider'
import FullScreenOverLayCouponPopUp from './FullScreenOverLayCouponPopUp'
import Footer from '../Footer/Footer'
import GridImageView from './GridImageView'
import { fetchWebsiteDisclaimer } from '../../action/common.action';
import BackToTopButton from './BackToTopButton';
import WhatsAppButton from './WhatsAppButton';
import { useServerBanners } from '../../Contaxt/ServerBannerContext';
import TrackVisite from '../TrackVisite';


const Home = ({user}) => {
	const [showComponent, setShowComponent] = useState(null);
	const{banners,categoryBanners,bannerLoading,CategoryBannerLoading,categoriesOptions,noFilterProducts,productAllProductsLoading} = useServerBanners();
    const dispatch = useDispatch();
	const scrollableDivRef = useRef(null); // Create a ref to access the div element
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
    useEffect(()=>{
        dispatch(Allproduct())
    },[])
    
    useEffect(() => {
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

        Small_Screen_Section_3.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 3")?.Url || []
        Small_Screen_Section_3.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 3")?.Header || ""

        Small_Screen_Section_4.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 4")?.Url || []
        Small_Screen_Section_4.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 4")?.Header || ""

        Small_Screen_Section_5.urls = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 5")?.Url || []
        Small_Screen_Section_5.header = banners.find((ma_cat)=> ma_cat?.CategoryType === "Small Screen Section- 5")?.Header || ""
    }
    

    // Randomly decide which component to show
    useEffect(() => {
        const randomComponent = Math.random() < 0.5 ? 'coupon' : 'dialog';
        setShowComponent(randomComponent);
    }, []);
	console.log("All Category Banner: ",CategoryBannerLoading,WideScreen_Video);
    
	
    return (
        <div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto justify-start scrollbar bg-slate-200 overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300">
            {
                window.screen.width > 1024 ?
                    <Fragment >
                        <div className='pt-1 min-w-[70%] h-fit relative'>
                            <CarousalView b_banners={Wide_Screen_Section_1.urls} indicator={indicator} bannerLoading = {bannerLoading}/>
                        </div>
                        <OurMotoData/>
						{
							productAllProductsLoading ? <div className='w-full justify-self-center max-w-screen-2xl justify-center items-center flex px-14'>
								<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 justify-center items-center justify-self-center max-w-screen-2xl">
									{
										Array(8).fill(0).map((_, index) => (
											<div 
												key={`skeleton_${index}`} 
												className="bg-gray-400 sm:w-[300px] sm:h-[700px] w-[230px] h-[400px] px-5 rounded-md relative flex flex-col justify-between items-center hover:shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 animate-pulse"
											>
												<div className='w-full absolute bottom-0 h-32 bg-gray-700 animate-pulse'></div>
											</div>
										))
									}
								</div>
                            </div>:(
								<Fragment>
                        			{noFilterProducts && noFilterProducts.length > 0 && <ProductPreviewFull product={noFilterProducts} user={user}/>}
								</Fragment>
							)
						}
                        {WideScreen_Video && WideScreen_Video.urls.length > 0 && (
								<div className="w-full max-w-screen-2xl justify-self-center flex flex-col justify-center uppercase items-center pb-7 space-y-3 px-14">
									{
										WideScreen_Video.header && <div className='w-full justify-center items-center flex rounded-md mb-8'>
											<strong className='text-4xl hover:underline text-left font-bold text-gray-700'>{WideScreen_Video.header}</strong>
										</div>
									}
									<div className='w-full justify-center items-center flex'>
										{
											CategoryBannerLoading ? (
												<ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 2xl:grid-cols-4 justify-center items-center">
													{
														Array(8).fill(0).map((_, index) => (
															<li key={`skeleton_${index}`} className="sm:w-[300px] sm:h-[700px] w-[230px] h-[400px] flex flex-col justify-start items-center bg-gray-300 rounded-lg animate-pulse">
																<div className="w-full h-full relative">
																	<div className="min-w-full bg-gray-400 h-10 bottom-5 left-0 justify-start absolute h-30 items-start px-2 flex flex-row">
																	</div>
																</div>
															</li>
														))
													}
												</ul>	
											):(
												<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 2xl:grid-cols-4 justify-center items-center'>
													{
														WideScreen_Video && WideScreen_Video.urls.length > 0 && WideScreen_Video.urls.slice(0, 8).map((url, index) => (
															<div
																key={`Index_${index}`}
																className={`h-auto w-auto relative flex flex-col justify-center items-center`}
															>
																<GridImageView imageToShow={url.url || url} startPlaying = {true} categoriesOptions={categoriesOptions} categoryName = {url.name} />
															</div>
														)) 
													}
												</div>
											)
										}
									</div>
								</div>
							)
						}
                        <DraggableImageSlider images={Wide_Screen_Section_2.urls} headers={Wide_Screen_Section_2.header} bannerLoading = {bannerLoading}/> 
                        <DraggableImageSlider images={Wide_Screen_Section_4.urls} headers={Wide_Screen_Section_4.header} bannerLoading = {bannerLoading}/> 
                        <DraggableImageSlider images={Wide_Screen_Section_5.urls} headers={Wide_Screen_Section_5.header} bannerLoading = {bannerLoading}/>
                        <DraggableImageSlider images={Wide_Screen_Section_6.urls} headers={Wide_Screen_Section_6.header} bannerLoading = {bannerLoading}/> 
                        <DraggableImageSlider images={Wide_Screen_Section_7.urls} headers={Wide_Screen_Section_7.header} bannerLoading = {bannerLoading}/>
                        {
							bannerLoading ? <Fragment>
								{
									Array(8).fill(0).map((_, index) => (
										<div key={`skeleton_${index}`} className="w-[300px] h-[700px] relative flex flex-col justify-start items-center bg-gray-300 rounded-lg p-4 animate-pulse">
										</div>
									))
								}
							
							</Fragment>:(
								<Fragment>
									{
										Wide_Screen_Section_8 && Wide_Screen_Section_8.urls.length > 0 && <div className=' w-full max-w-screen-2xl justify-self-center justify-center items-center flex flex-col px-14'>
											{Wide_Screen_Section_8.header && <strong className='text-4xl hover:underline text-center font-bold text-gray-700 mb-8'>{Wide_Screen_Section_8.header}</strong>} 
											<div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4'>
												{Wide_Screen_Section_8.urls.map((j, index) => (
														<Link key={`j_banners_${index}`} to='/products' className='m-1'>
															<LazyLoadImage 
																useIntersectionObserver
																	wrapperProps={{
																	// If you need to, you can tweak the effect transition using the wrapper style.
																	style: {transitionDelay: "1s"},
																}}
																placeholder = {<div className="w-full h-full bg-gray-200 animate-pulse"></div>}	
																loading='lazy'
																effect='blur' src={j} alt={`${Wide_Screen_Section_8.header}_${index}`} className="min-h-[200px] w-full rounded-lg shadow-md"/>
														</Link>
													))
												}
											</div>
										</div>
									}
								</Fragment>
							)
						}
                        
                        <DraggableImageSlider images={Wide_Screen_Section_9.urls} headers={Wide_Screen_Section_9.header} bannerLoading = {bannerLoading}/>
                        <DraggableImageSlider images={Wide_Screen_Section_10.urls} headers={Wide_Screen_Section_10.header} bannerLoading = {bannerLoading}/>
                        <DraggableImageSlider images={Wide_Screen_Section_11.urls} headers={Wide_Screen_Section_11.header} showArrows={false} bannerLoading = {bannerLoading}/> 
                        <Footer/>
                    </Fragment >
                :
                    <div className='space-y-4'>
						{
							bannerLoading ? <div className="flex overflow-x-auto bg-slate-200 pt-6 items-start">
								{/* Skeleton Loader for each item */}
								{Array(8).fill(0).map((_, index) => (
									<li
										key={`skeleton_loader_${index}`}
										className="flex-shrink-0 px-0.5 justify-center relative items-center"
									>
										<div className="min-w-[210px] min-h-[210px] bg-gray-400 animate-pulse">
										</div>
									</li>
								))}
							</div>:(
								<div className='w-[100vw]'>
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
											{Small_Screen_Section_1 && Small_Screen_Section_1.urls && Small_Screen_Section_1.urls.length > 0 && (
												Small_Screen_Section_1.urls.map((mb, index) => (
													<Link key={`mb_banners_${index}`} to='/products'>
														<LazyLoadImage effect='blur' src={mb} loading='lazy' width='100%' alt='Banner_Image' className='min-h-[200px]' />
													</Link>
												))
											)}
									</Carousel>
								</div>
							)
						}

						<CategorySlider MobileScreen_CategorySlider={MobileScreen_CategorySlider} CategoryBannerLoading={CategoryBannerLoading} />
						<div>
							{productAllProductsLoading ? <div className='w-full justify-self-center max-w-screen-2xl justify-center items-center flex px-14 '>
									<div className="grid grid-cols-2 gap-4 justify-center items-center px-4">
										{
											Array(5).fill(0).map((_, index) => (
												<div 
													key={`skeleton_${index}`} 
													className="bg-gray-400 w-[100%] h-[400px] px-2 rounded-md justify-end items-center py-2 flex flex-col animate-pulse"
												>
													<div className='w-full h-16 bg-gray-600'></div>
												</div>
											))
										}
									</div>
								</div>:(
									<>
										{noFilterProducts && noFilterProducts.length > 0 && <ProductPreviewFull product={noFilterProducts} user={user}/>}
									</>
								)
							}
						</div>
                        <div className="flex flex-col justify-center items-center pb-2 space-y-3 overflow-hidden w-full">
							<div className='px-4 py-2 justify-center items-center flex border border-gray-700 rounded-md mb-3'>
								{
									WideScreen_Video && WideScreen_Video.header && <strong className='text-3xl hover:underline text-center font-extrabold text-gray-700'>{WideScreen_Video.header}</strong>
								}
							</div>
							<div className='justify-center items-center flex flex-shrink-0'>
								<GridVideoBox bannerLoading={CategoryBannerLoading} WideScreen_Video ={WideScreen_Video} categoriesOptions = {categoriesOptions} />
							</div>
						</div>

						<div className='mt-1 grid grid-cols-1 min-h-[200px] px-4 rounded-xl'>
                            {
								Small_Screen_Section_3.header && <strong className='text-2xl text-left hover:underline font-extrabold text-gray-700 mb-8'>{Small_Screen_Section_3.header}</strong>
							}
                            <ul className='flex flex-row overflow-x-scroll'>
                                {!bannerLoading && Small_Screen_Section_3 && Small_Screen_Section_3.urls.length > 0 ? 
                                    Small_Screen_Section_3.urls.map((d, index) => (
                                        <Link key={`${Small_Screen_Section_3.header}_banners${index}`} to='/products' className='m-2'>
                                            <li className='w-max'>
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
                        <div className='mt-1 grid grid-cols-1 min-h-[200px] rounded-xl'>
                            {Small_Screen_Section_4.header && <h1 className='text-3xl hover:underline text-center font-extrabold text-gray-700 mb-8'>{Small_Screen_Section_4.header}</h1>} 
                            <div className='w-full px-2 flex justify-start items-center'>
                                <ul className='flex flex-row overflow-x-scroll'>
                                    {!bannerLoading && Small_Screen_Section_4 && Small_Screen_Section_4.urls.length > 0 ? Small_Screen_Section_4.urls.map((c, index) => (
                                        <Link key={index} to='/products' className='m-2'>
                                            <li className=''>
                                                <LazyLoadImage
												useIntersectionObserver
												wrapperProps={{
													// If you need to, you can tweak the effect transition using the wrapper style.
													style: {transitionDelay: "1s"},
												}}
												placeholder = {<div className="w-full h-full bg-gray-200 animate-pulse"></div>}	 
												effect='blur' loading='lazy' src={c} alt={`${Small_Screen_Section_4.header}_${index}`} className="min-h-[80px] min-w-[120px]" />
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
                                                <LazyLoadImage 
													effect='blur' 
													loading='lazy' src={mc} 
													width='100%' 
													alt='Banner_Image' 
													className='min-h-[200px]' 
													wrapperProps={{
														// If you need to, you can tweak the effect transition using the wrapper style.
														style: {transitionDelay: "1s"},
													}}
													placeholder = {<div className="w-full h-full bg-gray-200 animate-pulse"></div>}	
												/>
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
                    </div>

            }
            
            {/* {showComponent === 'dialog' && <FullScreenOverlayDialog products={product}/>} */}
            {showComponent === 'coupon' && <FullScreenOverLayCouponPopUp />}
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef}/>
			<TrackVisite/>
        </div>
    )
}


const CategorySlider = ({ MobileScreen_CategorySlider, CategoryBannerLoading }) => {
	const navigation = useNavigate();

	// Handle the query params for navigation
	const handleQueryParams = (image) => {
		const queryParams = new URLSearchParams();
		if (image.name) queryParams.set('category', image.name.toLowerCase());
		const url = `/products?${queryParams.toString()}`;
		navigation(url);
	};

	// Intersection Observer for detecting when the images come into view

	return (
		<div className="px-2">
			{/* Category */}
			<div className='px-2 py-2 my-2 w-full justify-center items-center bg-gray-100 flex-col border border-gray-700 rounded-md'>
				<h1 className='text-center text-black font-medium text-base'>ON U Exclusive Categories</h1>
			</div>
			<ul
				className="flex overflow-x-scroll hide-scroll-bar scrollbar-track-black scrollbar-thumb-gray-600"
			>
				{CategoryBannerLoading ? (
						<div className="flex overflow-x-auto bg-slate-200 pt-6 items-start scrollbar-hide">
							{/* Skeleton Loader for each item */}
							{[...Array(5)].map((_, index) => (
								<li
									key={`skeleton_loader_${index}`}
									className="flex-shrink-0 px-0.5 justify-center relative items-center"
								>
									<div className="w-[120px] min-h-[110px] bg-gray-400 animate-pulse">
									</div>
								</li>
							))}
						</div>
					):(
						<Fragment>
							{MobileScreen_CategorySlider && MobileScreen_CategorySlider.urls.length > 0 && (
								<div className="flex overflow-x-auto bg-slate-200 pt-2 items-start scrollbar-hide">
									{MobileScreen_CategorySlider.urls.map((image, index) => {
										return (
											<li
											key={`image_icons${index}`}
											onClick={() => handleQueryParams(image)}
											className="flex-shrink-0 w-28 min-h-[110px] px-0.5 justify-center relative items-center overflow-hidden"
										>
											
											<LazyLoadImage
												effect="blur"
												loading='lazy'
												wrapperProps={{
													// If you need to, you can tweak the effect transition using the wrapper style.
													style: {transitionDelay: "1s"},
												}}
												placeholder = {<div className="w-full h-full bg-gray-200 animate-pulse"></div>}
												src={image.url || image}
												alt={`image_icons_${index}`}
												className="category-image w-full justify-self-center h-full object-cover"
												data-category={image.name.toLowerCase()} // Store the category name
											/>
												{/* Display the banner if the category is in view */}
												{image.name && (
													<div
														className={`category-banner text-black bg-white font-bold uppercase h-min max-h-min text-[12px] w-[90%] opacity-70 rounded-sm absolute bottom-1/3 left-1/2 translate-x-[-50%] translate-y-[-50%] text-center transition-opacity duration-500 ease-out`}
													>
														{image.name}
													</div>
												)}
											</li>
										);
									})}
								</div>
							)}
						</Fragment>
					)
				}
			</ul>
		</div>
	);
};


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
        }, { threshold: 0.9 });
    
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
    }, [WideScreen_Video]);
	const isMobileView = window.innerWidth <= 1024;

	return (
		<div className="grid grid-cols-2 justify-center items-center gap-4 p-2">
			{bannerLoading ? (
				// Skeleton Loader View when no URLs
				Array(4).fill(0).map((_, index) => (
					<div
						key={`skeleton_${index}`}
						className="w-[30vw] h-[300px] px-5 sm:w-[36vw] sm:h-[370px]relative flex flex-col justify-start items-center bg-gray-300 rounded-lg p-1 animate-pulse"
					>
						<div className="w-full h-full relative">
							<div className="min-w-full bg-gray-400 h-10 bottom-5 left-0 justify-start absolute h-30 animate-pulse items-start px-2 flex flex-row">
							</div>
						</div>
					</div>
				))
			) : (
				// Actual content when URLs are available
				WideScreen_Video && WideScreen_Video.urls.length > 0 && WideScreen_Video.urls.slice(0, !isMobileView ? 8 : 4).map((url, index) => {
					return (
						<div
							key={`Index_${index}`}
							ref={(el) => (videoRefs.current[index] = el)} // Set individual ref for each video container
							className="h-auto w-[45vw] relative flex flex-col justify-center items-center"
						>
							<GridImageView
								imageToShow={url.url}
								startPlaying={inView[index]}
								categoriesOptions={categoriesOptions}
								categoryName={url?.name}
							/>
							{/* {inView[index] ? (
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
							)} */}
						</div>
					)
				})
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
                                <LazyLoadImage
									effect="blur"
									loading="lazy"
									useIntersectionObserver = {true}
									src={website?.iconImage} 
									alt={`Disclaimer_Icon_${index}`} 
									className="w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-150 group-hover:scale-110 mb-4"
									wrapperProps={{
										// If you need to, you can tweak the effect transition using the wrapper style.
										style: {transitionDelay: "1s"},
									}}
									placeholder = {<div className="w-full h-full bg-gray-200 animate-pulse"></div>}
								/>
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