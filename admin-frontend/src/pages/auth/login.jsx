import CommonForm from '@/components/common/form';
import { loginFormControls } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { loginUser } from '@/store/auth-slice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const AuthLogIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role:'admin'
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
        console.log('formData', formData);
        const res = await dispatch(loginUser(formData));
        if (res?.payload?.Success) {
            toast({
            title: 'LogIn Successful',
            description: res?.payload?.message,
            });
            setFormData({
            email: '',
            password: '',
            role:'',
            });
            navigate('/admin/dashboard');
        } else {
            toast({
            title: 'LogIn Un-Successful',
            description: res?.payload?.message,
            });
        }
        } catch (error) {
        console.error(`Error Occurred While LogIn User: ${error.message}`);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                {/* Header Section */}
                <div className="text-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">
                    Log In to Your Admin Account
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Don't have an Account?{' '}
                    <Link className="font-medium text-primary hover:underline" to="/auth/register">
                    Register
                    </Link>
                </p>
                </div>

                {/* Form Section */}
                <CommonForm
                formControls={loginFormControls}
                setFormData={setFormData}
                formData={formData}
                handleSubmit={onSubmit}
                buttonText="Log In"
                isBtnValid={formData.email && formData.password}
                />
            </div>
        </div>
    );
};

export default AuthLogIn;
