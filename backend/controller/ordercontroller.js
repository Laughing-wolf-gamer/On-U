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

export const addItemsToBag = A(async (req, res) => {
    try {
      // console.log("Bag Body",req.body)
      const {userId,productId,quantity,color,size} = req.body
      if(!userId || !productId || !quantity || !color || !size){
        return res.status(400).json({message: "Please provide all the required fields"})
      }
      const FindUserBag = await Bag.findOne({userId});
      if(!FindUserBag){
        const bag = new Bag({userId,orderItems:[{productId,quantity,color,size}]})
        
        await bag.save()
      }else{
        const userBag = await Bag.findOne({userId})
        const product = userBag.orderItems.find(p => p.productId == productId)
        if(product){
          product.quantity = product.quantity + quantity
        }
        await userBag.save()
      }
      const bag = await Bag.findOne({userId}).populate('orderItems.productId orderItems.color orderItems.size orderItems.quantity')
      console.log("Bag Items: ",bag)
      res.status(200).json({success:true,message:"Successfully added Items to Bag",bag})
    } catch (error) {
      console.error("Error Occurred during creating bag", error)
      res.status(500).json({message: "Internal Server Error"})
    }
 
 })

export const getbag = async (req, res) => {
  try {
    // console.log("Get Bag Prams: ",req.params)
    const{userId} = req.params;
    const bag = await Bag.findOne({userId}).populate('orderItems.productId')
    // console.log("Bag Items: ",bag)
    
    res.status(200).json({
      success:true,
      bag
    })
    
  } catch (error) {
    console.error("Error Occurred during getting bag ", error.message)
    // res.status(500).json({message: "Internal Server Error"})
  }

}

export const updateqtybag = A(async (req, res, next) => {
  try {
    // console.log("Update Bag User: ",req.user)
    const {id, qty} = req.body
    const bag = await Bag.findOne({userId: req.user.id});
    const product = bag.orderItems.find(p => p.productId == id)
    product.quantity = qty
    await bag.save()
    res.status(200).json({success:true,message:"Successfully updated Bag",bag})
    
  } catch (error) {
    console.error("Error Occurred during updating bag ", error.message)
    res.status(500).json({message: "Internal Server Error"}) 
    
  }
    /* const bag = await Bag.updateOne({'orderItems._id':id},{
      $set:{'orderItems.$.qty': qty}
    })

    res.status(200).json({
        success:true
        
    }) */
 
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