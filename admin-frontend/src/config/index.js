export const registerFormControls = [
    {
        name:'name',
        label :"User Name",
        placeHolder:'Enter your User Name',
        componentType: 'input',
        type: 'text',
    },
    {
        name:'email',
        label :"Email",
        placeHolder:'Enter your Email Address',
        componentType: 'input',
        type: 'email',
    },
    {
        name:'phoneNumber',
        label :"Phone Number",
        placeHolder:'Enter your Phone Number',
        componentType: 'input',
        type: 'phone',
    },
    {
        name:'password',
        label :"Password",
        placeHolder:'Enter your password',
        componentType: 'input',
        type: 'password',
    },
    {
        name:'role',
        label :"Role",
        placeHolder:'Set Role Type',
        componentType: 'select',
        options:[
            {id:'superAdmin', label:'Super Admin',},
            {id:'admin', label:'Admin',},
        ]  
    },

]
export const addressFormControls = [
    {
        name:'address',
        label :"Address",
        placeHolder:'Enter your address',
        componentType: 'input',
        type: 'text',
    },
    {
        name:'city',
        label :"City",
        placeHolder:'Enter your City',
        componentType: 'input',
        type: 'text',
    },
    {
        name:'state',
        label :"State",
        placeHolder:'Enter your State',
        componentType: 'input',
        type: 'text',
    },
    {
        name:'country',
        label :"Country",
        placeHolder:'Enter your Country',
        componentType: 'input',
        type: 'text',
    },
    {
        name:'pinCode',
        label :"Pin Code",
        placeHolder:'Enter your Pin Code',
        componentType: 'input',
        type: 'text',
    },
    {
        name:'phoneNumber',
        label :"PhoneNumber",
        placeHolder:'Enter your Phone Number',
        componentType: 'input',
        type: 'text',
    },
    {
        name:'notes',
        label :"Notes",
        placeHolder:'Enter your Notes',
        componentType: 'textarea',
        type: 'text',
    }
]
export const loginFormControls = [
    {
        name:'email',
        label :"Email",
        placeHolder:'Enter your Email Address',
        componentType: 'input',
        type: 'email',
    },
    {
        name:'password',
        label :"Password",
        placeHolder:'Enter your password',
        componentType: 'input',
        type: 'password',
    },
    {
        name:'role',
        label :"Role",
        placeHolder:'Set Type',
        componentType: 'select',
        options:[
            {id:'superAdmin', label:'Super Admin',},
            {id:'admin', label:'Admin',},
        ]  
    },
]

export const adminSideBarMenu = [
    {
        id: 'dashboard',
        label: 'DashBoard',
        accessRole:['admin','superAdmin'],
        path: '/admin/dashboard',
        
    },
    {
        id: 'products',
        label: 'Products',
        accessRole:['superAdmin'],
        path: '/admin/products',
        
    },
    {
        id: 'user',
        label: 'Users',
        accessRole:['superAdmin'],
        path: '/admin/users',
        
    },
    {
        id: 'orders',
        label: 'Orders',
        accessRole:['superAdmin'],
        path: '/admin/orders',
        
    },
    {
        id: 'query',
        label: 'Query',
        accessRole:['superAdmin','admin'],
        path: '/admin/contactQuery',
        
    },
    {
        id:'warehouse',
        label: 'Warehouse',
        accessRole:['superAdmin'],
        path: '/admin/warehouse',
    },
    {
        id: 'pages',
        label: 'Pages',
        accessRole:['superAdmin'],
        dropDownView:[
            {
                id:'privacyPolicy',
                label:'Privacy and Policy',
                accessRole:['superAdmin'],
                path: 'pages/privacyPolicy',
            },
            {
                id:'faqs',
                label:'FAQs',
                accessRole:['superAdmin'],
                path: 'pages/faqs',
            },
            {
                id:'termsAndConditions',
                label:'Terms and Conditions',
                accessRole:['superAdmin'],
                path: 'pages/termsAndCond',
            },
            {
                id:'contactManagement',
                label:'Contact Us',
                accessRole:['superAdmin'],
                path: 'pages/contactUsManagement',
            },
            {
                id:'adminAbout',
                label:'Admin About',
                accessRole:['superAdmin'],
                path: 'pages/about',
            },
        ]
        
    },
    {
        id: 'features',
        label: 'Features',
        accessRole:["admin",'superAdmin'],
        dropDownView:[
            {
                id:'adminHome',
                label:'Admin Home Details',
                accessRole:["admin",'superAdmin'],
                path: 'features/home',
            },
            {
                id:'adminOptionsManagement',
                label:'Admin Add Options',
                accessRole:['superAdmin'],
                path: 'features/addOptions',
            },
            {
                id:'adminAddressManagement',
                label:'Admin Address Options',
                accessRole:['superAdmin'],
                path: 'features/addressOptions',
            },
            {
                id:'adminCouponManagement',
                label:'Admin Coupon Management',
                accessRole:['superAdmin'],
                path: 'features/couponManagement',
            },
        ]
        
    },
    
    
];
export const adminFeaturesBarDropdown = [
    {
        id: 'homeImages',
        label: 'Home Images',
        path: '/admin/features/homeImages',
    }
]

