import React, { Fragment, useEffect, useState } from 'react'
import { AiOutlineFire, AiOutlineStar } from 'react-icons/ai'
import Per from '../images/per.png'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Allproduct as getproduct } from '../../action/productaction'
import elementClass from 'element-class'
import './MFilter.css'
import { capitalizeFirstLetterOfEachWord } from '../../config'
import Slider from '@mui/material/Slider';
import styled from '@emotion/styled'


const CustomSlider = styled(Slider)({
    '& .MuiSlider-thumb': {
        backgroundColor: '#333333', // Dark gray thumb color
        border: '2px solid #212121', // Darker gray border for the thumb
        '&:hover': {
            backgroundColor: '#555555', // Slightly lighter gray on hover
        },
    },
    '& .MuiSlider-rail': {
        backgroundColor: '#E0E0E0', // Light gray rail color
    },
    '& .MuiSlider-track': {
        backgroundColor: '#212121', // Dark gray track color
    },
    '& .MuiSlider-valueLabel': {
        backgroundColor: '#212121', // Dark gray background for the value label
        color: 'white', // White text for the value label
    },
});

const MFilter = ({ product ,handleSortChange}) => {
    const dispatch = useDispatch()
    const navigation = useNavigate()

    function classtoggle(e) {
        // let foo = document.getElementsByClassName('foo')
        // let foo1 = document.getElementsByClassName(`filter${e}`)
        var foo = document.querySelectorAll('.foo')
        var foo1 = document.querySelector(`.filter${e}`)
        for (let i = 0; i < foo.length; i++) {
        elementClass(foo[i]).remove('black')
        }
        // elementClass(foo).remove('black')
        elementClass(foo1).remove('grey')
        elementClass(foo1).add('black')
    }

    function datefun(e) {
        let url = window.location.search
        if (url.includes('?')) {
        if (url.includes('date')) {
            if (url.includes('&date')) {
            let newurl = url.includes(`&date=1`) ? url.replace(`&date=1`, `&date=${e}`) : null
            let newurl2 = url.includes(`&date=-1`) ? url.replace(`&date=-1`, `&date=${e}`) : null
            let newurlsuccess = (newurl === null ? newurl2 : newurl)
            //  window.location = newurlsuccess 
            // navigation(newurlsuccess)
            // dispatch(getproduct())
            }
            if (url.includes('?date')) {
            let newurl = url.includes(`?date=1`) ? url.replace(`?date=1`, `?date=${e}`) : null
            let newurl2 = url.includes(`?date=-1`) ? url.replace(`?date=-1`, `?date=${e}`) : null
            let newurlsuccess = (newurl === null ? newurl2 : newurl)
            //  window.location = newurlsuccess
            // navigation(newurlsuccess)
            // dispatch(getproduct())
            }
        } else {
            url += `&date=${e}`
            //  window.location = url
            // navigation(url)
            // dispatch(getproduct())
        }
        } else {
        url += `?date=${e}`
        //   window.location = url
        // navigation(url)
        }
        dispatch(getproduct())
    }

    function pricefun(e) {
        let url = window.location.search
        if (url.includes('?')) {
            if (url.includes('low')) {
                if (url.includes('&low')) {
                    let newurl = url.includes(`&low=1`) ? url.replace(`&low=1`, `&low=${e}`) : null
                    let newurl2 = url.includes(`&low=-1`) ? url.replace(`&low=-1`, `&low=${e}`) : null
                    let newurlsuccess = (newurl === null ? newurl2 : newurl)
                    navigation(newurlsuccess)
                    dispatch(getproduct())
                    //  window.location = newurlsuccess 
                }
                if (url.includes('?low')) {
                    let newurl = url.includes(`?low=1`) ? url.replace(`?low=1`, `?low=${e}`) : null
                    let newurl2 = url.includes(`?low=-1`) ? url.replace(`?low=-1`, `?low=${e}`) : null
                    let newurlsuccess = (newurl === null ? newurl2 : newurl)
                    navigation(newurlsuccess)
                    dispatch(getproduct())
                    //  window.location = newurlsuccess
                }
            } else {
                let newurl = window.location.search += `&low=${e}`
                navigation(newurl)
                dispatch(getproduct())
                //  url += `&low=${e}`
                //  Redirect(url)
                //  window.location = url
            }
        } else {
            //   url += `?low=${e}`
            navigation(`?low=${e}`)
            dispatch(getproduct())
        }
    }

    const [sortvi, setsortvi] = useState('hidden')

    let category = []
    let subcategory = []
    let specialCategory = []
    let discountedPercentageAmount = [];
    let size = []
    let gender = []
    let color = []
    let spARRAY = []
    let onSale = []

    function categoriesarray() {
        if (product && product.length > 0) {
            product.forEach(p => {
                if(!category.includes(p.category)){
                    category.push(p.category)
                }
            });
        }
    }
    function setDiscountedPercentage (){
        if (product && product.length > 0) {
            product.forEach(p => {
                if(p.salePrice && p.salePrice > 0){
                    // let discount = ((p.price - p.salePrice)/p.price) * 100
                    /* const priceOriginal = p.price;
                    const salePriceProduct = p.salePrice;
                    const discountAmount = priceOriginal - salePriceProduct;
                    const discountPercentage = Math.floor(((discountAmount / priceOriginal) * 100).toFixed(0));
                    if(!discountedPercentageAmount.includes(discountPercentage)){
                        discountedPercentageAmount.push(discountPercentage)
                    } */
                    const amount = Math.floor(p.DiscountedPercentage);
                    if(!discountedPercentageAmount.includes(amount)){
                        discountedPercentageAmount.push(amount)
                    }
                }
            });
        }
    }
    function SetOnSale (){
        if (product && product.length > 0) {
            product.forEach(p => {
                if(p.salePrice && p.salePrice > 0){
                    if(!onSale.includes(p.salePrice)){
                        onSale.push(p.salePrice)
                    }
                }
            });
        }
    }
    function subCategoriesarray() {
        console.log("Product: ",product);
        if (product && product.length > 0) {
            product.forEach(p => {
                if(!subcategory.includes(p.subCategory)){
                    subcategory.push(p.subCategory)
                }
            });
        }
    }
    function specialCategoriesarray() {
        if (product && product.length > 0) {
            product.forEach(p => {
                if(!specialCategory.includes(p.specialCategory) && p.specialCategory !== "none" && p.specialCategory !== undefined){
                specialCategory.push(p.specialCategory)
                }
            });
        }
    }
    function sizearray() {
        if (product && product.length > 0) {
        product.forEach(p => {
            p.size.forEach(s => {
            if(!size.includes(s.label)){
                size.push(s.label);
            }
            })
        });
        }
    }

    function genderarray() {
        if (product && product.length > 0) {
            product.forEach(p => {
                if(!gender.includes(p.gender)){
                    gender.push(p.gender)
                }
            });
        }
    }

    function colorarray() {
        if (product && product.length > 0) {
            product.forEach(p => {
                p.AllColors.forEach(c => {
                    const alreadyExists = color.some(item => item.label === c.label);
                    if (!alreadyExists){
                        color.push(c);
                    }
                });
            });
        }
    }

    function sparray() {
        product.forEach(p => {
            spARRAY.push(p.price);
        });
        console.log("Prices: ", spARRAY);
    }
    useEffect(()=>{
        categoriesarray()
        sizearray();
        genderarray()
        colorarray()
        sparray()
        specialCategoriesarray();
        subCategoriesarray();
        setDiscountedPercentage();
        SetOnSale()
    },[product])
    
    categoriesarray()
    sizearray();
    genderarray()
    colorarray()
    sparray()
    specialCategoriesarray();
    subCategoriesarray();
    setDiscountedPercentage();
    SetOnSale();

    let Categorynewarray = [...new Set(category)];
    let specialCategoryNewArray = [...new Set(specialCategory)];
    let subCategoryNewArray = [...new Set(subcategory)];
    let gendernewarray = [...new Set(gender)];
    let colornewarray = [...new Set(color)];
    let sizenewArray = [...new Set(size)]
    let sp = [...new Set(spARRAY.sort((a, b) => a - b))];

    // const [price, setPrice] = useState([Math.floor(Math.min(...sp)), Math.floor(Math.max(...sp))])
    const [price, setPrice] = useState(GetPrice().length > 0 ? GetPrice() : [Math.floor(Math.min(...sp)), Math.floor(Math.max(...sp))])
    const [MMainlink, setMMainlink] = useState(`?sellingPrice[$gte]=${price[0]}&sellingPrice[$lte]=${price[1]}`)
    const priceHandler = (event, newPrice)=>{
        setPrice(newPrice)
        setMMainlink(`?sellingPrice[$gte]=${price[0]}&sellingPrice[$lte]=${price[1]}`)
    }
    function price2fun(e,f){
        if (MMainlink.includes('?')) {
            if (MMainlink.includes(`${e}`)) {
                let newurl = MMainlink.includes(`&sellingPrice[$gte]=${e}&sellingPrice[$lte]=${f}`) ? MMainlink.replace(`&sellingPrice[$gte]=${e}&sellingPrice[$lte]=${f}`,'') : null
                let newurl2 = MMainlink.replace(`?sellingPrice[$gte]=${e}&sellingPrice[$lte]=${f}`,'')
                let newurlsuccess =  (newurl === null ? newurl2 : newurl)
                window.location = newurlsuccess 
                setMMainlink(newurlsuccess)
            }else{
                setMMainlink(`${MMainlink}&sellingPrice[$gte]=${e}&sellingPrice[$lte]=${f}`)
            }
        }else{
            setMMainlink(`${MMainlink}?sellingPrice[$gte]=${e}&sellingPrice[$lte]=${f}`)
        }
    }
    function onSaleFun() {
        // Check if MMainlink already has query parameters
        if (MMainlink.includes('?')) {
            // If onSale=true exists in the URL
            if (MMainlink.includes('&onSale=true')) {
                // Replace onSale=true with onSale=false
                let newurl = MMainlink.replace('&onSale=true', '&onSale=false');
                setMMainlink(newurl);
            }
            // If onSale=false exists in the URL
            else if (MMainlink.includes('&onSale=false')) {
                // Replace onSale=false with onSale=true
                let newurl = MMainlink.replace('&onSale=false', '&onSale=true');
                setMMainlink(newurl);
            } else {
                // If onSale parameter is not found, set it to onSale=true
                setMMainlink(`${MMainlink}&onSale=true`);
            }
        } else {
            // If no query parameters are present, start with onSale=true
            setMMainlink(`${MMainlink}?onSale=true`);
        }
    }

    function genderfun(e) {
        if (MMainlink.includes('?')) {
            let newtext = e.replace(' ', '%20')
            if (MMainlink.includes(`${newtext}`)) {
                let newurl = MMainlink.includes(`&gender=${newtext}`) ? MMainlink.replace(`&gender=${newtext}`, '') : null
                let newurl2 = MMainlink.replace(`?gender=${newtext}`, '')
                let newurlsuccess = (newurl === null ? newurl2 : newurl)
                setMMainlink(newurlsuccess)
            } else {
                setMMainlink(`${MMainlink}&gender=${e}`)
            }
        } else {
            setMMainlink(`${MMainlink}?gender=${e}`)
        }
    }
    function discountedAmountfun(e) {
        console.log("E-Amount:", e);
        // Check if the main URL contains a '?'
        if (MMainlink.includes('?')) {
            // Check if the URL already contains 'discountedAmount'
            if (MMainlink.includes(`discountedAmount=`)) {
                // If 'discountedAmount' already exists, replace it with the new value
                let newurl = MMainlink.replace(/([&?])discountedAmount=[^&]*/, `$1discountedAmount=${e}`);
                setMMainlink(newurl);
            } else {
                // If 'discountedAmount' does not exist, append it
                setMMainlink(`${MMainlink}&discountedAmount=${e}`);
            }
        } else {
            // If no '?' exists, simply add 'discountedAmount' as the first query parameter
            setMMainlink(`${MMainlink}?discountedAmount=${e}`);
        }
    }
    
    function sizefun(e) {
        if (MMainlink.includes('?')) {
            let newtext = e.replace(' ', '%20')
            if (MMainlink.includes(`${newtext}`)) {
                let newurl = MMainlink.includes(`&size=${newtext}`) ? MMainlink.replace(`&size=${newtext}`, '') : null
                let newurl2 = MMainlink.replace(`?size=${newtext}`, '')
                let newurlsuccess = (newurl === null ? newurl2 : newurl)
                setMMainlink(newurlsuccess)
            } else {
                setMMainlink(`${MMainlink}&size=${e}`)
            }
        } else {
            setMMainlink(`${MMainlink}?size=${e}`)
        }
    }
    function categoryfun(e) {
        if (MMainlink.includes('?')) {
            let newtext = e.replace(/ /g, '%20')
            if (MMainlink.includes(`${newtext}`)) {
                let newurl = MMainlink.includes(`&category=${newtext}`) ? MMainlink.replace(`&category=${newtext}`, '') : null
                let newurl2 = MMainlink.replace(`?category=${newtext}`, '')
                let newurlsuccess = (newurl === null ? newurl2 : newurl)
                setMMainlink(newurlsuccess)
            } else {
                let newtext = e.replace(/ /g, '%20')
                setMMainlink(`${MMainlink}&category=${newtext}`)
            }
        } else {
            let newtext = e.replace(/ /g, '%20')
            setMMainlink(`${MMainlink}?category=${newtext}`)
        }
    }
    function subCategoryfun(e) {
        if (MMainlink.includes('?')) {
            let newtext = e.replace(/ /g, '%20')
            if (MMainlink.includes(`${newtext}`)) {
                let newurl = MMainlink.includes(`&subcategory=${newtext}`) ? MMainlink.replace(`&subcategory=${newtext}`, '') : null
                let newurl2 = MMainlink.replace(`?subcategory=${newtext}`, '')
                let newurlsuccess = (newurl === null ? newurl2 : newurl)
                setMMainlink(newurlsuccess)
            } else {
                let newtext = e.replace(/ /g, '%20')
                setMMainlink(`${MMainlink}&subcategory=${newtext}`)
            }
        } else {
            let newtext = e.replace(/ /g, '%20')
            setMMainlink(`${MMainlink}?subcategory=${newtext}`)
        }
    }
    function specialCategoryfun(e) {
        if (MMainlink.includes('?')) {
            let newtext = e.replace(/ /g, '%20')
            if (MMainlink.includes(`${newtext}`)) {
                let newurl = MMainlink.includes(`&specialCategory=${newtext}`) ? MMainlink.replace(`&specialCategory=${newtext}`, '') : null
                let newurl2 = MMainlink.replace(`?specialCategory=${newtext}`, '')
                let newurlsuccess = (newurl === null ? newurl2 : newurl)
                setMMainlink(newurlsuccess)
            } else {
                let newtext = e.replace(/ /g, '%20')
                setMMainlink(`${MMainlink}&specialCategory=${newtext}`)
            }
        } else {
            let newtext = e.replace(/ /g, '%20')
            setMMainlink(`${MMainlink}?specialCategory=${newtext}`)
        }
    }

    function colorfun(e) {
        if (MMainlink.includes('?')) {
            let newtext = e.label.replace(/ /g, '%20')
            if (MMainlink.includes(`${newtext}`)) {
                let newurl = MMainlink.includes(`&color=${newtext}`) ? MMainlink.replace(`&color=${newtext}`, '') : null
                let newurl2 = MMainlink.replace(`?color=${newtext}`, '')
                let newurlsuccess = (newurl === null ? newurl2 : newurl)
                setMMainlink(newurlsuccess)
            } else {
                let newtext = e.label.replace(/ /g, '%20')
                setMMainlink(`${MMainlink}&color=${newtext}`)
            }
        } else {
            let newtext = e.label.replace(/ /g, '%20')
            setMMainlink(`${MMainlink}?color=${newtext}`)
        }
    }

    function addclass1(e) {
        console.log("Add Class 1: ",e);
        let f = e.replace(/ /g, "")

        var font = document.querySelector(`.font${f}`)

        elementClass(font).toggle('fontbold')


    }
    function addclass1Discounted(e) {
        console.log("Add Class 1: ",e);
        let f = e;

        var font = document.querySelector(`.font${f}`)

        elementClass(font).toggle('fontbold')


    }
    function addclassColor1(e) {
        let f = e.replace(/ /g, ""); // Remove any spaces from the string
        // Escape '#' for use in querySelector
        f = f.replace('#', '\\#');
        var font = document.querySelector(`.font${f}`)

        elementClass(font).toggle('fontbold')


    }
    function addclass2(e) {
        let f = e.replace(/ /g, "")
        var tick = document.querySelector(`.tick${f}`)
        elementClass(tick).toggle('tickcolor')
    }
    function addclass2Discounted(e) {
        let f = e;
        var tick = document.querySelector(`.tick${f}`)
        elementClass(tick).toggle('tickcolor')
    }
    function addcolorclass(e) {
        let f = e.replace(/ /g, ""); // Remove any spaces from the string
        // Escape '#' for use in querySelector
        f = f.replace('#', '\\#');
        var tick = document.querySelector(`.tick${f}`); // Query the element with the correct class name
        elementClass(tick).toggle('tickcolor'); // Toggle 'tickcolor' class on the found element
    }

    function addclass3(e) {
        var ulco = document.querySelectorAll('.ulco')
        var ul = document.querySelector(`.ul${e}`)

        for (let i = 0; i < ulco.length; i++) {
        elementClass(ulco[i]).remove('Dvisibile')

        }
        elementClass(ul).add('Dvisibile')


    }

    const [filter, setfilter] = useState('hidden')

    function filterdiv() {
        setfilter(filter === 'hidden' ? 'block' : 'hidden')
    }

    function reloadproducts() {
        dispatch(getproduct())
    }


    function clearall() {
        setMMainlink('')
        setfilter(filter === 'hidden' ? 'block' : 'hidden')
        navigation('/products')
        reloadproducts()
        // window.location.reload();
    }
    return (
        <Fragment>
        <div className='hidden mobilevisible fixed z-10 bottom-0 w-full '>

            {/* Sort and Filter Div ************************************************************************************* */}
            <div className='grid grid-cols-12 w-full font1 bg-white py-3 border-t-[0.5px] border-slate-200 relative z-10'>
            <div className="col-span-6 text-lg flex justify-center items-center " onClick={() => setsortvi('block')}>
                <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z" opacity="0.05"></path><path fill="#282C3F" d="M7.445 7.48V5.672L5.665 7.48h1.78zm1.09-4.42c.304.12.465.39.465.706v16.437a.784.784 0 01-.783.797.762.762 0 01-.772-.781V8.982H4.003a.832.832 0 01-.765-.204.759.759 0 01.002-1.105L7.652 3.23a.832.832 0 01.882-.17zm8.02 15.269l1.78-1.81h-1.78v1.81zm4.207-3.107a.76.76 0 01-.002 1.106l-4.412 4.442a.832.832 0 01-.882.17c-.305-.12-.466-.39-.466-.706V3.797c0-.432.332-.797.783-.797.45 0 .772.35.772.781v11.237h3.442a.833.833 0 01.765.204z"></path></g></svg>
                SORT</div>
            <div className="col-span-6 text-lg flex justify-center text-center " onClick={filterdiv}>
                <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z" opacity="0.05"></path><path fill="#282C3F" d="M3.749 7.508a.75.75 0 010-1.5h3.138a2.247 2.247 0 014.243 0h9.121a.75.75 0 010 1.5h-9.126a2.248 2.248 0 01-4.232 0H3.749zm13.373 9h3.129a.75.75 0 010 1.5h-3.135a2.247 2.247 0 01-4.231 0H3.749a.75.75 0 010-1.5h9.13a2.248 2.248 0 014.243 0z"></path></g></svg>
                FILTER</div>
            <span className='absolute h-[24px] border-r-[1px] border-slate-300 justify-self-center top-[33.33%]'></span>
            </div>



        </div>

        {/* SORT Div ********************************************************************************************************** */}

        <div className={`${sortvi} z-20 bg-[#18181846] w-full h-full fixed top-0`} onClick={() => setsortvi('hidden')}>
            <div className='absolute bottom-0 h-[45%] w-full bg-white'>
            <h1 className="font-semibold text-base font1 py-3 px-6 border-b-[0.5px] border-slate-200" >SORT BY</h1>
            <div className="text-base font1 py-3 px-6 flex justify-start items-center"><AiOutlineFire className='text-xl mr-2' onClick={() => (handleSortChange("newItems"),setsortvi('hidden'))} />Popularity</div>
            <div className="text-base font1 py-3 px-6 flex justify-start items-center"><AiOutlineStar className='text-xl mr-2' onClick={() => (/* datefun(1) */handleSortChange("Popularity"), setsortvi('hidden'))} />Latest</div>
            <div className="text-base font1 py-3 px-6 flex justify-start items-center" onClick={() => (/* pricefun(-1) */handleSortChange("discount"), setsortvi('hidden'))}>
                <img src={Per} width='28px' alt="jhgjhsd" /> Better Discount
            </div>
            <div className="text-base font1 py-3 px-6 flex justify-start items-center" onClick={() => (/* pricefun(-1) */handleSortChange("high-to-low"), setsortvi('hidden'))}>
                <svg width="24" height="24" viewBox="0 0 24 24" className="text-xl mr-2"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z" opacity="0.05"></path><path d="M4 6.215h4.962v2.43H4.505L4.13 9.858h4.764a3.05 3.05 0 01-.827 1.539 2.99 2.99 0 01-2.022.895l-1.361-.003a.304.304 0 00-.214.519l6.717 6.779 1.697-.004-6.107-6.16a4.193 4.193 0 002.14-1.167 4.256 4.256 0 001.198-2.398h2.474l.376-1.215h-2.799v-2.43h3.496V5H4v1.215zm12.389 10.028h1.337l-1.337 1.354v-1.354zm-.818 3.309c.23.09.488.04.663-.127l3.312-3.326a.567.567 0 000-.828.627.627 0 00-.574-.152H16.39v-5.043a.571.571 0 00-.58-.585.587.587 0 00-.587.597v8.935c0 .237.12.439.35.529z" fill="#282C3F"></path></g>
                </svg>Price: High To Low
            </div>
            <div className="text-base font1 py-3 px-6 flex justify-start items-center" onClick={() => (/* pricefun(1) */handleSortChange("low-to-high"), setsortvi('hidden'))}>
                <svg width="24" height="24" viewBox="0 0 24 24" className="text-xl mr-2"><g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z" opacity="0.05"></path><path d="M4 6.136h4.637v2.272H4.472l-.351 1.135h4.45a2.855 2.855 0 01-.772 1.44c-.51.514-1.177.81-1.888.836H5.91l-1.272-.002c-.25-.001-.377.305-.2.484l6.276 6.338 1.586-.002-5.706-5.76a3.92 3.92 0 002-1.092 3.984 3.984 0 001.119-2.242h2.311l.352-1.135H9.76V6.136h3.267V5H4v1.136zm12.626.733l1.249 1.265h-1.25V6.869zm-1.09-1.333v8.35c0 .3.232.557.548.557a.534.534 0 00.542-.547V9.184h2.414a.586.586 0 00.537-.143.53.53 0 00-.001-.773L16.48 5.161a.585.585 0 00-.62-.12.508.508 0 00-.326.495z" fill="#282C3F"></path></g>
                </svg>Price: Low To High
            </div>
            {/* <div className="text-base font1 py-3 px-6 flex justify-start items-center" onClick={() => setsortvi('hidden')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-xl mr-2"><path d="M13.7441 7.76569L15.5512 4.25163C15.7206 3.91273 16.2062 3.91728 16.3711 4.25845L18.2794 8.20012L22.6123 8.86767C22.9864 8.92567 23.132 9.38625 22.859 9.64896L19.6975 12.6808L20.406 17.0046C20.4674 17.3776 20.0728 17.6596 19.7385 17.48L16.3074 15.516" stroke="#282C3F" stroke-width="1.13724" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M9.98042 5.62951L12.0297 9.8623L16.681 10.5776C17.0518 10.6345 17.1973 11.0939 16.9244 11.3544L13.5331 14.6091L14.2917 19.2502C14.3531 19.6209 13.9619 19.9007 13.6298 19.7233L9.48344 17.5023L5.3041 19.6607C4.96975 19.8325 4.58195 19.547 4.64905 19.1763L5.47923 14.5489L2.13576 11.2429C1.86737 10.9779 2.01976 10.5219 2.39277 10.4696L7.05317 9.82477L9.16615 5.62382C9.3356 5.2872 9.81665 5.29061 9.98042 5.62951Z" stroke="#282C3F" stroke-width="1.13724" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>Customer Rating
            </div> */}
            </div>
        </div>

        {/* FILTER Div ********************************************************************************************************** */}

        <div className={`${filter} z-20 bg-white w-full h-full fixed top-0 `}>
            <div className=''>

            <h1 className='w-full px-8 font1 font-semibold text-base pt-3 pb-6 border-b-[1px] relative'>FILTERS
                {document.URL.includes('?') && <span className='absolute right-8 text-gray-700' onClick={clearall}>CLEAR ALL</span>} </h1>
            <div className='grid grid-cols-12 h-[93%] '>
                <div className='col-span-4 h-full text-[8px] font-normal md:text-sm'>
                    <h1 className={`filter1 foo w-full text-left border-b-[1px] font1 text-lg py-3 pl-3 md:px-8 bg-[#f8f6f6] black`} onClick={() => (classtoggle(1), addclass3(1))}>Gender</h1>
                    <h1 className={`filter2 foo w-full text-left border-b-[1px] font1 text-lg py-3 pl-3 md:px-8 bg-[#f8f6f6] grey`} onClick={() => (classtoggle(2), addclass3(2))}>Categories</h1>
                    <h1 className={`filter2 foo w-full text-left border-b-[1px] font1 text-lg py-3 pl-3 md:px-8 bg-[#f8f6f6] grey`} onClick={() => (classtoggle(3), addclass3(3))}>Sub Categories</h1>
                    <h1 className={`filter4 foo w-full text-left border-b-[1px] font1 text-lg py-3 pl-3 md:px-8 bg-[#f8f6f6] grey`} onClick={() => (classtoggle(4), addclass3(4))}>Size</h1>
                    <h1 className={`filter4 foo w-full text-left border-b-[1px] font1 text-lg py-3 pl-3 md:px-8 bg-[#f8f6f6] grey`} onClick={() => (classtoggle(5), addclass3(5))}>Price</h1>
                    <h1 className={`filter3 foo w-full text-left border-b-[1px] font1 text-lg py-3 pl-3 md:px-8 bg-[#f8f6f6] grey`} onClick={() => (classtoggle(6), addclass3(6))}>Color</h1>
                    <h1 className={`filter2 foo w-full text-left border-b-[1px] font1 text-lg py-3 pl-3 md:px-8 bg-[#f8f6f6] grey`} onClick={() => (classtoggle(7), addclass3(7))}>Special Category</h1>
                    <h1 className={`filter2 foo w-full text-left border-b-[1px] font1 text-lg py-3 pl-3 md:px-8 bg-[#f8f6f6] grey`} onClick={() => (classtoggle(8), addclass3(8))}>Discount</h1>
                    <h1 className={`filter2 foo w-full text-left border-b-[1px] font1 text-lg py-3 pl-3 md:px-8 bg-[#f8f6f6] grey`} onClick={() => (classtoggle(9), addclass3(9))}>On Sale</h1>
                </div>

                <div className='col-span-8 '>

                    <ul className={`hidden Dvisibile overflow-scroll h-[86%] ulco ul1`}>
                        {
                            gender && gender.map((e,i) =>

                                <li key={`gender_${i}`} className={`flex items-center ml-4 mr-4 py-[16px] border-b-[1px] font1 text-slate-700 font${e.replace(/ /g, "")} relative`}
                                    onClick={() => (genderfun(e), addclass1(e), addclass2(e))} ><span className={`rightdiv mr-4 tick${e.replace(/ /g, "")}`}></span>
                                <span className={`text-sm`}>{capitalizeFirstLetterOfEachWord(e)}</span> <span className={`absolute right-6 text-xs`}>{gender.filter((f) => f === e).length}</span></li>

                            )
                        }
                    </ul>
                    
                    <ul className={`hidden overflow-scroll h-[86%] ulco ul2`}>
                        {
                            Categorynewarray && Categorynewarray.map((e,i) =>

                                <li key={`category_${i}`} className={`flex items-center ml-4 mr-4 py-[16px] border-b-[1px] font1 text-slate-700 font${e.replace(/ /g, "")} relative`}
                                onClick={() => (categoryfun(e), addclass1(e), addclass2(e))} ><span className={`rightdiv mr-4 tick${e.replace(/ /g, "")}`}></span>
                                <span className={`text-sm`}>{capitalizeFirstLetterOfEachWord(e)}</span> <span className={`absolute right-6 text-xs`}>{category.filter((f) => f === e).length}</span></li>

                            )
                        }
                    </ul>
                    <ul className={`hidden overflow-scroll h-[86%] ulco ul3`}>
                        {
                            subCategoryNewArray && subCategoryNewArray.length > 0 && subCategoryNewArray.map((e,i) =>

                                <li key={`category_${i}`} className={`flex items-center ml-4 mr-4 py-[16px] border-b-[1px] font1 text-slate-700 font${e.replace(/ /g, "")} relative`}
                                onClick={() => (subCategoryfun(e), addclass1(e), addclass2(e))} ><span className={`rightdiv mr-4 tick${e.replace(/ /g, "")}`}></span>
                                <span className={`text-sm`}>{capitalizeFirstLetterOfEachWord(e)}</span> <span className={`absolute right-6 text-xs`}>{subCategoryNewArray.filter((f) => f === e).length}</span></li>

                            )
                        }
                    </ul>
                    <ul className={`hidden overflow-scroll h-[86%] ulco ul4`}>
                        {
                            size && size.map((e,i) =>

                                <li key={`category_${i}`} className={`flex items-center ml-4 mr-4 py-[16px] border-b-[1px] font1 text-slate-700 font${e.replace(/ /g, "")} relative`}
                                onClick={() => (sizefun(e), addclass1(e), addclass2(e))} ><span className={`rightdiv mr-4 tick${e.replace(/ /g, "")}`}></span>
                                <span className={`text-sm`}>{capitalizeFirstLetterOfEachWord(e)}</span> <span className={`absolute right-6 text-xs`}>{size.filter((f) => f === e).length}</span></li>

                            )
                        }
                    </ul>
                    <ul className={`hidden overflow-scroll h-[86%] ulco ul5`}>
                        {
                            sp &&
                            <div className='mt-10 ml-8 mr-8'>
                                <h1 className='text-xs text-slate-500'>Selected price range</h1>
                                <h1 className='text-base text-slate-900 font1'>&#x20B9; {price[0]} - &#x20B9;{price[1]}</h1>
                                <CustomSlider
                                    value={price}
                                    onChange={priceHandler}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                    min={Math.floor(Math.min(...sp))}
                                    max={Math.floor(Math.max(...sp))}
                                />
                            </div>
                        }
                    </ul>
                    <ul className={`hidden overflow-scroll h-[86%] ulco ul6`}>
                        {
                            colornewarray && colornewarray.map((e,i) =>

                                <li key={`color_key_${i}`} className={`flex items-center ml-4 mr-4 py-[16px] border-b-[1px] space-x-4 font1 text-slate-700 font${e.label.replace(/ /g, "")} relative`}
                                onClick={() => (colorfun(e), addclassColor1(e.label), addcolorclass(e.label))} >
                                    <span className={`rightdiv mr-4 tick${e.label.replace(/ /g, "")}`}>
                                    
                                    </span>
                                    <div className='w-6 h-6 rounded-full' style={{ backgroundColor: e.label }}>

                                    </div>
                                <span className={`text-sm`}>{e?.name}</span> <span className={`absolute right-6 text-xs`}>{color.filter((f) => f === e).length}</span></li>

                            )
                        }
                    </ul>
                    
                    <ul className={`hidden overflow-scroll h-[86%] ulco ul7`}>
                        {
                            specialCategoryNewArray && specialCategoryNewArray.length > 0 && specialCategoryNewArray.map((e,i) =>

                                <li key={`category_${i}`} className={`flex items-center ml-4 mr-4 py-[16px] border-b-[1px] font1 text-slate-700 font${e.replace(/ /g, "")} relative`}
                                onClick={() => (specialCategoryfun(e), addclass1(e), addclass2(e))} ><span className={`rightdiv mr-4 tick${e.replace(/ /g, "")}`}></span>
                                <span className={`text-sm`}>{capitalizeFirstLetterOfEachWord(e)}</span> <span className={`absolute right-6 text-xs`}>{specialCategoryNewArray.filter((f) => f === e).length}</span></li>

                            )
                        }
                    </ul>
                    <ul className={`hidden overflow-scroll h-[86%] ulco ul8`}>
                        {
                            discountedPercentageAmount && discountedPercentageAmount.length > 0 && discountedPercentageAmount.map((e,i) =>

                                <li key={`category_${i}`} className={`flex items-center ml-4 mr-4 py-[16px] border-b-[1px] font1 text-slate-700 font${e.toString()} relative`}
                                onClick={() => (discountedAmountfun(e), addclass1Discounted(e), addclass2Discounted(e))} ><span className={`rightdiv mr-4 tick${e.toString()}`}></span>
                                <span className={`text-sm`}>Up to {e}% OFF</span> <span className={`absolute right-6 text-xs`}>{discountedPercentageAmount.filter((f) => f === e).length}</span></li>

                            )
                        }
                    </ul>
                    <ul className={`hidden overflow-scroll h-[86%] ulco ul9`}>
                        <li className={`flex items-center ml-4 mr-4 py-[16px] border-b-[1px] fontonSale text-slate-700 relative`}
                            onClick={() => (onSaleFun(), addclass1('onSale'), addclass2('onSale'))} ><span className={`rightdiv mr-4 tickonSale`}></span>
                        <span className={`text-sm`}>On Sale</span> <span className={`absolute right-6 text-xl`}>{onSale.length}</span></li>
                    </ul>
                </div>

            </div>

            <div className='grid grid-cols-12 w-full font1 bg-white py-3 border-t-[0.5px] border-slate-200 absolute bottom-0 h-[7%]'>
                <div className="col-span-6 text-lg flex justify-center items-center " onClick={filterdiv}>
                CLOSE</div>
                <div className="col-span-6 text-lg flex justify-center text-center text-gray-900 " 
                onClick={() => (setMMainlink( MMainlink.includes('?') ?`${MMainlink}&sellingPrice[$gte]=${price[0]}&sellingPrice[$lte]=${price[1]}` : `${MMainlink}?sellingPrice[$gte]=${price[0]}&sellingPrice[$lte]=${price[1]}`)
                ,filterdiv(), reloadproducts() )}>
                <Link to={MMainlink}>
                    APPLY
                </Link>

                </div>
                <span className='absolute h-[24px] border-r-[1px] border-slate-300 justify-self-center top-[33.33%]'></span>
            </div>
            </div>
        </div>

        </Fragment>
    )
}

const GetPrice = ()=>{
    const url = new URL(window.location.href);
    const urlMinPrice = url.searchParams.get('sellingPrice[$gte]');
    const urlMaxPrice = url.searchParams.get('sellingPrice[$lte]');
    
    if (urlMinPrice && urlMaxPrice) {
        return [Number(urlMinPrice), Number(urlMaxPrice)]
    }
    return [];
}

export default MFilter