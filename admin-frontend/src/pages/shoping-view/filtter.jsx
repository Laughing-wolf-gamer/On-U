import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { filterOptions } from '@/config'
import React, { Fragment } from 'react'

const ProductFilter = ({filters,handleFilters}) => {
    return (
        <div className='bg-background rounded-lg shadow-sm'>
            <div className='p-4 border-b'>
                <h2 className='text-xl font-extrabold mb-4'>Filter products</h2>
                
            </div>
            <div className='p-4 space-y-4'>
                {
                    Object.keys(filterOptions).map((keyItems,i) => (
                        <Fragment key={i}>
                            <div>
                                <h3 className='text-base font-bold'>
                                    {keyItems}
                                </h3>
                                <div className = "grid gap-2 mt-2">
                                    {
                                        filterOptions[keyItems].map((option,l) => (
                                            <Label key={l} className = "flex items-center gap-2 font-medium">
                                                <Checkbox 
                                                    checked = {
                                                        filters && Object.keys(filters).length > 0 && filters[keyItems] && filters[keyItems].indexOf(option.id) > -1
                                                    }
                                                    onCheckedChange={(checked) => handleFilters(keyItems,option.id)}/> 
                                                {
                                                    option.label
                                                }
                                            </Label>
                                        ))
                                    }
                                </div>
                            </div>
                            <Separator/>
                        </Fragment>
                    ))
                }
            </div>
        </div>
    )
}

export default ProductFilter