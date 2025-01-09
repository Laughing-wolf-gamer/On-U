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
            <form className="flex flex-row w-full h-full justify-between items-center gap-2" onSubmit={searchenter}>
                <input
                    type="text"
                    placeholder="Search for products, brands and more"
                    className="rounded-3xl w-full h-full pl-4 text-white placeholder-white outline-none border-2 border-solid border-gray-300 focus:border-blue-500"
                    style={{ backgroundColor: "#BCCCDC" }}
                    onChange={(e) => setstate(e.target.value)}
                />
            </form>
        </Fragment>

    )
}

export default Search