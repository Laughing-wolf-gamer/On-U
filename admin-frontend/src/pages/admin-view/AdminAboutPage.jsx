import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSettingsContext } from '@/Context/SettingsContext';
import { fetchAboutData, sendAboutData } from '@/store/common-slice';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AdminAboutPage = () => {
	const{checkAndCreateToast} = useSettingsContext();
    const dispatch = useDispatch();
	const{isLoading:aboutDataLoading,aboutData} = useSelector(state => state.common);
    const [imageLoading, setImageLoading] = useState(false);

    // New state variables
	const [founderData,setFounderData] = useState({
		name:'',
		image:'',
		designation:'',
		introduction:'',
		details:'',
		founderVision:'',
		goals:'',
		promises:'',
	});
    const [header, setHeader] = useState('');
    const [subHeader, setSubHeader] = useState('');
    const [ourMissionDescription, setOurMissionDescription] = useState('');
    const [outMoto, setOutMoto] = useState([{ title: '', description: '' }]);
    const [teamMembers, setTeamMembers] = useState([
        { name: '', image: '', designation: '' }
    ]);

    // Handle adding a new Out Moto
    const handleAddOutMoto = () => {
        setOutMoto([...outMoto, { title: '', description: '' }]);
    };

    // Handle removing an Out Moto
    const handleRemoveOutMoto = (index) => {
        const updatedOutMoto = outMoto.filter((_, i) => i !== index);
        setOutMoto(updatedOutMoto);
    };

    // Handle saving the form data
    const handleSave = async () => {
		if(imageLoading){
            return;
        }
        await dispatch(sendAboutData({
            header,
            subHeader,
            ourMissionDescription,
            outMoto,
			founderData,
            teamMembers:teamMembers.filter(member => member.title !== '' && member.image !== '' && member.designation !== ''),
        }))
        checkAndCreateToast("success","Data Saved Successfully");
    };
    const handleAddTeamMember = () => {
        setTeamMembers([...teamMembers, { name: '', image: '', designation: '' }]);
    };
    const handleRemoveTeamMember = (index) => {
        const updatedTeamMembers = teamMembers.filter((_, i) => i !== index);
        setTeamMembers(updatedTeamMembers);
    };
	


	const handleSetMotoData = (text,field,index) => {
		if(!text){
			checkAndCreateToast("error",'No Images Files found!');
			return;
		}
		console.log("update Data: ",text,field,index,teamMembers.length);
		if (index >= 0 && index < outMoto.length) {
			const updateMoto = outMoto.map((member, i) => 
				i === index ? { ...member, [field]: text } : member
			);
			setOutMoto(updateMoto);
		} else {
			checkAndCreateToast("error","Invalid index.");
		}
	}
	const handleChangeTeamMembersData = (text,field,index)=>{
		if(!text){
			checkAndCreateToast("error",'No Images Files found!');
			return;
		}
		if (index >= 0 && index < teamMembers.length) {
			const updatedTeamMembers = teamMembers.map((member, i) => 
				i === index ? { ...member, [field]: text } : member
			);
			setTeamMembers(updatedTeamMembers);
		} else {
			checkAndCreateToast("error","Invalid index.");
		}
	}
	const handleHandleUploadAddTeamMembers = (file,index)=>{
		if(!file){
			checkAndCreateToast("error",'No Images Files found!');
			return;
		}
		if(file.length <= 0){
			checkAndCreateToast("error",'No files Found!');
			return;
		}

		const urls = file[0];

		if(!urls){
			checkAndCreateToast("error",'No url found!');
			return;
		}
		if (index >= 0 && index < teamMembers.length) {
			const updatedTeamMembers = teamMembers.map((member, i) => 
				i === index ? { ...member, image: urls?.url } : member
			);
			setTeamMembers(updatedTeamMembers);
		} else {
			checkAndCreateToast("error","Invalid index.");
		}
	}
	useEffect(()=>{
		dispatch(fetchAboutData());
	},[dispatch])
	useEffect(()=>{
		if(aboutData){
			setHeader(aboutData?.header);
            setSubHeader(aboutData?.subHeader);
            setOurMissionDescription(aboutData?.ourMissionDescription);
            setOutMoto(aboutData?.outMoto);
            setTeamMembers(aboutData?.teamMembers);
			setFounderData(aboutData?.founderData);
		}
	},[aboutData,dispatch])
    return (
        <div className="">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin: About Page Management</h1>
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

            {/* Our Mission Description */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Out Mission Description</h2>
                <Textarea
                    className="w-full p-2 border rounded h-32"
                    value={ourMissionDescription}
					rows={'10'}
					cols={'30'}
                    onChange={(e) => setOurMissionDescription(e.target.value)}
                    placeholder="Enter Our Mission Description"
                />
            </div>

            {/* Out Moto */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold uppercase mb-4">Our Moto <span className='text-xs'>(Min-3)</span> </h2>
                {outMoto.map((moto, index) => (
                    <div key={index} className="mb-4 relative my-2 p-2 rounded-md border border-purple-600">
						<Button
                            className=" px-4 py-2 rounded absolute top-2 right-2"
                            onClick={() => handleRemoveOutMoto(index)}
                        >
                        	Remove Moto
                        </Button>
						<div className='py-6 my-5 space-y-3'>
							<Input
								type="text"
								className="w-full p-2 border rounded mb-2"
								value={moto?.title}
								
								onChange={(e) => handleSetMotoData(e.target.value,'title',index)}
								placeholder="Your Company Moto Title"
							/>
							<Textarea
								className="w-full p-2 border rounded mb-2"
								value={moto?.description}
								rows={'5'}
								cols={'30'}
								onChange={(e) => handleSetMotoData(e.target.value,'description',index)}
								placeholder="Explain this Moto...."
							/>
                        
						</div>
                    </div>
                ))}
                <Button
                    className="bg-purple-500 hover:bg-purple-700 w-full text-center flex text-white px-6 py-3 rounded"
                    onClick={handleAddOutMoto}
                >
                	Add (Our Moto)
                </Button>
            </div>
			

            {/* Team Members */}
            <div className="mb-8 bg-white p-4 space-y-3 rounded shadow">
                <h1 className="text-xl font-semibold mb-4">Team Members</h1>
                {teamMembers.map((team, index) => (
                    <div key={index} className="relative my-2 p-2 rounded-md border border-green-600">
						<Button
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveTeamMember(index)}
                        >
                        	Remove Team Member ({team?.name})
                        </Button>
						<div className='py-6 space-y-3'>
							<img
								src={team?.image}
								alt="Team Member Image"
								className="h-20 w-20 object-cover rounded-md border border-green-600"
								style={{ maxWidth: '100%', height: 'auto' }}
							/>
							<Input
								type="text"
								className="w-full p-2 border rounded mb-2"
								value={team?.name}
								onChange={(e) => handleChangeTeamMembersData(e.target.value,'name',index)}
								placeholder="Team Member Name"
							/>
							<Input
								type="text"
								placeholder="Team Member Designation"
								className="w-full p-2 border rounded mb-2"
								value={team?.designation}
								onChange={(e) => handleChangeTeamMembersData(e.target.value,'designation',index)}
							/>
							
							<FileUploadComponent
								maxFiles={1}
								tag={`tag-${index}`}
								sizeTag={`team-${index}`}
								onSetImageUrls={(file)=> handleHandleUploadAddTeamMembers(file,index)}
								isLoading = {imageLoading}
								setIsLoading={setImageLoading}
							/>
						</div>
                        
                    </div>
                ))}
                <Button
                    className="bg-green-500 hover:bg-green-700 w-full text-center flex text-white px-6 py-3"
                    onClick={handleAddTeamMember}
                >
                	Add Team Member
                </Button>
            </div>
			<div className="mb-8 bg-white p-4 rounded shadow">
				<h1 className="text-xl font-semibold mb-4">Founder Data</h1>
				<div className="mb-4">
					<img
						src={founderData?.image}
						alt="Founder-Image"
						className="w-32 h-32 object-cover rounded-full mb-4"
					/>
					<FileUploadComponent
						maxFiles={1}
						tag={`Founder-image`}
						sizeTag={`founder-vision-image`}
						onSetImageUrls={(file) => {
							setFounderData({...founderData, image: file[0].url });
						}}
						isLoading = {imageLoading}
						setIsLoading={setImageLoading}
					/>
					<Input
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        value={founderData.name}
                        onChange={(e) => setFounderData({...founderData, name: e.target.value })}
						placeholder="Add Founder's Name"
                    />
					<Input
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        value={founderData.designation}
                        onChange={(e) => setFounderData({...founderData, designation: e.target.value })}
						placeholder="Add Founder's Designation"
                    />
					<Textarea
                        className="w-full p-2 border rounded h-32"
                        value={founderData.introduction}
                        onChange={(e) => setFounderData({...founderData, introduction: e.target.value })}
                        placeholder="Add Founder's introduction"
						rows={'5'}
						cols={'30'}
						required
					/>
					<Textarea
                        type="text"
						rows={'5'}
						cols={'30'}
                        className="w-full p-2 border rounded mb-2"
                        value={founderData.details}
                        onChange={(e) => setFounderData({...founderData, details: e.target.value })}
						placeholder="Add Founder's Details"
                    />
					<Textarea
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        value={founderData.founderVision}
                        onChange={(e) => setFounderData({...founderData, founderVision: e.target.value })}
						placeholder="Add Founder's Vision"
						rows={5}
						cols={30}
						required
                    />
					<Textarea
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        value={founderData.goals}
                        onChange={(e) => setFounderData({...founderData, goals: e.target.value })}
						placeholder="Add Founder's goals"
						rows={'5'}
						cols={'30'}
						required
                    />
					<Textarea
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        value={founderData?.promises}
                        onChange={(e) => setFounderData({...founderData, promises: e.target.value })}
						placeholder="Add Founder's promises"
						rows={5}
						cols={30}
						required
                    />
				</div>
			</div>

            {/* Save Button */}
            <div className="text-center">
                <Button
					disabled = {aboutDataLoading}
                    className="bg-blue-500 w-full text-white px-6 py-3 rounded hover:bg-blue-600"
                    onClick={handleSave}
                >
					{aboutDataLoading ? <div className="w-6 h-6 border-4 border-t-4 border-white border-t-purple-800 rounded-full animate-spin"></div> :<span>Update Details</span>}
                	
                </Button>
            </div>
        </div>
    );
};

export default AdminAboutPage;
