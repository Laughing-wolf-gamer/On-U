import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import { fetchCouponBannerData, setCouponBannerData } from '@/store/common-slice';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
const AdminHomeCouponBanner = () => {
	const dispatch = useDispatch();
	const{CouponBannerData} = useSelector(state => state.common);
	const [header, setHeader] = useState('');
	const [imageLoading, setImageLoading] = useState(false);
	const [subHeader, setSubHeader] = useState('');
	const [bannerModelUrl, setBannerModelUrl] = useState('');
	const handleSave = async ()=>{
		if(!header ||!subHeader || !bannerModelUrl){
			toast.error('All fields are required');
			return;
		}
		const response =  await dispatch(setCouponBannerData({header, subHeader, bannerModelUrl}));
		if(response?.payload?.Success){
            toast.success('Coupon Banner updated successfully');
        }
	}
	useEffect(()=>{
		dispatch(fetchCouponBannerData());
	},[dispatch])
	useEffect(()=>{
		setHeader(CouponBannerData?.header);
        setSubHeader(CouponBannerData?.subHeader);
		setBannerModelUrl(CouponBannerData?.bannerModelUrl)
	},[dispatch, CouponBannerData]);
	console.log("CouponBannerData: ",CouponBannerData);
	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-center">Home screen Coupon Banner</h1>
			{/* Header */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Header</h2>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                    placeholder="Enter Header"
                />
            </div>
			{/* SubHeader */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">SubHeader</h2>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={subHeader}
                    onChange={(e) => setSubHeader(e.target.value)}
                    placeholder="Enter SubHeader"
                />
            </div>
			<div className='w-full justify-center flex mb-4 flex-col items-center'>
				<img
					src={bannerModelUrl}
					alt="Model Image"
					className="h-20 w-20 object-cover rounded-full"
					style={{ maxWidth: '100%', height: 'auto' }}
				/>
				<p>Image Size Should be: 474px x 711px</p>
			</div>
			<FileUploadComponent
				maxFiles={1}
				tag={`tag-banner-model`}
				sizeTag={`banner-model-home`}
				onSetImageUrls={(e) => {
					// const updatedTeamMembers = [...teamMembers];
					// updatedTeamMembers[index].image = e[0].url;
					setBannerModelUrl(e[0].url);
				}}
				isLoading = {imageLoading}
				setIsLoading={setImageLoading}
			/>
			<div className="text-center">
                <button
                    className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
                    onClick={handleSave}
                >
                	Save Details
                </button>
            </div>
		</div>
	)
}

export default AdminHomeCouponBanner
