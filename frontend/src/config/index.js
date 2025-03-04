export function capitalizeFirstLetterOfEachWord(str) {
    console.log(str);
    if(!str){
        return "NO TEXT"
    }
    return str.split(' ').map(word =>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
export function getRandomItems(array, numItems) {
    if (!Array.isArray(array) || array.length === 0 || numItems <= 0) {
      return [];
    }
  
    const shuffled = array.slice().sort(() => Math.random() - 0.5); // Shuffle the array
    return shuffled.slice(0, numItems); // Return the first `numItems` elements
}
function filterImageFiles(files) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];
  
    return files.filter(file => {
      const fileExtension = file.url.toLowerCase().split('.').pop();
      return imageExtensions.includes('.' + fileExtension); // Only allow image files
    });
}
export function getImagesArrayFromProducts(product) {
  // Helper function to check if a file is a video based on its extension
  console.log("all colors",product)
  const isVideoFile = (fileName) => {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv'];
    return videoExtensions.some(extension => fileName.url.toLowerCase().endsWith(extension));
  };

  // Function to collect images, excluding video files
  const getImagesFromProduct = (product) => {
    let images = [];

    // Iterate over the sizes
    if (product.size && Array.isArray(product.size)) {
      product.size.forEach(s => {
        // Iterate over the colors for each size
        if (s.colors && Array.isArray(s.colors)) {
          s.colors.forEach(c => {
            // Filter out video files from color images
            if (c.images && Array.isArray(c.images)) {
              const filteredImages = c.images.filter(image => !isVideoFile(image));
              images = [...images, ...filteredImages];
            }
          });
        }
      });
    }

    return images;
  };

  // Get and return filtered images
  return getImagesFromProduct(product);
}
  


export function getRandomItem(array) {
    if (!Array.isArray(array) || array.length === 0) {
      return null; // Return null for invalid or empty arrays
    }
  
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
export function hexToRgba(hex, alpha = 1) {
    // Remove '#' if present in hex string
    hex = hex.replace('#', '');

    // Parse the red, green, and blue values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Return the rgba string
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export const calculateDiscount = (originalPrice, salePrice) => {
    // Ensure prices are valid (greater than 0)
    if (originalPrice <= 0 || salePrice < 0) {
        throw new Error("Invalid price values");
    }

    // Calculate the discount amount
    const discountAmount = originalPrice - salePrice;

    // Calculate the discount percentage
    const discountPercentage = ((discountAmount / originalPrice) * 100).toFixed(0);

    return {
        discountAmount,
        discountPercentage,
    };
};
export const generateArrayOfRandomItems = (array,numItems)=>{
    if (!Array.isArray(array) || array.length === 0 || numItems <= 0) {
        return [];
    }

    // Fisher-Yates Shuffle algorithm
    const shuffled = [...array]; // Create a copy of the original array
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Get a random index from 0 to i
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap the elements
    }

    return shuffled.slice(0, numItems); // Return the first `numItems` elements
}
export const extractSpecificWord = (inputString) => {
    if(inputString == null){
        return "-"
    }
    // Regular expression to match uppercase words or phrases like "ON-U"
    const regex = /\b[A-Z]+(?:-[A-Z]+)*\b/g;
  
    // Find matches
    const matches = inputString.match(regex);
    return matches ? matches[0] : null; // Return the first match or null if no match is found
};
export const headerConfig = ()=>{
    const token = sessionStorage.getItem("token");
    console.log("Header Token: ",token);
    const headers = {
        withCredentials:true,
        headers: {
            Authorization:`Bearer ${token}`,
            "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
        },
    }
    return headers;
}
export const removeSpaces = (inputString) => {
    return inputString.replace(/\s+/g, '');
}

export const getLocalStorageBag = ()=>{
  const bag = JSON.parse(sessionStorage.getItem("bagItem")) || [];
  return bag;
}
export const getLocalStorageWishListItem = ()=>{
  const wishList = JSON.parse(sessionStorage.getItem("wishListItem")) || [];
  return wishList;
}
export const setSessionStorageBagListItem = (orderData,productId)=>{
  let bagItem = JSON.parse(sessionStorage.getItem("bagItem"));
  if (!bagItem) {
      bagItem = [];
  }
  // console.log("bag: ",b)
  let index = bagItem?.findIndex((item) => item.productId === productId);
  if (index !== -1) {
      if(bagItem[index].size._id === orderData.size._id && bagItem[index].color._id === orderData.color._id) {
          bagItem[index].quantity += 1;
      }else{
          bagItem.push(orderData);
      }

  } else {
      bagItem.push(orderData);
  }
  sessionStorage.setItem("bagItem", JSON.stringify(bagItem));
}
export const setWishListProductInfo = (product,productId)=>{
  const wishListData = {
    productId: {...product},
  };
  let wishListItem = JSON.parse(sessionStorage.getItem("wishListItem"));
  if (!wishListItem) {
      wishListItem = [];
  }
  // console.log("bag: ",b)
  let index = wishListItem?.findIndex((item) => item.productId?._id === productId);
  if (index === -1) {
      wishListItem.push(wishListData);
      sessionStorage.setItem("wishListItem", JSON.stringify(wishListItem));
  }else{
      wishListItem.splice(index,1);
      sessionStorage.setItem("wishListItem", JSON.stringify(wishListItem));
  }
  console.log("wishListItem Addded or remove: ",wishListItem);
}


export const calculateDiscountPercentage = (originalPrice, salePrice) => {
    if (originalPrice > 0 && salePrice > 0) {
      return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    }
    return 0; // Return 0 if the prices are invalid or zero
};

export const DevMode = true;
// export const BASE_API_URL = DevMode ? process.env.REACT_APP_API_URL : "https://api.theonu.in";
export const BASE_API_URL = process.env.REACT_APP_API_URL;
// export const BASE_CLIENT_URL = DevMode ? process.env.REACT_APP_CLIENT_URL : "https://theonu.in";
export const BASE_CLIENT_URL = process.env.REACT_APP_CLIENT_URL;
