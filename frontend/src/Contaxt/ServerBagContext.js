import React, { createContext,  useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getbag } from '../action/orderaction';

// Create the context
const ServerBagContext = createContext();

// Provider component
export const SeverBagProvider = ({ children }) => {
	const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
	const dispatch = useDispatch();
	const fetchBag = async () => {
		dispatch(getbag());
	}
	useEffect(()=>{
		fetchBag();
	},[])
	return (
		<ServerBagContext.Provider value={{ bag,bagLoading,fetchBag }}>
			{children}
		</ServerBagContext.Provider>
	);
};

// Custom hook to use the toast context
export const useServerBag = () => {
	return useContext(ServerBagContext);
};
