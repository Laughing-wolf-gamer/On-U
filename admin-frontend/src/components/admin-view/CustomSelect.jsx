import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const CustomSelect = ({ controlItems, setChangeData,defaultValue = ""}) => {
    /* const value = formData[controlItems.name]; // Ensures value is correctly bound to the formData

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [controlItems.name]: e.target.value, // Update formData state on input change
        });
    };

    const handleSelectChange = (v) => {
        setFormData({
            ...formData,
            [controlItems.name]: v, // Update formData state on select change
        });
    }; */
    const[inputValue,setInputValue] = useState('')
    const[value,setValue] = useState('')
    const handelOnInputChange = (e)=>{
        setInputValue(e.target.value);
        setValue('');
        // setChangeData(e.target.value);
        console.log("Value: ",e.target.value);
    }
    const handelSetActiveValue = (e)=>{
        // setChangeData(e.target.value);
        setValue(e);
        setInputValue(e);
    }
    useEffect(()=>{
        console.log("Value: ",value,inputValue);
        setChangeData(value || inputValue)
    },[value,inputValue])

    return (
    <div className="space-y-4">
        <Select onValueChange={handelSetActiveValue} value={value}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md">
                <SelectValue placeholder={controlItems.label || defaultValue || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
                {controlItems?.options?.length > 0 &&
                    controlItems.options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                            {option.label}
                        </SelectItem>
                    ))}
            </SelectContent>
        </Select>
    </div>
    );
  };

export default CustomSelect