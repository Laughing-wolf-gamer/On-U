import FileUploadComponent from '@/components/admin-view/FileUploadComponent';
import { fetchAboutData, sendAboutData } from '@/store/common-slice';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const AdminAboutPage = () => {
    const dispatch = useDispatch();
	const{aboutData} = useSelector(state => state.common);
    const [imageLoading, setImageLoading] = useState(false);
    // Existing state variables
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');

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
        console.log("About Data.",{
            header,
            subHeader,
            ourMissionDescription,
            outMoto,
            teamMembers,
			founderData,
        });
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
        toast.success("Data Saved Successfully");
    };
    const handleAddTeamMember = () => {
        setTeamMembers([...teamMembers, { name: '', image: '', designation: '' }]);
    };
    const handleRemoveTeamMember = (index) => {
        const updatedTeamMembers = teamMembers.filter((_, i) => i !== index);
        setTeamMembers(updatedTeamMembers);
    };
    /* const handleImageUpload = (index, imageUrl) => {
        setTeamMembers((prev) => {prev[index].image = imageUrl; return prev;});
    }; */
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
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin: About Page Management</h1>
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

            {/* Our Mission Description */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Out Mission Description</h2>
                <textarea
                    className="w-full p-2 border rounded h-32"
                    value={ourMissionDescription}
                    onChange={(e) => setOurMissionDescription(e.target.value)}
                    placeholder="Enter Our Mission Description"
                ></textarea>
            </div>

            {/* Out Moto */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Out Moto</h2>
                {outMoto.map((out, index) => (
                    <div key={index} className="mb-4">
                        <input
                            type="text"
                            className="w-full p-2 border rounded mb-2"
                            value={out?.title}
                            onChange={(e) => {
                                const updatedOutMoto = [...outMoto];
                                updatedOutMoto[index].title = e.target.value;
                                setOutMoto(updatedOutMoto);
                            }}
                            placeholder="Out Moto Title"
                        />
                        <textarea
                            className="w-full p-2 border rounded mb-2"
                            value={out?.description}
                            onChange={(e) => {
                                const updatedOutMoto = [...outMoto];
                                updatedOutMoto[index].description = e.target.value;
                                setOutMoto(updatedOutMoto);
                            }}
                            placeholder="Out Moto Description"
                        />
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                            onClick={() => handleRemoveOutMoto(index)}
                        >
                        Remove Out Moto
                        </button>
                    </div>
                ))}
                <button
                    className="bg-green-500 text-white px-6 py-3 rounded"
                    onClick={handleAddOutMoto}
                >
                Add Out Moto
                </button>
            </div>
			

            {/* Team Members */}
            <div className="mb-8 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Team Members</h2>
                {teamMembers.map((team, index) => (
                    <div key={index} className="mb-4">
                        <input
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
                        <input
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
						<img
							src={team?.image}
							alt="Team Member Image"
                            className="h-20 w-20 object-cover rounded-full"
                            style={{ maxWidth: '100%', height: 'auto' }}
						/>
                        <FileUploadComponent
                            maxFiles={1}
                            tag={`tag-${index}`}
                            sizeTag={`team-${index}`}
                            onSetImageUrls={(e) => {
                                const updatedTeamMembers = [...teamMembers];
                                updatedTeamMembers[index].image = e[0].url;
                                setTeamMembers(updatedTeamMembers);
                            }}
                            isLoading = {imageLoading}
                            setIsLoading={setImageLoading}
                        />
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                            onClick={() => handleRemoveTeamMember(index)}
                        >
                        Remove Team Member
                        </button>
                    </div>
                ))}
                <button
                    className="bg-green-500 text-white px-6 py-3 rounded"
                    onClick={handleAddTeamMember}
                >
                Add Team Member
                </button>
            </div>
			<div className="mb-8 bg-white p-4 rounded shadow">
				<h2 className="text-xl font-semibold mb-4">Founder</h2>
				<div className="mb-4">
					{/* <img
						src={founderData.image}
						alt="Founder Image"
						className="w-32 h-32 object-cover rounded-full mb-4"
					/>
					<h3 className="text-2xl font-semibold">{founderData.name}</h3>
					<p className="text-gray-600 mb-2">{founderData.nameDescription}</p>
					<p className="mb-4">{founderData.description}</p>
					<p className="text-gray-600 font-medium">{founderData.details}</p>
					<h4 className="text-xl font-semibold mt-4">{founderData.founderVision}</h4>
					<p className="mt-2">{founderData.community}</p> */}
					<img
						src={founderData?.image}
						alt="Founder Image"
						className="w-32 h-32 object-cover rounded-full mb-4"
					/>
					<FileUploadComponent
						maxFiles={1}
						tag={`Founder-image`}
						sizeTag={`founder-vision-image`}
						onSetImageUrls={(e) => {
							// const updatedTeamMembers = [...teamMembers];
							// updatedTeamMembers[index].image = e[0].url;
							// setTeamMembers(updatedTeamMembers);
							setFounderData({...founderData, image: e[0].url });
						}}
						isLoading = {imageLoading}
						setIsLoading={setImageLoading}
					/>
					<input
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        value={founderData.name}
                        onChange={(e) => setFounderData({...founderData, name: e.target.value })}
						placeholder="Add Founder's Name"
                    />
					<input
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        value={founderData.designation}
                        onChange={(e) => setFounderData({...founderData, designation: e.target.value })}
						placeholder="Add Founder's Designation"
                    />
					<textarea
                        className="w-full p-2 border rounded h-32"
                        value={founderData.introduction}
                        onChange={(e) => setFounderData({...founderData, introduction: e.target.value })}
                        placeholder="Add Founder's introduction"
						rows={5}
						cols={30}
						required
					/>
					<textarea
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        value={founderData.details}
                        onChange={(e) => setFounderData({...founderData, details: e.target.value })}
						placeholder="Add Founder's Details"
                    />
					<textarea
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        value={founderData.founderVision}
                        onChange={(e) => setFounderData({...founderData, founderVision: e.target.value })}
						placeholder="Add Founder's Vision"
						rows={5}
						cols={30}
						required
                    />
					<textarea
                        type="text"
                        className="w-full p-2 border rounded mb-2"
                        value={founderData.goals}
                        onChange={(e) => setFounderData({...founderData, goals: e.target.value })}
						placeholder="Add Founder's goals"
						rows={5}
						cols={30}
						required
                    />
					<textarea
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
                <button
                    className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                    onClick={handleSave}
                >
                Save Details
                </button>
            </div>
        </div>
    );
};

export default AdminAboutPage;
