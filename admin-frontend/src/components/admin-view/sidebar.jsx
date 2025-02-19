import React from 'react'
import { adminSideBarMenu, capitalizeFirstLetterOfEachWord } from '@/config'
import { ChartArea, ListOrdered } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import Dropdown from './Dropdown'
import { MdDashboard, MdFeaturedPlayList, MdQueryStats, MdWarehouse } from "react-icons/md";
import { FaCartArrowDown, FaUsers } from "react-icons/fa";
import { RiPagesFill } from "react-icons/ri";
const GetAdminSideBarMenuIcon = ({ id }) => {
    switch (id) {
        case "dashboard":
			return <MdDashboard size={24} />
        case "customers":
			return <FaUsers size={24}/>
		case 'query':
			return <MdQueryStats size={24}/>
        case "products":
            return <FaCartArrowDown size={24} />
        case "orders":
            return <ListOrdered size={24} />
        case "warehouse":
			return <MdWarehouse size = {24} />
        case "features":
            return <MdFeaturedPlayList size={24} />
		case "pages":
			return <RiPagesFill size={24}/>
        default:
            return null
    }
}

const MenuItems = ({ setOpen, user }) => {
    const navigate = useNavigate();
    // console.log("handle add Navigation: ",adminSideBarMenu)
    // Filter accessible menu based on the user's role
    const accessibleMenu = adminSideBarMenu.filter((item) => item?.accessRole?.includes(user.role));
    
    // Filter dropdown menu items from the accessible menu
    const accessibleDropDownMenu = accessibleMenu.filter(
        (item) => item?.dropDownView?.length > 0 && item?.dropDownView.some((dropdown) => dropdown?.accessRole?.includes(user.role))
    );

    return (
        <nav className="mt-8 flex flex-col gap-2">
            {user && accessibleMenu?.length > 0 && accessibleMenu.map((item) => (
                <div key={item.id} className="flex cursor-pointer max-h-screen overflow-y-auto border-b-4 items-center gap-2 rounded-md py-2 transition-all duration-300 ease-in-out">
                    {/* Check if the item has a dropdown */}
                    {item?.dropDownView && accessibleDropDownMenu.length > 0 ? (
                        <div className="flex w-full items-center space-x-2 justify-between">
							{/* <GetAdminSideBarMenuIcon id={item.id} /> */}
                            <Dropdown items={item} GetAdminSideBarMenuIcon = {GetAdminSideBarMenuIcon}/>
                        </div>
                    ) : (
                        <button
                            className={`flex ${window.location.href.includes(item?.path) ? "bg-gray-500 text-gray-50" : "hover:bg-gray-200 hover:text-gray-900"} items-center justify-start w-full p-2 rounded-md transition-all duration-300 ease-in-out`}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(item?.path);
                                setOpen && setOpen(false); // Close the menu if `setOpen` exists
                            }}
                            itemType="button"
                        >
                            <GetAdminSideBarMenuIcon id={item.id} />
                            <span className="ml-3 text-lg font-semibold">{item.label}</span>
                        </button>
                    )}
                </div>
            ))}
        </nav>
    );
}

const AdminSidebarLayout = ({ sheetOpen, setOpen, user }) => {
    const navigate = useNavigate();
    return (
        <div >
            {/* Sheet Sidebar */}
            <Sheet open={sheetOpen} onOpenChange={setOpen}>
                <SheetContent side='left' className="w-64 bg-gray-100 text-gray-900 transition-transform duration-300 ease-in-out overflow-y-auto">
                    <div className='flex flex-col h-full'>
                        <SheetHeader className="border-b border-gray-600">
                            <SheetTitle className="border-b py-3">
                                <ChartArea size={30} className="text-gray-500" />
                                <h1 className='text-xl font-extrabold mt-5 mb-3'>
                                    {capitalizeFirstLetterOfEachWord(user.role)} Panel
                                </h1>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems setOpen={setOpen} user={user} />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <aside className='hidden lg:flex w-64 flex-col border-r bg-gray-100 p-6 transition-transform duration-300 ease-in-out'>
                <div
                    onClick={() => navigate("/admin/dashboard")}
                    className='flex cursor-pointer items-center gap-2 p-2 rounded-md transition-all duration-300 ease-in-out'
                >
                    <ChartArea size={30} className="text-gray-500" />
                    <h1 className='text-xl font-extrabold text-gray-800 mt-5 mb-3'>
                        Admin Panel
                    </h1>
                </div>
                <MenuItems user={user} />
            </aside>
        </div>
    );
}

export default AdminSidebarLayout;
