import { ChevronDown, ChevronRight} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dropdown = ({ items }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const toggleItems = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full h-full gap-7 pr-3" itemType='button' onClick={() => {
            toggleItems();
        }}>
            <div className="flex justify-between flex-row items-center">
                <span className='text-lg font-semibold'>{items?.label || "No Label"}</span>
                {
                    isOpen ? <ChevronDown /> : <ChevronRight />
                }
            </div>

            {isOpen && (
                <div className="w-full h-fit p-1 justify-start items-center">
                    {items?.dropDownView.map((d) => (
                        <div
                            key={d.id}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(d?.path);
                            }}
                            className="flex flex-row justify-start items-center p-3 rounded-md hover:bg-gray-100 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                        >
                            <span className="font-normal text-gray-800 text-lg">{d?.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
