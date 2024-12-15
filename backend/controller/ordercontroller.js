import A from '../Middelwares/resolveandcatch.js'
import WhishList from '../model/wishlist.js'
import Bag from '../model/bag.js'
import Errorhandler from '../utilis/errorhandel.js'


export const createorder = A(async (req, res, next) => {
    
    const {} = req.body
  
  })

export const createwishlist = A(async (req, res, next) => {
   const {user, orderItems} = req.body
   const Finduser = await WhishList.find({user: user})
    if (Finduser.length !== 0 ) {
      const product = await WhishList.find({user:user})
      function f (data){
        return data.product ==  orderItems[0].product
      }
      if (product[0].orderItems.filter(f).length > 0) {
     
        return next(new Errorhandler("Product all ready added in Wishlist", 404));
      }else{
        await WhishList.updateOne({user: user}, {$push:{
          orderItems: [orderItems[0]]
        }})
      
      }
      
    }else{
       console.log('else')
      const wishlist = await WhishList.create(req.body)

    }
    
    res.status(200).json({
      success:true,
      
  })
  
  })

export const getwishlist = A(async (req, res, next) => {
    
    const wishlist = await WhishList.findOne({user: req.params.id}).populate('orderItems.product')

    res.status(200).json({
      success:true,
      wishlist
      
  })
  
})

export const createbag = A(async (req, res, next) => {
  // console.log(req.body)
  const {user, orderItems} = req.body
  console.log(orderItems)
  const Finduser = await Bag.find({user: user})
   if (Finduser.length !== 0 ) {
    
    const product = await Bag.find({user:user})
    function f (data){
      return data.product ==  orderItems[0].product
    }
    
    if ( product[0].orderItems.filter(f).length > 0 ) {

      return next(new Errorhandler("Product all ready added in Bag", 404));

    }else{

      await Bag.updateOne({user: user}, {$push:{
        orderItems: [orderItems[0]]
      }})
    
    }
     
   }else{

     await Bag.create(req.body)

   }
   
   res.status(200).json({
     success:true,
     
 })
 
 })

export const getbag = A(async (req, res, next) => {
    
  const bag = await Bag.findOne({user: req.params.id}).populate('orderItems.product')

  
  res.status(200).json({
    success:true,
    bag
    
})

})

export const updateqtybag = A(async (req, res, next) => {
 
  const {id, qty} = req.body
  
  const bag = await Bag.updateOne({'orderItems._id':id},{
    $set:{'orderItems.$.qty': qty}
  })

   res.status(200).json({
     success:true
     
 })
 
 })

export const deletebag = A(async (req, res, next) => {
  console.log(req.body)
  const {user, product} = req.body

  const users =  await Bag.updateOne({user: user}, {$pull:{
        orderItems: {product:product}
      }})
   
   res.status(200).json({
     success:true
     
 })
 
 })

export const deletewish = A(async (req, res, next) => {
  console.log(req.body)
  const {user, product} = req.body

  const users =  await updateOne({user: user}, {$pull:{
        orderItems: {product:product}
      }})

      console.log(users)
   
   res.status(200).json({
     success:true
     
 })
 
 })