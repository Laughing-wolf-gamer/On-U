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
            <form className="flex flex-row w-[600px] h-full justify-between items-center gap-2" onSubmit={searchenter}>
                <input
                    type="text"
                    placeholder="Search for products, brands and more"
                    className="rounded-xl w-full h-full pl-4 text-gray-800 placeholder-black outline-none border-2 border-solid border-gray-100 focus:border-slate-500 bg-neutral-50"
                    style={{ backgroundColor: "#BCCCDC" }}
                    onChange={(e) => setstate(e.target.value)}
                />
            </form>
        </Fragment>

    )
}

export default Search