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
	const{aboutData} = useSelector(state => state.common);
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
        /* console.log("About Data.",{
            header,
            subHeader,
            ourMissionDescription,
            outMoto,
            teamMembers,
			founderData,
        }); */
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
    // console.log("Team Members: ",teamMembers);
	console.log("About Data: ",aboutData);

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
                    onChange={(e) => setOurMissionDescription(e.target.value)}
                    placeholder="Enter Our Mission Description"
                />
            </div>

            {/* Out Moto */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Out Moto <span className='text-xs'>(Min-3)</span> </h2>
                {outMoto.map((out, index) => (
                    <div key={index} className="mb-4">
                        <Input
                            type="text"
                            className="w-full p-2 border rounded mb-2"
                            value={out?.title}
                            onChange={(e) => {
                                const updatedOutMoto = [...outMoto];
                                updatedOutMoto[index].title = e.target.value;
                                setOutMoto(updatedOutMoto);
                            }}
                            placeholder="Our Moto Title"
                        />
                        <Textarea
                            className="w-full p-2 border rounded mb-2"
                            value={out?.description}
							rows={'5'}
							cols={'30'}
                            onChange={(e) => {
                                const updatedOutMoto = [...outMoto];
                                updatedOutMoto[index].description = e.target.value;
                                setOutMoto(updatedOutMoto);
                            }}
                            placeholder="Out Moto Description"
                        />
                        <Button
                            className=" px-4 py-2 rounded mt-2"
                            onClick={() => handleRemoveOutMoto(index)}
                        >
                        	Remove Out Moto
                        </Button>
                    </div>
                ))}
                <Button
                    className="bg-green-500 text-white px-6 py-3 rounded"
                    onClick={handleAddOutMoto}
                >
                Add Out Moto
                </Button>
            </div>
			

            {/* Team Members */}
            <div className="mb-8 bg-white p-4 space-y-3 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Team Members</h2>
                {teamMembers.map((team, index) => (
                    <div key={index} className="relative my-2 p-2 rounded-md border border-gray-900">
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
								className="h-20 w-20 object-cover rounded-md border border-gray-900"
								style={{ maxWidth: '100%', height: 'auto' }}
							/>
							<Input
								type="text"
								className="w-full p-2 border rounded mb-2"
								value={team?.name}
								onChange={(e) => {
									const updatedTeamMembers = [...teamMembers];
									updatedTeamMembers[index].name = e.target.value;
									setTeamMembers(updatedTeamMembers);
								}}
								placeholder="Team Member Name"
							/>
							<Input
								type="text"
								className="w-full p-2 border rounded mb-2"
								value={team?.designation}
								onChange={(e) => {
									const updatedTeamMembers = [...teamMembers];
									updatedTeamMembers[index].designation = e.target.value;
									setTeamMembers(updatedTeamMembers);
								}}
								placeholder="Team Member Designation"
							/>
							
							<FileUploadComponent
								maxFiles={1}
								tag={`tag-${index}`}
								sizeTag={`team-${index}`}
								onSetImageUrls={(file) => {
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

								}}
								isLoading = {imageLoading}
								setIsLoading={setImageLoading}
							/>
						</div>
                        
                    </div>
                ))}
                <Button
                    className="bg-green-500 text-white px-6 py-3"
                    onClick={handleAddTeamMember}
                >
                	Add Team Member
                </Button>
            </div>
			<div className="mb-8 bg-white p-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-4">Founder Data</h2>
				<div className="mb-4">
					<img
						src={founderData?.image}
						alt="Founder Image"
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
						placeholder="Add Founde's promises"
						rows={5}
						cols={30}
						required
                    />
				</div>
			</div>

            {/* Save Button */}
            <div className="text-center">
                <Button
                    className="bg-blue-500 w-full  text-white px-6 py-3 rounded hover:bg-blue-600"
                    onClick={handleSave}
                >
                	Update Details
                </Button>
            </div>
        </div>
    );
};

export default AdminAboutPage;
