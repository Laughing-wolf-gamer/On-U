import AdminProductTile from '@/components/admin-view/product-tile';
import ProductPreview from '@/components/admin-view/ProductPreview';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addProductsFromElement } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { addNewProduct, delProducts, editProducts, fetchAllProducts } from '@/store/admin/product-slice';
import { fetchAllOptions } from '@/store/common-slice';
import {  X } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';



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
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const [currentPreviewProductId, setCurrentPreviewProduct] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const togglePopUp = () => {
    setShowPopUp(!showPopUp);
  };

  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const { products, isLoading: productLoading } = useSelector(state => state.adminProducts);
  const [currentEditingId, setCurrentEditingId] = useState(null);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { AllOptions } = useSelector(state => state.common);

  const fetchAllFiltersCategory = async () => {
    setIsLoading(true);
    try {
      dispatch(fetchAllOptions());
    } catch (error) {
      console.error("Error Fetching All Filters Category: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProducts = async (productId) => {
    try {
      const data = await dispatch(delProducts(productId));
      if (data?.payload?.Success) {
        toast({
          title: "Product Deleted Successfully",
          description: data?.payload?.message,
        });
        dispatch(fetchAllProducts());
      }
    } catch (error) {
      console.error(`Failed to delete ${productId} `, error);
    }
  };
  const updateEditedItems = async (productId,editedData) => {
    try {
      if(!productId){
        toast({title:"No Product Id",type:"error"});
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
        dispatch(fetchAllProducts());
        toast({
          title: "Product Updated Successfully",
          description: data?.payload?.message,
        });
      }
    } catch (error) {
      console.error(`Failed to Update Product: ${error.message}`);
    }
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (currentEditingId) {
      
    } else {
      try {
        const data = await dispatch(addNewProduct({ ...formData }));
        if (data?.payload?.Success) {
          setOpenCreateProduct(false);
          setUploadedImageUrls([]);
          setFormData(initialFormData);
          dispatch(fetchAllProducts());
          toast({
            title: "Product Added Successfully",
            description: data?.payload?.message,
          });
        }
      } catch (error) {
        console.error(`Failed to Add New Product: ${error.message}`);
      }
    }
  };

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
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleFilterChange = (name,value) => {
    console.log("Filter Change: ", name,value);
    // const { name, value } = e;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value === 'default' ? '' : value,
    }));
  };

  const filteredProducts = products.filter((product) => {
    if (!filters.category && !filters.subCategory && !filters.gender && !filters.color && !filters.size && !filters.specialCategory) return true;

    const categoryMatch = filters.category ? product.category.toLowerCase() === filters.category.toLowerCase() : true;
    const specialCategoryMatch = filters.specialCategory ? product.specialCategory.toLowerCase() === filters.specialCategory.toLowerCase() : true;
    const subCategoryMatch = filters.subCategory ? product.subCategory.toLowerCase() === filters.subCategory.toLowerCase() : true;
    const genderMatch = filters.gender ? product.gender.toLowerCase() === filters.gender.toLowerCase() : true;

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
    
    <div>
      {
        productLoading || isLoading ? <LoadingOverlay isLoading={productLoading || isLoading} />:<div>
          <div className="mb-5 flex justify-between items-center px-6 flex-row flex-wrap">
            {/* Category Dropdown */}
            <div className="flex items-center space-x-3 mb-3 sm:w-full md:w-auto">
              <Label className="text-lg font-semibold">Filter by Category:</Label>
              <Select 
                id="categoryFilter"
                name="category"
                value={filters.category}
                onValueChange={(e)=>handleFilterChange("category",e)} 
                className = "border border-gray-300 p-2 rounded w-full md:w-auto"
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
            <div className="flex items-center space-x-3 mb-3 sm:w-full md:w-auto">
              <Label className="text-lg font-semibold">Special Category :</Label>
              <Select 
                id="specialCategory"
                name="specialCategory"
                value={filters.specialCategory}
                onValueChange={(e)=>handleFilterChange("specialCategory",e)} 
                className = "border border-gray-300 p-2 rounded w-full md:w-auto"
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
            <div className="flex items-center px-4 space-x-3 mb-3 sm:w-full md:w-auto">
              <label className="text-lg font-semibold">Filter by Sub-Category:</label>
              <Select 
                id="subCategoryFilter"
                name="subCategory"
                value={filters.subCategory}
                onValueChange={(e)=> handleFilterChange("subCategory",e)} 
                className="border border-gray-300 p-2 rounded w-full md:w-auto"
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
            <div className="flex items-center  px-9 space-x-9 mb-3 sm:w-full md:w-auto">
              <label className="text-lg font-semibold text-left ">Sort </label>
              <Select 
                id="sortFilter"
                name="sort" 
                value={filters.sort}
                onValueChange={(e)=>handleFilterChange("sort",e)} 
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
            <Button onClick={() => setOpenCreateProduct(true)} className="mt-3 sm:w-full md:w-auto">
              Add New Product
            </Button>
          </div>

          <div className="grid gap-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 pr-4">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product, i) => (
                <AdminProductTile key={i} togglePopUp={togglePopUp} setOpenProductPreview={setCurrentPreviewProduct} product={product} />
              ))
            ) : (
              <p>No products found for the selected filter.</p>
            )}
          </div>
          <div>
            {/* Add Product Overlay */}
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

            {/* Product Preview */}
            
          </div>
        </div>
      }
      <div>
        {currentPreviewProductId && (
          <ProductPreview
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
        )}
      </div>
    </div>
  );
};

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full mx-auto">
      <Box sx={{ width: 300 }}>
        <Skeleton />
        <Skeleton animation="wave" />
        <Skeleton animation={false} />
      </Box>
    </div>
  );
};
const SkeletonLoader = () => (
  <div className="relative h-40 bg-gray-300 animate-pulse rounded-lg mb-4">
    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
  </div>
);

const SkeletonText = ({ width = 'w-32' }) => (
  <div className={`${width} bg-gray-300 animate-pulse h-5`}></div>
);
export default AdminProducts;
