import React from 'react'

const AdminTrackingView = () => {
	const visitData = [
		{ lat: 37.7749, lng: -122.4194, label: "Visit 1" }, // San Francisco
		{ lat: 34.0522, lng: -118.2437, label: "Visit 2" }, // Los Angeles
		{ lat: 40.7128, lng: -74.0060, label: "Visit 3" },  // New York
		// Add more coordinates here
	];
	// Generate marker URL parameters for blue dots
	const generateMarkers = () => {
		return visitData
		.map(
			(visit) => `&markers=color:blue|${visit.lat},${visit.lng}`
		)
		.join('');
	};

	// Create the Static Map URL for embedding
	const mapUrl = `https://static-maps.yandex.ru/1.x/?l=map&size=650,450${generateMarkers()}`;

	return (
		<div>
			<h1>Tracking Visits</h1>
			<iframe
				src={mapUrl}
				width="650"
				height="450"
				frameBorder="0"
				style={{ border: "none" }}
				title="Tracking View"
			></iframe>
		</div>
	);
}

export default AdminTrackingView
