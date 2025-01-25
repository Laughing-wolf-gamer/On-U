import React from 'react'
import accImg from '../../assets/account.jpg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Orders from '@/components/shopping-view/Orders'
import Address from '@/components/shopping-view/Address'
const ShoppingAccountPage = () => {
    return (
        <div className='flex flex-col'>
            <div className='relative h-[300px] w-full overflow-hidden'>
                <img
                    width={'1600'}
                    height={'300'}
                    style={{aspectRatio:"1600/300",objectFit:'cover'}}
                    src={accImg}
                    alt='accountImg'
                    className='h-full w-full object-cover object-center'
                />
            </div>
            <div className='container mx-auto grid grid-cols-1 gap-8 py-8'>
                <div className='flex flex-col rounded-lg border bg-background p-6 shadow-sm'>
                    <Tabs defaultValue='orders'>
                        <TabsList>
                            <TabsTrigger value = "orders">Orders</TabsTrigger>
                            <TabsTrigger value = "address">Address</TabsTrigger>
                        </TabsList>
                        <TabsContent value = "orders">
                            <Orders/>
                        </TabsContent>
                        <TabsContent value = "address">
                            <Address/>
                        </TabsContent>
                    </Tabs>
                </div>

            </div>
        </div>
    )
}

export default ShoppingAccountPage
