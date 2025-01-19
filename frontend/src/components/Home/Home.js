import React, { Fragment, CSSProperties, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'
import './home.css'
import d1 from '../images/d1.webp'
import d2 from '../images/d2.webp'
import d3 from '../images/d3.webp'
import d4 from '../images/d4.webp'
import d5 from '../images/d5.webp'
import d6 from '../images/d6.webp'
import d7 from '../images/d7.webp'
import d8 from '../images/d8.webp'
import a1 from '../images/a1.webp'
import a2 from '../images/a2.webp'
import a3 from '../images/a3.webp'
import a4 from '../images/a4.webp'
import a5 from '../images/a5.webp'
import a6 from '../images/a6.webp'
import a7 from '../images/a7.webp'
import a8 from '../images/a8.webp'
import i1 from '../images/i1.webp'
import i2 from '../images/i2.webp'
import i3 from '../images/i3.webp'
import i4 from '../images/i4.webp'
import i5 from '../images/i5.webp'
import j1 from '../images/j1.webp'
import j2 from '../images/j2.webp'
import j3 from '../images/j3.webp'
import j4 from '../images/j4.webp'
import k1 from '../images/k1.webp'
import k2 from '../images/k2.webp'
import k3 from '../images/k3.webp'
import k4 from '../images/k4.webp'
import k5 from '../images/k5.webp'
import k6 from '../images/k6.webp'
import k7 from '../images/k7.webp'
import k8 from '../images/k8.jpg'
import k9 from '../images/k9.webp'
import k10 from '../images/k10.webp'
import k11 from '../images/k11.webp'
import k12 from '../images/k12.jpg'
import k13 from '../images/k13.webp'
import k14 from '../images/k14.jpg'
import k15 from '../images/k15.webp'
import k16 from '../images/k16.webp'
import l1 from '../images/l1.jpg'
import l2 from '../images/l2.jpg'
import l3 from '../images/l3.jpg'
import l4 from '../images/l4.jpg'
import l5 from '../images/l5.jpg'
import l6 from '../images/l6.jpg'
import l7 from '../images/l7.jpg'
import m1 from '../images/m1.webp'
import m2 from '../images/m2.webp'
import m3 from '../images/m3.webp'
import m4 from '../images/m4.webp'
import m5 from '../images/m5.webp'
import m6 from '../images/m6.webp'
import m7 from '../images/m7.webp'
import m8 from '../images/m8.webp'
import n1 from '../images/n1.webp'
import n2 from '../images/n2.webp'
import n3 from '../images/n3.jpg'
import n4 from '../images/n4.webp'
import n5 from '../images/n5.webp'
import n6 from '../images/n6.webp'
import n7 from '../images/n7.webp'
import n8 from '../images/n8.webp'
import o1 from '../images/o1.webp'
import o2 from '../images/o2.webp'
import o3 from '../images/o3.webp'
import o4 from '../images/o4.webp'
import o5 from '../images/o5.webp'
import o6 from '../images/o6.webp'
import o7 from '../images/o7.jpg'
import p1 from '../images/p1.webp'
import p2 from '../images/p2.webp'
import p3 from '../images/p3.webp'
import p4 from '../images/p4.webp'
import p5 from '../images/p5.webp'
import p6 from '../images/p6.webp'
import p7 from '../images/p7.webp'
import p8 from '../images/p8.webp'
import q1 from '../images/q1.webp'
import q2 from '../images/q2.webp'
import q3 from '../images/q3.webp'
import q4 from '../images/q4.webp'
import q5 from '../images/q5.webp'
import q6 from '../images/q6.webp'
import q7 from '../images/q7.webp'
import q8 from '../images/q8.webp'
import r1 from '../images/r1.webp'
import r2 from '../images/r2.webp'
import r3 from '../images/r3.webp'
import r4 from '../images/r4.webp'
import r5 from '../images/r5.webp'
import r6 from '../images/r6.webp'
import r7 from '../images/r7.webp'
import r8 from '../images/r8.webp'
import mb1 from '../images/mb1.jpg'
import mb2 from '../images/mb2.jpg'
import mb3 from '../images/mb3.jpg'
import mc1 from '../images/mc1.jpg'
import mc2 from '../images/mc2.jpg'
import mc3 from '../images/mc3.jpg'
import mc4 from '../images/mc4.jpg'
import mc5 from '../images/mc5.jpg'
import mc6 from '../images/mc6.jpg'
import mc7 from '../images/mc7.jpg'
import mc8 from '../images/mc8.jpg'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Footer from '../Footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { featchallbanners } from '../../action/banner.action'
import DraggingScrollView from '../Productpage/DraggableHorizontalScroll'
import { getuser } from '../../action/useraction'
import CarousalView from './CarousalView'
import { Allproduct } from '../../action/productaction'
import ProductPreviewFull from './ProductPreviewFull'
import { BadgeIndianRupee, CircleDollarSign, Clock, Truck } from 'lucide-react'
import DraggableImageSlider from './DraggableImageSlider'
import FullScreenOverLayCouponPopUp from './FullScreenOverLayCouponPopUp'
import Loader from '../Loader/Loader'


const Home = () => {
  const { product} = useSelector(state => state.Allproducts)
  const { banners,loading:bannerLoading} = useSelector(state => state.banners)

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
  useEffect(()=>{
    dispatch(getuser());
    dispatch(featchallbanners());
    dispatch(Allproduct())
  },[dispatch])
  
  useEffect(() => {
    document.documentElement.scrollTo = 0;
  }, []);



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
  
  // console.log("All Banners: ",Wide_Screen_Section_3);

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
                {!bannerLoading && Wide_Screen_Section_1 && Wide_Screen_Section_1?.urls.length > 0 ? 
                  <CarousalView b_banners={Wide_Screen_Section_1.urls} indicator={indicator} />
                  : 
                  <Loader/> }
            </div>
            <div className='h-fit w-screen bg-slate-200 py-5'>
                <div className='w-full flex justify-center items-center px-4 md:px-8 h-full'>
                    <div className='w-fit h-auto flex justify-center gap-10 items-center flex-wrap'>
                        <div className='px-4 flex w-72 flex-row gap-x-1 justify-center items-center'>
                            <Truck size={5} className="w-16 h-16 text-gray-700 transition-transform duration-150 hover:scale-110"/>
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
        
            <div className='py-8 flex flex-col justify-center space-y-5 my-auto items-center bg-slate-200'>
                {product && product.length > 0 && <ProductPreviewFull product={product} />}
            </div>
        
            {/* <DraggableImageSlider images={Wide_Screen_Section_2.urls} headers={Wide_Screen_Section_2?.header} /> */}
            <DraggableImageSlider images={Wide_Screen_Section_3.urls} headers={Wide_Screen_Section_3.header} />
            {!bannerLoading && Wide_Screen_Section_4 && Wide_Screen_Section_4.urls.length > 0 ? 
                <DraggableImageSlider images={Wide_Screen_Section_4.urls} headers={Wide_Screen_Section_4.header}/> : 
                <Loader/>
            }
        
            {!bannerLoading && Wide_Screen_Section_5 && Wide_Screen_Section_5.urls.length > 0 ? 
              <DraggableImageSlider images={Wide_Screen_Section_5.urls} headers={Wide_Screen_Section_5.header}/> : 
              <Loader/>
            }
        
            {
              !bannerLoading && Wide_Screen_Section_6 && Wide_Screen_Section_6.urls.length > 0 ? 
              <DraggableImageSlider images={Wide_Screen_Section_6.urls} headers={Wide_Screen_Section_6.header}/> : 
              <Loader/>
            }
        
            {
                !bannerLoading &&  Wide_Screen_Section_7 && Wide_Screen_Section_7.urls.length > 0 ? 
                <DraggableImageSlider images={Wide_Screen_Section_7.urls} headers={Wide_Screen_Section_7.header}/> : 
                <Loader/>
            }
        
            <div className='bg-slate-200 pt-8'>
                <h1 className='text-3xl px-8 font-bold font1 tracking-widest text-gray-700 mb-8'>DEALS ON LATEST ARRIVALS</h1>
                <div className='grid grid-cols-2'>
                    {
                        Wide_Screen_Section_8 && Wide_Screen_Section_8.length > 0 ? 
                        Wide_Screen_Section_8.map((j, index) => (
                            <Link key={`j_banners_${index}`} to='/products' className='m-1'>
                                <LazyLoadImage effect='blur' src={j} alt="" className="min-h-[200px] rounded-lg shadow-lg" />
                            </Link>
                        )) : (
                            <>
                                <Link to='/products'>
                                    <LazyLoadImage effect='blur' src={j1} alt="" className='min-h-[200px] rounded-lg shadow-lg' />
                                </Link>
                                <Link to='/products'>
                                    <LazyLoadImage effect='blur' src={j2} alt="" className='min-h-[200px] rounded-lg shadow-lg' />
                                </Link>
                                <Link to='/products'>
                                    <LazyLoadImage effect='blur' src={j3} alt="" className='min-h-[200px] rounded-lg shadow-lg' />
                                </Link>
                                <Link to='/products'>
                                    <LazyLoadImage effect='blur' src={j4} alt="" className='min-h-[200px] rounded-lg shadow-lg' />
                                </Link>
                            </>
                        )
                    }
                </div>
            </div>
        
            {
                Wide_Screen_Section_9 && Wide_Screen_Section_9.urls.length > 0 ? 
                <DraggableImageSlider images={Wide_Screen_Section_9.urls} headers={Wide_Screen_Section_9.header}/> : 
                <DraggableImageSlider images={[o1, o2, o3, o4, o5, o6, o7]} headers={"BEST OF KIDS-WEAR"}/>
            }
        
            {
                Wide_Screen_Section_10 && Wide_Screen_Section_10.urls.length > 0 ? 
                <DraggableImageSlider images={Wide_Screen_Section_10.urls} headers={Wide_Screen_Section_10.header}/> : 
                <DraggableImageSlider images={[q1, q2, q3, q4, q5, q6, q7, q8]} headers={"SPRING SUMMER SEASON CHECKLIST"}/>
            }
        
            {
                Wide_Screen_Section_11 && Wide_Screen_Section_11.urls.length > 0 ? 
                <DraggableImageSlider images={Wide_Screen_Section_11.urls} headers={Wide_Screen_Section_11.header}/> : 
                <DraggableImageSlider images={[r1, r2, r3, r4, r5, r6, r7, r8,r8,r8]} headers={"NEWNESS FOR EVERY OCCASION"}/>
            }
            
            <Footer/>
          </Fragment >
          :
          <Fragment>
            <div className='bg-slate-200'>{/* Category */}
              <ul className='flex overflow-x-scroll hide-scroll-bar scrollbar-track-black scrollbar-thumb-gray-600'>
                <DraggingScrollView images={Small_Screen_Section_1.urls} />
              </ul>
            </div>

            <div className='pt-4 w-[100vw] bg-slate-200'>
              <Carousel className='bg-slate-200' showThumbs={false} showStatus={false} showArrows={false} showIndicators={true} renderIndicator={(onClickHandler, isSelected, index, label) => indicator(onClickHandler, isSelected, index, label)}>
                {Small_Screen_Section_2 && Small_Screen_Section_2.urls && Small_Screen_Section_2.urls.length > 0 ?
                  Small_Screen_Section_2.urls.map((mb, index) => (
                    <Link key={`mb_banners_${index}`} to='/products'>
                      <div>
                        <LazyLoadImage effect='blur' src={mb} loading='lazy' width='100%' alt='Banner_Image' className='min-h-[200px]' />
                      </div>
                    </Link>
                  )) : (
                    <>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mb1} loading='lazy' width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mb2} loading='lazy' width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mb3} loading='lazy' width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                    </>
                  )
                }
              </Carousel>
            </div>

            <div className='bg-slate-200'>
              <h1 className='text-xl px-8 font-bold font1 text-center text-gray-700 pb-6 pt-6'>{Small_Screen_Section_3.header}</h1>
              <ul className='flex overflow-x-scroll'>
                {Small_Screen_Section_3 && Small_Screen_Section_3?.urls.length > 0 ? 
                  Small_Screen_Section_3.urls.map((d, index) => (
                    <Link key={`dealsOfDaty_banners${index}`} to='/products'>
                      <li className='w-max mr-2'>
                        <LazyLoadImage effect='blur' loading='lazy' src={d} alt="dealsofday" className="w-[50vw] min-h-[200px]" />
                      </li>
                    </Link>
                  )) : (
                    <>
                      <Link to='/products'>
                        <li className='w-max mr-2'>
                          <LazyLoadImage effect='blur' loading='lazy' src={d1} alt="dealsofday" className="w-[50vw] min-h-[200px]" />
                        </li>
                      </Link>
                      <Link to='/products'>
                        <li className='w-max mr-2'>
                          <LazyLoadImage effect='blur' loading='lazy' src={d2} alt="dealsofday" className="w-[50vw] min-h-[200px]" />
                        </li>
                      </Link>
                      <Link to='/products'>
                        <li className='w-max mr-2'>
                          <LazyLoadImage effect='blur' loading='lazy' src={d3} alt="dealsofday" className="w-[50vw] min-h-[200px]" />
                        </li>
                      </Link>
                      <Link to='/products'>
                        <li className='w-max mr-2'>
                          <LazyLoadImage effect='blur' loading='lazy' src={d4} alt="dealsofday" className="w-[50vw] min-h-[200px]" />
                        </li>
                      </Link>
                      <Link to='/products'>
                        <li className='w-max mr-2'>
                          <LazyLoadImage effect='blur' loading='lazy' src={d5} alt="dealsofday" className="w-[50vw] min-h-[200px]" />
                        </li>
                      </Link>
                      <Link to='/products'>
                        <li className='w-max mr-2'>
                          <LazyLoadImage effect='blur' loading='lazy' src={d6} alt="dealsofday" className="w-[50vw] min-h-[200px]" />
                        </li>
                      </Link>
                      <Link to='/products'>
                        <li className='w-max mr-2'>
                          <LazyLoadImage effect='blur' loading='lazy' src={d7} alt="dealsofday" className="w-[50vw] min-h-[200px]" />
                        </li>
                      </Link>
                      <Link to='/products'>
                        <li className='w-max mr-2'>
                          <LazyLoadImage effect='blur' loading='lazy' src={d8} alt="dealsofday" className="w-[50vw] min-h-[200px]" />
                        </li>
                      </Link>
                    </>
                  )}
              </ul>
            </div>

            <div className='bg-slate-200 flex flex-col justify-center space-y-5 py-auto items-center'>
              {product && product.length && <ProductPreviewFull product={product} />}
            </div>

            <div className='pt-4 grid grid-cols-1 min-h-[200px] bg-slate-100'>
              <h1 className='text-xl px-8 font-bold font1 text-center text-slate-900 mb-6 mt-6'>{Small_Screen_Section_4.header}</h1>
              <div className='w-screen flex justify-start items-center'>
                <ul className='flex flex-row overflow-x-scroll'>
                  {Small_Screen_Section_4 && Small_Screen_Section_4?.urls.length > 0 && Small_Screen_Section_4?.urls.map((c, index) => (
                    <Link key={index} to='/products' className='m-2'>
                      <li className=''>
                        <LazyLoadImage effect='blur' loading='lazy' src={c} alt="categoryToBag" className="min-h-[80px] min-w-[120px]" />
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>

            <div className='pt-4 w-[100vw] bg-slate-200'>
              <Carousel showThumbs={false} showStatus={false} showArrows={false} showIndicators={true} renderIndicator={(onClickHandler, isSelected, index, label) => indicator(onClickHandler, isSelected, index, label)}>
                {Small_Screen_Section_5 && Small_Screen_Section_5.urls.length > 0 ?
                  Small_Screen_Section_5.urls.map((mc, index) => (
                    <Link key={`mc_banners_${index}`} to='/products'>
                      <div>
                        <LazyLoadImage effect='blur' loading='lazy' src={mc} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                        <div className='h-[30px]'></div>
                      </div>
                    </Link>
                  )) : (
                    <>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc1} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc2} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc3} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc4} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc5} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc6} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc7} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc8} width='100%' alt='Banner_Image' className='min-h-[200px]' />
                          <div className='h-[30px]'></div>
                        </div>
                      </Link>
                    </>
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

export default Home