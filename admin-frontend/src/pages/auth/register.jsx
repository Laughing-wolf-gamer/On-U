import CommonForm from '@/components/common/form'
import { registerFormControls } from '@/config'
import { useToast } from '@/hooks/use-toast'
import { registerUser } from '@/store/auth-slice'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const AuthRegister = () => {
    const [formData, setFormData] = useState({
        userName:'',
        email:'',
        password:'',
        role:''
    })
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await dispatch(registerUser(formData));
            if(res?.payload?.Success){
                toast({
                    title: "Registered Successful",
                    description: res?.payload?.message,
                })
                setFormData({
                    userName:'',
                    email:'',
                    password:'',
                    role:''
                })
                navigate('/auth/login');
            }else{
                toast({
                    title: "Registered Un-Successful",
                    description: res?.payload?.message,
                })
            }
        } catch (error) {
            console.error(`Error Occurred While Registering User: ${error.message}`);
        }
    }
	return (
		<div className='mx-auto w-full max-w-md space-y-6'>
            <div className='text-center'>
                <h1 className='text-3xl font-bold tracking-tight text-foreground'>
                    Create a New Account
                </h1>
                <p className='mt-2'>
                    Already have an Account? 
                    <Link className='font-medium ml-2 text-primary hover:underline' to= "/auth/login"> LogIn</Link>
                </p>
            </div>
            <CommonForm formControls={registerFormControls} setFormData={setFormData} formData={formData} handleSubmit={onSubmit} buttonText={"Register"} isBtnValid={true}/>
        </div>
	)
}

export default AuthRegister