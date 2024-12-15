export function capitalizeFirstLetterOfEachWord(str) {
    return str
        .split(' ')                    // Split the string into an array of words
        .map(word =>                    // Map over each word
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()  // Uppercase the first letter, lowercase the rest
        )
        .join(' ');                     // Join the words back into a single string
}