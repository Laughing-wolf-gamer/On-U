import React from 'react'

const BulletPointView = ({ points }) => {
	return (
		<div className="w-full h-auto bg-white p-4 md:p-6 lg:p-8">
			{/* Main Header */}
			<h2 className="text-xl font-semibold text-gray-500 mb-6">Bullet Point List</h2>
			{/* Body Section: Dynamically generated bullet points */}
			<div className="space-y-6">
				{points.map((point, index) => (
					<div key={index} className="flex flex-col space-y-2">
						{/* Bullet point with header */}
						<div className="flex items-start space-x-2">
							<span className="text-lg text-gray-600">•</span>
							<h3 className="text-sm font-semibold text-gray-500">{point.header}</h3>
						</div>
						{/* Body Text */}
						<p className="text-gray-700 text-base">{point.body}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default BulletPointView;
