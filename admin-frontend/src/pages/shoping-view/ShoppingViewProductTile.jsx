import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { brandOptions, categoryOptions } from '@/config'
import React from 'react'

const ShoppingViewProductTile = ({product,handleGetProductDetails,handleAddToCart,isLoading}) => {
    return (
        <Card className="w-full max-w-[250px] mx-auto">
            <div onClick={() => handleGetProductDetails(product?._id)}>
                <div className="relative">
                    <img 
                        src={product?.image}
                        alt={product?.title}
                        className="w-full p-1 h-[200px] rounded-lg object-cover"
                    />
                    {product?.totalStock <= 0 ? (
                        <Badge>Out Of Stock</Badge>
                    ) : (
                        <>
                            {product?.salePrice > 0 && (
                                <Badge className="absolute top-2 ml-3 mt-2 bg-red-700 hover:bg-red-500 rounded-sm">Sale</Badge>
                            )}
                            {product?.totalStock <= 10 && (
                                <Badge className="absolute top-2 ml-3 mt-2 bg-red-700 hover:bg-red-500 rounded-sm">
                                    Only {product?.totalStock} items Left
                                </Badge>
                            )}
                        </>
                    )}
                </div>
                <CardContent className="p-3 gap-2">
                    <h2 className="text-lg font-bold">{product?.title}</h2>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            {categoryOptions[product?.category]}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {brandOptions[product?.brand]}
                        </span>
                    </div>
                    <div>
                        <span className={`${product?.salePrice > 0 ? 'line-through' : ''} text-base text-primary font-semibold`}>
                            ₹ {product?.price}
                        </span>
                        {product?.salePrice > 0 && (
                            <span className="text-lg ml-2 font-semibold text-red-500">
                                {product?.salePrice}
                            </span>
                        )}
                    </div>
                </CardContent>
            </div>
            {product?.totalStock > 0 ? (
                <CardFooter>
                    <Button
                        disabled={isLoading}
                        onClick={() => handleAddToCart(product._id, product?.totalStock)}
                        className="w-full text-sm py-2"
                    >
                        {isLoading ? 'Adding.. to Cart' : 'Add to Cart'}
                    </Button>
                </CardFooter>
            ) : (
                <CardFooter>
                    <Button disabled className="w-full text-sm py-2">
                        Out Of Stock
                    </Button>
                </CardFooter>
            )}
        </Card>

    )
}

export default ShoppingViewProductTile
