import React from 'react';
import Footer from '../Footer/Footer';

const About = () => {
  return (
    <div className="bg-gray-50 py-12 px-6 lg:px-24">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to <span className="text-pink-500">ON-U</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 sm:text-xl md:text-2xl">
          Where innovation meets style – Your go-to e-commerce destination
        </p>
      </header>

      {/* Mission Statement Section */}
      <section className="mb-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Our Mission</h2>
          <p className="mt-4 text-xl text-gray-600 md:text-2xl">
            At ON-U, we are dedicated to offering high-quality products, from fashion to electronics, with a focus on sustainability and customer satisfaction.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-12 shadow-lg rounded-xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Value 1: Quality */}
          <div className="text-center bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <i className="fas fa-cogs text-4xl text-pink-500 mb-4"></i>
            <h3 className="text-2xl font-semibold text-gray-800">Quality</h3>
            <p className="mt-4 text-gray-600">
              We prioritize providing high-quality products that meet our customers' expectations and needs.
            </p>
          </div>

          {/* Value 2: Sustainability */}
          <div className="text-center bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <i className="fas fa-leaf text-4xl text-pink-500 mb-4"></i>
            <h3 className="text-2xl font-semibold text-gray-800">Sustainability</h3>
            <p className="mt-4 text-gray-600">
              Our commitment to sustainability ensures that we actively minimize our environmental impact.
            </p>
          </div>

          {/* Value 3: Customer Satisfaction */}
          <div className="text-center bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <i className="fas fa-users text-4xl text-pink-500 mb-4"></i>
            <h3 className="text-2xl font-semibold text-gray-800">Customer Satisfaction</h3>
            <p className="mt-4 text-gray-600">
              Our customers come first. We provide excellent customer support and ensure an exceptional shopping experience.
            </p>
          </div>
        </div>
      </section>

      	{/* Team Section */}
		<section className="mb-24">
			<h2 className="text-4xl font-semibold text-center text-gray-800 mb-12">Meet Our Team</h2>
			<div className="flex justify-center gap-16">
				{/* Team Member 1 */}
				<div className="relative text-center flex flex-col bg-white p-10 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
				<img
					src="https://www.insightstate.com/wp-content/uploads/2024/02/positive-traits-of-a-person.jpg.webp"
					alt="Team Member 3"
					className="w-64 h-64 mx-auto object-cover transition-all duration-500 ease-in-out group-hover:scale-125"
				/>
				{/* Overlay */}
				<div className="absolute inset-0 top-1/2 h-14 bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300 z-20">
					<div>
					<h3 className="text-xl font-semibold text-slate-800">Michael Brown</h3>
					<p className="text-slate-500">Product Manager</p>
					</div>
				</div>
				</div>

				{/* Team Member 2 */}
				<div className="relative text-center flex flex-col bg-white p-10 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
				<img
					src="https://www.insightstate.com/wp-content/uploads/2024/02/positive-traits-of-a-person.jpg.webp"
					alt="Team Member 3"
					className="w-64 h-64 mx-auto object-cover transition-all duration-500 ease-in-out group-hover:scale-125"
				/>
				{/* Overlay */}
				<div className="absolute inset-0 top-1/2 h-14 bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300 z-20">
					<div>
					<h3 className="text-xl font-semibold text-slate-800">Michael Brown</h3>
					<p className="text-slate-500">Product Manager</p>
					</div>
				</div>
				</div>

				{/* Team Member 3 */}
				<div className="relative text-center flex flex-col bg-white p-10 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
				<img
					src="https://www.insightstate.com/wp-content/uploads/2024/02/positive-traits-of-a-person.jpg.webp"
					alt="Team Member 3"
					className="w-64 h-64 mx-auto object-cover transition-all duration-500 ease-in-out group-hover:scale-125"
				/>
				{/* Overlay */}
				<div className="absolute inset-0 top-1/2 h-14 bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300 z-20">
					<div>
					<h3 className="text-xl font-semibold text-slate-800">Michael Brown</h3>
					<p className="text-slate-500">Product Manager</p>
					</div>
				</div>
				</div>

			</div>
		</section>
		<Footer/>
    </div>
  );
};

export default About;
