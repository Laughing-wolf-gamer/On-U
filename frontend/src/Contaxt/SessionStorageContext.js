import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context to hold session storage data
const SessionStorageContext = createContext();

// Custom hook to access session storage context
export const useSessionStorage = () => {
    return useContext(SessionStorageContext);
};

// Provider component to wrap around the app
export const SessionStorageProvider = ({ children }) => {
    const [sessionData, setSessionData] = useState(() => {
        // Initialize state with session storage data
        return JSON.parse(sessionStorage.getItem('wishListItem')) || [];
    });
    const [sessionBagData, setBagSessionData] = useState(() => {
        // Initialize state with session storage data
        return JSON.parse(sessionStorage.getItem('bagItem')) || [];
    });

    useEffect(() => {
        // Listen for changes in session storage
        const handleStorageChange = () => {
            const updatedData = JSON.parse(sessionStorage.getItem('wishListItem')) || [];
            const updatedBagData = JSON.parse(sessionStorage.getItem('bagItem')) || [];
            setSessionData(updatedData);
            setBagSessionData(updatedBagData);
        };

        // Listen for session storage changes
        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    const setSessionStorageBagListItem = (orderData,productId)=>{
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
        setBagSessionData(bagItem)
    }
    const setWishListProductInfo = (product,productId)=>{
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
        console.log("wishListItem Added or remove: ",wishListItem);
        setSessionData(JSON.parse(sessionStorage.getItem("wishListItem")));
    }
    const updateSessionStorage = (newData) => {
        sessionStorage.setItem('wishListItem', JSON.stringify(newData));
        setSessionData(newData);
    };

    return (
        <SessionStorageContext.Provider value={{ sessionData,sessionBagData, updateSessionStorage,setWishListProductInfo ,setSessionStorageBagListItem}}>
            {children}
        </SessionStorageContext.Provider>
    );
};