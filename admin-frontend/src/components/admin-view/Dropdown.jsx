import { ChevronRight} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dropdown = ({ items,GetAdminSideBarMenuIcon }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const toggleItems = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full h-full pr-3" onClick={(e) => {
			e.preventDefault();
            toggleItems();
        }}>
            <div className="flex justify-between flex-row items-center">
				<GetAdminSideBarMenuIcon id={items.id} />
                <span className='text-lg font-semibold'>{items?.label || "No Label"}</span>
                <ChevronRight className={`transition-all ${isOpen ? "rotate-90":""} duration-300 ease-ease-out-expo`}/>
            </div>

            {isOpen && (
                <div className="w-full h-fit p-1 my-2 text-black justify-start items-center">
                    {items?.dropDownView.map((d,index) => (
                        <button
							key={index}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								navigate(d?.path);
							}}
							className={`flex flex-row justify-start  hover:rounded-md border-b w-full ${window.location.href.includes(d?.path) ? "bg-gray-500 text-gray-50" : "hover:bg-gray-300 hover:text-gray-800"} items-center p-3 text-left rounded-md cursor-pointer transition-all duration-200 ease-ease-in-out-expo`}
						>
							<span className="font-normal text-base">{d?.label}</span>
						</button>

                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
