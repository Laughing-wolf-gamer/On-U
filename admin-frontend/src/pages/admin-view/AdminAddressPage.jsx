import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchAddressFormData, removeAddressFormData, sendAddressFormData } from '@/store/common-slice';

const AdminAddressPage = () => {
    const{addressFormFields:AllAddressFields} = useSelector(state=>state.common);
    const dispatch = useDispatch();
    const[addressFormFields,setAddressFormFields] = useState([])
    const[addressFormFieldsValue,setAddressFormFieldsValue] = useState('')
    const handelChangeNewField = (e)=>{
        setAddressFormFieldsValue(e.target.value)
    }
    const handelAddNewField = async (e)=>{
        if(!addressFormFieldsValue){
            toast.error("Field Empty",{duration:3000})
            return
        };
        if(addressFormFields.includes(addressFormFieldsValue)) {
            toast.error("Field Exists",{duration:3000})
            return;
        };
        setAddressFormFields([...addressFormFields,addressFormFieldsValue])
        await dispatch(sendAddressFormData({addressFormFields:addressFormFieldsValue}))
        dispatch(fetchAddressFormData())
        setAddressFormFieldsValue('')
        toast.success("Field Added Successfully",{duration:3000})
    }
    const handelRemoveNewField = async (f)=>{
        setAddressFormFields(prev => prev.filter(field=>field !== f))
        await dispatch(removeAddressFormData({addressFormFields:f}))
        dispatch(fetchAddressFormData())
    }
    useEffect(()=>{
        dispatch(fetchAddressFormData())
    },[dispatch])
    // console.log("All Address Fields: ",AllAddressFields)
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Address Form</h2>
        <div className='space-y-4'>
            <Input placeHolder = "Add New Address Field" value = {addressFormFieldsValue} onChange = {handelChangeNewField}/>
            <Button onClick = {handelAddNewField}>Add New Field</Button>
        </div>
        <div className='space-y-4'>
            {
                AllAddressFields.length > 0 && AllAddressFields.map((field,index)=>(
                    <div key={index} className='space-y-4 justify-between items-center flex'>
                        <span className='text-lg font-semibold text-gray-800'>
                            {field}
                        </span>
                        <Button onClick = {()=> handelRemoveNewField(field)}>Delete Field</Button>
                    </div>
                ))
            }
        </div>
      </div>
    );
};

export default AdminAddressPage;