export const addProductsFromElement = [
    {
        label:'Product ID',
        name:'productId',
        componentType:'input',
        type:'text',
        placeHolder:'Enter Product ID',
        required:true,
    },
    {
        label:'Title',
        name:'title',
        componentType:'input',
        type:'text',
        placeHolder:'Enter Product Title',
        required:true,
    },
    {
        label:'Short Title',
        name:'shortTitle',
        componentType:'input',
        type:'text',
        placeHolder:'Enter Short Title',
        required:true,
    },
    {
        label:'Description',
        name:'description',
        componentType:'textarea',
        placeHolder:'Enter Product Description',
        required:true,
    },
    {
        label:'Materials & Care',
        name:'material',
        componentType:'textarea',
        placeHolder:'Enter Materials & Care',
        required:true,
    },
    {
        label:'Care Instructions',
        name:'careInstructions',
        componentType:'textarea',
        placeHolder:'Enter Care Instructions',
        required:true,
    },
    {
        label:'Specification',
        name:'specification',
        componentType:'textarea',
        placeHolder:'Enter Specification',
        required:true,
    },
    /* {
        label:'GST',
        name:'gst',
        componentType:'input',
        type:'number',
        placeHolder:'Enter Product Price',
        required:true,
    }, */
    {
        label:'Price',
        name:'price',
        componentType:'input',
        type:'number',
        placeHolder:'Enter Product Price',
        required:true,
    },
    {
        label:'Sale Price',
        name:'salePrice',
        componentType:'input',
        type:'number',
        placeHolder:'Enter Product Sale Price (Option)',
        required:false,
    },
    {
        label:"Gender",
        name:'gender',
        componentType:'select',
        placeHolder:'Select Product Gender',
        options:[
            {id:'men',label:"Men"},
            {id:'women',label:"Women"},
            {id:'kids',label:"Kids"},
        ],
        required:true,
    },
    {
        label:"Delivary Points",
        name:'delivaryPoints',
        componentType:'arrayTexts',
        required:false,
    },

    {
        label:"Category",
        name:'category',
        componentType:'select',
        placeHolder:'Select Product Category',
        options:[
            {id:'topWear',label:"Top Wear"},
            {id:'india&festiveWear',label:"Indian & Festival Wear"},
            {id:'bottomWear',label:"Bottom Wear"},
            {id:'innerWear',label:"Inner Wear"},
            {id:'footWear',label:"Foot Wear"},
        ],
        required:true,
    },
    {
        label:"Special Category",
        name:'specialCategory',
        componentType:'select',
        placeHolder:'Select Product Category',
        options:[
            {id:'none',label:"None"},
            {id:'topPicks',label:"Top Picks"},
            {id:'bestSeller',label:"Best Seller"},
            {id:'luxuryItems',label:"Luxury Items"},
        ],
        required:false,
    },
    {
        label:"SubCategory",
        name:'subCategory',
        componentType:'select',
        placeHolder:'Select Product Sub-Category',
        options:[
        ],
        required:true,
    },
	
    {
        label:"ClothSize",
        name:'clothingSize',
        componentType:'sizeSelect',
        placeHolder:'Select Product Size',
        options:[],
        required:true,
    },
    /* {
        label:"FootwearSize",
        name:'footWearSize',
        componentType:'sizeSelect',
        placeHolder:'Select Product Shoes Size',
        options:[],
        required:true,
    }, */
	/* {
        label:"AllColorSelect",
        name:'allColors',
        componentType:'allcolorSelect',
        placeHolder:'Select Product All Colors',
        required:true,
    }, */
    {
        label:"Bullet Points",
        name:'bulletPoints',
        componentType:'bulletPoints',
        placeHolder:'Select Product Bullet Points',
        required:true,
    },
    {
        label:"width",
        name:'Width',
        componentType:'input',
        type:'number',
        placeHolder:'Enter Product Width',
        required:true,
    },
    {
        label:"height",
        name:'Height',
        componentType:'input',
        type:'number',
        placeHolder:'Enter Product Height',
        required:true,
    },
    {
        label:"length",
        name:'Length',
        componentType:'input',
        type:'number',
        placeHolder:'Enter Product Length',
        required:true,
    },
    {
        label:"weight",
        name:'Weight',
        componentType:'input',
        type:'number',
        placeHolder:'Enter Product Weight',
        required:true,
    },
    {
        label:"breadth",
        name:'Breadth',
        componentType:'input',
        type:'text',
        placeHolder:'Enter Product Breadth',
        required:true,
    }
    
]

