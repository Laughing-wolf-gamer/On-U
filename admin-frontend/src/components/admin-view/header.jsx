import React from 'react'
import { Button } from '../ui/button'
import { LogOut, SquareMenu } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutUser, resetTokenCredentials } from '@/store/auth-slice'
import { useNavigate } from 'react-router-dom'

const AdminHeaderLayout = ({setOpen}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const HandleLogOut = async (e)=>{
        e.preventDefault();
        // dispatch(logoutUser())
        dispatch(resetTokenCredentials());
        sessionStorage.clear();
        navigate('/auth/login');
    }
	return (
		<header className='flex items-center justify-between px-4 bg-background border-b-2'>
            <Button className = "lg:hidden sm:block" onClick = {()=> setOpen(true)}>
                <SquareMenu />
                <span className='sr-only'>Toggle Menu</span>
            </Button>
            <div className='flex flex-1 p-2 justify-end'>
                <Button onClick = {HandleLogOut} className = "inline-flex items-center px-4 rounded-md font-medium shadow">
                    <LogOut />
                    Logout
                </Button>
            </div>
        </header>
	)
}

export default AdminHeaderLayout