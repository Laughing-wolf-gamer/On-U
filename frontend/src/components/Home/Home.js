import React, { Fragment, CSSProperties, useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'
import './home.css'
import b2 from '../images/banner2.webp'
import b3 from '../images/banner3.jpg'
import b4 from '../images/banner4.jpg'
import b5 from '../images/banner5.jpg'
import b6 from '../images/banner6.webp'
import b7 from '../images/banner.7.webp'
import b8 from '../images/banner8.webp'
import b9 from '../images/banner9.webp'
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
import a9 from '../images/a9.webp'
import a10 from '../images/a10.webp'
import a11 from '../images/a11.webp'
import a12 from '../images/a12.webp'
import a13 from '../images/a13.webp'
import a14 from '../images/a14.webp'
import a15 from '../images/a15.webp'
import a16 from '../images/a16.webp'
import c1 from '../images/c1.webp'
import c2 from '../images/c2.webp'
import c3 from '../images/c3.webp'
import c4 from '../images/c4.webp'
import c5 from '../images/c5.webp'
import c6 from '../images/c6.webp'
import c7 from '../images/c7.webp'
import c8 from '../images/c8.webp'
import c9 from '../images/c9.webp'
import c10 from '../images/c10.webp'
import c11 from '../images/c11.webp'
import c12 from '../images/c12.webp'
import c13 from '../images/c13.webp'
import c14 from '../images/c14.webp'
import c15 from '../images/c15.webp'
import c16 from '../images/c16.webp'
import c17 from '../images/c17.webp'
import c18 from '../images/c18.webp'
import c19 from '../images/c19.webp'
import c20 from '../images/c20.webp'
import c21 from '../images/c21.webp'
import c22 from '../images/c22.webp'
import c23 from '../images/c23.webp'
import c24 from '../images/c24.webp'
import bb1 from '../images/b1.webp'
import bb2 from '../images/b2.webp'
import bb3 from '../images/b3.webp'
import bb4 from '../images/b4.webp'
import bb5 from '../images/b5.webp'
import bb6 from '../images/b6.webp'
import bb7 from '../images/b7.webp'
import e1 from '../images/e1.webp'
import e2 from '../images/e2.webp'
import e3 from '../images/e3.webp'
import e4 from '../images/e4.webp'
import e5 from '../images/e5.webp'
import e6 from '../images/e6.webp'
import e7 from '../images/e7.webp'
import e8 from '../images/e8.webp'
import e9 from '../images/e9.webp'
import e10 from '../images/e10.webp'
import e11 from '../images/e11.webp'
import e12 from '../images/e12.webp'
import e13 from '../images/e13.webp'
import e14 from '../images/e14.webp'
import e15 from '../images/e15.webp'
import e16 from '../images/e16.webp'
import e17 from '../images/e17.webp'
import e18 from '../images/e18.webp'
import e19 from '../images/e19.webp'
import e20 from '../images/e20.webp'
import e21 from '../images/e21.webp'
import e22 from '../images/e22.webp'
import e23 from '../images/e23.webp'
import e24 from '../images/e24.webp'
import f1 from '../images/f1.webp'
import f2 from '../images/f2.webp'
import f3 from '../images/f3.webp'
import f4 from '../images/f4.webp'
import f5 from '../images/f5.webp'
import f6 from '../images/f6.webp'
import f7 from '../images/f7.webp'
import f8 from '../images/f8.webp'
import f9 from '../images/f9.webp'
import f10 from '../images/f10.webp'
import f11 from '../images/f11.webp'
import f12 from '../images/f12.webp'
import f13 from '../images/f13.webp'
import f14 from '../images/f14.webp'
import g1 from '../images/g1.webp'
import g2 from '../images/g2.webp'
import g3 from '../images/g3.webp'
import g4 from '../images/g4.webp'
import g5 from '../images/g5.webp'
import g6 from '../images/g6.webp'
import g7 from '../images/g7.webp'
import g8 from '../images/g8.webp'
import g9 from '../images/g9.webp'
import g10 from '../images/g10.webp'
import g11 from '../images/g11.webp'
import g12 from '../images/g12.webp'
import g13 from '../images/g13.webp'
import g14 from '../images/g14.webp'
import g15 from '../images/g15.webp'
import g16 from '../images/g16.webp'
import h1 from '../images/h1.webp'
import h2 from '../images/h2.webp'
import h3 from '../images/h3.webp'
import h4 from '../images/h4.webp'
import h5 from '../images/h5.webp'
import h6 from '../images/h6.webp'
import h7 from '../images/h7.webp'
import h8 from '../images/h8.webp'
import h9 from '../images/h9.webp'
import h10 from '../images/h10.webp'
import h11 from '../images/h11.webp'
import h12 from '../images/h12.webp'
import h13 from '../images/h13.webp'
import h14 from '../images/h14.webp'
import h15 from '../images/h15.webp'
import h16 from '../images/h16.webp'
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
import s1 from '../images/s1.webp'
import s2 from '../images/s2.webp'
import s3 from '../images/s3.webp'
import s4 from '../images/s4.webp'
import s5 from '../images/s5.webp'
import s6 from '../images/s6.webp'
import s7 from '../images/s7.webp'
import s8 from '../images/s8.webp'
import t1 from '../images/t1.webp'
import t2 from '../images/t2.webp'
import t3 from '../images/t3.webp'
import t4 from '../images/t4.webp'
import t5 from '../images/t5.webp'
import t6 from '../images/t6.webp'
import t7 from '../images/t7.webp'
import t8 from '../images/t8.webp'
import u1 from '../images/u1.webp'
import u2 from '../images/u2.webp'
import u3 from '../images/u3.webp'
import u4 from '../images/u4.jpg'
import u5 from '../images/u5.webp'
import u6 from '../images/u6.webp'
import u7 from '../images/u7.webp'
import u8 from '../images/u8.webp'
import mb1 from '../images/mb1.jpg'
import mb2 from '../images/mb2.jpg'
import mb3 from '../images/mb3.jpg'
import ma1 from '../images/ma1.webp'
import ma2 from '../images/ma2.webp'
import ma3 from '../images/ma3.webp'
import ma4 from '../images/ma4.webp'
import ma5 from '../images/ma5.webp'
import ma6 from '../images/ma6.webp'
import ma7 from '../images/ma7.webp'
import ma8 from '../images/ma8.webp'
import ma9 from '../images/ma9.webp'
import ma10 from'../images/ma10.jpg'
import ma11 from'../images/ma11.webp'
import mm3 from'../images/mm3.jpg'
import mad1 from '../images/mad1.jpg'
import mm1_1 from '../images/mm1-1.gif'
import mm1_2 from '../images/mm1-2.gif'
import mm2_1 from '../images/mm2-1.gif'
import mm2_2 from '../images/mm2-2.gif'
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
import { generateArrayOfRandomItems } from '../../config'
import ProductPreviewFull from './ProductPreviewFull'
import { BadgeIndianRupee, CircleDollarSign, Clock, Truck } from 'lucide-react'
import DraggableImageSlider from './DraggableImageSlider'


const Home = () => {
  const { product} = useSelector(state => state.Allproducts)
  const { banners} = useSelector(state => state.banners)

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
          style={{ ...indicatorStyles, background: '#9f9f9f' }}
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
  
  console.log("All Banners: ",banners);
  return (
    <Fragment>
      {
        window.screen.width > 1024 ?
        <Fragment>
            <div className='mt-8 w-[100vw] relative'>
                {Wide_Screen_Section_1 && Wide_Screen_Section_1?.urls.length > 0 ? <CarousalView b_banners={Wide_Screen_Section_1.urls} indicator = {indicator}/>: <CarousalView b_banners={[b2, b3, b4, b5, b6, b7, b8, b9]} indicator = {indicator}/>}
            </div>
            <div className='w-full flex justify-center items-center my-10 px-4 md:px-8 h-auto'>
              <div className='w-fit  h-auto flex justify-center gap-10 items-center flex-wrap'>
                <div className='px-4 flex w-72  flex-row gap-x-1 justify-center items-center'>
                  <Truck  size={5} className="w-16 h-16 text-black transition-transform duration-150 hover:animate-vibrateScale"/>
                  <div className='h-full w-1 bg-black'/>
                  <div className='w-full text-left h-auto justify-center items-center'>
                    <h3 className='font-medium text-left text-[20px] text-black'>FREE SHIPPING</h3>
                    <span className='font-light text-left text-[15px] text-gray-400'>On all orders over $75.00</span>
                  </div>
                </div>
                <div className='px-4 flex w-72 flex-row gap-x-1 justify-center items-center'>
                  <Clock  size={5} className="w-16 h-16 text-black transition-transform duration-150 hover:animate-vibrateScale"/>
                  <div className='h-full w-1 bg-black'/>
                  <div className='w-full text-left h-auto justify-center items-center'>
                    <h3 className='font-medium text-left [20px] text-black'>SUPPORT 24/7</h3>
                    <span className='font-light text-left text-[15px] text-gray-400'>Free shipping on all order</span>
                  </div>
                </div>
                <div className='px-4 flex w-72 flex-row gap-x-1 justify-center items-center'>
                  <CircleDollarSign  size={5} className="w-16 h-16 text-black transition-transform duration-150 hover:animate-vibrateScale"/>
                  <div className='h-full w-1 bg-black'/>
                  <div className='w-full text-left h-auto justify-center items-center'>
                    <h3 className='font-medium text-left text-[20px] text-black'>Money Return</h3>
                    <span className='font-light text-left text-[15px] text-gray-400'>Free shipping on all order</span>
                  </div>
                </div>
                <div className='px-4 flex w-72 flex-row gap-x-1 justify-center items-center'>
                  <BadgeIndianRupee size={5} className="w-16 h-16 text-black transition-transform duration-150 hover:animate-vibrateScale"/>
                  <div className='h-full w-1 bg-black'/>
                  <div className='w-full text-left h-auto justify-center items-center'>
                    <h3 className='font-medium text-left [20px] text-black'>Order Discount</h3>
                    <span className='font-light text-left text-[15px] text-gray-400'>Free shipping on all order</span>
                  </div>
                </div>
              </div>
            </div>

            <div className=' py-8 flex flex-col justify-center space-y-5 my-auto items-center'>
              {product && product.length > 0 && <ProductPreviewFull product = {product}/>}
            </div>
            <DraggableImageSlider images={Wide_Screen_Section_2.urls} headers={Wide_Screen_Section_2?.header}/>
            <DraggableImageSlider images={Wide_Screen_Section_3.urls} headers={Wide_Screen_Section_3.header}/>
            {Wide_Screen_Section_4 && Wide_Screen_Section_4.urls.length > 0 ? <DraggableImageSlider images={Wide_Screen_Section_4.urls} headers={Wide_Screen_Section_4.header}/>: <DraggableImageSlider images={[d1, d2, d3, d4, d5, d6, d7, d8]} headers={"DEAL OF THE DAY"}/>}
            {Wide_Screen_Section_5 && Wide_Screen_Section_5.urls.length > 0 ? <DraggableImageSlider images={Wide_Screen_Section_5.urls} headers={Wide_Screen_Section_5.header}/>: 
              <DraggableImageSlider images={[
              a1,
              a2, 
              a3, 
              a4, 
              a5, 
              a6, 
              a7, 
              a8,
            ]} headers={"BEST OF ON-U EXCLUSIVE BRANDS"}/>}
            
            {
              Wide_Screen_Section_6 && Wide_Screen_Section_6.urls.length > 0 ? <DraggableImageSlider images={Wide_Screen_Section_6.urls} headers={Wide_Screen_Section_6.header}/> : <DraggableImageSlider images={[i1, i2, i3, i4, i5]} headers={"GIFTING CARDS"}/>
            }

            {
              Wide_Screen_Section_7 && Wide_Screen_Section_7.urls.length > 0 ? <DraggableImageSlider images={Wide_Screen_Section_7.urls} headers={Wide_Screen_Section_7.header}/> : <DraggableImageSlider images={[k1, k2, k3, k4, k5, k6, k7, k8, k9, k10, k11, k12, k13, k14, k15, k16]} headers={"SPRING SUMMER 2022- FIRST ON E-COM"}/>
            }
            <div>
              <h1 className='text-3xl px-8 font-bold font1 tracking-widest text-slate-800 mb-8 mt-8'>DEALS ON LATEST ARRIVALS</h1>
              <div className='grid grid-cols-2 '>
                
                {
                  Wide_Screen_Section_8 && Wide_Screen_Section_8.length > 0 ? Wide_Screen_Section_8.map((j, index) => (
                    <Link key={`j_banners_${index}`} to='/products' className='m-1'><LazyLoadImage effect='blur' src={j} alt="" className="min-h-[200px]" /></Link>
                  )):(
                    <>
                      <Link to='/products'><LazyLoadImage effect='blur' src={j1} alt="" className='min-h-[200px]'/></Link>
                      <Link to='/products'><LazyLoadImage effect='blur' src={j2} alt="" className='min-h-[200px]'/></Link>
                      <Link to='/products'><LazyLoadImage effect='blur' src={j3} alt="" className='min-h-[200px]'/></Link>
                      <Link to='/products'><LazyLoadImage effect='blur' src={j4} alt="" className='min-h-[200px]'/></Link>
                    </>
                  )
                }

              </div>
            </div>

            {
              Wide_Screen_Section_9 && Wide_Screen_Section_9.urls.length > 0 ? <DraggableImageSlider images={Wide_Screen_Section_9.urls} headers={Wide_Screen_Section_9.header}/> : <DraggableImageSlider images={[o1, o2, o3, o4, o5, o6, o7]} headers={"BEST OF KIDS-WEAR"}/>
            }
            {
              Wide_Screen_Section_10 && Wide_Screen_Section_10.urls.length > 0 ? <DraggableImageSlider images={Wide_Screen_Section_10.urls} headers={Wide_Screen_Section_10.header}/> : <DraggableImageSlider images={[q1, q2, q3, q4, q5, q6, q7, q8]} headers={"SPRING SUMMER SEASON CHECKLIST"}/>
            }
            {
              Wide_Screen_Section_11 && Wide_Screen_Section_11.urls.length > 0 ? <DraggableImageSlider images={Wide_Screen_Section_11.urls} headers={Wide_Screen_Section_11.header}/> : <DraggableImageSlider images={[r1, r2, r3, r4, r5, r6, r7, r8]} headers={"NEWNESS FOR EVERY OCCASION"}/>
            }
          <Footer/>

          </Fragment>
          :
          <Fragment>
            <div className='bg-white '>{/* Category */}
              <ul className='flex overflow-x-scroll hide-scroll-bar scrollbar-track-black scrollbar-thumb-gray-600'>
                <DraggingScrollView images={Small_Screen_Section_1.urls}/>
              </ul>
            </div>
            <div className='mt-4 w-[100vw]'>
              <Carousel showThumbs={false} showStatus={false} showArrows={false} showIndicators={true} renderIndicator={(onClickHandler, isSelected, index, label) => indicator(onClickHandler, isSelected, index, label)}>
                {
                  Small_Screen_Section_2 && Small_Screen_Section_2.urls && Small_Screen_Section_2.urls.length > 0 ? Small_Screen_Section_2.urls.map((mb, index) => (
                    <Link key={`mb_banners_${index}`} to='/products'><div><LazyLoadImage effect='blur' src={mb} width='100%' alt='Banner_Image' className='min-h-[200px]'/></div></Link>
                  )):(<>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mb1} width='100%' alt='Banner_Image' className='min-h-[200px]'/>
                          <div className='h-[30px]'>
                          </div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mb2} width='100%' alt='Banner_Image' className='min-h-[200px]'/>
                          <div className='h-[30px]'>

                          </div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mb3} width='100%' alt='Banner_Image' className='min-h-[200px]'/><br />
                          <div className='h-[30px]'>

                          </div>
                        </div>
                      </Link>
                  </>)
                }

              </Carousel>
            </div>


            <div>
              <h1 className='text-xl px-8 font-bold font1 text-center text-slate-800 mb-6 mt-6'>{Small_Screen_Section_3.header}</h1>
              <ul className='flex overflow-x-scroll '>
                {
                  Small_Screen_Section_3 && Small_Screen_Section_3?.urls.length > 0 ? Small_Screen_Section_3.urls.map((d, index) => (
                    <Link key={`dealsOfDaty_banners${index}`} to='/products'><li className='w-max mr-2'><LazyLoadImage effect='blur' src={d} alt="dealsofday" className="w-[50vw] min-h-[200px]" /></li></Link>
                  )):(<>
                      <Link to='/products'><li className='w-max mr-2'><LazyLoadImage effect='blur' src={d1} alt="dealsofday" className="w-[50vw] min-h-[200px]" /></li></Link>
                      <Link to='/products'><li className='w-max mr-2'><LazyLoadImage effect='blur' src={d2} alt="dealsofday" className="w-[50vw] min-h-[200px]" /></li></Link>
                      <Link to='/products'><li className='w-max mr-2'><LazyLoadImage effect='blur' src={d3} alt="dealsofday" className="w-[50vw] min-h-[200px]" /></li></Link>
                      <Link to='/products'><li className='w-max mr-2'><LazyLoadImage effect='blur' src={d4} alt="dealsofday" className="w-[50vw] min-h-[200px]" /></li></Link>
                      <Link to='/products'><li className='w-max mr-2'><LazyLoadImage effect='blur' src={d5} alt="dealsofday" className="w-[50vw] min-h-[200px]" /></li></Link>
                      <Link to='/products'><li className='w-max mr-2'><LazyLoadImage effect='blur' src={d6} alt="dealsofday" className="w-[50vw] min-h-[200px]" /></li></Link>
                      <Link to='/products'><li className='w-max mr-2'><LazyLoadImage effect='blur' src={d7} alt="dealsofday" className="w-[50vw] min-h-[200px]" /></li></Link>
                      <Link to='/products'><li className='w-max mr-2'><LazyLoadImage effect='blur' src={d8} alt="dealsofday" className="w-[50vw] min-h-[200px]" /></li></Link>
                  </>)
                }
                
              </ul>
            </div>
            
            <div className='flex flex-col justify-center space-y-5 my-auto items-center'>
              {product && product.length && <ProductPreviewFull product = {product}/>}
            </div>

            <div className='mt-4 grid grid-cols-1 min-h-[200px]'>
              <h1 className='text-xl px-8 font-bold font1 text-center text-slate-800 mb-6 mt-6'>{Small_Screen_Section_4.header}</h1>
              <div className='w-screen flex justify-start items-center'>
                <ul className='flex flex-row overflow-x-scroll'>
                  
                  {
                    Small_Screen_Section_4 && Small_Screen_Section_4?.urls.length > 0 && Small_Screen_Section_4?.urls.map((c,index)=>(
                      <Link key={index} to='/products' className='m-2'><li className=''><LazyLoadImage effect='blur' src={c} alt="categoryToBag" className="min-h-[80px] min-w-[120px]" /></li></Link>
                    ))
                  }
                </ul>
              </div>
            </div>
            <div className='mt-4 w-[100vw]'>
              <Carousel showThumbs={false} showStatus={false} showArrows={false} showIndicators={true} renderIndicator={(onClickHandler, isSelected, index, label) => indicator(onClickHandler, isSelected, index, label)}>
                {
                  Small_Screen_Section_5 && Small_Screen_Section_5.urls.length > 0 ? Small_Screen_Section_5.urls.map((mc, index) => (
                    <Link key={`mc_banners_${index}`} to='/products'>
                      <div>
                        <LazyLoadImage effect='blur' src={mc} width='100%' alt='Banner_Image' className='min-h-[200px]'/>
                        <div className='h-[30px]'>
                        </div>
                      </div>
                    </Link>
                  )):(<>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc1} width='100%' alt='Banner_Image' className='min-h-[200px]'/>
                          <div className='h-[30px]'>
                          </div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc2} width='100%' alt='Banner_Image' className='min-h-[200px]'/>
                          <div className='h-[30px]'>

                          </div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc3} width='100%' alt='Banner_Image' className='min-h-[200px]'/><br />
                          <div className='h-[30px]'>

                          </div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc4} width='100%' alt='Banner_Image' className='min-h-[200px]'/><br />
                          <div className='h-[30px]'>

                          </div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc5} width='100%' alt='Banner_Image' className='min-h-[200px]'/><br />
                          <div className='h-[30px]'>

                          </div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc6} width='100%' alt='Banner_Image' className='min-h-[200px]'/><br />
                          <div className='h-[30px]'>

                          </div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc7} width='100%' alt='Banner_Image' className='min-h-[200px]'/><br />
                          <div className='h-[30px]'>

                          </div>
                        </div>
                      </Link>
                      <Link to='/products'>
                        <div>
                          <LazyLoadImage effect='blur' src={mc8} width='100%' alt='Banner_Image' className='min-h-[200px]'/><br />
                          <div className='h-[30px]'>

                          </div>
                        </div>
                      </Link>
                  </>)
                }
                
              </Carousel>
            </div>

            <Footer/>
          </Fragment>
      }

    </Fragment>
  )
}

export default Home