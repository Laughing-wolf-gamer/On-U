import React, { Fragment, useState } from 'react'
import {FiSearch} from 'react-icons/fi'
import {Allproduct} from '../../action/productaction'
import {useDispatch } from 'react-redux'
import { useNavigate  } from 'react-router-dom'

const Search = () => {
    
    const [state, setstate] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate ()
    function searchenter(e) {
        e.preventDefault();
        if (state.trim()) {
            navigate(`/products?keyword=${state}`)
            dispatch(Allproduct())
        } else {
            navigate('/products')
        }
     
    }
    return (
        <Fragment>
            <form className="flex flex-row w-full h-10 mt-3 px-4 justify-between items-center gap-2" onSubmit={searchenter}>
                <button
                    className="rounded-xl w-10 justify-center items-center h-full bg-[#ECEBDE]"
                    onClick={searchenter}
                >
                    <div className="w-full h-full justify-center flex items-center">
                    <FiSearch color="red" />
                    </div>
                </button>
                <input
                    type="text"
                    placeholder="Search for products, brands and more"
                    className="rounded-xl w-full h-full pl-4"
                    style={{ backgroundColor: "#ECEBDE" }}
                    onChange={(e) => setstate(e.target.value)}
                />
            </form>

        </Fragment>
    )
}

export default Search