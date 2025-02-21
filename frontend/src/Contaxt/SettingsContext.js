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
            border: '1px solid #713200'
            padding: '16px',
            color: '#713200',
        },
        const icon = "👌"
        const iconTheme = {
            primary: '#000',
            secondary: '#fff',
        }
        const ariaProps = {
            role: 'status',
            'aria-live': 'polite',
        }
        const removeDelay = 1000;
        const appearDuratin = 4000;
        const position = 'top-center'
        // console.log("check Toast: ",type, message,activeToast);
        if(!activeToast){
            switch(type){
                case "error":
                    toast.error(message,{
                        duration: appearDuratin,
                        position: position,
                      
                        // Styling
                        style,
                        className: '',
                                            
                        // Change colors of success/error/loading icon
                        iconTheme: iconTheme,
                      
                        // Aria
                        ariaProps: ariaProps,
                      
                        // Additional Configuration
                        removeDelay: removeDelay,
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
                    toast.success(message,{
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
