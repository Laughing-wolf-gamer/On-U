import React, { createContext, useContext, useEffect } from 'react';
import { useToast } from './ToastProvider';
import toast from 'react-hot-toast';
import { inProduction } from '../config';

// Create the context
const SettingContext = createContext();

// Provider component
export const SettingsProvider = ({ children }) => {
    const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type,message) => {
        const style = {
            border: '1px solid #fff',
            padding: '16px',
            color: '#713200',
        }
        const iconTheme = {
            primary: '#000',
            secondary: '#fff',
        };
        const ariaProps = {
            role: 'status',
            'aria-live': 'polite',
        };
        const removeDelay = 500;
        const appearDuratin = 1000;
        const position = 'top-center'
        // console.log("check Toast: ",type, message,activeToast);
        if(!activeToast){
            switch(type){
                case "success":
                    toast.success(message,{
                        duration: appearDuratin,
                        position: position,
                      
                        // Styling
                        style: style,
                                            
                        // Change colors of success/error/loading icon
                        iconTheme: iconTheme,
                      
                        // Aria
                        ariaProps: ariaProps,
                      
                        // Additional Configuration
                        removeDelay: removeDelay,
                    })
                    break;
                default:
                    toast.error(message,{
                        duration: appearDuratin,
                        position: position,
                      
                        // Styling
                        style: style,
                        // Change colors of success/error/loading icon
                        iconTheme: iconTheme,
                      
                        // Aria
                        ariaProps: ariaProps,
                      
                        // Additional Configuration
                        removeDelay: removeDelay,
                    })
                break;
            }
            showToast(message);
        }
    }
    
    /* useEffect(() => {
        if(inProduction){
            document.addEventListener('contextmenu', (e) => e.preventDefault());
            return () => {
                document.removeEventListener('contextmenu', (e) => e.preventDefault());
            };
        }
    }, []);
    
    useEffect(() => {
        if(inProduction){
            const handleKeyPress = (event) => {
                if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
                    event.preventDefault();
                    checkAndCreateToast("error",'Opening Developer Tools is not allowed!');
                }
            };
            
            window.addEventListener('keydown', handleKeyPress);
            
            return () => {
                window.removeEventListener('keydown', handleKeyPress);
            };
        }
    }, []); */

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
