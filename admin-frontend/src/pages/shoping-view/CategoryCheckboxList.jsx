import { BabyIcon, CloudLightning, ShirtIcon, WatchIcon } from 'lucide-react';
import React, { useState } from 'react';

const CategoryCheckboxList = ({selectedCategories, setSelectedCategories}) => {
    const categories = [
        { id: 'men', label: 'Men',},
        { id: 'women', label: 'Women',},
        { id: 'kids', label: 'Kids',},
        { id: 'watch', label: 'Watch',},
    ];

    // State to keep track of the checked categories
    // const [selectedCategories, setSelectedCategories] = useState({});

    // Handle checkbox change
    const handleChange = (event) => {
        const { id, checked } = event.target;
		console.log(`Checkbox with id "${id}" is ${checked? 'checked' : 'unchecked'}`);
        setSelectedCategories((prev) => ({
            ...prev,
            [id]: checked,
        }));
    };
	

    return (
        <div>
            {categories.map((category) => (
                <div key={category.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="checkbox"
                        id={category.id}
                        checked={selectedCategories[category.id] || false}
                        onChange={handleChange}
                    />
                    <label htmlFor={category.id} style={{ marginLeft: 8 }}>
                        {category.label}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default CategoryCheckboxList;
