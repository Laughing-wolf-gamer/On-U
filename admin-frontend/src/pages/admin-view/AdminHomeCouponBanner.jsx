import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchCouponBannerData, setCouponBannerData } from '@/store/common-slice';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import 'react-lazy-load-image-component/src/effects/blur.css';
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
	useEffect(()=>{
		window.scroll(0,0);
	},[])
	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-center">Home screen Coupon Banner</h1>
			{/* Header */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Header</h2>
                <Input
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
                <Input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={subHeader}
                    onChange={(e) => setSubHeader(e.target.value)}
                    placeholder="Enter SubHeader"
                />
            </div>
			<div className='w-full justify-center flex mb-4 flex-col items-center'>
				<LazyLoadImage
					effect="blur"
					useIntersectionObserver
					loading="lazy"
					wrapperProps={{
						// If you need to, you can tweak the effect transition using the wrapper style.
						style: {transitionDelay: "1s"},
					}}
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
			<Button
				className="bg-gray-500 flex justify-center items-center w-full mt-6 text-center text-white px-6 py-3 rounded hover:bg-gray-600"
				onClick={handleSave}
			>
				<span>Save Details</span>
			</Button>
		</div>
	)
}

export default AdminHomeCouponBanner
