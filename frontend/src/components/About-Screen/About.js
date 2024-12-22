import React from 'react'

const About = () => {
	return (
		<div className="bg-gray-50 py-12 px-6 lg:px-24">
		  {/* Header Section */}
		  <header className="text-center mb-12">
		    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
			 Welcome to ON-U
		    </h1>
		    <p className="mt-4 text-lg text-gray-600">
			 Where innovation meets style – Your go-to e-commerce destination
		    </p>
		  </header>
	 
		  {/* Mission Statement Section */}
		  <section className="mb-16">
		    <div className="max-w-5xl mx-auto text-center">
			 <h2 className="text-3xl font-semibold text-gray-800">Our Mission</h2>
			 <p className="mt-4 text-xl text-gray-600">
			   At ON-U, we are dedicated to offering high-quality products, from fashion to electronics, with a focus on sustainability and customer satisfaction.
			 </p>
		    </div>
		  </section>
	 
		  {/* Values Section */}
		  <section className="bg-white py-12">
		    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
			 <div className="text-center">
			   <h3 className="text-2xl font-semibold text-gray-800">Quality</h3>
			   <p className="mt-4 text-gray-600">
				We prioritize providing high-quality products that meet our customers' expectations and needs.
			   </p>
			 </div>
			 <div className="text-center">
			   <h3 className="text-2xl font-semibold text-gray-800">Sustainability</h3>
			   <p className="mt-4 text-gray-600">
				Our commitment to sustainability ensures that we actively minimize our environmental impact.
			   </p>
			 </div>
			 <div className="text-center">
			   <h3 className="text-2xl font-semibold text-gray-800">Customer Satisfaction</h3>
			   <p className="mt-4 text-gray-600">
				Our customers come first. We provide excellent customer support and ensure an exceptional shopping experience.
			   </p>
			 </div>
		    </div>
		  </section>
		</div>
	   );
}

export default About