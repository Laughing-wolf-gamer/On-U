import React, { useEffect, useRef, useState } from 'react';
import Footer from '../Footer/Footer';
import { BASE_API_URL, extractSpecificWord } from '../../config';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import BackToTopButton from '../Home/BackToTopButton';
import WhatsAppButton from '../Home/WhatsAppButton';
import Loader from '../Loader/Loader';

const About = () => {
    const scrollableDivRef = useRef(null); // Create a ref to access the div element
    const [aboutData, setAboutData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    /* const founderData = {
		image: "https://th.bing.com/th?id=OIP.rVHb8aGuPiS7hU7mOGBIvAHaEK&w=333&h=187&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
		name: "John Doe",
		designation: "CEO & Founder of Our Company",
		introduction: "John has a long and distinguished history of leadership in the tech industry, having played pivotal roles in driving innovation and fostering creativity within teams. Over the years, he has built a reputation as a visionary who pushes the boundaries of what's possible in the world of technology, encouraging his teams to embrace cutting-edge solutions and disruptive ideas. His expertise spans across numerous successful projects that have shaped the tech landscape.",
		details: "With over 20 years of experience in the tech field, John has successfully founded and grown several startups, as well as led large, multi-national organizations. His business acumen and passion for technological advancement have earned him numerous accolades and recognition. John’s leadership style is focused on empowering individuals and creating an environment where innovation thrives. Throughout his career, he has worked with a diverse range of teams and clients, always striving to find solutions that bring about lasting change and progress in the industry.",
		founderVision: "Our vision is to bring unique, sustainable, and exceptional products from all around the world, offering them to a global community of individuals who share a love for creativity, craftsmanship, and quality. We aim to foster a world where sustainability is at the core of all products, ensuring that each item we offer contributes positively to the environment and the lives of our customers. By collaborating with artisans and creators from diverse cultures, we believe we can provide a platform for the celebration of culture, creativity, and conscious living.",
		goals: "On-U’s community is built around sharing knowledge, sustainability, and a passion for exceptional, one-of-a-kind products. We are not just a marketplace, but a space for individuals who are passionate about contributing to positive change. Our members are thought leaders, innovators, and people who believe in the power of connection and conscious consumption. By joining the On-U community, you become part of a global movement that values creativity, sustainability, and high-quality craftsmanship. We are committed to providing a platform where like-minded individuals can share experiences, ideas, and collaborate on building a better, more sustainable future.",
		promises: "On-U’s community is built around sharing knowledge, sustainability, and a passion for exceptional, one-of-a-kind products. We are not just a marketplace, but a space for individuals who are passionate about contributing to positive change. Our members are thought leaders, innovators, and people who believe in the power of connection and conscious consumption. By joining the On-U community, you become part of a global movement that values creativity, sustainability, and high-quality craftsmanship. We are committed to providing a platform where like-minded individuals can share experiences, ideas, and collaborate on building a better, more sustainable future."
	} */

    const fetchPageAboutData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_API_URL}/api/common/website/about`);
            setAboutData(res?.data?.aboutData || null);
        } catch (error) {
            setAboutData(null);
        } finally {
            setIsLoading(false);
			
        }
    };

    useEffect(() => {
        scrollableDivRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        fetchPageAboutData();
    }, []);
    // console.log("About Data:,",aboutData);
    
    return (
        <div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto justify-start scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
            {!isLoading ? (
                <div className="bg-white py-12 px-6 lg:px-24 w-full max-w-screen-2xl justify-self-center">
					
                    {/* Header Section */}
                    <header className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-700 sm:text-5xl md:text-6xl">
                            Welcome to <span className="text-slate-600 hover:animate-bounce">{extractSpecificWord(aboutData?.header) || "ON-U"}</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-700 sm:text-xl md:text-2xl">
                            {aboutData ? aboutData.subheader : "Where innovation meets style – Your go-to e-commerce destination"}
                        </p>
                    </header>
					{
						aboutData && aboutData.founderData &&  <FounderSection founderData={aboutData.founderData}/>
					}
					

                    {/* Mission Statement Section */}
                    <section className="py-5 w-full">
                        <div className="w-full mx-auto text-center">
                            <h2 className="text-3xl font-semibold text-slate-900">Our Mission</h2>
                            <p className="mt-4 text-xl w-full text-gray-800 md:text-2xl">
                                {aboutData ? aboutData.ourMissionDescription: "Our mission is to provide high-quality, sustainable products that enhance our customers' lives."}
                            </p>
                        </div>
                    </section>
					

                    {/* Values Section */}
                    <section className="py-10 mb-8 h-fit w-full font-kumbsan">
                        <div className="w-full p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                            {aboutData && aboutData.outMoto.length > 0 && aboutData.outMoto.map((moto, index) => (
                                <div key={`moto-${index}`} className="text-center py-5 space-y-3 bg-gray-700 p-6 min-h-[200px] max-h-[200px] overflow-y-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-105">
                                    <i className="fas fa-cogs text-4xl mb-4"></i>
                                    <h3 className="text-2xl font-semibold text-white">{moto?.title || "Quality"}</h3>
                                    <p className=" text-white">{moto?.description || "We prioritize providing high-quality products that meet our customers' expectations and needs."}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Team Section */}
                    <section className="w-full flex flex-col justify-center items-center">
                        <h2 className="text-4xl font-semibold text-center text-slate-700 mb-5">Meet Our Team</h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            {aboutData && aboutData.teamMembers.length > 0 && aboutData.teamMembers.map((member, index) => (
                                <div key={`team-${index}`} className="relative text-center flex flex-col bg-slate-300 p-10 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
                                    <LazyLoadImage
                                        src={member.image}
                                        alt={`Team_Member_${index+1}`}
										loading='lazy'
                                        className="w-64 h-64 mx-auto object-cover transition-all duration-500 ease-in-out group-hover:scale-125"
                                    />
                                    <div className="absolute inset-0 top-1/2 h-14 bg-slate-300 bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300 z-20">
                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-800">{member.name || "No-Name"}</h3>
                                            <p className="text-slate-500">{member.designation || "No-Designation"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            ) : (
                <Loader isLoading={isLoading} />
            )}
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
            <WhatsAppButton scrollableDivRef={scrollableDivRef}/>
            <Footer />
        </div>
    );
};
const FounderSection = ({ founderData }) => {
	const [activeTab, setActiveTab] = useState('introduction');
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleShowMore = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<section className="bg-white font-kumbsan max-w-screen-2xl mx-auto py-12 px-1 lg:px-24">
			{/* Founder Information Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Founder Image */}
				<div className="flex max-h-[600px] h-[400px] overflow-hidden justify-center items-center">
					<img
						src={founderData?.image}
						alt="Founder"
						className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
					/>
					</div>

					{/* Tabs and Information */}
					<div className="w-full justify-start items-start bg-neutral-50">
					{/* Header Section */}
					<div className="flex font-bold justify-between mb-4 items-center px-2">
						<h1 className="text-3xl sm:text-4xl md:text-5xl">{founderData.designation}</h1>
					</div>

					{/* Tabs Section */}
					<div className="mb-4">
						<div className="flex justify-between items-center space-x-2 max-w-screen-sm overflow-x-auto">
						<button
							className={`px-4 py-2 text-xs sm:text-base transition-colors duration-500 ease-in-out border-b-4 ${activeTab === 'introduction' ? 'border-b-orange-400 text-gray-700' : 'text-gray-800'}`}
							onClick={() => setActiveTab('introduction')}
						>
							Introduction
						</button>
						<button
							className={`px-4 py-2 text-xs sm:text-base transition-all duration-300 ease-in-out border-b-4 ${activeTab === 'founderVision' ? 'border-b-orange-400 text-gray-700' : 'text-gray-800'}`}
							onClick={() => setActiveTab('founderVision')}
						>
							Vision
						</button>
						<button
							className={`px-4 py-2 text-xs sm:text-base transition-all duration-300 ease-in-out border-b-4 ${activeTab === 'goals' ? 'border-b-orange-400 text-gray-700' : 'text-gray-800'}`}
							onClick={() => setActiveTab('goals')}
						>
							Goals
						</button>
						<button
							className={`px-4 py-2 text-xs sm:text-base transition-all duration-300 ease-in-out border-b-4 ${activeTab === 'promises' ? 'border-b-orange-400 text-gray-700' : 'text-gray-800'}`}
							onClick={() => setActiveTab('promises')}
						>
							Promises
						</button>
						</div>
					</div>

					{/* Tab Content */}
					<div className="mt-6 justify-start overflow-hidden items-center">
						{/* Founder Tab */}
						{activeTab === 'introduction' && (
						<div className="text-left px-2 flex flex-col justify-start items-start space-y-2">
							<p className="text-gray-700 max-h-[200px] overflow-y-auto min-h-[200px]">
							{isExpanded ? founderData.introduction : founderData.introduction.slice(0, 300) + '...'}
							</p>
							<button
							onClick={toggleShowMore}
							className="mt-4 rounded-full bg-black hover:bg-gray-50 hover:border-gray-900 hover:border hover:text-black p-2 px-4 text-center font-medium text-white"
							>
							<span>{isExpanded ? 'Show Less' : 'Show More'}</span>
							</button>
						</div>
						)}

						{/* Founder Vision Tab */}
						{activeTab === 'founderVision' && (
						<div className="text-left px-2 flex flex-col justify-start items-start space-y-2">
							<p className="text-gray-700 max-h-[200px] overflow-y-auto min-h-[200px]">
							<span className="block mt-2 max-h-[200px] overflow-y-auto">
								{isExpanded ? founderData.founderVision : founderData.founderVision.slice(0, 300) + '...'}
							</span>
							</p>
							<button
							onClick={toggleShowMore}
							className="mt-4 rounded-full bg-black hover:bg-gray-50 hover:border-gray-900 hover:border hover:text-black p-2 px-4 text-center font-medium text-white"
							>
							<span>{isExpanded ? 'Show Less' : 'Show More'}</span>
							</button>
						</div>
						)}

						{/* Goals Tab */}
						{activeTab === 'goals' && (
						<div className="text-left px-2 flex flex-col justify-start items-start space-y-2">
							<p className="text-gray-700 max-h-[200px] overflow-y-auto min-h-[200px]">
							{isExpanded ? founderData.goals : founderData.goals.slice(0, 300) + '...'}
							</p>
							<button
							onClick={toggleShowMore}
							className="mt-4 rounded-full bg-black hover:bg-gray-50 hover:border-gray-900 hover:border hover:text-black p-2 px-4 text-center font-medium text-white"
							>
							<span>{isExpanded ? 'Show Less' : 'Show More'}</span>
							</button>
						</div>
						)}

						{/* Promises Tab */}
						{activeTab === 'promises' && (
						<div className="text-left px-2 flex flex-col justify-start items-start space-y-2">
							<p className="text-gray-700 max-h-[200px] overflow-y-auto min-h-[200px]">
							{isExpanded ? founderData.promises : founderData.promises.slice(0, 300) + '...'}
							</p>
							<button
							onClick={toggleShowMore}
							className="mt-4 rounded-full bg-black hover:bg-gray-50 hover:border-gray-900 hover:border hover:text-black p-2 px-4 text-center font-medium text-white"
							>
							<span>{isExpanded ? 'Show Less' : 'Show More'}</span>
							</button>
						</div>
						)}
					</div>
				</div>
			</div>
			</section>

	);
};

export default About;
