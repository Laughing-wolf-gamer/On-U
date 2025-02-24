import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { capitalizeFirstLetterOfEachWord, GetBadgeColor } from '@/config';
import { fetchAllQuery } from '@/store/admin/query-slice';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import CommonForm from '@/components/common/form';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';


import xl_icon from '../../assets/xl_icon.png';
import pdf_icon from '../../assets/pdf_icon.png';
import csv_icon from '../../assets/csv_icon.png';
import CustomSelect from '@/components/admin-view/CustomSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { sendContactUsPageQuery } from '@/store/common-slice';


const mockQueries = [
    {
        _id: "6782673643fbfc9467bfd9da",
        queryDetails: {
            emailId: "sinhaabhishek374@gmail.com",
            fullName: "Abhishek Sinha",
            phoneNumber: "9101094674",
            queryMessage: "NEW QUERY",
            createdAt: "2025-01-11T12:42:30.649+00:00",
            updatedAt: "2025-01-11T12:42:30.649+00:00"
        }
    },
    {
        _id: "82a72b3f12f3a94b57693c9b",
        queryDetails: {
            emailId: "john.doe@example.com",
            fullName: "John Doe",
            phoneNumber: "9876543210",
            queryMessage: "Inquiry about product features",
            createdAt: "2025-01-10T10:30:10.000+00:00",
            updatedAt: "2025-01-10T10:30:10.000+00:00"
        }
    },
    {
        _id: "763b13acdc6d482b95ac7fa2",
        queryDetails: {
            emailId: "jane.smith@example.com",
            fullName: "Jane Smith",
            phoneNumber: "9988776655",
            queryMessage: "Request for demo",
            createdAt: "2025-01-09T14:22:40.000+00:00",
            updatedAt: "2025-01-09T14:22:40.000+00:00"
        }
    }
];
const AdminContactQueryViewPage = () => {

    
    const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'
    const [statusFilter, setStatusFilter] = useState(''); // To filter by status (if needed)
    const [minQueries, setMinQueries] = useState(0); // Min number of queries to show
    const [maxQueries, setMaxQueries] = useState(10); // Max number of queries to show
    const[selectedQueryDetails, setSelectedQueryDetails] = useState(null);

    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { ContactQuery } = useSelector(state => state.contactQuery);

    useEffect(() => {
        dispatch(fetchAllQuery());
    }, [dispatch]);

    const handleFetchContactQueryDetails = async (querySelected) => {
        // await dispatch(adminGetContactQueryById(queryId));
        setSelectedQueryDetails(querySelected);
        setOpenDetailsDialogue(true);
    };
    const convertToCSV = () => {
        const header = ['Email Id', 'Full Name', 'Phone Number', 'QueryMessage', 'Status', 'Created At', 'Updated At'];
        const rows = ContactQuery.map(item => [
            item.QueryDetails['Email Id'], // Accessing Email Id from QueryDetails
            item.QueryDetails.FullName, // Accessing Full Name from QueryDetails
            item.QueryDetails['Phone Number'], // Accessing Phone Number from QueryDetails
            item.QueryMessage,
            item.Status,
            item.createdAt,
            item.updatedAt
        ]);
    
        return [header, ...rows].map(row => row.join(',')).join('\n');
    };
    
    const downloadCSV = () => {
        const csvContent = convertToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `Query_Data.csv`);
    };
    
    const downloadPDF = () => {
        const doc = new jsPDF();
        
        // Set title
        doc.setFontSize(18);
        doc.text('Query Data', 10, 20);
        
        // Set font size for other text
        doc.setFontSize(9);
        
        // Add headers for each field
        doc.text('Email Id', 10, 30);
        doc.text('Full Name', 60, 30); // Adjusted x-position
        doc.text('Phone Number', 90, 30); // Adjusted x-position (added space)
        doc.text('Query Message', 120, 30); // Adjusted x-position
        doc.text('Status', 170, 30); // Adjusted x-position
        doc.text('Created At', 190, 30); // Adjusted x-position
    
        // Add data rows
        ContactQuery.forEach((item, index) => {
            const yPos = 40 + (index * 10);
            doc.text(item.QueryDetails['Email Id'], 10, yPos);
            doc.text(item.QueryDetails.FullName, 60, yPos);
            doc.text(item.QueryDetails['Phone Number'], 90, yPos); // Adjusted x-position
            doc.text(item.QueryMessage, 120, yPos); // Adjusted x-position
            doc.text(item.Status, 170, yPos); // Adjusted x-position
            doc.text(new Date(item.createdAt).toLocaleDateString(), 190, yPos); // Adjusted x-position
        });
        
        // Save the PDF with a simplified file name
        doc.save('Query_Data.pdf');
    };
    
    
    const downloadExcel = () => {
        // Mapping the ContactQuery data into an appropriate format for Excel
        const rows = ContactQuery.map(item => ({
            'Email Id': item.QueryDetails['Email Id'],
            'Full Name': item.QueryDetails.FullName,
            'Phone Number': item.QueryDetails['Phone Number'],
            'Query Message': item.QueryMessage,
            'Status': item.Status,
            'Created At': item.createdAt,
            'Updated At': item.updatedAt
        }));
        
        const ws = XLSX.utils.json_to_sheet(rows); // Pass the rows array to create the Excel sheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Query Data');
        XLSX.writeFile(wb, 'Query_Data.xlsx');
    };

    /* useEffect(() => {
        if (ContactQuery) {
            setOpenDetailsDialogue(true);
        }
    }, [ContactQuery]); */
    console.log("ContactQuery: ",ContactQuery);
    // Sort queries based on the selected sortOrder
    const sortedQueryList = [...ContactQuery].sort((a, b) => {
        const dateA = new Date(a?.createdAt);
        const dateB = new Date(b?.createdAt);
        return sortOrder === 'latest' ? dateB - dateA : dateA - dateB; // Latest or Oldest
    });

    // Filter queries (optional if you need to add filters)
    const filteredQueryList = sortedQueryList.filter(query => {
        if (statusFilter === '') return true; // Show all if no filter
        return query?.Status === statusFilter;
    });

    // Apply min-max filtering for queries to show
    const displayedQueries = filteredQueryList.slice(minQueries, maxQueries);

    // Check if there are no queries available
    const isNoQueries = !displayedQueries || displayedQueries.length === 0;
    // console.log("Available Query: ",ContactQuery);
    return (
        <Card className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Contact Queries</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Sorting and Filter Controls */}
                <div className="mb-4 text-center space-x-4 justify-between flex flex-col md:flex-row lg:flex-row 2xl:flex-row">
                    {/* Sort By Dropdown */}
                    <Button
                        variant="outline"
                        onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
                    >
                        Sort by {sortOrder === 'latest' ? 'Oldest' : 'Latest'}
                    </Button>

                    {/* Filter By Status Dropdown */}
                    <select
                        className="border border-gray-300 px-4 py-2 rounded-md"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Filter Status (All)</option>
                        <option value="Pending">Pending</option>
                        <option value="Responded">Responded</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-5 items-center mb-4">
                        <button onClick={downloadCSV} className="w-full sm:w-fit h-12 sm:h-10 shadow-md flex items-center justify-center gap-2">
                            <img
                                src={csv_icon}
                                alt="csv icon"
                                className="w-6 h-6 sm:w-full sm:h-full object-contain"
                            />
                            <span className="text-[10px] sm:text-[12px] font-bold">Download for (CSV)</span>
                        </button>
                        <button onClick={downloadPDF} className="w-full sm:w-fit h-12 sm:h-10 shadow-md flex items-center justify-center gap-2">
                            <img
                                src={pdf_icon}
                                alt="pdf icon"
                                className="w-6 h-6 sm:w-full sm:h-full object-contain"
                            />
                            <span className="text-[10px] sm:text-[12px] font-bold">Download for (PDF)</span>
                        </button>
                        <button onClick={downloadExcel} className="w-full sm:w-fit h-12 sm:h-10 shadow-md flex items-center justify-center gap-2">
                            <img
                                src={xl_icon}
                                alt="xl icon"
                                className="w-6 h-6 sm:w-full sm:h-full object-contain"
                            />
                            <span className="text-[10px] sm:text-[12px] font-bold">Download for (Excel)</span>
                        </button>
                    </div>

                </div>

                {/* Slider for showing queries range */}
                <div className="mb-4 text-center space-x-4">
                    <label className="text-lg font-medium">Min-Max Queries</label>
                    <div className="flex justify-center items-center space-x-4">
                        <input
                            type="range"
                            min="0"
                            max={filteredQueryList.length}
                            value={minQueries}
                            onChange={(e) => setMinQueries(parseInt(e.target.value))}
                            className="slider"
                        />
                        <span>{minQueries} to {maxQueries}</span>
                        <input
                            type="range"
                            min={minQueries}
                            max={filteredQueryList.length}
                            value={maxQueries}
                            onChange={(e) => setMaxQueries(parseInt(e.target.value))}
                            className="slider"
                        />
                    </div>
                </div>

                {/* No Queries Available */}
                {isNoQueries && (
                    <div className="text-center p-4 mb-4 border border-gray-200 rounded-lg shadow-sm bg-gray-100">
                        <span className="text-lg font-semibold text-gray-800">No Queries Available</span>
                    </div>
                )}

                {/* Non-table layout for larger screens */}
                {!isNoQueries && (
                    <div className="hidden sm:block">

                        {/* Table Body */}
                        <div className="divide-y divide-gray-200">
                            {displayedQueries.map((query) => (
                                <div key={query?._id} className="flex flex-row max-w-full justify-between space-x-6 p-4 hover:bg-gray-100">
                                    {
                                        query?.QueryDetails && Object.entries(query?.QueryDetails).map(([key, value]) => (
                                            <div key={key} className="flex flex-col justify-between">
                                                <span className="font-medium">{capitalizeFirstLetterOfEachWord(key)}:</span>
                                                <span>{formatValue(key, value)}</span>
                                            </div>
                                        ))
                                    }
                                    <div className="text-sm sm:text-base">
                                        <Badge className={`justify-center items-center py-1 px-3 hover:bg-transparent hover:shadow-md bg-black hover:bg-gray-700`}>{query?.Status}</Badge>
                                    </div>
                                    <div className="text-sm sm:text-base text-center">
                                        <Button onClick={() => handleFetchContactQueryDetails(query)} className="btn btn-primary text-xs sm:text-sm">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mobile layout */}
                <div className="sm:hidden">
                    {displayedQueries.map((query) => (
                        <div key={query?._id} className="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                            {
                                query?.QueryDetails && <div className="flex flex-col space-y-3">
                                    {Object.entries(query?.QueryDetails).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                            <span className="font-medium">{capitalizeFirstLetterOfEachWord(key)}:</span>
                                            <span>{formatValue(key, value)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-sm">Status:</span>
                                        <span className="text-sm">
                                            <Badge className={`py-1 px-3 `}>{capitalizeFirstLetterOfEachWord(query?.Status)}</Badge>
                                        </span>
                                    </div>
                                    
                                    <Button
                                        onClick={() => handleFetchContactQueryDetails(query)}
                                        className="btn btn-primary mt-2 w-full text-sm"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            }
                            
                        </div>
                    ))}
                </div>
            </CardContent>

            {/* Dialog for contact query details */}
            <Dialog open={openDetailsDialogue} onOpenChange={() => {
                setOpenDetailsDialogue(false);
                // dispatch(resetContactQueryDetails());
            }}>
                {selectedQueryDetails && <AdminQueryDetailsView query={selectedQueryDetails}/>}
            </Dialog>
        </Card>
    );
};
const AdminQueryDetailsView = ({query}) => {

	const initialFormData = {
		queryId:query?._id,
		email:'',
		Subject:'',
		status:'',
		resolvedMessage:'',
	}
    // Helper function to get badge color based on status
    // console.log("Order Details: ",GetBadgeColor(query?.Status))
    const [formData,setFormData] = useState(initialFormData);
    // console.log("Query Details: ",query)
	const dispatch = useDispatch();
	const handleSubmitStatus = async (e)=>{
		e.preventDefault();
		console.log("Data Updated: ", {...formData,email:query?.QueryDetails?.Email})
		const data = await dispatch(sendContactUsPageQuery({...formData,queryId:query._id,email:query?.QueryDetails?.Email}))
		if(data?.payload?.Success){
            setFormData(initialFormData);
			// dispatch(adminGetAllOrders())
		}
	}
	return (
		<DialogContent className = "sm:max-w-[600px] h-[500px] overflow-y-auto">
			<DialogTitle>Query Data</DialogTitle>
			<div className='grid gap-6'>
				<div className='grid gap-6'>
					<div className='flex mt-6 items-center justify-between'>
						<p className='font-medium'>Query Id</p>
						<Label>{query?._id}</Label>
					</div>
					<div className='flex mt-2 items-center justify-between'>
						<p className='font-medium'>Query Created Date & Time</p>
						<Label>{new Date(query?.createdAt).toLocaleString()}</Label>
					</div>
					<div className='flex mt-2 items-center justify-between'>
						<p className='font-medium'>Query Last Responded Date & Time</p>
						<Label>{new Date(query?.updatedAt).toLocaleString()}</Label>
					</div>
					<div className='flex mt-2 items-center justify-between'>
						<p className='font-medium'>Query Status</p>
						<Label>
							<Badge className={`justify-center items-center py-1 px-3 text-white`}>{query?.Status}</Badge>
						</Label>
					</div>
				</div>
				<Separator/>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<div className='font-medium'>Query Details</div>
                        {
                            query?.QueryDetails && Object.keys(query?.QueryDetails).length === 0? (
                                <p className='text-gray-500'>No Query Details Available</p>
                            ) : (
                                <ul className='grid gap-3'>
                                    {
                                        Object.entries(query?.QueryDetails).map(([key, value]) => (
                                            <li key={key} className='flex items-center justify-between'>
                                                <span>{capitalizeFirstLetterOfEachWord(key)}:</span>
                                                <span>{formatValue(key, value)}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                        }
						{/* <ul className='grid gap-3'>
							{
								Object.entries(query.QueryDetails).map(([key, value]) => (
									<li key={key} className='flex items-center justify-between'>
										<span>{capitalizeFirstLetterOfEachWord(key)}:</span>
										<span>{formatValue(key, value)}</span>
									</li>
								))
							}
						</ul> */}
					</div>
				</div>
				<Separator/>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<ul className='grid gap-0.5'>
                            {
                                query?.QueryMessage && <li className='flex items-center justify-between'>
                                    <div className='font-medium'>Query Message</div>
                                    <span>{query?.QueryMessage}</span>
                                </li>
                            }
							
						</ul>
					</div>
				</div>
				<Separator/>

				<div className='flex flex-col space-y-3 justify-center w-full items-center'>
					<Select onValueChange={(value)=>{
						setFormData({...formData, status: value});
					}} value={formData.status}>
						<SelectTrigger className="w-full border border-gray-300 rounded-md">
							<SelectValue placeholder={"Select an option"} />
						</SelectTrigger>
						<SelectContent>
							{[
								{id:'Pending', label:'Pending'},
								{id:'Responded', label:'Responded'},
							].map((option) => (
									<SelectItem key={option.id} value={option.id}>
										{option.label}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
					<div className=' w-full justify-start items-start flex flex-col space-y-2'>
						<Label>Subject</Label>
						<Input
                            value = {formData.Subject}
							onChange = {(e) => setFormData({...formData, Subject: e.target.value})}
                            type="text"
                            label="Subject"
                            placeholder="Enter subject"
						/>
					</div>
					<div className=' w-full justify-start items-start flex flex-col space-y-2'>
						<Label>Subject</Label>
						<Textarea
							value = {formData?.resolvedMessage}
							type="text"
							row = "8"
							label="Resolve Message"
							placeholder="Enter resolve message"
							className = {"border border-gray-900"}
							onChange={(e) => setFormData({...formData,resolvedMessage:e.target.value})}
						/>
					</div>
					<Button onClick={handleSubmitStatus} className="btn btn-primary mt-2 w-full">Send Resolve Email</Button>
					{/* <CommonForm formControls={[
						{
							label:"Status",
							name:'status',
							componentType:'select',
							options:[
								{id:'Pending', label:'Pending'},
								{id:'Responded', label:'Responded'},
								{id:'Closed',label:"Closed"},
							]
						},
					]}
						formData={formData}
						setFormData={setFormData}
						buttonText={"Update Query Status"}
						handleSubmit={handleSubmitStatus}
						isBtnValid={true}
					/> */}
				</div>
			</div>
		</DialogContent>
	)
}

// Custom formatting for certain values (like dates)
const formatValue = (key, value) => {
    if (key.toLowerCase().includes("date")) {
        return new Date(value).toLocaleString(); // Format date fields
    }
    return value; // For other fields, return the value as it is
};
export default AdminContactQueryViewPage;
