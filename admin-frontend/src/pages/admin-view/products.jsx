import AdminProductTile from '@/components/admin-view/product-tile';
import ProductPreview from '@/components/admin-view/ProductPreview';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addProductsFromElement } from '@/config';
import { addNewProduct, delProducts, editProducts, fetchAllProducts } from '@/store/admin/product-slice';
import { fetchAllOptions } from '@/store/common-slice';
import {  ChevronLeft, ChevronRight, X } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingView from './LoadingView';
import { useSettingsContext } from '@/Context/SettingsContext';
import { FaProductHunt } from 'react-icons/fa';
import { Dialog } from '@/components/ui/dialog';

const maxAmountPerPage = 50;

const AddProductOverlay = ({ addProductsFromElement, currentEditingId, formData, setFormData, onSubmit, handleOpenCloseWindow }) => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [genders, setGenders] = useState([]);
    const dispatch = useDispatch();
    const { AllOptions } = useSelector(state => state.common);
    const [isLoading, setIsLoading] = useState(false);
    const [updatedProductElements, setUpdatedProductElements] = useState(null);

    // Fetching data function
    const fetchAllFiltersCategory = async () => {
        setIsLoading(true);
        try {
            dispatch(fetchAllOptions());
        } catch (error) {
            console.error("Error Fetching All Filters Category: ", error);
        } finally {
            setIsLoading(false); // Set loading state to false when request is complete
        }
    };

    const filterCategory = () => {
        const updatedProductElements = addProductsFromElement.map(item => {
            if (item.label === 'Category') {
                return { ...item, options: categories?.map(c => ({ id: c.value.toLowerCase(), label: c.value })) };
            }
            if (item.name === 'gender') {
                return { ...item, options: genders?.map(c => ({ id: c.value.toLowerCase(), label: c.value })) };
            }
            if (item.name === 'subCategory') {
                return { ...item, options: subcategories?.map(c => ({ id: c.value.toLowerCase(), label: c.value })) };
            }
            return item; // Return unchanged item
        });
        setUpdatedProductElements(updatedProductElements);
    };

    useEffect(() => {
        if (AllOptions) {
            setAllOptions();
        }
    }, [AllOptions]);

    useEffect(() => {
        filterCategory();
    }, [categories, subcategories, colors, sizes, genders]);

    const setAllOptions = () => {
        if (AllOptions && AllOptions.length > 0) {
            AllOptions.map(item => {
                switch (item.type) {
                case 'category':
                    setCategories(AllOptions.filter(item => item.type === 'category'));
                    break;
                case 'subcategory':
                    setSubcategories(AllOptions.filter(item => item.type === "subcategory"));
                    break;
                case 'gender':
                    setGenders(AllOptions.filter(item => item.type === "gender"));
                    break;
                default:
                    break;
                }
            });
        }
    };

    useEffect(() => {
        fetchAllFiltersCategory();
    }, [dispatch]);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg m-10 relative max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Add New Product</h2>
                <div className="flex justify-end mt-4">
                    <Button onClick={handleOpenCloseWindow} className="text-white p-2 top-1 absolute right-2 rounded-full mr-2">
                        <X className="w-6 h-6" />
                    </Button>
                </div>
                {
                !isLoading && updatedProductElements &&
                    <CommonForm
                        formControls={updatedProductElements}
                        buttonText={!currentEditingId ? "Add" : "Edit"}
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={onSubmit}
                        isBtnValid={true}
                    />
                }
            </div>
        </div>
    );
};

const initialFormData = {
    productId: '',
    title: '',
    description: '',
    shortTitle: '',
    salePrice: '',
    bulletPoints: [],
    size: [],
    price: '',
    material: '',
    style_no: '',
    gender: '',
    category: '',
    subCategory: '',
};

