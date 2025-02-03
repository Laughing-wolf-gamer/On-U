import React, { useEffect, useState } from 'react';
import { BsShieldFillCheck } from 'react-icons/bs';
import { GrClose } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getuser, updatedetailsuser } from "../../action/useraction";
import { getbag } from '../../action/orderaction';
import { useSettingsContext } from '../../Contaxt/SettingsContext';

const Address = () => {
    const [edit, setEdit] = useState(false);
    const { user, userloading, isAuthentication } = useSelector(state => state.user);
    const { bag, bagloading } = useSelector(state => state.bag_data);
    const { success } = useSelector(state => state.updateuser2);
    const {checkAndCreateToast} = useSettingsContext();
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const [addressDetails, setAddressDetails] = useState({
        name: '',
        phonenumber: '',
        pincode: '',
        address1: '',
        address2: '',
        citystate: ''
    });

    const [priceDetails, setPriceDetails] = useState({
        mrp: 0,
        sp: 0,
        ds: 0
    });

    useEffect(() => {
        if (!user) dispatch(getuser());

        if (!isAuthentication) {
            checkAndCreateToast('info','Log in to access BAG');
            navigation('/Login');
            
        } else {
        dispatch(getbag({ userId: user?.id }));
        setAddressDetails({
            name: user?.name,
            phonenumber: user?.phonenumber,
            pincode: user?.address?.pincode,
            address1: user?.address?.address1,
            address2: user?.address?.address2,
            citystate: user?.address?.citystate
        });
        }
    }, [dispatch, user, isAuthentication, checkAndCreateToast, navigation]);

    useEffect(() => {
        if (bagloading === false && bag?.orderItems) {
            let mrp = 0, sp = 0, ds = 0;
            bag?.orderItems?.forEach(item => {
                mrp += item.product.mrp * item.qty;
                sp += item.product.sellingPrice * item.qty;
            });
            ds = mrp - sp;
            setPriceDetails({ mrp, sp, ds });
        }
    }, [bagloading, bag]);

    const saveAddress = () => {
        dispatch(updatedetailsuser(addressDetails, user?.id));
        checkAndCreateToast('success',success);
        setEdit(false);
        dispatch(getuser());
    };

    if (userloading || bagloading) return null;

    return (
        <div className="relative">
        <div className="border-b border-slate-100 py-5">
            <div className="mx-auto text-[#696B79] w-max">
            <span className="font-semibold text-[14px] tracking-[3px]">BAG</span> ----------
            <span className="font-semibold text-[14px] underline tracking-[3px] text-[#0db7af]">ADDRESS</span> ----------
            <span className="font-semibold text-[14px] tracking-[3px]">PAYMENT</span>
            </div>
            <div className="absolute flex right-0 top-0 2xl:right-10 xl:right-10 lg:right-10 2xl:top-2 xl:top-2 lg:top-2">
            <BsShieldFillCheck className="text-[#0db7af] 2xl:text-3xl xl:text-3xl lg:text-3xl" />
            <span className="text-[#535766] text-[8px] ml-2 font-semibold tracking-[3px]">100% SECURE</span>
            </div>
        </div>

        <div className="mx-auto mt-4 2xl:w-[70%] xl:w-[70%] lg:w-[70%] grid grid-cols-12 gap-4">
            <div className="col-span-8">
                <h1 className="font-bold text-[18px] text-[#282c3f]">Select Delivery Address</h1>
                <h1 className="text-[#535766] text-[12px] font-bold mt-3">DEFAULT ADDRESS</h1>
                <div className="rounded-sm shadow-md w-full py-4 px-8 border-[1px] border-slate-100 mt-2 hover:border-slate-200">
                    <div className="flex items-center">
                    <input type="radio" className="accent-pink-500" checked readOnly />
                    <h1 className="ml-3 capitalize">{user?.name}</h1>
                    </div>
                    <p className="text-[#424553] mt-3 text-[13px] capitalize">{user?.address?.address1}, {user?.address?.address2}</p>
                    <p className="text-[#424553] text-[13px] capitalize">{user?.address?.citystate}, {user?.address?.pincode}</p>
                    <p className="text-[#424553] mt-3 text-[13px] capitalize">Mobile: <span>{user?.phonenumber}</span></p>
                    <li className="text-[#424553] mt-3 text-[14px] capitalize list-disc">Pay on delivery Available</li>
                    <button className="mt-4 text-[#282c3f] border-[#282c3f] px-4 py-1 text-sm border-[1px] rounded-sm" onClick={() => setEdit(true)}>EDIT</button>
                </div>
            </div>

            <div className="col-span-4 border-l-[1px] pl-4">
                <h1 className="text-[#535766] text-[13px] mt-4">DELIVERY ESTIMATES</h1>
                {bag?.orderItems?.map(item => (
                    <div className="grid grid-cols-12 py-2 border-b-[1px] border-slate-200" key={item.product.id}>
                    <div className="col-span-2">
                        <img src={item.product.images[0].url} alt={item.product.name} className="w-full" />
                    </div>
                    <div className="col-span-10 text-center flex justify-center items-center text-xs">
                        <h1>Estimated delivery by <span className="font-bold">Tomorrow</span></h1>
                    </div>
                    </div>
                ))}
                <div>
                    <h1 className="text-[#535766] text-[12px] mt-2">PRICE DETAILS ({bag?.orderItems?.length} items)</h1>
                    <div className="text-[#535766] relative mt-2">Total MRP <span className="absolute right-0">&#8377;{priceDetails.mrp}</span></div>
                    <div className="text-[#535766] relative mt-2">Discount on MRP <span className="absolute right-0 text-[#0db7af]">-&#8377;{Math.round(priceDetails.ds)}</span></div>
                    <div className="text-[#535766] relative mt-2 mb-2">Convenience Fee <span className="absolute right-0"><span className="line-through">-&#8377;99</span> <span className="text-[#0db7af]">FREE</span></span></div>
                    <div className="py-2 border-t-[1px] bg-white">
                    <div className="relative font1 text-base">Total Amount <span className="absolute right-0">&#8377;{Math.round(priceDetails.sp)}</span></div>
                    <button className="mt-2 bg-[#ff3f6c] text-center w-full py-3 text-white font-bold">CONTINUE</button>
                    </div>
                </div>
            </div>
        </div>

        {edit && (
            <div className="fixed top-0 bg-[#24242468] w-full h-full z-10">
                <div className="w-[31.33%] mx-auto bg-white rounded-md border-[1px] border-slate-200 pt-5">
                    <h1 className="font-bold text-[14px] px-4 pb-5 flex justify-between items-center">
                    <span>EDIT ADDRESS</span>
                    <GrClose className="text-xl cursor-pointer" onClick={() => setEdit(false)} />
                    </h1>
                    <div className="px-4">
                    {['name', 'phonenumber', 'pincode', 'address1', 'address2', 'citystate'].map((field, idx) => (
                        <div className="mt-6 relative" key={idx}>
                        <label className="bg-white left-4 -top-4 text-[#94969f] text-[12px] px-1 z-10 absolute">{field}</label>
                        <input
                            type="text"
                            className="w-full py-3 px-4 text-xs border-[1px] border-slate-300 rounded-md -mt-2"
                            value={addressDetails[field]}
                            onChange={(e) => setAddressDetails({ ...addressDetails, [field]: e.target.value })}
                        />
                        </div>
                    ))}
                    </div>
                    <button className="bg-[#ff3f6c] font-bold text-white py-3 w-full" onClick={saveAddress}>SAVE ADDRESS</button>
                </div>
            </div>
        )}
        </div>
    );
};

export default Address;