export const shoppingViewHeaderMenuItems = [
    {
        id: 'home',
        label: 'Home',
        path: '/shop/home',
    },
    {
        id:'products',
        label:'Products',
        path:'/shop/listing',
    },
    {
        id: 'electronics',
        label: 'Electronics',
        path: '/shop/listing',
    },
    {
        id: 'clothing',
        label: 'Clothing',
        path: '/shop/listing',
    },
    {
        id:'men',
        label:'Men',
        path:'/shop/listing',
    },
    {
        id: 'women',
        label: 'Women',
        path: '/shop/listing',
    },
    {
        id: 'kids',
        label: 'Kids',
        path: '/shop/listing',
    },
    {
        id: 'cart',
        label: 'Cart',
        path: '/shop/listing',
    },
    {
        id:'watch',
        label: 'Watch',
        path: '/shop/listing',
    },
    {
        id:'search',
        label:'Search',
        path:'/shop/search',
    },

]
export const filterOptions = {
    category:[
        {id:'men', label:'Men'},
        {id:'women', label:'Women'},
        {id:'kids', label:'Kids'},
        {id:'footwear', label:'Footwear'},
    ],
    brand:[
        { id: 'nike', label: 'Nike' },
        { id: 'adidas', label: 'Adidas' },
        { id: 'puma', label: 'Puma' },
        { id: 'under-armour', label: 'Under Armour' },
        { id: 'the-north-face', label: 'The North Face' },
        { id: 'vans', label: 'Vans' },
        { id: 'new-balance', label: 'New Balance' },
        { id: 'converse', label: 'Converse' },
        { id: 'burberry', label: 'Burberry' },
        { id: 'louis-vuitton', label: 'Louis Vuitton' },
        { id: 'chanel', label: 'Chanel' },
        { id: 'gucci', label: 'Gucci' },
        { id: 'prada', label: 'Prada' },
        { id: 'ralph-lauren', label: 'Ralph Lauren' },
        { id: 'calvin-klein', label: 'Calvin Klein' },
        { id: 'tommy-hilfiger', label: 'Tommy Hilfiger' },
        { id: 'panerai', label: 'Panerai' },
        { id: 'longines', label: 'Longines' },
        { id: 'montblanc', label: 'Montblanc' },
        { id: 'seiko', label: 'Seiko' },
        { id: 'casio', label: 'Casio' },
        { id: 'citizen', label: 'Citizen' },
        { id: 'tissot', label: 'Tissot' },
        { id: 'swarovski', label: 'Swarovski' },
        { id: 'hublot', label: 'Hublot' },
        { id: 'breitling', label: 'Breitling' },
        { id: 'breguet', label: 'Breguet' },
        { id: 'chopard', label: 'Chopard' },
        { id: 'tag-heuer', label: 'TAG Heuer' },
    ]
}


