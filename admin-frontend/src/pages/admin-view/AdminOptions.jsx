import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addNewOption, deleteOption, fetchAllOptions, setConvenienceFees, updateColorName, updateOptionActive } from '@/store/common-slice';
import { ChevronRight, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminOptions = () => {
    const { AllOptions,convenienceFees } = useSelector(state => state.common);
    const[currentUpdatingColorNameData,setUpdatingColorNameData] = useState(null);
	const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);
    // const{toast} = useToast();
	
    const [dropdowns, setDropdowns] = useState({
        categories: false,
        subcategories: false,
        genders: false,
        clothingWearSizes: false,
        footWearSizes: false,
        colors: false
    });

    // Toggle dropdown visibility
    const toggleDropdown = (section) => {
        setDropdowns(prevState => ({
        ...prevState,
        [section]: !prevState[section]
        }));
    };
    const dispatch = useDispatch();
    const[convenienceFeesAmount,setConvenienceFeesAmount] = useState(0)
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [color, setColor] = useState('');
    // const [footWearSize, setFootWearSize] = useState('');
    const [clothingWearSize, setClothingWearSize] = useState('');
    const [gender, setGender] = useState('');

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [footWearSizes, setFootWearSizes] = useState([]);
    const [clothingWearSizes, setClothingWearSizes] = useState([]);
    const [genders, setGenders] = useState([]);

    const handleAddOption = async (type, value) => {
        if (value.trim() === '') return;
        await dispatch(addNewOption({ type, value }));
        dispatch(fetchAllOptions());
        switch (type) {
            case 'category':
                setCategory('');
                break;
            case'subcategory':
                setSubcategory('');
                break;
            case 'color':
                setColor('');
                break;
            /* case 'footWearSize':
                setFootWearSize('');
                break; */
            case 'clothingSize':
                setClothingWearSize('');
                break;
            case 'gender':
                setGender('');
                break;
            default:
            break;
        }
        toast.success(`Added New ${type}`);
    };

    const handleRemoveOption = async (type, value) => {
        await dispatch(deleteOption({ type: type, value: value.value }));
        dispatch(fetchAllOptions());
        // toast();
    };
    const handleToggleShowOptionInProducts = async (type, value,checked) => {
        console.log("Toggle show option in products: ",type,value,checked);
        await dispatch(updateOptionActive({type: type, value: value.value, isActive: checked}))
        toast({title:`Toggle show option in products`,type:"success"});
        dispatch(fetchAllOptions());
    }
    const handleUpdateColorName = async () => {
        if (currentUpdatingColorNameData) {
            console.log("Update color name: ",{type: currentUpdatingColorNameData.type, value: currentUpdatingColorNameData.value.value, name: currentUpdatingColorNameData?.name})
            await dispatch(updateColorName({type: currentUpdatingColorNameData.type, value: currentUpdatingColorNameData.value.value, name: currentUpdatingColorNameData?.name}));
            dispatch(fetchAllOptions());
			toast.success(`Updated Color Name: ${currentUpdatingColorNameData?.type}`);
        }else{
			toast.info(`Set a New Name to Update`);
		}
    }

    useEffect(() => {
        dispatch(fetchAllOptions());
    }, [dispatch]);

    useEffect(() => {
        setAllOptions();
    }, [AllOptions, dispatch]);
	useEffect(()=>{
		window.scrollTo(0,0);
	},[])
    const setAllOptions = () => {
        if (AllOptions && AllOptions.length > 0) {
            AllOptions.map(item => {
                switch (item.type) {
                case 'category':
                    setCategories(AllOptions.filter(item => item.type === 'category'));
                    break;
                case 'subcategory':
                    setSubcategories(AllOptions.filter(item => item.type === 'subcategory'));
                    break;
                case 'color':
                    setColors(AllOptions.filter(item => item.type === 'color') || []);
                    break;
                case 'clothingSize':
                    setClothingWearSizes(AllOptions.filter(item => item.type === 'clothingSize'));
                    break;
                case 'gender':
                    setGenders(AllOptions.filter(item => item.type === 'gender'));
                    break;
                }
            });
        }
    };
    const updateConvenienceFees = async()=>{
        try {
            await dispatch(setConvenienceFees({convenienceFees:convenienceFeesAmount || 0}));
            setConvenienceFeesAmount(0);
        } catch (error) {
            console.error("Failed to set convenience: " + amount, error);
        }
    }
    return (

        <div className="p-8 space-y-6 bg-gray-50">
            <h1 className="text-3xl font-bold text-center text-gray-900">Admin Product Options</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Create Options Form */}
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6 transform transition-transform hover:shadow-xl hover:bg-gray-50">
                <h2 className="text-2xl font-semibold text-gray-700">Create New Option</h2>
                <div>
                    <Label className="block font-medium text-gray-700">Add Products Purchase Convenience Fees</Label>
                    <Input
                        type="number"
                        value={convenienceFeesAmount}
                        onChange={(e) => setConvenienceFeesAmount(e.target.value)}
                        className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    />
                    <Button
                        onClick={updateConvenienceFees}
                        className="mt-4 w-full p-2 text-white rounded-md transition duration-300"
                    >
                        Add Convenience Fees
                    </Button>
                </div>
                {/* Product Category */}
                <div>
                    <Label className="block font-medium text-gray-700">Product Category</Label>
                    <Input
						type="text"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    />
                    <Button
                    onClick={() => handleAddOption('category', category)}
                    className="mt-4 w-full p-2 text-white rounded-md transition duration-300"
                    >
                    Add Category
                    </Button>
                </div>

                {/* Product Subcategory */}
                <div>
                    <Label className="block font-medium text-gray-700">Product Subcategory</Label>
                    <Input
                        type="text"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    />
                    <Button
                        onClick={() => handleAddOption('subcategory', subcategory)}
                        className="mt-4 w-full p-2 text-white rounded-md transition duration-300"
                    >
                    Add Subcategory
                    </Button>
                </div>

                {/* Product Color */}
                <div>
                    <Label className="block font-medium text-gray-700">Product Color</Label>
                    <Input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="mt-2 w-full h-16 p-2 border border-gray-300 rounded-md"
                    />
                    <Button
                        onClick={() => handleAddOption('color', color)}
                        className="mt-4 w-full p-2 text-white rounded-md transition duration-300"
                    >
                    	Add Color
                    </Button>
                </div>

                {/* Product Size */}
                {/* <div>
                    <Label className="block font-medium text-gray-700">Product FootWear Size</Label>
                    <Input
						type="text"
						value={footWearSize}
						onChange={(e) => setFootWearSize(e.target.value)}
						className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    />
                    <Button
						onClick={() => handleAddOption('footWearSize', footWearSize)}
						className="mt-4 w-full p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                    >
                    Add Foot Wear Size
                    </Button>
                </div> */}
                <div>
                    <Label className="block font-medium text-gray-700">Product Cloth Size</Label>
                    <Input
						type="text"
						value={clothingWearSize}
						onChange={(e) => setClothingWearSize(e.target.value)}
						className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    />
                    <Button
						onClick={() => handleAddOption('clothingSize', clothingWearSize)}
						className="mt-4 w-full p-2 text-white rounded-md transition duration-300"
                    >
                    Add Clothing Size
                    </Button>
                </div>

                {/* Product Gender */}
                <div>
                    <Label className="block font-medium text-gray-700">Product Gender</Label>
                    <Input
						type="text"
						value={gender}
						onChange={(e) => setGender(e.target.value)}
						className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                    />
                    <Button
						onClick={() => handleAddOption('gender', gender)}
						className="mt-4 w-full p-2 text-white rounded-md transition-all duration-300"
                    >
                    Add Gender
                    </Button>
                </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
					<div>
						<h3 className="text-3xl font-bold text-red-600 flex items-center justify-between">
							Delivery Convenience Fees 
							<span className='text-red-700'>{convenienceFees}</span>
						</h3>
					</div>
					<h2 className="text-2xl font-semibold text-gray-700">Manage Options</h2>
					{/* Categories List */}
					<div className='border border-gray-800 p-2 space-y-1'>
						<button onClick={() => toggleDropdown('categories')} className="text-xl font-medium text-gray-800 flex w-full items-center justify-between">
							Product Categories: {categories && categories.length > 0? `(${categories.length})` : 'No Categories'}
							<div  className="text-black">
								<ChevronRight className={`transition-all duration-300 ease-ease-out-expo ${dropdowns.categories ? "rotate-90":""}`}/>
							</div>
						</button>
						<ul
							className="space-y-2"
							style={{
								maxHeight: '300px', // Set the maximum height for the scrollable area
								overflowY: 'auto',  // Enable vertical scrolling
								overflowX:'auto'
							}}
						>
							{dropdowns.categories && (
								<ul className="space-y-2">
									{categories.map((item, index) => (
										<li key={index} className="flex justify-between items-center hover:bg-gray-50">
											<input
												type="checkbox"
												id='category-select'
												checked={item?.isActive || false}
												onChange={(e) => handleToggleShowOptionInProducts('category',item, e.target.value)}
											/>
											<span className='font-sans'>{item?.value}</span>
											<button
												onClick={() => handleRemoveOption('category', item)}
												className="p-2  text-black rounded-md  transition duration-300"
											>
												<Trash/>
											</button>
										</li>
									))}
								</ul>
							)}
						</ul>
					</div>

					{/* Subcategories List */}
					<div className='border border-gray-800 p-2 space-y-1'>
						<button onClick={() => toggleDropdown('subcategories')} className="text-xl font-medium text-gray-800 flex items-center w-full justify-between">
							<h3>Product Subcategories:  {subcategories && subcategories.length > 0? `(${subcategories.length})` : 'No Values'}</h3>
							<div  className="text-black">
								<ChevronRight className={`transition-all duration-300 ease-ease-out-expo ${dropdowns.subcategories ? "rotate-90":""}`}/>
							</div>
						</button>
						<ul
							className="mt-2 space-y-2"
							style={{
								maxHeight: '300px', // Set the maximum height for the scrollable area
								overflowY: 'auto',  // Enable vertical scrolling
								overflowX:'auto'
							}}
						>
							{dropdowns.subcategories && (
								<ul className="mt-2 space-y-2">
									{subcategories.map((item, index) => (
										<li key={index} className="flex justify-between items-center">
											<input
												type="checkbox"
												id='Subcategories-select'
												checked={item?.isActive || false}
												onChange={(e) => handleToggleShowOptionInProducts('subcategory',item, e.target.value)}
											/>
											<span className='font-sans'>{item?.value}</span>
											<button
												onClick={() => handleRemoveOption('subcategory', item)}
												className="p-2  text-black rounded-md  transition-all duration-300"
											>
											<Trash/>
											</button>
										</li>
									))}
								</ul>
							)}
						</ul>
					</div>

					{/* Genders List */}
					<div className='border border-gray-800 p-2 space-y-1'>
						<button onClick={() => toggleDropdown('genders')} className="text-xl font-medium text-gray-800 flex items-center w-full justify-between">
							<h3>Product Genders: {genders && genders.length > 0 ? `(${genders.length})` : 'No Values' }</h3>
							<div  className="text-black text-base">
								<ChevronRight className={`transition-all duration-300 ease-ease-out-expo ${dropdowns.genders ? "rotate-90":""}`}/>
							</div>
						</button>
						<ul
							className="mt-2 space-y-2"
							style={{
								maxHeight: '300px', // Set the maximum height for the scrollable area
								overflowY: 'auto',  // Enable vertical scrolling
								overflowX:'auto'
							}}
						>
							{dropdowns.genders && (
								<ul className="mt-2 space-y-2">
									{genders.map((item, index) => (
										<li key={index} className="flex justify-between items-center">
											<input
												type="checkbox"
												id="Genders-select"
												checked={item?.isActive || false}
												onChange={(e) => handleToggleShowOptionInProducts('gender', item, e.target.value)}
											/>
											<span className="font-sans">{item?.value}</span>
											<button
												onClick={() => handleRemoveOption('gender', item)}
												className="p-2  text-black rounded-md  transition duration-300"
											>
											<Trash/>
											</button>
										</li>
									))}
								</ul>
							)}
						</ul>
					</div>


					{/* Clothing Size List */}
					<div  className='w-full border border-gray-800 p-2 space-y-1'>
						<button onClick={() => toggleDropdown('clothingWearSizes')} className="text-xl font-medium text-gray-800 flex items-center w-full justify-between">
							<h3>Product Clothing Size: {clothingWearSizes && clothingWearSizes.length > 0 ? `(${clothingWearSizes.length})` : 'No Values' }</h3>
							<div className="text-black">
								<ChevronRight className={`transition-all duration-300 ease-ease-out-expo ${dropdowns.clothingWearSizes ? "rotate-90":""}`}/>
							</div>
						</button>
						<ul
							className="mt-2 space-y-2"
							style={{
								maxHeight: '300px', // Set the maximum height for the scrollable area
								overflowY: 'auto',  // Enable vertical scrolling
								overflowX:'auto'
							}}
						>
							{dropdowns.clothingWearSizes && (
								<ul className="mt-2 space-y-2">
									{clothingWearSizes.map((item, index) => (
									<li key={index} className="flex justify-between items-center">
										<input
											type="checkbox"
											id='Clothing-Size-select'
											checked={item?.isActive || false}
											onChange={(e) => {
												e.stopPropagation();
												handleToggleShowOptionInProducts('clothingSize',item, e.target.value)
											}}
										/>
										<span className='font-sans'>{item?.value}</span>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveOption('clothingSize', item)
											}}
											className="p-2 text-black rounded-md transition duration-300"
										>
										<Trash/>
										</button>
									</li>
									))}
								</ul>
							)}
						</ul>
					</div>



					{/* Colors List */}
					<div className='border border-gray-800 p-2 space-y-1 '>
						<button onClick={() => toggleDropdown('colors')} className="text-xl font-medium text-gray-800 flex items-center w-full justify-between">
							Colors: {colors && colors.length > 0 ? `(${colors.length})` : 'No Values' }
							<div className="text-black">
								<ChevronRight className={`transition-all duration-300 ease-ease-out-expo ${dropdowns.colors ? "rotate-90":""}`}/>
							</div>
						</button>
						{dropdowns.colors && (
							<ul
								className="mt-2 space-y-2"
								style={{
									maxHeight: '300px', // Set the maximum height for the scrollable area
									overflowY: 'auto',  // Enable vertical scrolling
									overflowX: 'auto',  // Enable horizontal scrolling if necessary
								}}
							>
								{colors.map((item, index) => (
									<li key={index} className="flex justify-between items-center space-x-4">
										<div className="w-fit flex flex-row justify-start items-start space-x-3">
										<Input
											type="text"
											id="color-select"
											className="border border-gray-400 w-32 focus:border-gray-800"
											value={
											currentUpdatingColorNameData && currentUpdatingColorNameData.value && currentUpdatingColorNameData.value._id === item._id
												? currentUpdatingColorNameData?.name
												: item?.name
											}
											placeholder="Enter Color Name"
											onChange={(e) => {
												setUpdatingColorNameData({ type: 'color', value: item, name: e.target.value });
												setIsUpdateEnabled(true);  // Enable the update button when the input value changes
											}}
										/>
										<Button
											className="w-fit"
											onClick={handleUpdateColorName}
											disabled={!isUpdateEnabled}  // Disable the update button when isUpdateEnabled is false
										>
											Update
										</Button>
										</div>
										<div
											className="w-full h-fit border border-gray-800 shadow-md border-spacing-4 hover:scale-y-105 transition-transform duration-300 p-3"
											style={{ backgroundColor: item?.value }}
										></div>
										<button
											onClick={() => handleRemoveOption('color', item)}
											className="p-2 text-gray-800 rounded-md transition duration-300"
										>
										<Trash />
										</button>
									</li>
								))}
							</ul>
							)}

					</div>

            	</div>
		</div>
        </div>
    );
};

export default AdminOptions;
