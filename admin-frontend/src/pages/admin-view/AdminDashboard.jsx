import { fetchAllCustomers, fetchAllOrdersCount, fetchAllProductsCount, fetchMaxDeliveredOrders, getCustomerGraphData, getOrderDeliveredGraphData, getOrderGraphData } from "@/store/admin/status-slice";
import { BoxIcon, DollarSign, IndianRupee, PackageCheck, ShoppingBasket, User } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { hexToRgba } from "@/config";
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';


import xl_icon from '../../assets/xl_icon.png';
import pdf_icon from '../../assets/pdf_icon.png';
import csv_icon from '../../assets/csv_icon.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Header = () => {
    const navigation = useNavigate();
    return (
        <div className="w-full bg-white p-5 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-gray-700">On-U Dashboard</h1>
        <div className="flex items-center space-x-4">
            <button className="text-gray-700">Notifications</button>
            <button onClick={() => navigation('/admin/profile')} className="text-gray-700">Profile</button>
        </div>
        </div>
    );
};

const StatsCard = ({ title, value, icon, onChange ,isActive}) => {
    return (
        <div
        onClick={(e) => {
            if (onChange) {
            onChange(title, value);
            }
        }}
        className={`${isActive ? "bg-gray-200":"bg-white"} p-6 cursor-pointer rounded-lg gap-8 shadow-md flex items-center justify-between w-full sm:w-96 md:w-80 mb-4`}
        >
        <div className="hover:scale-110 transition-transform duration-300">
            <h3 className="text-gray-500 text-base">{title}</h3>
            <h2 className="text-3xl font-bold">{value}</h2>
        </div>
        <div className="bg-gray-200 p-4 rounded-full">
            {icon}
        </div>
        </div>
    );
};

const CustomerBarChart = ({ data, filter, title ,dateStart,dateEnd}) => {
    console.log("Data: ",data);
    if (!data || data.length <= 0) return null;
    
    const labels = filter === 'Monthly' ? data.map(item => item.date) : data.map(item => item.date);
    const counts = data.map(item => item.count);

    const chartData = {
        labels: labels,
        datasets: [{
            label: filter === 'Monthly' ? `${title} Count (Monthly)` : `${title} Count (Yearly)`,
            data: counts,
            backgroundColor: hexToRgba('#E4080A', 0.5),
            borderColor: hexToRgba('#E4080A', 1),
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${title}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
    };

    const convertToCSV = () => {
        const header = ['Date', 'Count'];
        const rows = data.map(item => [item.date, item.count]);

        return [header, ...rows].map(row => row.join(',')).join('\n');
    };

    const downloadCSV = () => {
        const csvContent = convertToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `${title}-${dateStart}-${dateEnd}_Growth_Data.csv`);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
    
        // Set title
        doc.setFontSize(18);
        doc.text(`${title} - ${dateStart} - ${dateEnd} Growth Data`, 20, 20);
    
        // Set font size for other text
        doc.setFontSize(12);
    
        // Add header for the table
        doc.text('Date', 20, 30); // Date header at position (20, 30)
        doc.text('Count', 100, 30); // Count header at position (100, 30)
    
        // Add data rows with right alignment for count
        data.forEach((item, index) => {
            const yPos = 40 + (index * 10);
            doc.text(item.date, 20, yPos); // Left-align date
            doc.text(item.count.toString(), 100, yPos, { align: 'right' }); // Right-align count
        });
    
        // Save the PDF with a dynamic filename
        doc.save(`${title}-${dateStart}-${dateEnd}_Growth_Data.pdf`);
    };
  

    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `${title}-${dateStart}-${dateEnd}} Growth Data`);
        XLSX.writeFile(wb, `${title}-${dateStart}-${dateEnd}_Growth_Data.xlsx`);
    };

    return (
        <div>
            <div className="flex justify-end gap-5 items-center mb-4">
                <button onClick={downloadCSV} className="w-fit h-10 shadow-md">
                <img
                    src={csv_icon}
                    alt="csv icon"
                    className="w-full h-full object-contain"
                />
                <span className="text-[10px] font-bold">Download for (CSV)</span>
                </button>
                <button onClick={downloadPDF} className="w-fit h-10 shadow-md">
                <img
                    src={pdf_icon}
                    alt="pdf icon"
                    className="w-full h-full object-contain"
                />
                <span className="text-[10px] font-bold">Download for (PDF)</span>
                </button>
                <button onClick={downloadExcel} className="w-fit h-10 shadow-md">
                <img
                    src={xl_icon}
                    alt="xl icon"
                    className="w-full h-full object-contain"
                />
                <span className="text-[10px] font-bold">Download for (Excel)</span>
                </button>
            </div>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};