export const GetBadgeColor = (status)=>{
    switch(status){
        case 'Processing':
            return 'bg-orange-600 text-white hover:bg-orange-800';
        case'Order Confirmed':
            return 'bg-yellow-600 text-white hover:bg-yellow-800';
        case 'Order Shipped':
            return 'bg-blue-600 text-white hover:bg-blue-800';
        case 'Out for Delivery':
            return 'bg-pink-600 text-white hover:bg-pink-800';
        case 'Delivered':
            return 'bg-green-600 text-white hover:bg-green-800';
        default:
            return 'bg-black text-black hover:bg-gray-600';
    }
}
export function getInitials(fullName) {
    if(fullName){
        // Trim leading and trailing spaces and split the name by spaces
        const nameParts = fullName.trim().split(/\s+/);
        // Map each part to its first letter, capitalize it, and join the initials
        const initials = nameParts.map(part => part[0].toUpperCase()).join('');
        return initials;
    }
    return 'JD'
}
export const categoryOptions = {
    'topWear':"Top Wear",
    'india&festiveWear':"Indian & Festival Wear",
    'bottomWear':"Bottom Wear",
    'innerWear':"Inner Wear",
}
export const brandOptions = {
    'nike': 'Nike',
    'adidas': 'Adidas',
    'puma': 'Puma',
    'under-armour': 'Under Armour',
    'the-north-face': 'The North Face',
    'vans': 'Vans',
    'new-balance': 'New Balance',
    'converse': 'Converse',
    'burberry': 'Burberry',
    'louis-vuitton': 'Louis Vuitton',
    'chanel': 'Chanel',
    'gucci': 'Gucci',
    'prada': 'Prada',
    'ralph-lauren': 'Ralph Lauren',
    'calvin-klein': 'Calvin Klein',
    'tommy-hilfiger': 'Tommy Hilfiger',
    'panerai': 'Panerai',
    'longines': 'Longines',
    'montblanc': 'Montblanc',
    'seiko': 'Seiko',
    'casio': 'Casio',
    'citizen': 'Citizen',
    'tissot': 'Tissot',
    'swarovski': 'Swarovski',
    'hublot': 'Hublot',
    'breitling': 'Breitling',
    'breguet': 'Breguet',
    'chopard': 'Chopard',
    'tag-heuer': 'TAG Heuer',
 
}
export const sortOptions = [
    {id: 'price-low-to-high', label: 'Price Low to High'},
    {id: 'price-high-to-low', label: 'Price High to Low'},
    {id: 'title-a-2-z', label: 'A 2 Z'},
    {id: 'title-z-2-a', label: 'Z 2 A'},
    {id: 'rating-high-to-low', label: 'Rating High to Low'},
    {id: 'rating-low-to-high', label: 'Rating Low to High'},
    {id: 'newest-first', label: 'Newest First'},
    {id: 'oldest-first', label: 'Oldest First'},
    {id: 'best-sellers', label: 'Best Sellers'},
    {id: 'most-popular', label: 'Most Popular'},
    {id: 'most-relevant', label: 'Most Relevant'},
    {id: 'best-reviewed', label: 'Best Reviewed'},
    {id: 'discount-high-to-low', label: 'Discount High to Low'},
    {id: 'discount-low-to-high', label: 'Discount Low to High'},
    {id: 'price-ascending', label: 'Price Ascending'},
    {id: 'price-descending', label: 'Price Descending'},
    {id: 'alphabetical-a-z', label: 'Alphabetical A-Z'},
    {id: 'alphabetical-z-a', label: 'Alphabetical Z-A'},
    {id: 'availability', label: 'Availability'},
    {id: 'most-viewed', label: 'Most Viewed'},
]
export function capitalizeFirstLetterOfEachWord(str) {
    console.log(str);
    if(!str){
        return "-"
    }
    return str.split(' ').map(word =>word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}
export const Header = ()=>{
    const token = sessionStorage.getItem('token');
    // console.log(token);
    const header = {
        withCredentials:true,
        headers: {
            Authorization:`Bearer ${token}`,
            "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
        },
    }
    return header;
}
export function hexToRgba(hex, alpha = 1) {
    // Remove hash (#) if present
    const hexToRGB = hex.replace('#', '');
    
    // Parse the hex string based on its length (3 or 6 characters)
    let r, g, b;
    
    if (hexToRGB.length === 3) {
        // Short hex form: #RGB
        r = parseInt(hexToRGB[0] + hexToRGB[0], 16);
        g = parseInt(hexToRGB[1] + hexToRGB[1], 16);
        b = parseInt(hexToRGB[2] + hexToRGB[2], 16);
    } else if (hexToRGB.length === 6) {
        // Full hex form: #RRGGBB
        r = parseInt(hexToRGB.substring(0, 2), 16);
        g = parseInt(hexToRGB.substring(2, 4), 16);
        b = parseInt(hexToRGB.substring(4, 6), 16);
    } else {
        throw new Error('Invalid hex color format');
    }
    
    // Return the RGBA value with the provided alpha
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export const formattedSalePrice = (price)=>{
    return price ? Math.round(price) : "0";
}
export const BASE_URL = import.meta.env.VITE_BASE_LOCAL_API
