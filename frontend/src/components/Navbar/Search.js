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
					className="rounded-xl w-full h-full pl-4 text-black placeholder-gray-600 focus-visible: outline-none border-2 border-solid border-gray-800 focus:border-slate-500"
					style={{ backgroundColor:"white" }}
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
				className="w-[600px] font-kumbsan h-[240px] bg-gray-600 fixed border border-white rounded-t-md top-16 z-30 scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-500"
				style={{ maxHeight: "200px", overflowY: "auto", transition: 'all 0.3s ease-in-out' }}
			>
				<ul className="p-2">
					<label className="text-base font-bold text-white">Recent Searches:</label>
					{filterSearchs.map((search, index) => (
						<li
							key={index}
							className="cursor-pointer relative min-w-fit py-2 justify-between items-start flex-col flex p-2 peer-hover:bg-gray-300"
							onClick={(e) => {
								e.stopPropagation();
								setState(search); // Set the clicked recommendation in input
								searchEnter(new Event('submit'),search); // Trigger search with the clicked value
							}}
						>
							<div className='w-full justify-between flex items-center'>
								<span className=' text-sm text-white' >{search}</span>
								<div onClick={(e)=>{
									e.preventDefault();
									e.stopPropagation();
									removeKeyWoards(search)	
								}} className=' text-sm text-white' >
									<X/>
								</div>
							</div>
							<div className="w-full h-[0.1px] bg-white bg-opacity-20" />
						</li>
					))}
				</ul>
			</div>

		</div>
	);
};

export default Search;