const AdminProducts = () => {
	const{checkAndCreateToast} = useSettingsContext();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [genders, setGenders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const specialCategory = addProductsFromElement.find(e => e.name === "specialCategory").options.filter(s => s.id !== 'none');
    const [filters, setFilters] = useState({
        category: "",
        subCategory: "",
        specialCategory:'',
        gender: "",
        color: "",
        size: "",
        sort: "" // Add sort filter here
    });
    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
        console.log("change Page Number.");
        dispatch(fetchAllProducts({pageNo:currentPage}));
    };

    const [currentPreviewProductId, setCurrentPreviewProduct] = useState(null);
    const [showPopUp, setShowPopUp] = useState(false);
    const [openCreateProduct, setOpenCreateProduct] = useState(false);
    const [currentEditingId, setCurrentEditingId] = useState(null);
    
    const togglePopUp = () => {
        setShowPopUp(!showPopUp);
    };

    const [formData, setFormData] = useState(initialFormData);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const { allProducts,productsPagination,totalProducts, isLoading: productLoading } = useSelector(state => state.adminProducts);
    const { AllOptions } = useSelector(state => state.common);
    const dispatch = useDispatch();

    const fetchAllFiltersCategory = async () => {
        setIsLoading(true);
        try {
            dispatch(fetchAllOptions());
        } catch (error) {
            console.error("Error Fetching All Filters Category: ", error);
			checkAndCreateToast('error', 'Failed to fetch filters category');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProducts = async (productId) => {
        try {
        const data = await dispatch(delProducts(productId));
        if (data?.payload?.Success) {
            checkAndCreateToast("success","Product Deleted Success")
            dispatch(fetchAllProducts({pageNo:currentPage}));
        }
        } catch (error) {
            console.error(`Failed to delete ${productId} `, error);
            checkAndCreateToast("error"`Failed to Delete Product id: ${productId}, Internal Error`)
        }
    };
    const updateEditedItems = async (productId,editedData) => {
        try {
            if(!productId){
                checkAndCreateToast("error","No Product Id")
                return;
            }
            console.log(`Updated ${productId}`, editedData)
            // return;
            const data = await dispatch(editProducts({ id: productId, formData: { ...editedData} }));
            if (data?.payload?.Success) {
                setOpenCreateProduct(false);
                setUploadedImageUrls([]);
                setFormData(initialFormData);
                setCurrentEditingId(null);
                dispatch(fetchAllProducts({pageNo:currentPage}));
                checkAndCreateToast("success","Product Updated Success")
            }
        } catch (error) {
            console.error(`Failed to Update Product: ${error.message}`);
            checkAndCreateToast("error",`Failed to Update Product: ${error.message}`)
        }
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!currentEditingId) {
            try {
                console.log("Form Validation: ",isFormValid());
                const data = await dispatch(addNewProduct({ ...formData }));
                if (!data?.payload?.Success) {
                    throw new Error(`Missing Fields ${data?.payload?.reasons}`);
                }
                setOpenCreateProduct(false);
                setUploadedImageUrls([]);
                setFormData(initialFormData);
                dispatch(fetchAllProducts({pageNo:currentPage}));
                checkAndCreateToast("success","Product Added Success")
            } catch (error) {
                console.error(`Failed to Add New Product: ${error.message}`);
                checkAndCreateToast("error",error.message)
            }
        
        } 
    };
    function isFormValid() {
        console.log("Form Data",formData);
        const reasons = [];
        if(!formData.productId){
            reasons.push("Product ID is required.");
            return;
        }
        // Title check
        if (!formData.title) {
            reasons.push("Title is required.");
        }
        // Title check
        if (!formData.shortTitle) {
            reasons.push("Short Title is required.");
        }
    
        // Description check
        if (!formData.description) {
            reasons.push("Description is required.");
        }
    
        // Price check
        if (!formData.price) {
            reasons.push("Price is required.");
        } else if (isNaN(formData.price) || formData.price <= 0) {
            reasons.push("Price must be a positive number.");
        }
        // Size check
        if (!formData.size || formData.size.length === 0) {
            reasons.push("At least one size is required.");
        }
    
        // Material check
        if (!formData.material) {
            reasons.push("Material is required.");
        }
    
        // Gender check
        if (!formData.gender) {
            reasons.push("Gender is required.");
        }
    
        // Subcategory check
        if (!formData.subCategory) {
            reasons.push("Subcategory is required.");
        }
    
        // Category check
        if (!formData.category) {
            reasons.push("Category is required.");
        }
    
        // Quantity check
    
        // Bullet points check
        if (!formData.bulletPoints || formData.bulletPoints.length === 0) {
            reasons.push("At least one bullet point is required.");
        }
    
        // If there are no reasons, the form is valid
    
        return {
            isValid:reasons.length === 0,
            reasons
        }
    }

    useEffect(() => {
        fetchAllFiltersCategory();
    }, [dispatch]);

    const setAllOptions = () => {
        if (AllOptions && AllOptions.length > 0) {
            AllOptions.map(item => {
                switch (item.type) {
                case 'category':
                    setCategories(AllOptions.filter(item => item.type === 'category'));
                    break;
                case 'subcategory':
                    setSubcategories(AllOptions.filter(item => item.type === "subcategory"));
                    break;
                case 'color':
                    setColors(AllOptions.filter(item => item.type === "color"));
                    break;
                case 'size':
                    setSizes(AllOptions.filter(item => item.type === "size"));
                    break;
                case 'gender':
                    setGenders(AllOptions.filter(item => item.type === "gender"));
                    break;
                }
            });
        }
    };
    useEffect(()=>{
        if(AllOptions){
            setAllOptions();
        }
    },[AllOptions]);

    useEffect(() => {
        dispatch(fetchAllProducts({pageNo:currentPage}));
    }, [dispatch]);

    const handleFilterChange = (name,value) => {
        // const { name, value } = e;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value === 'default' ? '' : value,
        }));
    };

    const filteredProducts = productsPagination.filter((product) => {
		if (!filters.category && !filters.subCategory && !filters.gender && !filters.color && !filters.size && !filters.specialCategory) return true;

		const categoryMatch = filters.category 
			? product.category && product.category.toLowerCase() === filters.category.toLowerCase() 
			: true;
		const specialCategoryMatch = filters.specialCategory 
			? product.specialCategory && product.specialCategory.toLowerCase() === filters.specialCategory.toLowerCase() 
			: true;
		const subCategoryMatch = filters.subCategory 
			? product.subCategory && product.subCategory.toLowerCase() === filters.subCategory.toLowerCase() 
			: true;
		const genderMatch = filters.gender 
			? product.gender && product.gender.toLowerCase() === filters.gender.toLowerCase() 
			: true;

		return categoryMatch && subCategoryMatch && genderMatch && specialCategoryMatch;
	});

    const sortedProducts = filteredProducts.sort((a, b) => {
        // Sorting by Date
        if (filters.sort === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (filters.sort === 'oldest') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    
        // Sorting by Price - Low to High
        else if (filters.sort === 'priceLowToHigh') {
            const priceA = a.salePrice || a.price; // Fallback to price if salePrice is not available
            const priceB = b.salePrice || b.price;
            return priceA - priceB;
        }
    
        // Sorting by Price - High to Low
        else if (filters.sort === 'priceHighToLow') {
            const priceA = a.salePrice || a.price; // Fallback to price if salePrice is not available
            const priceB = b.salePrice || b.price;
            return priceB - priceA;
        }
    
        return 0;  // No sorting by default
    });

    return (
        
        <Fragment>
           {
				productLoading || isLoading ? (
					<LoadingView isLoading={productLoading || isLoading} />
				) : (
					<div>
						<div className="w-full mb-4 sm:w-auto flex justify-center justify-self-end sm:px-2">
							<Button onClick={() => setOpenCreateProduct(true)} className="sm:w-full md:w-auto">
								Add Product <FaProductHunt />
							</Button>
						</div>
						<div className="mb-5 px-6">
							<div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
								
								{/* Category Dropdown */}
								<div className="flex items-center space-x-3 mb-3 w-full sm:px-2">
									<Label className="text-sm font-semibold whitespace-nowrap">Category</Label>
									<Select
										id="categoryFilter"
										name="category"
										value={filters.category}
										onValueChange={(e) => handleFilterChange("category", e)}
										className="border border-gray-300 p-2 rounded w-full"
									>
										<SelectTrigger className="w-full border border-gray-300 rounded-md">
										<SelectValue placeholder={filters.category || "All Category"} />
										</SelectTrigger>
										<SelectContent>
										<SelectItem value="default">Default</SelectItem>
										{categories.map((category, i) => (
											<SelectItem key={i} value={category.value}>{category.value}</SelectItem>
										))}
										</SelectContent>
									</Select>
								</div>

								{/* Special Category Dropdown */}
								<div className="flex items-center space-x-3 mb-3 w-full sm:px-2">
								<Label className="text-sm font-semibold whitespace-nowrap">Special Category</Label>
								<Select
									id="specialCategory"
									name="specialCategory"
									value={filters.specialCategory}
									onValueChange={(e) => handleFilterChange("specialCategory", e)}
									className="border border-gray-300 p-2 rounded w-full"
								>
									<SelectTrigger className="w-full border border-gray-300 rounded-md">
									<SelectValue placeholder={filters.specialCategory || "All Special Category"} />
									</SelectTrigger>
									<SelectContent>
									<SelectItem value="default">Default</SelectItem>
									{specialCategory.map((special, i) => (
										<SelectItem key={i} value={special.id}>{special.label}</SelectItem>
									))}
									</SelectContent>
								</Select>
								</div>

								{/* Sub-Category Dropdown */}
								<div className="flex items-center space-x-3 mb-3 w-full sm:px-2">
								<Label className="text-sm font-semibold whitespace-nowrap">Sub-Category</Label>
								<Select
									id="subCategoryFilter"
									name="subCategory"
									value={filters.subCategory}
									onValueChange={(e) => handleFilterChange("subCategory", e)}
									className="border border-gray-300 p-2 rounded w-full"
								>
									<SelectTrigger className="w-full border border-gray-300 rounded-md">
									<SelectValue placeholder={filters.subCategory || "All Sub-Category"} />
									</SelectTrigger>
									<SelectContent>
									<SelectItem value="default">Default</SelectItem>
									{subcategories.map((subCategory, i) => (
										<SelectItem key={i} value={subCategory.value}>{subCategory.value}</SelectItem>
									))}
									</SelectContent>
								</Select>
								</div>

								{/* Sorting Dropdown */}
								<div className="flex items-center space-x-3 mb-3 w-full sm:px-2">
								<Label className="text-sm font-semibold whitespace-nowrap">Sort</Label>
								<Select
									id="sortFilter"
									name="sort"
									value={filters.sort}
									onValueChange={(e) => handleFilterChange("sort", e)}
									className="border border-gray-300 p-2 rounded w-full"
								>
									<SelectTrigger className="w-full border border-gray-300 rounded-md">
									<SelectValue placeholder={filters.sort || "Default"} />
									</SelectTrigger>
									<SelectContent>
									<SelectItem value="default">Default</SelectItem>
									<SelectItem value="newest">Newest First</SelectItem>
									<SelectItem value="oldest">Oldest First</SelectItem>
									<SelectItem value="priceLowToHigh">Price Low to High</SelectItem>
									<SelectItem value="priceHighToLow">Price High to Low</SelectItem>
									</SelectContent>
								</Select>
								</div>

								{/* Add New Product Button */}

							</div>
							
						</div>



						{/* Product List */}
						<PaginatedProductList
							sortedProducts={sortedProducts}
							totalProducts={totalProducts}
							maxAmountPerPage={maxAmountPerPage}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							setCurrentPageNo={setCurrentPageNo}
							togglePopUp={togglePopUp}
							setCurrentPreviewProduct={setCurrentPreviewProduct}
						/>
					</div>
				)
			}
			<Dialog open = {currentPreviewProductId !== null && showPopUp} onOpenChange={()=>{
				setShowPopUp(false);
			}}>
				<ProductPreview
					genders={genders}
					categories = {categories}
					subcategories = {subcategories}
					setFormData={setFormData}
					UpdateEditedData={(productId,e)=>{
						updateEditedItems(productId,e);
					}}
					productDataId={currentPreviewProductId}
					showPopUp={showPopUp}
					togglePopUp={togglePopUp}
					OnEditing={(editingId) => {
						setOpenCreateProduct(true);
						setUploadedImageUrls([]);
						setFormData(initialFormData);
						setCurrentEditingId(editingId);
						setCurrentPreviewProduct(null);
					}}
					OnDelete={handleDeleteProducts}
				/>
			</Dialog>

			{/* {currentPreviewProductId && (
			)} */}
			{openCreateProduct && (
				<AddProductOverlay
					addProductsFromElement={addProductsFromElement}
					currentEditingId={currentEditingId}
					formData={formData}
					setFormData={setFormData}
					onSubmit={onSubmit}
					handleOpenCloseWindow={() => setOpenCreateProduct(false)}
				/>
			)}  
        </Fragment>
    );
};
const PaginatedProductList = ({
    sortedProducts,
    totalProducts,
    maxAmountPerPage,
    currentPage,
    setCurrentPage,
    setCurrentPageNo,
    togglePopUp,
    setCurrentPreviewProduct
  }) => {
	// Calculate the total number of pages
	const totalPages = Math.ceil(totalProducts / maxAmountPerPage);

	// Slice the products for the current page
	const startIndex = (currentPage - 1) * maxAmountPerPage;
	const endIndex = startIndex + maxAmountPerPage;
	const currentPageProducts = sortedProducts.slice(startIndex, endIndex);

	return (
		<div className="min-h-screen flex flex-col justify-between items-start px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
			<h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4">
				Total Products: {totalProducts}
			</h1>
			<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 px-2 py-3">
				{currentPageProducts.length > 0 ? (
					currentPageProducts.map((product, i) => (
						<AdminProductTile
							key={`products_${i}`}
							togglePopUp={togglePopUp}
							setOpenProductPreview={setCurrentPreviewProduct}
							product={product}
						/>
					))
				) : (
					<p className="col-span-full text-center text-gray-500">No Products found for the selected filter.</p>
				)}
			</ul>

			<div className="font1 border-t-[0.5px] border-gray-700 py-4 relative flex flex-col sm:flex-row items-center w-full justify-center space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
			{/* Pagination Info */}
			<span className="text-sm text-gray-500 sm:absolute sm:left-0 sm:text-base">
				Page {currentPage} of {totalPages}
			</span>

			{/* Previous Button */}
			{currentPage === 1 ? (
				""
				) : (
					<button
						className="mb-2 sm:mb-0 sm:mr-5 text-lg flex items-center border-[1px] border-gray-500 py-2 px-5 rounded-[4px] hover:border-black"
						onClick={() => {
						setCurrentPage(currentPage - 1);
						setCurrentPageNo(currentPage - 1);
						}}
					>
						<ChevronLeft />
						<h1>Previous</h1>
					</button>
				)}

				{/* Next Button */}
				{currentPage === totalPages ? (
				""
				) : (
					<button
						className="mb-2 sm:mb-0 sm:ml-5 text-lg flex items-center border-[1px] border-gray-500 py-2 px-5 rounded-[4px] hover:border-black"
						onClick={() => {
						setCurrentPage(currentPage + 1);
						setCurrentPageNo(currentPage + 1);
						}}
					>
						<h1>Next</h1>
						<ChevronRight />
					</button>
				)}
			</div>
		</div>

	);
};

export default AdminProducts;
