export function capitalizeFirstLetterOfEachWord(str) {
    console.log(str);
    if(!str){
        return "NO TEXT"
    }
    return str.split(' ').map(word =>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
export const isDevelopment = false;
export const BASE_API_URL = isDevelopment ?  'http://localhost:8080':'https://myntra-clone-backend-kf7m.onrender.com';
