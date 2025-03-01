import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
	return (
		<div className='flex min-h-screen w-full'>
			<div className='hidden lg:flex items-center justify-center bg-black w-1/2 px-1'>
				<div className='max-w-md space-y-6 text-primary-foreground text-center'>
					<h1 className='text-4xl font-extrabold tracking-tight'>Welcome to our On U</h1>
				</div>
			</div>
			<div className='flex flex-1 justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
				<Outlet/>
			</div>
		</div>
	)
}

export default AuthLayout