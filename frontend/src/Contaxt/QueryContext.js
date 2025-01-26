// context/QueryContext.js

import React, { createContext, useContext, useState } from 'react';

const QueryContext = createContext();

// Custom hook to use the QueryContext
export const useQueryContext = () => {
    return useContext(QueryContext);
};

// QueryContext provider component
export const QueryProvider = ({ children }) => {
    const [queryParams, setQueryParams] = useState([]);

    // Function to add or update query params
    const updateQueryParams = (paramsArray) => {
        setQueryParams((prevParams) => {
            // Create a new array with updated params
            const updatedParams = [...prevParams, ...paramsArray];
            return updatedParams;
        });
    };

    // Function to get the full query string
    const getQueryString = () => {
        const urlParams = new URLSearchParams();
        queryParams.forEach((param) => {
            if (param.key && param.value) {
                urlParams.append(param.key, param.value);
            }
        });
        return urlParams.toString();
    };

    return (
        <QueryContext.Provider value={{ queryParams, updateQueryParams, getQueryString }}>
            {children}
        </QueryContext.Provider>
    );
};
