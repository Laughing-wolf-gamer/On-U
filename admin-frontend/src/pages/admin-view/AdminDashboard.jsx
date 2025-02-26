import { fetchAllCustomers, fetchAllOrdersCount, fetchAllProductsCount, fetchMaxDeliveredOrders, fetchRecentOrders, fetchTopSellingProducts, getCustomerGraphData, getOrderDeliveredGraphData, getOrderGraphData, getWalletBalance } from "@/store/admin/status-slice";
import { BoxIcon, IndianRupee, PackageCheck, ShoppingBasket, User } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { hexToRgba } from "@/config";
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';


import xl_icon from '../../assets/xl_icon.png';
import pdf_icon from '../../assets/pdf_icon.png';
import csv_icon from '../../assets/csv_icon.png';
import { Label } from "@/components/ui/label";
import LoadingView from "./LoadingView";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Header = ({user}) => {
    const navigation = useNavigate();
    return (
        <div className="w-full bg-white p-6 flex justify-between items-center shadow-lg rounded-md">
			<h1 className="text-3xl font-semibold text-gray-800">On-U Dashboard</h1>
			<button onClick={() => navigation('/admin/profile')} className="flex justify-between items-center space-x-6">
				<img
					src={user?.profilePic}
					alt="User Profile"
                    className="w-12 h-12 rounded-full bg-gray-400 object-cover"
					style={{ filter: `drop-shadow(0 0 5px ${hexToRgba('#000', 0.2)})`,objectFit: "cover" }}
				/>
				<span
					
					className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-all duration-200"
				>
					Profile
				</span>
			</button>
		</div>

    );
};

