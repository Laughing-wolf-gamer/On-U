import { inProduction } from "@/config";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";


// Create the context
const SettingContext = createContext();

// Provider component
export const SettingsProvider = ({ children }) => {
	const [activeToast, setActiveToast] = useState(null);
    const checkAndCreateToast = (type,message,closeTime = 1000) => {
		console.log("Log type: ", type, "message: ", message,);
		switch(type){
			case "error":
				toast.error(message,{autoClose:closeTime})
				break;
			case "warning":
				toast.warn(message,{autoClose:closeTime})
				break;
			case "info":
			    toast.info(message,{autoClose:closeTime})
				break;
			case "success":
				toast.success(message,{autoClose:closeTime})
				break;
			default:
			    toast.info(message,{autoClose:closeTime})
				break;
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

export const useSettingsContext = () => {
    return useContext(SettingContext);
};
