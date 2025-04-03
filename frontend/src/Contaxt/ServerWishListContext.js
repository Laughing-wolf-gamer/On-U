import React, { createContext,  useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getbag, getwishlist } from '../action/orderaction';
import { getRandomArrayOfProducts } from '../action/productaction';

// Create the context
const ServerWishListContext = createContext();

// Provider component
export const SeverWishListProvider = ({ children }) => {
	const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
	const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
	const { randomProducts, loading: RandomProductLoading, error: errorRandomProductLoading } = useSelector(state => state.RandomProducts);
	const dispatch = useDispatch();
	const fetchWishList = async () => {
		dispatch(getwishlist());
	}
	const fetchBag = async () => {
		dispatch(getbag());
	}
	useEffect(()=>{
		fetchWishList();
		fetchBag();
		dispatch(getRandomArrayOfProducts());
	},[])
	return (
		<ServerWishListContext.Provider value={{ wishlist,loadingWishList,fetchWishList,bag,bagLoading,fetchBag,randomProducts,RandomProductLoading }}>
			{children}
		</ServerWishListContext.Provider>
	);
};

// Custom hook to use the toast context
export const useServerWishList = () => {
	return useContext(ServerWishListContext);
};