const StatsCard = ({ title, value, icon, onChange, isActive }) => {
	return (
		<div
		onClick={(e) => {
			if (onChange) {
				onChange(title, value);
			}
		}}
		className={`${isActive ? "bg-gray-200" : "bg-white"} p-6 cursor-pointer rounded-lg gap-8 shadow-md flex items-center justify-between w-fit mb-4 transition-all duration-300`}
		>
			<div className="hover:scale-105 transition-transform duration-300">
				<h3 className="text-gray-500 text-sm sm:text-base">{title}</h3>
				<h2 className="text-2xl sm:text-3xl font-bold">{value}</h2>
			</div>
			<div className="bg-gray-200 p-4 rounded-full">
				{icon}
			</div>
		</div>
	);
};
const PageLinkCard = ({ title,pageLocation }) => {
	return (
		<Link to={pageLocation}
			className={`bg-gray-50 p-6 cursor-pointer rounded-lg gap-8 shadow-md flex items-center justify-between w-fit mb-4 transition-all duration-300`}
		>
			<div className="hover:scale-105 transition-transform duration-300">
				<h3 className="text-gray-500 text-sm sm:text-base">{title}</h3>
			</div>
		</Link>
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
    const { isLoading,walletBalance, TotalCustomers, TotalProducts,RecentOrders,TopSellingProducts, MaxDeliveredOrders, CustomerGraphData, OrderDeliverData, OrdersGraphData, TotalOrders } = useSelector(state => state.stats);
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
		dispatch(getWalletBalance());
        dispatch(fetchRecentOrders());
        dispatch(fetchTopSellingProducts());
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
    console.log("Top Selling Products Data: ", TopSellingProducts);
    return (
        <Fragment>
        {isLoading ? <LoadingView/>:<Fragment>
                <div className="flex flex-col h-full w-full">
					<div className="flex flex-wrap justify-start items-center h-fit min-w-fit p-5">
						<Header user={user} />
						<div className="flex flex-wrap gap-3 justify-start items-center mt-8 p-5 rounded-lg w-full">
							<StatsCard
								isActive={currentGraphData.title === "Total Orders"}
								onChange={(title, value) => {
								setStats({ title, value });
								setGraphData({ title, value: OrdersGraphData });
								handleFilterChange("THIS MONTH", OrdersGraphData);
								}}
								title="Total Orders"
								value={TotalOrders}
								icon={<ShoppingBasket className="text-3xl text-blue-600" />}
								className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5"
							/>
							<StatsCard
								isActive={currentGraphData.title === "Total Customers"}
								onChange={(title, value) => {
								setStats({ title, value });
								setGraphData({ title, value: CustomerGraphData });
								handleFilterChange("THIS MONTH", CustomerGraphData);
								}}
								title="Total Customers"
								value={TotalCustomers}
								icon={<User className="text-3xl text-yellow-600" />}
								className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5"
							/>
							<StatsCard
								isActive={currentGraphData.title === "Max Delivered Orders"}
								onChange={(title, value) => {
								setStats({ title, value });
								setGraphData({ title, value: OrderDeliverData });
								handleFilterChange("THIS MONTH", OrderDeliverData);
								}}
								title="Max Delivered Orders"
								value={MaxDeliveredOrders}
								icon={<PackageCheck className="text-3xl text-pink-500" />}
								className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5"
							/>
							<StatsCard
								isActive={currentGraphData.title === "Total Products"}
								onChange={(title, value) => {
								setStats({ title, value });
								}}
								title="Total Products"
								value={TotalProducts}
								icon={<BoxIcon className="text-3xl text-orange-600" />}
								className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5"
							/>
							<StatsCard
								title="Shiprocket Wallet Balance"
								value={`₹${walletBalance}`}
								icon={<IndianRupee className="text-3xl text-green-600" />}
								className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5"
							/>
						</div>
					</div>

					<div className="flex-1 p-5 sm:p-8 md:p-10">
						<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
						{currentGraphData?.title} Growth Over Time
						</h2>
						<div className="bg-white p-5 rounded-lg shadow-md">
						<div className="flex justify-between items-center mb-4">
							<span className="text-base sm:text-lg font-medium">Select Date Range</span>
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
						<div className="text-sm text-gray-600 mb-4">
							<p>Start Date: {startDate}</p>
							<p>End Date: {endDate}</p>
						</div>
						<div className="mb-4">
							<div className="flex gap-3">
							<input
								type="date"
								value={startDate}
								onChange={(e) => {
									setStartDate(e.target.value);
									newStartDate = e.target.value;
									handleSetCustomStartDate(currentGraphData?.value || []);
								}}
								className="px-4 py-2 border rounded-md w-full sm:w-1/2"
							/>
							<input
								type="date"
								value={endDate}
								onChange={(e) => {
									setEndDate(e.target.value);
									newEndDate = e.target.value;
									handleSetCustomStartDate(currentGraphData?.value || []);
								}}
								min={startDate}
								className="px-4 py-2 border rounded-md w-full sm:w-1/2"
							/>
							</div>
						</div>
						<div className="h-fit mx-auto">
							<CustomerBarChart
								data={filterDateRange.length > 0 ? filterDateRange : CustomerGraphData}
								filter={'Monthly'}
								title={currentGraphData.title}
								dateStart={startDate}
								dateEnd={endDate}
							/>
						</div>
						</div>
					</div>
					</div>

                <TopSellingProductsTable products={TopSellingProducts} />
                <AllRecentOrders allOrders={RecentOrders}/>
            </Fragment>
            }
        </Fragment>
    );
};

const TopSellingProductsTable = ({products}) => {

    return (
        <div className="py-12 bg-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-8">Top Selling Products</h2>
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-6 py-3 text-left">Product ID</th>
                                <th className="px-6 py-3 text-left">Product Title</th>
                                <th className="px-6 py-3 text-left">Price</th>
                                <th className="px-6 py-3 text-left">Sale Price</th>
                                {/* <th className="px-6 py-3 text-left">Total Sold</th> */}
                                <th className="px-6 py-3 text-left">Stock</th>
                                <th className="px-6 py-3 text-left">Rating</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{product?._id}</td>
                                    <td className="px-6 py-4">{product?.title}</td>
                                    <td className="px-6 py-4">₹{product?.price}</td>
                                    <td className="px-6 py-4">₹{product?.salePrice}</td>
                                    {/* <td className="px-6 py-4">{product.totalSold}</td> */}
                                    <td className="px-6 py-4">{product.totalStock}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className="text-yellow-500">
                                                {"★".repeat(Math.floor(product?.averageRating))}
                                                {"☆".repeat(5 - Math.floor(product?.averageRating))}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* <button className="text-blue-500 hover:text-blue-700 mr-4">
                                            Edit
                                        </button> */}
                                        <button className="text-red-500 hover:text-red-700">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AllRecentOrders = ({allOrders}) => {
    // Sample data for recent orders
    /* const orders = [
        {
            id: 1,
            customer: 'John Doe',
            date: '2025-02-01',
            total: '$120.99',
            status: 'Shipped',
        },
        {
            id: 2,
            customer: 'Jane Smith',
            date: '2025-02-01',
            total: '$56.49',
            status: 'Processing',
        },
        {
            id: 3,
            customer: 'Mike Johnson',
            date: '2025-01-30',
            total: '$89.75',
            status: 'Delivered',
        },
        {
            id: 4,
            customer: 'Emily Davis',
            date: '2025-01-29',
            total: '$215.00',
            status: 'Shipped',
        },
    ]; */
  
    return (
        <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Recent Orders</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr className="border-b">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Total</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {allOrders && allOrders.length > 0 && allOrders.map((order,index) => (
                        <tr key={order._id || index} className="border-b hover:bg-gray-100">
                            <td className="py-3 px-4 text-sm font-medium text-gray-700">{order._id}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{order?.userId?.name}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{new Date(order?.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-sm font-semibold text-gray-800">₹{order?.TotalAmount}</td>
                            <td className="py-3 px-4 text-sm">
                            <Label
                                className={`px-3 py-1 rounded-full text-xs ${
                                order.status === 'Order Shipped'
                                    ? 'bg-green-100 text-green-700'
                                    : order.status === 'Processing'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                            >
                                {order.status}
                            </Label>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
    );
};



export default AdminDashboard;
