import React, { createContext,  useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { featchallbanners, fetchAllCategoryBanners } from '../action/banner.action';
import { getOptionsByType } from '../action/productaction';

// Create the context
const ServerBannersContext = createContext();

// Provider component
export const SeverBannersProvider = ({ children }) => {
	const { banners,loading:bannerLoading} = useSelector(state => state.banners)
	const { categoryBanners,loading:CategoryBannerLoading} = useSelector(state => state.categoryBanners)
	const [categoriesOptions,setCategoryOptions] = useState([]);
	const dispatch = useDispatch();
	const getSingleOptions = async (type)=>{
		try {
			const catResponse = await dispatch(getOptionsByType({type}))
			if(catResponse){
				setCategoryOptions(catResponse.map(c => c.value));
			}
		} catch (error) {
			console.error("Error getting: ", error);
		}
	}
	useEffect(()=>{
		if(!bannerLoading){
			dispatch(featchallbanners());
		}
		if(!CategoryBannerLoading){
			dispatch(fetchAllCategoryBanners());
		}
		getSingleOptions('category');
	},[])
	return (
		<ServerBannersContext.Provider value={{ banners,categoryBanners,bannerLoading,CategoryBannerLoading,categoriesOptions,getSingleOptions }}>
			{children}
		</ServerBannersContext.Provider>
	);
};

// Custom hook to use the toast context
export const useServerBanners = () => {
	return useContext(ServerBannersContext);
};
