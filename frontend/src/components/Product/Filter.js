import React, { Fragment, useEffect,useState } from 'react'


const Filter = ({ product,dispatchFetchAllProduct }) => {
  // console.log("Fillter PRoducts array: ",product)
    const [ colorul, setcolorul ] = useState('max-h-72')
    const [colorulbtn, setcolorulbtn] = useState('block')
    let category = []
    let gender = []
    let color = []
    let spARRAY =[]

    function categoriesarray() {
      for (let i = 0; i < product.length; i++) {
        category.push(product[i].category)
      }

    }

    function genderarray() {
      for (let i = 0; i < product.length; i++) {
        gender.push(product[i].gender)
      }

    }

    function colorarray() {
      for (const Pro of product) {
        for (const col of Pro?.color) {
          color.push(col)
        }
      }
    }
    
    function sparray() {
      for (let i = 0; i < product.length; i++) {

        spARRAY.push(product[i].salePrice ? product[i].salePrice : product[i].price)
      }

    }
    categoriesarray()
    genderarray()
    colorarray()
    sparray()

    let Categorynewarray = [...new Set(category)];
    let gendernewarray = [...new Set(gender)];
    let colornewarray = [...new Set(color)];
    let sp = [...new Set(spARRAY.sort((a,b)=> a-b ))];


  function categoryfun(e){
    let url = document.URL
  
    if (url.includes('?')) {
      let nexttext1 = e.replace(' ', '%20')
      let newtext = nexttext1.replace(' ', '%20')
    
    
      if (url.includes(`${newtext}`)) {
        let newurl = url.includes(`&category=${newtext}`) ? url.replace(`&category=${newtext}`,'') : null
        let newurl2 = url.replace(`?category=${newtext}`,'')
        let newurlsuccess =  (newurl === null ? newurl2 : newurl)
      
        window.location = newurlsuccess 
      }else{
        url += `&category=${e}`
        window.location = url
      }

    }else{

      url += `?category=${e}`
      window.location = url

    }

  }

  function colorfun(e) {
      // Create a URL object for easier manipulation
      let url = new URL(window.location.href);
      let colorKey = "color";
      let colorValue = e.trim().replace(" ", "%20"); // Sanitize and encode the color value

      if (url.searchParams.has(colorKey)) {
          // If the color parameter already exists
          if (url.searchParams.get(colorKey) === colorValue) {
              // If it matches the provided value, remove it
              url.searchParams.delete(colorKey);
          } else {
              // Otherwise, update it with the new value
              url.searchParams.set(colorKey, colorValue);
          }
      } else {
          // If the color parameter does not exist, add it
          url.searchParams.append(colorKey, colorValue);
      }

      // Update the URL in the address bar without reloading the page
      window.history.replaceState(null, "", url.toString());
      if(dispatchFetchAllProduct){
        dispatchFetchAllProduct();
      }
  }



  function price1fun(e){
    let url = document.URL
    if (url.includes('?')) {
      if (url.includes(`${e+1}`)) {
        let newurl = url.includes(`&sellingPrice[$lte]=${e+1}`) ? url.replace(`&sellingPrice[$lte]=${e+1}`,'') : null
        let newurl2 = url.replace(`?sellingPrice[$lte]=${e+1}`,'')
        let newurlsuccess =  (newurl === null ? newurl2 : newurl)
        window.location = newurlsuccess 
      }else{
        url += `&sellingPrice[$lte]=${e+1}`
        window.location = url
      }

    }else{
      url += `?sellingPrice[$lte]=${e+1}`
      window.location = url
    }
  }


  function price2fun(e, f) {
      let url = new URL(window.location.href);
      let lowerBoundKey = "sellingPrice[$gte]";
      let upperBoundKey = "sellingPrice[$lte]";
      let lowerBoundValue = e + 1;
      let upperBoundValue = f + 1;

      // Check if the current URL already includes the desired parameters
      if (
          url.searchParams.get(lowerBoundKey) == lowerBoundValue &&
          url.searchParams.get(upperBoundKey) == upperBoundValue
      ) {
          // If the parameters exist with matching values, remove them
          url.searchParams.delete(lowerBoundKey);
          url.searchParams.delete(upperBoundKey);
      } else {
          // Otherwise, update or add the parameters
          url.searchParams.set(lowerBoundKey, lowerBoundValue);
          url.searchParams.set(upperBoundKey, upperBoundValue);
      }

      // Update the URL in the browser without reloading the page
      window.history.replaceState(null, "", url.toString());
      if(dispatchFetchAllProduct){
        dispatchFetchAllProduct();
      }
  }


  function price3fun(e) {
    let url = new URL(window.location.href);
    let paramKey = `sellingPrice[$gte]`;
    let paramValue = e + 1;

    if (url.searchParams.has(paramKey)) {
        if (url.searchParams.get(paramKey) == paramValue) {
            // Remove the parameter if it matches the current value
            url.searchParams.delete(paramKey);
        } else {
            // Update the parameter value
            url.searchParams.set(paramKey, paramValue);
        }
    } else {
        // Add the parameter if it doesn't exist
        url.searchParams.append(paramKey, paramValue);
    }

    // Update the URL without reloading the page
    window.history.replaceState(null, "", url.toString());
    if(dispatchFetchAllProduct){
      dispatchFetchAllProduct();
    }
  }


  function genderfun(e) {
    let url = document.URL;
  
    // Replace spaces with '%20' to handle URL encoding
    let newText = e.replace(' ', '%20');
  
    // Check if URL already contains query parameters
    if (url.includes('?')) {
      // Check if the gender query parameter is already in the URL
      if (url.includes(`gender=${newText}`)) {
        // If gender is already in the URL, remove it
        let newUrl = url.includes(`&gender=${newText}`)
          ? url.replace(`&gender=${newText}`, '')  // Remove '&gender=XXX' if present
          : url.replace(`?gender=${newText}`, '');  // Remove '?gender=XXX' if it's the first parameter
  
        // Update the browser's URL without reloading the page
        window.history.replaceState({}, '', newUrl);
      } else {
        // If gender is not in the URL, add it
        let newUrl = url + `&gender=${newText}`;
  
        // Update the browser's URL without reloading the page
        window.history.pushState({}, '', newUrl);
      }
    } else {
      // If there are no query parameters, add gender as the first parameter
      let newUrl = url + `?gender=${newText}`;
  
      // Update the browser's URL without reloading the page
      window.history.pushState({}, '', newUrl);
    }
    if(dispatchFetchAllProduct){
      dispatchFetchAllProduct();
    }
  }
  

  function check() {
    const params = new URLSearchParams(window.location.search)
    let categoriesarray = []
  
    for (const param of params) {
      if (!categoriesarray.includes(param[1])) {
        categoriesarray.push(param[1])
      }
    
    }
    for (let i = 0; i < categoriesarray.length; i++) {
      let div1 = document.getElementById(`id${categoriesarray[i]}`)
      if(div1) {
        let div = document.getElementById(`id${categoriesarray[i]}`)
        div.checked = 'checked'
      }
    }

  }


  // const items = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //… your array, filled with values

  const n = 3
  const result = [[], [], []] //we create it, then we'll fill it

  const wordsPerLine = Math.ceil(sp.length / 3)

  for (let line = 0; line < n; line++) {
    for (let i = 0; i < wordsPerLine; i++) {
      const value = sp[i + line * wordsPerLine]
      if (!value) continue //avoid adding "undefined" values
      result[line].push(value)

    }
  }

  function sparraynew(){
    let filersp = spARRAY.filter((f)=>f <=  Math.max(...result[1]) )
    let newfiltersp = filersp.filter((f)=>f >=  Math.min(...result[1]))
    return newfiltersp.length
  } 


  useEffect(() => {
    check()
  }, []);
  console.log("Filter: ",color);

  return (
    <Fragment>
      <div className=''>
       {/* Gender Filter ********************************************** */}
          <ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
            {
              gendernewarray && gendernewarray.map((e,i)=>
                <li className='items-center'>
                  <input type="radio" name="gender" value={`${e}`} className='mb-2 accent-pink-500' id={`id${i}`}  onClick={(event)=>{
                    console.log("Gender Clicked")
                    genderfun(`${e}`)
                  }} />
                  <label className='font1 text-sm font-semibold ml-2 mr-4 mb-2'>{e}</label>
                </li>
              )
            }
           
          </ul>

            {/* categories Filter ******************************************* */}

            <ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
              <h1 className='font1 text-base font-semibold mb-2'>CATEGORIES</h1>
            {
              Categorynewarray && Categorynewarray.map((e,i)=>
              <li className='items-center' onClick={(event)=>{
                event.preventDefault();
                categoryfun(`${e}`)
              }} >
                <input type="checkbox" name="categories" value={`${e}`} id={`id${i}`} className='mb-2 accent-pink-500' />
                <label className='font1 text-sm ml-2 mr-4 mb-2'>{e}<span className='text-xs font-serif font-normal text-slate-400'> ({category.filter((f)=>f === e).length})</span> </label>
              </li>
              )
            }
           
          </ul>
            
            {/* Color filter *************************************************** */}

            <ul className={`pl-8 border-b-[1px] border-slate-200 py-4  ${colorul} overflow-hidden relative `}>
              <h1 className='font1 text-base font-semibold mb-2'>COLOR</h1>
              {
                colornewarray && colornewarray.map((e)=>
                  <li className='items-center justify-start flex flex-row'>
                    <input type="checkbox" name="color" value={`${e.id}`} id={`id${e.id}`}  onClick={(event)=>{
                      event.preventDefault();
                      colorfun(`${e.id}`)
                    }} className='mb-2 accent-pink-500'/>
                    <div className='w-4 h-4 mb-[2%] rounded-full'/>
                    <label className='font1 text-sm ml-2 mr-4 mb-2'>{e.id} 
                      <span className='text-xs font-serif font-normal text-slate-400'> ({color.filter((f)=>f.id === e.id).length})
                      </span> 
                    </label>
                  </li>
                )
            }
           <button className={`absolute bottom-1 right-2 font1 text-[#ff3f6c] ${colorulbtn} `}
           onClick={(event)=>(setcolorul('max-h-max'), setcolorulbtn('hidden'))}> + more</button>
          </ul>
              {/* Price filter *************************************************** */}
          <ul className={`pl-8 border-b-[1px] border-slate-200 py-4  overflow-hidden relative `}>
              <h1 className='font1 text-base font-semibold mb-2'>PRICE</h1>
           
              <li className='items-center '>
              <input type="checkbox" name="color" value={`price1`}  className='mb-2 accent-pink-500' onClick={()=>price1fun(Math.max(...result[0]))} id={`id${Math.max(...result[0])+1}`} />
              
              <label className='font1 text-sm ml-2 mr-4 mb-2'> Rs. {Math.floor(Math.min(...result[0]))} to Rs. {Math.floor(Math.max(...result[0]))} <span className='text-xs font-serif font-normal text-slate-400'> ({spARRAY.filter((f) => f <=  Math.max(...result[0])).length})</span> </label>
              </li>

              <li className='items-center '>
              <input type="checkbox" name="color" value={`price1`}  className='mb-2 accent-pink-500' onClick={()=>price2fun(Math.min(...result[1]), Math.max(...result[1]))} id={`id${Math.max(...result[1])+1}`} />
              
              <label className='font1 text-sm ml-2 mr-4 mb-2'> Rs. {Math.floor(Math.min(...result[1]))} to Rs. {Math.floor(Math.max(...result[1]))} <span className='text-xs font-serif font-normal text-slate-400'> ({sparraynew()})</span> </label>
              </li>

              <li className='items-center '>
              <input type="checkbox" name="color" value={`price1`}  className='mb-2 accent-pink-500' onClick={()=>price3fun(Math.min(...result[2]))}  id={`id${Math.min(...result[2])+1}`} />
              
              <label className='font1 text-sm ml-2 mr-4 mb-2'> Rs. {Math.floor(Math.min(...result[2]))} to Rs. {Math.floor(Math.max(...result[2]))} <span className='text-xs font-serif font-normal text-slate-400'> ({spARRAY.filter((f) => f >=  Math.min(...result[2])).length})</span> </label>
              </li>
              
          </ul>
      </div>
    </Fragment>
  )
}

export default Filter