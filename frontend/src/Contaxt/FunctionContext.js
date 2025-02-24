// FunctionContext.js
import React, { createContext, useContext, useState } from 'react';

const FunctionContext = createContext();

export const useFunctionContext = () => useContext(FunctionContext);

export const FunctionProvider = ({ children }) => {
  const [state, setState] = useState('Initial State');

  const callFunction = (data) => {
    // console.log('Function called with:', data);
    setState(data);
  };

  return (
    <FunctionContext.Provider value={{ callFunction, state }}>
      {children}
    </FunctionContext.Provider>
  );
};
