import React, { Fragment, CSSProperties, useEffect, useState } from 'react'
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


const Home = ({user}) => {
    const { product} = useSelector(state => state.Allproducts)
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
            style={{ ...indicatorStyles, background: '#7E99A3' }}
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
    // console.log("Categories options: ", categoriesOptions)

    const [showComponent, setShowComponent] = useState(null);

    // Randomly decide which component to show
    useEffect(() => {
        const randomComponent = Math.random() < 0.5 ? 'coupon' : 'dialog';
        setShowComponent(randomComponent);
    }, []);


    return (
        <div className="w-screen h-screen overflow-y-auto justify-start scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
            {
                window.screen.width > 1024 ?
                    <Fragment >
                        <div className='pt-1 w-[100vw] h-fit relative bg-slate-200'>
                            <CarousalView b_banners={Wide_Screen_Section_1.urls} indicator={indicator} bannerLoading = {bannerLoading}/>
                        </div>
                        <OurMotoData/>
                    
                        {product && product.length > 0 && <ProductPreviewFull product={product} user={user}/>}
                        <div className="w-screen h-fit flex flex-col bg-slate-200 justify-center items-center pb-7 space-y-3 px-12">
                            <h1 className='text-3xl font-bold text-center font1 tracking-widest text-gray-700 mb-10'>
                                {Wide_Screen_Section_3.header}
                            </h1>
                            <div className='w-screen justify-center items-center flex pr-20 pl-20'>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 2xl:grid-cols-4 justify-center items-center">
                                    {
                                        !bannerLoading && Wide_Screen_Section_3 && Wide_Screen_Section_3.urls.length <= 0 ? (
                                            // Skeleton Loader View when no URLs
                                            Array(8).fill(0).map((_, index) => (
                                                <div key={`skeleton_${index}`} className="w-[500px] h-[800px] relative flex flex-col justify-start items-center bg-gray-300 rounded-lg p-4 animate-pulse">
                                                </div>
                                            ))
                                        ) : (
                                            // Actual content when URLs are available
                                            Wide_Screen_Section_3.urls.slice(0, 8).map((url, index) => (
                                                <div
                                                    key={`Index_${index}`}
                                                    className="h-auto min-w-full relative flex flex-col justify-center items-center hover:shadow-md transform transition-all duration-300 ease-in-out hover:scale-105"
                                                >
                                                    <GridImageView imageToShow={url} categoriesOptions={categoriesOptions} />
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
                        
                        <div className='bg-slate-200 w-screen justify-center items-center flex flex-col pl-[80px] pr-[70px]'>
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
                        {/* {
                            Small_Screen_Section_1 && Small_Screen_Section_1.urls && <div className='bg-slate-200'>
                                <ul className='flex overflow-x-scroll hide-scroll-bar scrollbar-track-black scrollbar-thumb-gray-600'>
                                    <DraggingScrollView images={Small_Screen_Section_1.urls} />
                                </ul>
                            </div>
                        } */}
                        

                        <div className='w-[100vw] bg-slate-200'>
                            <Carousel
                                preventMovementUntilSwipeScrollTolerance 
                                className='bg-slate-200' 
                                autoPlay={1000}
                                swipeable
                                infiniteLoop={true}
                                showThumbs={false} 
                                showStatus={false} 
                                showArrows={false} 
                                showIndicators={true} 
                                renderIndicator={(onClickHandler, isSelected, index, label) => indicator(onClickHandler, isSelected, index, label)}>
                                    {!bannerLoading && Small_Screen_Section_2 && Small_Screen_Section_2.urls && Small_Screen_Section_2.urls.length > 0 ? (
                                        Small_Screen_Section_2.urls.map((mb, index) => (
                                            <Link key={`mb_banners_${index}`} to='/products'>
                                                <LazyLoadImage effect='blur' src={mb} loading='lazy' width='100%' alt='Banner_Image' className='min-h-[200px]' />
                                            </Link>
                                        ))
                                    ) : (
                                        // Skeleton Loader for the Carousel Items
                                        <div className="flex w-full justify-center space-x-4">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <div key={index} className="w-[80%] min-h-[200px] bg-gray-300 animate-pulse rounded-lg" />
                                            ))}
                                        </div>
                                    )}
                            </Carousel>
                        </div>


                        <div className='bg-slate-200'>
                            <h1 className='text-xl px-8 font-bold font1 text-center text-gray-700 pb-6 pt-6'>{Small_Screen_Section_3.header}</h1>
                            <ul className='flex overflow-x-scroll'>
                                {!bannerLoading && Small_Screen_Section_3 && Small_Screen_Section_3?.urls.length > 0 ? 
                                    Small_Screen_Section_3.urls.map((d, index) => (
                                    <Link key={`${Small_Screen_Section_3.header}_banners${index}`} to='/products'>
                                        <li className='w-max mr-2'>
                                            <LazyLoadImage effect='blur' loading='lazy' src={d} alt={`${Small_Screen_Section_3.header}_${index}`} className="w-[50vw] min-h-[200px]" />
                                        </li>
                                    </Link>
                                )) : (
                                    <li className='w-max mr-2'>
                                        <div className="w-[50vw] min-h-[200px] bg-gray-300 animate-pulse rounded-lg"></div>
                                    </li>
                                )}
                            </ul>
                        </div>
                        {/* <OurMotoData/> */}
                        {product && product.length && <ProductPreviewFull product={product} user={user}/>}
                            <div className="w-screen h-fit flex flex-col bg-slate-200 justify-center items-center pb-7 space-y-3">
                                <h1 className='text-3xl font-bold text-center font1 tracking-widest text-gray-700 mb-10'>
                                    {Wide_Screen_Section_3.header}
                                </h1>
                                <div className='w-screen justify-center items-center flex'>

                                    <div className="grid grid-cols-2 justify-center items-center gap-3 p-2">
                                        {
                                            !bannerLoading && Wide_Screen_Section_3 && Wide_Screen_Section_3.urls.length <= 0 ? (
                                                // Skeleton Loader View when no URLs
                                                Array(8).fill(0).map((_, index) => (
                                                    <div key={`skeleton_${index}`} className="w-[500px] h-[800px] relative flex flex-col justify-start items-center bg-gray-300 rounded-lg p-4 animate-pulse">
                                                    </div>
                                                ))
                                            ) : (
                                                // Actual content when URLs are available
                                                Wide_Screen_Section_3.urls.slice(0, 8).map((url, index) => (
                                                    <div
                                                        key={`Index_${index}`}
                                                        className="h-auto bg-blue-400 min-w-full relative flex flex-col justify-center items-center hover:shadow-md transform transition-all duration-300 ease-in-out hover:scale-105"
                                                    >
                                                        <GridImageView imageToShow={url} categoriesOptions={categoriesOptions} />
                                                    </div>
                                                ))
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        <div className='pt-4 grid grid-cols-1 min-h-[200px] bg-slate-200'>
                            <h1 className='text-xl px-8 font-bold font1 text-center text-slate-900 mb-6 mt-6'>{Small_Screen_Section_4.header}</h1>
                            <div className='w-screen flex justify-start items-center'>
                                <ul className='flex flex-row overflow-x-scroll'>
                                    {!bannerLoading && Small_Screen_Section_4 && Small_Screen_Section_4?.urls.length > 0 ? Small_Screen_Section_4.urls.map((c, index) => (
                                        <Link key={index} to='/products' className='m-2'>
                                            <li className=''>
                                                <LazyLoadImage effect='blur' loading='lazy' src={c} alt={`${Small_Screen_Section_4.header}_${index}`} className="min-h-[80px] min-w-[120px]" />
                                            </li>
                                        </Link>
                                    )):(
                                        Array(8).fill(0).map((_, index) => (
                                            <li key={`skeleton_${index}`} className='m-2'>
                                                <div className="w-[120px] h-[80px] bg-gray-300 animate-pulse rounded-lg"></div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className='pt-4 w-[100vw] bg-slate-200'>
                            <Carousel showThumbs={false} showStatus={false} showArrows={false} showIndicators={true} renderIndicator={(onClickHandler, isSelected, index, label) => indicator(onClickHandler, isSelected, index, label)}>
                                {!bannerLoading && Small_Screen_Section_5 && Small_Screen_Section_5.urls.length > 0 ?
                                    Small_Screen_Section_5.urls.map((mc, index) => (
                                        <Link key={`mc_banners_${index}`} to='/products'>
                                            <div>
                                                <LazyLoadImage effect='blur' loading='lazy' src={mc} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                                                <div className='h-[30px]'></div>
                                            </div>
                                        </Link>
                                )) : (
                                    // Skeleton Loader for the Carousel Items
                                    <div className="flex w-full justify-center space-x-4">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <div key={index} className="w-[80%] min-h-[200px] bg-gray-300 animate-pulse rounded-lg" />
                                        ))}
                                    </div>
                                )}
                            </Carousel>
                        </div>

                        <Footer />
                    </Fragment>

            }
        {/* {showComponent === 'dialog' && <FullScreenOverlayDialog products={product}/>} */}
        {showComponent === 'coupon' && <FullScreenOverLayCouponPopUp />}
        </div>
    )
}

const OurMotoData = ()=>{
    return(
        <div className='h-fit w-screen bg-slate-200 py-5 pb-4'>
            <div className='w-full flex justify-center items-center px-4 md:px-8 h-full'>
                <div className='w-fit h-auto grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 justify-center gap-10 items-center'>
                    <div className='px-4 flex w-72 flex-row gap-x-1 justify-center items-center'>
                        <Truck size={10} className="w-16 h-16 text-gray-700 transition-transform duration-150 hover:scale-110"/>
                        <div className='h-full w-1'/>
                        <div className='w-full text-left h-auto justify-center items-center'>
                            <h3 className='font-medium text-left text-[17px] text-slate-700'>FREE SHIPPING</h3>
                            <span className='font-light text-left text-[15px] text-slate-800'>On all orders over ₹75.00</span>
                        </div>
                    </div>

                    <div className='px-4 flex w-72 flex-row gap-x-1 justify-center items-center'>
                        <Clock size={5} className="w-16 h-16 text-gray-700 transition-transform duration-150 hover:scale-110"/>
                        <div className='h-full w-1'/>
                        <div className='w-full text-left h-auto justify-center items-center'>
                            <h3 className='font-medium text-left text-[17px] text-gray-700'>SUPPORT 24/7</h3>
                            <span className='font-light text-left text-[15px] text-gray-800'>Free shipping on all orders</span>
                        </div>
                    </div>

                    <div className='px-4 flex w-72 flex-row gap-x-1 justify-center items-center'>
                        <CircleDollarSign size={5} className="w-16 h-16 transition-transform duration-150 hover:scale-110 text-gray-700"/>
                        <div className='h-full w-1'/>
                        <div className='w-full text-left h-auto justify-center items-center'>
                            <h3 className='font-medium text-left text-[17px] text-gray-700'>Money Return</h3>
                            <span className='font-light text-left text-[15px] text-gray-800'>Free shipping on all orders</span>
                        </div>
                    </div>

                    <div className='px-4 flex w-72 flex-row gap-x-1 justify-center items-center'>
                        <BadgeIndianRupee size={5} className="w-16 h-16 transition-transform duration-150 hover:scale-110 text-gray-700"/>
                        <div className='h-full w-1'/>
                        <div className='w-full text-left h-auto justify-center items-center'>
                            <h3 className='font-medium text-left text-[17px] text-gray-700'>Order Discount</h3>
                            <span className='font-light text-left text-[15px] text-gray-800'>Free shipping on all orders</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home