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
        // console.log("check Toast: ",type, message,activeToast);
        if(!activeToast){
            switch(type){
                case "error":
                    toast.error(message,{
                        duration: 4000,
                        position: 'top-center',
                      
                        // Styling
                        style: {},
                        className: '',
                                            
                        // Change colors of success/error/loading icon
                        iconTheme: {
                            primary: '#000',
                            secondary: '#fff',
                        },
                      
                        // Aria
                        ariaProps: {
                            role: 'status',
                            'aria-live': 'polite',
                        },
                      
                        // Additional Configuration
                        removeDelay: 1000,
                    })
                    break;
                case "warning":
                    toast.warning(message,{
                        duration: 4000,
                        position: 'top-center',
                      
                        // Styling
                        style: {},
                        className: '',
                                            
                        // Change colors of success/error/loading icon
                        iconTheme: {
                            primary: '#000',
                            secondary: '#fff',
                        },
                      
                        // Aria
                        ariaProps: {
                            role: 'status',
                            'aria-live': 'polite',
                        },
                      
                        // Additional Configuration
                        removeDelay: 5000,
                    })
                    break;
                case "info":
                    toast.info(message,{
                        duration: 4000,
                        position: 'top-center',
                      
                        // Styling
                        style: {},
                        className: '',
                      
                        // Custom Icon
                        icon: '👋',
                      
                        // Change colors of success/error/loading icon
                        iconTheme: {
                            primary: '#000',
                            secondary: '#fff',
                        },
                      
                        // Aria
                        ariaProps: {
                            role: 'status',
                            'aria-live': 'polite',
                        },
                      
                        // Additional Configuration
                        removeDelay: 500,
                    })
                    break;
                case "success":
                    toast.success(message,{
                        duration: 4000,
                        position: 'top-center',
                      
                        // Styling
                        style: {},
                        className: '',
                                            
                        // Change colors of success/error/loading icon
                        iconTheme: {
                            primary: '#000',
                            secondary: '#fff',
                        },
                      
                        // Aria
                        ariaProps: {
                            role: 'status',
                            'aria-live': 'polite',
                        },
                      
                        // Additional Configuration
                        removeDelay: 500,
                    })
                    break;
                default:
                    toast.info(message,{
                        duration: 4000,
                        position: 'top-center',
                      
                        // Styling
                        style: {},
                        className: '',
                      
                        // Custom Icon
                        icon: '👏',
                      
                        // Change colors of success/error/loading icon
                        iconTheme: {
                            primary: '#000',
                            secondary: '#fff',
                        },
                      
                        // Aria
                        ariaProps: {
                            role: 'status',
                            'aria-live': 'polite',
                        },
                      
                        // Additional Configuration
                        removeDelay: 500,
                    })
                break;
            }
            showToast(message);
        }
    }
    
    useEffect(() => {
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
                    checkAndCreateToast("info",'Opening Developer Tools is not allowed!');
                }
            };
            
            window.addEventListener('keydown', handleKeyPress);
            
            return () => {
                window.removeEventListener('keydown', handleKeyPress);
            };
        }
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