let newStartDate, newEndDate;
let startingGraphData = false;
const getDateRange = (preset) => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    switch (preset) {
        case 'TODAY':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
        case 'YESTERDAY':
        start = new Date(today);
        start.setDate(today.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(today);
        end.setDate(today.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
        case 'THIS MONTH':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
        case 'LAST 7 DAYS':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
    }

    return { startDate: start, endDate: end };
};
const AdminDashboard = ({ user }) => {
    const{startDate:defaulStart, endDate:defaultEnd} = getDateRange("THIS MONTH");
    const { isLoading, TotalCustomers, TotalProducts, MaxDeliveredOrders, CustomerGraphData, OrderDeliverData, OrdersGraphData, TotalOrders } = useSelector(state => state.stats);
    const dispatch = useDispatch();
    const [stats, setStats] = useState({ title: "Total Customers", value: TotalCustomers });
    const [currentGraphData, setGraphData] = useState({ title: "Total Orders", value: [] });
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [filterDateRange, setFilterRange] = useState([]);
    const [dateLabel, setDateLabel] = useState('THIS MONTH');

    const handleFilterChange = (preset, graph) => {
        const { startDate, endDate } = getDateRange(preset);
        setStartDate(new Date(startDate).toISOString().split("T")[0]);
        setEndDate(new Date(endDate).toISOString().split("T")[0]);
    
        // Adjust the filter logic to ensure proper date comparison
        const newData = graph.filter(item => {
            const dataDate = new Date(item.date);
            return dataDate >= new Date(startDate) && dataDate <= new Date(endDate);
        }) || [];
    
        setDateLabel(preset);
        setFilterRange(newData);
    };

    const handleSetCustomStartDate = (graph) => {
        // Ensure both dates are in Date format and have the correct time set
        const start = new Date(newStartDate);
        start.setHours(0, 0, 0, 0); // Midnight start time
        
        const end = new Date(newEndDate);
        end.setHours(23, 59, 59, 999); // Just before midnight of the next day
        
        const newData = graph.filter(item => {
            const dataDate = new Date(item.date);
            dataDate.setHours(0, 0, 0, 0); // Set item date to midnight for proper comparison
            
            return dataDate >= start && dataDate <= end;
        });
    
        setDateLabel("CUSTOM");
        setFilterRange(newData);
    };

    const randomRevenue = Math.floor(Math.random() * 100000) + 10000;

    const convertAmount = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    
    useEffect(()=>{
        const s = new Date(defaulStart).toISOString().split("T")[0]
        const e = new Date(defaultEnd).toISOString().split("T")[0]
        console.log("Fetching all customers: ",s,e);
        dispatch(getCustomerGraphData({ s, e, period: 'monthly' }));
        dispatch(getOrderDeliveredGraphData({ defaulStart, defaultEnd, period: 'monthly' }));
        dispatch(getOrderGraphData({ defaulStart, defaultEnd, period: 'monthly' }));
    },[])

    useEffect(() => {
        // Fetch all necessary data whenever startDate or endDate changes
        dispatch(fetchAllCustomers());  // Pass date range to fetch customer data
        dispatch(fetchAllProductsCount());
        dispatch(fetchAllOrdersCount());
        dispatch(fetchMaxDeliveredOrders());
        // console.log("Fetching all customers: ",startDate,endDate);
        dispatch(getCustomerGraphData({ startDate, endDate, period: 'monthly' }));
        dispatch(getOrderDeliveredGraphData({ startDate, endDate, period: 'monthly' }));
        dispatch(getOrderGraphData({ startDate, endDate, period: 'monthly' }));
        if(!startingGraphData){
            startingGraphData = CustomerGraphData;
        }
    }, [dispatch, startDate, endDate]);
    useEffect(()=>{
        if(CustomerGraphData && CustomerGraphData.length > 0){
        if(!startingGraphData){
            startingGraphData = true;
            handleFilterChange("THIS MONTH",CustomerGraphData)
        }
        }
    },[CustomerGraphData,startingGraphData])
    console.log("CustomerGraphData Data: ", CustomerGraphData);
    return (
        <>
        {isLoading ? <LoadingSpinner/>:<Fragment>
            <div className="flex flex-col h-full w-full">
                <div className="flex flex-wrap justify-start items-center h-fit min-w-fit p-5">
                <Header />
                <div className="flex flex-wrap gap-3 justify-start items-center mt-8 p-5 rounded-lg">
                    <StatsCard
                    isActive={currentGraphData.title === "Total Orders"}
                    onChange={(title, value) => {
                        setStats({ title, value });
                        setGraphData({ title, value: OrdersGraphData });
                        handleFilterChange("THIS MONTH",OrdersGraphData)
                    }}
                    title="Total Orders"
                    value={TotalOrders}
                    
                    icon={<ShoppingBasket className="text-3xl text-blue-600" />}
                    />
                    <StatsCard
                    isActive={currentGraphData.title === "Total Customers"}
                    onChange={(title, value) => {
                        setStats({ title, value });
                        setGraphData({ title, value: CustomerGraphData });
                        handleFilterChange("THIS MONTH",CustomerGraphData)
                    }}
                    title="Total Customers"
                    value={TotalCustomers}
                    icon={<User className="text-3xl text-yellow-600" />}
                    />
                    <StatsCard
                    isActive={currentGraphData.title === "Max Delivered Orders"}
                    onChange={(title, value) => {
                        setStats({ title, value });
                        setGraphData({ title, value: OrderDeliverData });
                        handleFilterChange("THIS MONTH",OrderDeliverData)
                    }}
                    title="Max Delivered Orders"
                    value={MaxDeliveredOrders}
                    icon={<PackageCheck className="text-3xl text-pink-500" />}
                    />
                    <StatsCard
                    isActive={currentGraphData.title === "Total Products"}
                    onChange={(title, value) => {
                        setStats({ title, value });
                    }}
                    title="Total Products"
                    value={TotalProducts}
                    icon={<BoxIcon className="text-3xl text-orange-600" />}
                    />
                    <StatsCard
                    title="Total Revenue"
                    value={`₹${convertAmount(randomRevenue)}`}
                    icon={<IndianRupee className="text-3xl text-green-600" />}
                    />
                    
                </div>
                </div>

                <div className="flex-1 p-10">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">{currentGraphData?.title} Growth Over Time</h2>
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium">Select Date Range</span>
                    <select
                        value={dateLabel}
                        onChange={(e) => handleFilterChange(e.target.value, currentGraphData?.value || [])}
                        className="px-4 py-2 border rounded-md"
                    >
                        <option value="TODAY">Today</option>
                        <option value="YESTERDAY">Yesterday</option>
                        <option value="LAST 7 DAYS">Last 7 Days</option>
                        <option value="THIS MONTH">This Month</option>
                        <option value="CUSTOM">Custom</option>
                    </select>
                    </div>
                    <div className="text-sm text-gray-600">
                    <p>Start Date: {startDate}</p>
                    <p>End Date: {endDate}</p>
                    </div>
                    <div className="mb-4">
                    <div className="flex gap-3">
                        <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value)
                            newStartDate = e.target.value;
                            handleSetCustomStartDate(currentGraphData?.value || [])
                        }}
                        className="px-4 py-2 border rounded-md"
                        />
                        <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value)
                            newEndDate = e.target.value;
                            handleSetCustomStartDate(currentGraphData?.value || [])
                        }}
                        min={startDate}
                        className="px-4 py-2 border rounded-md"
                        />
                    </div>
                    </div>
                    <div className="h-fit mx-auto">
                    <CustomerBarChart data={filterDateRange.length > 0 ? filterDateRange : CustomerGraphData} filter={'Monthly'} title={currentGraphData.title} dateStart={startDate} dateEnd={endDate}/>

                    </div>
                </div>
                </div>
            </div>
            </Fragment>}
        </>
    );
};

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 bg-slate-700 bg-opacity-100 flex justify-center items-center z-50">
            <div className="flex flex-col justify-center items-center">
                <div className="border-t-4 border-b-4 border-white w-16 h-16 rounded-full animate-spin">
                    
                </div>
            </div>
        </div>
    )
}


export default AdminDashboard;
