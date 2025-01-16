import React, { useEffect, useState } from 'react'
import checkoutImg from '../../assets/account.jpg'
import Address from '@/components/shopping-view/Address'
import { useDispatch, useSelector } from 'react-redux'
import CartItemsContent from '@/components/shopping-view/CartItemsContent'
import { Button } from '@/components/ui/button'
import { createNewOrder, verifyingOrder } from '@/store/shop/order-slice'
import { useToast } from '@/hooks/use-toast'
import { cashfree } from '@/utils/utiles'
import { BASE_CLIENT_URL } from '@/config'
import { deleteCartItems, updateToCart } from '@/store/shop/car-slice'

const ShoppingCheckoutPage = () => {
  const dispatch = useDispatch();
  
  const {cartItems} = useSelector(state => state.shopCardSlice);
  const {user} = useSelector(state => state.auth);
  const {toast} = useToast();
  const[isPaymentStart,setIsPaymentStart] = useState(false);
  const[currentSelectedAddress,setCurrentSelectedAddress] = useState(null);
  
  const totalCartAmount = cartItems &&  cartItems.items && cartItems.items.length > 0 ? cartItems.items.reduce((sum,currentItem) => sum + (currentItem?.salePrice > 0 ? currentItem.salePrice :currentItem.price) * currentItem.quantity,0): 0;
  
  const handleCashFreePayment = async ()=>{
    if(!cartItems.items || cartItems.items.length <= 0){
      toast({
        title: "Error",
        variant:'destructive',
        description: "Your cart is empty, please add items to proceed",
      })
      return;
    }
    if(currentSelectedAddress === null){
      toast({
        title: "Error",
        variant:'destructive',
        description: "Please select an address to proceed",
      })
      return;
    }
    // Call API to make cash free payment and update order status
    const data = {
      userId:user?.id,
      cartId:cartItems?._id,
      cartItems: cartItems.items.map(item =>{
        return {
          productId:item.productId,
          title:item.title,
          image:item?.image,
          price:item?.salePrice > 0? item.salePrice : item.price,
          quantity:item.quantity,
        }
      }),
      address:{
        address:currentSelectedAddress?.address,
        city:currentSelectedAddress?.city,
        state:currentSelectedAddress?.state,
        country:currentSelectedAddress?.country,
        phoneNumber:currentSelectedAddress?.phoneNumber,
        pinCode:currentSelectedAddress?.pinCode,
        notes:currentSelectedAddress?.notes
      },
      orderStatus:'pending',
      paymentMethods:'Cashfree',
      totalAmount:totalCartAmount,
      orderDate:new Date(),
      orderUpdateDate:new Date(),
      paymentId:'',
      payerId:'',
    }
    try {
      const response = await dispatch(createNewOrder(data))
      const responseResult = response?.payload?.result?.orderData;
      if(response?.payload?.Success){
        toast({
          title: "Order Placed Successfully",
          description: response?.payload?.message,
        })
        let checkoutOptions = {
          paymentSessionId: responseResult?.payment_session_id,
          redirectTarget:'_self',
          returnUrl:`${BASE_CLIENT_URL}/shop/payment-return`,
        }
        // console.log("responseResult: ",checkoutOptions);
        cashfree?.checkout(checkoutOptions).then(function(result){
          if(result.error){
            alert(result.error.message)
            setIsPaymentStart(false);
          }
          if(result.redirect){
            console.log("Redirection: ")
            setIsPaymentStart(true);
          }
        });
      }
    } catch (error) {
      console.error(`Error creating order: `,error);
      setIsPaymentStart(false);
    }
  }
  const handleOnCartItemDelete = async (item) => {
    await dispatch(deleteCartItems({userId:user.id,productId:item?.productId}));
  }
  const handleUpdateCartItemQuantity = async (item,updateAmount)=>{
    console.log("All Cart Items : ",cartItems.items);
    let getCartItems = cartItems.items || [];
    const amount = updateAmount === "plus" ? item?.quantity + 1 : item?.quantity - 1;
    console.log(item?.totalStock)
    if(updateAmount === 'plus'){
        if(getCartItems.length > 0){
            const indexOfProduct = getCartItems.findIndex(c => c.productId === item?.productId);
            if(indexOfProduct > -1){
                const quantity = getCartItems[indexOfProduct].quantity;
                if(quantity + 1 > item?.totalStock){
                    toast({
                        title: "Product Quantity Exceeded",
                        variant:'destructive',
                        description: "You can't add more than available stock",
                    });
                    return;
                }
            }
        }

  }
    const updated = await dispatch(updateToCart({userId:user.id,productId:item?.productId,quantity:amount}))
    if(updated?.payload?.Success){
        toast({
            title: "Cart Item Updated Successfully",
            description: updated?.payload?.message,
        });
    }
}

  return (
    <div className='flex flex-col'>
      <div className='relative h-[300px] w-full overflow-hidden'>
        <img
          width={'1600'}
          height={'300'}
          style={{aspectRatio:"1600/300",objectFit:'cover'}}
          src={checkoutImg}
          alt='checkoutImg'
          className='h-full w-full object-cover object-center'
        />
        <div className='absolute top-0 left-0 w-full h-full bg-black opacity-50'></div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5'>
        <Address setCurrentSelectedAddress = {setCurrentSelectedAddress} currentSelectedAddress = {currentSelectedAddress} />
        <div className='flex flex-col gap-4'>
          {
            cartItems && cartItems?.items?.length > 0 && cartItems?.items.map((item) => (
              <CartItemsContent key={`item_${item?.productId}`} item = {item} handleOnCartItemDelete={handleOnCartItemDelete} handleUpdateCartItemQuantity={handleUpdateCartItemQuantity}/>
            ))
          }
          <div className='mt-8 space-y-4'>
            <div className='flex justify-between'>
              <span className='font-bold'>Total</span>
              <span className='font-bold'>₹{totalCartAmount}</span>
            </div>
          </div>
          <div className='w-full mt-5'>
            <Button disabled = {cartItems?.items?.length <= 0} onClick = {handleCashFreePayment} className = "w-full h-10">
              {
                isPaymentStart ? "Processing":"Go To Payment"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCheckoutPage