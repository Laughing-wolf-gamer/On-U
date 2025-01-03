import A from '../Middelwares/resolveandcatch.js'
import WhishList from '../model/wishlist.js'
import Bag from '../model/bag.js'
import Errorhandler from '../utilis/errorhandel.js'
import OrderModel from '../model/ordermodel.js'
import ProductModel from '../model/productmodel.js'
import { console } from 'inspector'

export const createorder = async (req, res, next) => {
  console.log("Order User ID:", req.user?.id);
  console.log("Order Items Count:", req.body?.orderItems?.length);

  try {
    if (!req.user) {
      return res.status(400).json({ success: false, message: "No User Found" });
    }

    const { orderItems, Address, bagId, TotalAmount, paymentMode, status } = req.body;

    if (!orderItems || !Address || !bagId || !TotalAmount || !paymentMode || !status) {
      return res.status(400).json({ success: false, message: "Please Provide All the Data" });
    }

    const orderData = new OrderModel({
      userId: req.user.id,
      orderItems,
      SelectedAddress: Address,
      TotalAmount,
      paymentMode,
      status,
    });

    await orderData.save();

    const removingAmountPromise = orderItems.map(async item => {
      try {
        console.log("All Orders Items: ", item.productId._id, item.color.label, item.size, item.quantity);
        await removeProduct(item.productId._id, item.color.label, item.size, item.quantity);
      } catch (err) {
        console.error(`Error removing product: ${item?.productId?._id}`, err);
      }
    });

    await Promise.all(removingAmountPromise);

    // Uncomment and handle bag removal if needed
    const bagToRemove = await Bag.findByIdAndDelete(bagId);
    console.log("Bag Removed:", bagToRemove);
    res.status(200).json({ success: true, message: "Order Created Successfully", result: orderData });

  } catch (error) {
    console.error("Error creating Order:", error);
    res.status(500).json({ success: false, message: "Internal server Error" });
  }
};

const removeProduct = async(productId,color,size,quantity) => {
  try {
    const product = await ProductModel.findById(productId);
    if(!product) {
      console.log("Product Not Found: ",productId);
      return
    } ;
    const activeSize = product.size.find(s => s?.label == size);
    if(!activeSize) {
      console.log("Size Not Found: ",size);
      return
    }
    const activeColor = activeSize.colors.find(c => c?.label == color);
    if(!activeColor) {
      console.log("Color Not Found: ",color);
      return
    }
    const colorReducedAmount = activeColor.quantity - quantity
    const sizeReducedAmount = activeSize.quantity - quantity
    console.log("Reduced Amount: ",colorReducedAmount,sizeReducedAmount);
    activeColor.quantity = colorReducedAmount;
    activeSize.quantity = sizeReducedAmount;
    const AllColors = []
    product.size.forEach(s => {
      if(s.colors){
        s.colors.forEach(c => {
          AllColors.push(c);
        });
      }
    });
    product.AllColors = AllColors;
    if (product.size && product.size.length > 0) {
      let totalStock = 0;
      // updateFields.size = activeSize
      product.size.forEach(s => {
          let sizeStock = 0;
          if(s.colors){
              s.colors.forEach(c => {
                sizeStock += c.quantity;
              });
          }
          totalStock += sizeStock;
      })
      // console.log("Colors: ",AllColors);
      if(totalStock > 0) product.totalStock = totalStock;
    };
    await product.save();
    console.log("Product Updated: ",product);
  } catch (error) {
    console.error("Error Removing Product: ",error)
  }
}
export const getallOrders = A(async (req, res, next) => {
  try {
    console.log("Order User",req.user);  
    if(!req.user){
      return res.status(400).json({success:false,message:"No User Found!",result:[]});
    }
    const orders = await OrderModel.find({userId:req.user.id});
    
    res.status(200).json({success:true,message:"Successfully Fetched Orders",result:orders || []})

  } catch (error) {
    console.error("Error Fetching Orders...",error)
    res.status(500).json({success:false,message:"Internal server Error"});
  }
  
})
export const getOrderById = A(async (req, res, next) => {
  // console.log("Order Id: ",req.params,req.user);
  try {
    const{orderId} = req.params
    if(!orderId){
      return res.status(404).json({success:false,message:"Please Provide OrderId: ",result:null})
    }
    if(!req.user){
      return res.status(404).json({success:false,message:"Please Provide User: ",result:null})
    }
    const order = await OrderModel.findById(orderId);
    if(order.userId.toString() !== req.user.id){
      return res.status(400).json({success:false,message:`Not the User Order ${req.user.id}`});
    }
    res.status(200).json({success:true,message:"Found Order",result:order});
    
  } catch (error) {
    console.error("Error Getting Order Details: ",error);
    res.status(500).json({success:false,message:"Internal server Error"});
  }
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
    const bag = await Bag.findOne({ userId })
    .populate('orderItems.productId')
    .exec();
    console.log("Bag Items: ",bag)
    
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

export const deletebag = async (req, res) => {
  // console.log("Deleting Bag: ",req.user)
  try {
    const {productId} = req.body
    const bag = await Bag.findOne({userId: req.user.id});
    bag.orderItems = bag.orderItems.filter(p => p.productId != productId)
    if(bag.orderItems.length === 0){
      await Bag.findOneAndDelete({userId: req.user.id})
      return res.status(200).json({success:true,message:"Successfully deleted Bag"})
    }
    console.log("Bag Items: ",bag)
    await bag.save()
    res.status(200).json({success:true,message:"Successfully deleted Bag",bag})
    
  } catch (error) {
    console.error("Error Occurred during deleting bag ", error.message)
    res.status(500).json({message: "Internal Server Error"})
  }
}

export const deletewish = A(async (req, res, next) => {
  /* console.log(req.body)
  const {user, product} = req.body

  const users =  await updateOne({user: user}, {$pull:{
        orderItems: {product:product}
      }})

      console.log(users)
   
   res.status(200).json({
     success:true
     
 }) */
 
 })