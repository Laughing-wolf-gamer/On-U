export function capitalizeFirstLetterOfEachWord(str) {
    console.log(str);
    if(!str){
        return "NO TEXT"
    }
    return str.split(' ').map(word =>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
export const isDevelopment = true;
export const BASE_URL = isDevelopment ?  'http://localhost:8080':'https://myntra-clone-new.onrender.com';
