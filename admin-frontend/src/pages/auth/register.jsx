import CustomSelect from '@/components/admin-view/CustomSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettingsContext } from '@/Context/SettingsContext'
import { authverifyOtp, registerUser } from '@/store/auth-slice'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const registerFormControls = [
    {
        name: 'userName',
        label: 'User Name',
        placeHolder: 'Enter your User Name',
        componentType: 'input',
        type: 'text',
        required: true,
        disabled: false,
    },
    {
        name: 'email',
        label: 'Email',
        placeHolder: 'Enter your Email Address',
        componentType: 'input',
        type: 'email',
        required: true,
        disabled: false,
    },
    {
        name: 'phoneNumber',
        label: 'Phone Number',
        placeHolder: 'Enter your Phone Number',
        componentType: 'input',
        type: 'phone',
        required: true,
        disabled: false,
    },
    {
        name: 'password',
        label: 'Password',
        placeHolder: 'Enter your password',
        componentType: 'input',
        type: 'password',
        required: true,
        disabled: false,
    },
    {
        name: 'role',
        label: 'Role',
        placeHolder: 'Set Role Type',
        componentType: 'select',
        required: true,
        disabled: false,
        options: [
            { id: 'superAdmin', label: 'Super Admin' },
            { id: 'admin', label: 'Admin' },
        ],
    },
]

const AuthRegister = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        role: '',
    })
    const {checkAndCreateToast} = useSettingsContext();
    const [checkOtp, setCheckOtp] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await dispatch(registerUser(formData))
            if (res?.payload?.Success) {
                checkAndCreateToast("success",'Sent OTP to registered Email. Please verify it.')
                setCheckOtp(true)
            } else {
                setCheckOtp(false)
            }
        } catch (error) {
            checkAndCreateToast("error",'Error registering User')
        } finally {
            setIsLoading(false)
        }
    }

    const verifyOtp = async (otp) => {
        setIsLoading(true)
        try {
            if (!otp) {
                checkAndCreateToast("error",'Please enter OTP')
                return
            }
            const res = await dispatch(authverifyOtp({ otp, email: formData.email }))
            // Handle OTP verification response here
			console.log("OTP verified: ", res?.payload);
			if(res?.payload?.Success){
				checkAndCreateToast("success","Registration Successful")
                navigate('/auth/login')
			}else{
				checkAndCreateToast("error","Failed to register")
                setFormData({...formData, password: '' })
                navigate('/auth/register')
			}
        } catch (error) {
            checkAndCreateToast("error",'Invalid OTP')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='mx-auto w-full max-w-md space-y-6 h-fit shadow-lg p-3 rounded-md'>
            <div className='text-center'>
                <h1 className='text-3xl font-bold tracking-tight text-foreground'>
                    Create a New Account
                </h1>
                <p className='mt-2'>
                    Already have an Account? 
                    <Link className='font-medium ml-2 text-primary hover:underline' to="/auth/login"> LogIn</Link>
                </p>
            </div>
            <form onSubmit={onSubmit} className="space-y-6 ">
                <div className="flex flex-col gap-6">
                    {registerFormControls.map((controlItem, index) => (
                        <div key={index}>
                            <Label>
                                {controlItem.label}
                                {controlItem.required && !formData[controlItem.name] && (
                                    <span className="text-red-500 text-[12px] font-light">*</span>
                                )}
                            </Label>
                            {controlItem.componentType === "select" ? (
                                <CustomSelect
                                    controlItems={controlItem}
                                    setChangeData={(e) => {
                                        setFormData({ ...formData, [controlItem.name]: e })
                                    }}
                                />
                            ) : (
                                <div>
                                    {/* Check if the control is for OTP */}
									<Input
										disabled={checkOtp}
										value={formData[controlItem.name]}
										onChange={(e) => setFormData({ ...formData, [controlItem.name]: e.target.value })}
										name={controlItem.name}
										placeholder={controlItem.placeHolder}
										id={controlItem.name}
										type={controlItem.type}
										className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full"
										required={controlItem.required}
									/>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </form>
            <Button
                disabled={isLoading}
                onClick={(e) => {
					onSubmit(e)
                }}
                className="mt-4 w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                ) : (
                    <span>{checkOtp ? "Verify OTP" : "Submit"}</span>
                )}
            </Button>
			{checkOtp &&  <OptInputView isLoading = {isLoading} onSubmiOtp = {(otp)=>{
				verifyOtp(otp)
			}}/>}
        </div>
    )
}
const OptInputView = ({isLoading ,onSubmiOtp}) => {
	const [otp, setOtp] = useState(null)
	const handleChangeOtp = (e) => {
		e.preventDefault();
		onSubmiOtp(otp);
	}
	return(
		<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white min-h-[200px] flex flex-col space-y-5 p-6 rounded-lg shadow-lg w-96">
				<Label>Enter Otp</Label>
				<Input
					value={otp}
					onChange={(e) => {
						console.log("otp updated: ", e.target.value)
						setOtp(e.target.value)
					}}
					name={'otp'}
					placeholder={'Enter OTP'}
					id={'otp'}
					type="number"
					className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full"
				/>
				<Button
					onClick={handleChangeOtp}
					className="mt-4 w-full py-2 bg-primary text-white font-semibold border border-gray-700 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
				>
					{isLoading ? (
						<div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
					) : (
						<span>Verify</span>
					)}
				</Button>
			</div>
		</div>
	)
}

export default AuthRegister
