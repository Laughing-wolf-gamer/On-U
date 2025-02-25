import React, { useEffect, useRef, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { MdArrowBack } from 'react-icons/md'
import { useLocalStorage } from '../../../Contaxt/LocalStorageContext'
import { X } from 'lucide-react'

const MKeywoardSerach = ({setserdiv,state,setstate,searchenter,searchenters}) => {
	const{keyWoards,removeKeyWoards} = useLocalStorage();
	const[filterSearchs,setfilterSearches] = useState(keyWoards);
	// Filter previous searches based on user input
	useEffect(()=>{
		setfilterSearches(keyWoards.filter(search =>
			search.toLowerCase().includes(state.toLowerCase())
		))
		console.log("state",keyWoards,state);
	},[removeKeyWoards,keyWoards,state]);
	const applySerach = (e) => {
		searchenter(e);
	}
	const startSerach = (e,activeSearch) => {
		e.preventDefault();
		searchenters(activeSearch)
	}
	console.log("filterSearchs",filterSearchs);
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
			<div
				className="fixed top-0 left-0 rounded-t-md w-full h-full bg-black opacity-30 z-20"
				onClick={() => {
					setstate("")
					setserdiv('hidden');
				}} // Optional: Close the search when clicking on the overlay
				></div>

				{/* Search Bar */}
				<div className='grid grid-cols-12 bg-white py-3 px-[6px] fixed top-0 left-0 w-full z-30'>
					<div className="col-span-1 align-middle text-center flex items-center text-2xl" onClick={() => setserdiv('hidden')}>
						<MdArrowBack color='black'/>
					</div>
					<div className="col-span-10">
						<input
							ref={inputRef}
							type="text"
							value={state}
							placeholder='Search for products'
							className='msearch caret-[#000000] w-full h-full'
							onChange={(e) => setstate(e.target.value)}
							onKeyUp={applySerach}
						/>
					</div>
					<div className="col-span-1 flex items-center text-center align-middle" onClick={(e)=> startSerach(e,'')}>
						<FiSearch color='black' strokeWidth={.9} className='text-2xl text-black' />
					</div>
				</div>

				{/* Search Recommendations */}
				<div
				className="w-full font-kumbsan h-[240px] bg-gray-300 fixed top-[48px] z-40 border-b border-r border-l border-white scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-100"
				style={{ maxHeight: "300px", overflowY: "auto", transition: 'all 0.3s ease-in-out' }}
				>
				<ul className="p-2">
					<label className="text-base font-semibold text-gray-800">Recent Searches:</label>
					{filterSearchs.map((search, index) => (
						<div
							key={index}
							className="cursor-pointer font-bold relative min-w-fit py-2 flex flex-col justify-between items-start p-2 hover:bg-gray-100"
							onClick={(e) => {
								e.stopPropagation();
								setstate(search); // Set the clicked recommendation in input
								startSerach(e,search) // Trigger search with the clicked value
							}}
						>
							<div className='w-full justify-between flex items-center'>
							<span className=' text-sm text-gray-700'>{search}</span>
							<div
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									removeKeyWoards(search);
								}}
								className=' text-sm text-gray-700'
							>
								<X />
							</div>
							</div>
							<div className="w-full h-[0.5px] bg-gray-700 bg-opacity-20 my-1" />
						</div>
					))}
				</ul>
				</div>

		</div>
	)
}

export default MKeywoardSerach
