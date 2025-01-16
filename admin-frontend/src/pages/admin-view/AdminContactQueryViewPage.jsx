import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import { fetchAllQuery } from '@/store/admin/query-slice';
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

    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { ContactQuery } = useSelector(state => state.contactQuery);

    useEffect(() => {
        dispatch(fetchAllQuery());
    }, [dispatch]);

    const handleFetchContactQueryDetails = async (queryId) => {
        // await dispatch(adminGetContactQueryById(queryId));
    };

    useEffect(() => {
        if (ContactQuery) {
            setOpenDetailsDialogue(true);
        }
    }, [ContactQuery]);
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

    return (
        <Card className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-full mx-auto">
            <CardHeader>
                <CardTitle className="text-center">Contact Queries</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Sorting and Filter Controls */}
                <div className="mb-4 text-center space-x-4">
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
                                        <Button onClick={() => handleFetchContactQueryDetails(query?._id)} className="btn btn-primary text-xs sm:text-sm">
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
                                        onClick={() => handleFetchContactQueryDetails(query?._id)}
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
                dispatch(resetContactQueryDetails());
            }}>
                <div>{/* Replace with your Contact Query Detail View component */}</div>
            </Dialog>
        </Card>
    );
};

// Custom formatting for certain values (like dates)
const formatValue = (key, value) => {
    if (key.toLowerCase().includes("date")) {
        return new Date(value).toLocaleString(); // Format date fields
    }
    return value; // For other fields, return the value as it is
};
export default AdminContactQueryViewPage;
