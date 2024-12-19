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

export const isDevelopment = false;
export const BASE_API_URL = isDevelopment ?  'http://192.168.1.2:8000':'https://on-u-backend-new.onrender.com';
