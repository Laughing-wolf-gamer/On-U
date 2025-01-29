import { adminSideBarMenu, capitalizeFirstLetterOfEachWord } from '@/config'
import { ChartArea, Feather, LayoutDashboard, ListOrdered, ShoppingCart } from 'lucide-react'
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import Dropdown from './Dropdown'

const GetAdminSideBarMenuIcon = ({ id }) => {
    switch (id) {
        case "products":
            return <ShoppingCart size={24} />
        case "features":
            return <Feather size={24} />
        case "orders":
            return <ListOrdered size={24} />
        default:
            return <LayoutDashboard size={24} />
    }
}

const MenuItems = ({ setOpen, user }) => {
    const navigate = useNavigate();
    console.log("handle add Navigation: ",adminSideBarMenu)
    // Filter accessible menu based on the user's role
    const accessibleMenu = adminSideBarMenu.filter((item) => item?.accessRole?.includes(user.role));
    
    // Filter dropdown menu items from the accessible menu
    const accessibleDropDownMenu = accessibleMenu.filter(
        (item) => item?.dropDownView?.length > 0 && item?.dropDownView.some((dropdown) => dropdown?.accessRole?.includes(user.role))
    );

    return (
        <nav className="mt-8 flex flex-col gap-2">
            {user && accessibleMenu?.length > 0 && accessibleMenu.map((item) => (
                <div key={item.id} className="flex cursor-pointer hover:bg-gray-200 hover:text-blue-600 overflow-y-auto items-center gap-2 rounded-md py-2 transition-all duration-300 ease-in-out">
                    {/* Check if the item has a dropdown */}
                    {item?.dropDownView && accessibleDropDownMenu.length > 0 ? (
                        <div className="flex w-full items-center justify-center">
                            <Dropdown items={item} />
                        </div>
                    ) : (
                        <button
                            className="flex items-center justify-start w-full p-2 rounded-md hover:bg-blue-100 transition-all duration-300 ease-in-out"
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
                                <ChartArea size={30} className="text-blue-500" />
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
                    <ChartArea size={30} className="text-blue-500" />
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
