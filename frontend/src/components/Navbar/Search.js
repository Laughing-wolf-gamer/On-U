import React, { useEffect, useRef, useState } from 'react';
import { Allproduct } from '../../action/productaction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../Contaxt/LocalStorageContext';
import { X } from 'lucide-react';

const Search = ({ toggleSearchBar }) => {
	const{saveSearchKeywoards,keyWoards,removeKeyWoards} = useLocalStorage();
	const [state, setState] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const[filterSearchs,setfilterSearches] = useState(keyWoards);
	// Mock of previous searches (can be stored in localStorage or state management)
	useEffect(()=>{
		setfilterSearches(keyWoards.filter(search =>
			search.toLowerCase().includes(state.toLowerCase())
		))
		console.log("getSearchKeywoards",keyWoards);
	},[removeKeyWoards,state]);
	
	// Filter previous searches based on user input

	function searchEnter(e,activeSearch) {
		e.preventDefault();
		if (activeSearch.trim()) {
			navigate(`/products?keyword=${activeSearch}`);
			saveSearchKeywoards(activeSearch);
		} else {
			navigate(`/products?keyword=${state}`);
			saveSearchKeywoards(state);
		}
		dispatch(Allproduct()); // Assuming it fetches the products
		if (toggleSearchBar) {
			toggleSearchBar(); // Close the search bar
		}
	}
	const inputRef = useRef(null);

	// Focus the input when it is mounted or whenever you want to trigger focus
	useEffect(() => {
		// Check if the input is in view and focus it
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	return (
		<div>
			<form className="flex flex-row w-[600px] relative h-full z-30 justify-between items-center gap-1" onSubmit={(e)=> searchEnter(e,'')}>
				<input
					ref={inputRef}
					type="text"
					placeholder="Search for products, brands and more"
					className="rounded-xl w-full h-full pl-4 text-gray-800 placeholder-black focus-visible: outline-none border-2 border-solid border-gray-800 focus:border-slate-500 bg-neutral-50"
					style={{ backgroundColor: "#BCCCDC",opacity: 0.8 }}
					onChange={(e) => setState(e.target.value)} // Update input state
				/>
			</form>

			<div
				className="fixed top-0 left-0 w-full min-h-screen bg-black opacity-50 z-20"
				onClick={() => {
					setState("")
					toggleSearchBar()
				}}  // Optional: Close the search when clicking on the overlay
			></div>

			{/* Search Recommendations */}
			<div
				className="w-[600px] font-kumbsan h-[240px] bg-gray-50 fixed border border-gray-500 rounded-t-md top-16 z-30"
				style={{ maxHeight: "200px", overflowY: "auto", transition: 'all 0.3s ease-in-out' }}
			>
				<ul className="p-2">
					<label className="text-sm font-bold text-gray-600">Popular Searches:</label>
					{filterSearchs.map((search, index) => (
						<li
							key={index}
							className="cursor-pointer relative min-w-fit py-2 justify-between items-start flex-col flex p-2 hover:bg-gray-100"
							onClick={(e) => {
								e.stopPropagation();
								setState(search); // Set the clicked recommendation in input
								searchEnter(new Event('submit'),search); // Trigger search with the clicked value
							}}
						>
							<div className='w-full justify-between flex items-center'>
								<span className=' text-sm text-gray-500' >{search}</span>
								<div onClick={(e)=>{
									e.preventDefault();
									e.stopPropagation();
									removeKeyWoards(search)	
								}} className=' text-sm text-gray-500' >
									<X/>
								</div>
							</div>
							<div className="w-full h-[0.1px] bg-gray-500 bg-opacity-20" />
						</li>
					))}
				</ul>
			</div>

		</div>
	);
};

export default Search;
