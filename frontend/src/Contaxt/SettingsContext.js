import React, { createContext, useContext, useEffect } from 'react';
import { useToast } from './ToastProvider';
import toast from 'react-hot-toast';

// Create the context
const SettingContext = createContext();

// Provider component
export const SettingsProvider = ({ children }) => {
    const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type,message) => {
        // console.log("check Toast: ",type, message,activeToast);
        if(!activeToast){
            switch(type){
                case "error":
                    toast.error(message)
                    break;
                case "warning":
                    toast.warning(message)
                    break;
                case "info":
                    toast.info(message)
                    break;
                case "success":
                    toast.success(message)
                    break;
                default:
                    toast.info(message)
                    break;
            }
            showToast(message);
        }
    }
    useEffect(() => {
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        return () => {
            document.removeEventListener('contextmenu', (e) => e.preventDefault());
        };
    }, []);
    
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
                event.preventDefault();
                checkAndCreateToast("info",'Opening Developer Tools is not allowed!');
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <SettingContext.Provider value={{ checkAndCreateToast}}>
            {children}
        </SettingContext.Provider>
    );
};

// Custom hook to use the Settings context
export const useSettingsContext = () => {
    return useContext(SettingContext);
};
