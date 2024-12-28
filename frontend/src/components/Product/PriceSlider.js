import React, { useState } from 'react';

const PriceSlider = ({ result, spARRAY }) => {
    // Initialize state for min and max price ranges
    const [range1, setRange1] = useState([Math.floor(Math.min(...result[0])), Math.floor(Math.max(...result[0]))]);
    const [range2, setRange2] = useState([Math.floor(Math.min(...result[1])), Math.floor(Math.max(...result[1]))]);
    const [range3, setRange3] = useState([Math.floor(Math.min(...result[2])), Math.floor(Math.max(...result[2]))]);

    // Function to handle slider changes
    const handleRange1Change = (e) => {
        const value = e.target.value.split(',').map(Number);
        setRange1(value);
    };

    const handleRange2Change = (e) => {
        const value = e.target.value.split(',').map(Number);
        setRange2(value);
    };

    const handleRange3Change = (e) => {
        const value = e.target.value.split(',').map(Number);
        setRange3(value);
    };

    // Filtered results count based on price range
    const getFilteredCount = (min, max) => {
        return spARRAY.filter(f => f >= min && f <= max).length;
    };

    return (
        <ul className="pl-8 border-b-[1px] border-slate-200 py-4">
            <h1 className="font1 text-base font-semibold mb-2">PRICE</h1>

            {/* Price Range 1 Slider */}
            <li className="items-center">
                <input
                    type="range"
                    min={Math.floor(Math.min(...result[0]))}
                    max={Math.floor(Math.max(...result[0]))}
                    step="100"
                    value={range1.join(',')}
                    onChange={handleRange1Change}
                    className="mb-2 accent-pink-500"
                />
                <label className="font1 text-sm ml-2 mr-4 mb-2">
                    ₹ {range1[0]} to ₹ {range1[1]}
                    <span className="text-xs font-serif font-normal text-slate-400">
                        ({getFilteredCount(range1[0], range1[1])})
                    </span>
                </label>
            </li>

            {/* Price Range 2 Slider */}
            <li className="items-center">
                <input
                    type="range"
                    min={Math.floor(Math.min(...result[1]))}
                    max={Math.floor(Math.max(...result[1]))}
                    step="100"
                    value={range2.join(',')}
                    onChange={handleRange2Change}
                    className="mb-2 accent-pink-500"
                />
                <label className="font1 text-sm ml-2 mr-4 mb-2">
                    ₹ {range2[0]} to ₹ {range2[1]}
                    <span className="text-xs font-serif font-normal text-slate-400">
                        ({getFilteredCount(range2[0], range2[1])})
                    </span>
                </label>
            </li>

            {/* Price Range 3 Slider (Greater Than Minimum Price) */}
            <li className="items-center">
                <input
                    type="range"
                    min={Math.floor(Math.min(...result[2]))}
                    max={Math.floor(Math.max(...result[2]))}
                    step="100"
                    value={range3.join(',')}
                    onChange={handleRange3Change}
                    className="mb-2 accent-pink-500"
                />
                <label className="font1 text-sm ml-2 mr-4 mb-2">
                    ₹ {range3[0]} +
                    <span className="text-xs font-serif font-normal text-slate-400">
                        ({getFilteredCount(range3[0], Infinity)})
                    </span>
                </label>
            </li>
        </ul>
    );
};

export default PriceSlider;
