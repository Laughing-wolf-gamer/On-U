import A from '../Middelwares/resolveandcatch.js'
import WhishList from '../model/wishlist.js'
import Bag from '../model/bag.js'
import Errorhandler from '../utilis/errorhandel.js'
import OrderModel from '../model/ordermodel.js'
import ProductModel from '../model/productmodel.js'
import { fetchPayments, generateOrderRequest } from '../utilis/paymentGatwayHelper.js'
import Coupon from '../model/Coupon.model.js'
import WebSiteModel from '../model/websiteData.model.js'

export const createPaymentOrder = async (req, res, next) => {
  try {
    console.log("Order User ID:", req.user?.id);
    if (!req.user) {
      return res.status(400).json({ success: false, message: "No User Found" });
    }
    
    const { bagId, orderItems, totalAmount,address, paymentMode, orderStatus } = req.body;
    const orderData = await generateOrderRequest(totalAmount,req.user.id,orderItems,req.user.user.phoneNumber)
    
    console.log("orderRecept Data: ", orderData);
    if (!orderData) {
      return res.status(400).json({ success: false, message: "Please Provide All the Data" });
    }

    ;
    res.status(200).json({ success: true, message: "Order Created Successfully", result: orderData });

  } catch (error) {
    console.error("Error creating Order:", error);
    res.status(500).json({ success: false, message: "Internal server Error" });
  }
}

export const verifyPayment = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).json({ success: false, message: "No User Found" });
    }
    const{paymentData,SelectedAddress,orderDetails,totalAmount,bagId} = req.body;
    console.log("Payment Verification Request: ", req.body);
		console.log("Payments Data: ",bagId);
		if(!paymentData){
			return res.status(404).json({Success: false, message:"All Fields are required"})
		}
		const paymentStatus = await fetchPayments(paymentData.order_id);
		console.log("Payment Status: ", paymentStatus);
		if(!paymentStatus){
      return res.status(404).json({Success: false, message:"Payment not found"})
    }
		if(paymentStatus.length > 0){
			if(paymentStatus[0].payment_status === "SUCCESS"){
        const bagData = await Bag.findById(bagId).populate('orderItems.productId');
        if(bagData){
          console.log("Bag Data: ",bagData);
          const orderData = new OrderModel({
            userId: req?.user?.id,
            orderItems:orderDetails,
            SelectedAddress: SelectedAddress,
            TotalAmount:totalAmount,
            paymentMode:paymentStatus[0].payment_group,
            status:'Order Confirmed',
          });
      
          await orderData.save();
      
          const removingAmountPromise = orderDetails.map(async item => {
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
          res.status(200).json({ success: true, message: "Order Created Successfully", result: "SUCCESS",userId:req.user?.id });
          return;
        }
			}else{
				res.status(200).json({Success: true, message: 'Payment Not Completed!',result: "FAILED",userId:req.user?.id });
        return;
			}
		}
		res.status(200).json({Success: true, message: 'Payment Not Completed!',result: "FAILED",userId:req.user?.id });
	} catch (error) {
		console.error(`Error  while verifying payment request`,error);
    if(res.headersSent) return;
		res.status(500).json({Success:false, message: 'Internal Server Error',userId:req.user?.id });
	}
}


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
      status:'Processing',
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
    console.error("Error creating Order: ", error);
    if(res.headersSent) return;
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

export const applyCouponToBag = async(req,res)=>{
  try {
    const{id} = req.user;
    const{bagId} = req.params;
    const{couponCode} = req.body;
    
    const coupon = await Coupon.findOne({CouponCode: couponCode});
    console.log("Coupon Code: ",coupon)
    if(!coupon){
      return res.status(404).json({message: "Coupon Not Found"})
    }
    if (coupon.ValidDate < Date.now()) {
      return res.status(400).json({ message: "Coupon is expired" });
    }
    const bag = await  Bag.findById(bagId);
    console.error("Coupon bag",bag);
    if(!bag){
      return res.status(404).json({message: "Bag Not Found"})
    }
    if(bag.Coupon){
      return res.status(400).json({message: "Bag already has a coupon"})
    }
    if(bag.userId.toString() !== id){
      return res.status(400).json({message: "Coupon cannot be applied to this bag"})
    }
    bag.Coupon = coupon._id;
    coupon.Status = "Inactive";
    
    await Promise.all([
      coupon.save(),
      bag.save()
    ])
    res.status(200).json({success:true,message: "Coupon Applied Successfully"})
  } catch (error) {
    console.error("Failed to apply coupon: ",error);
    res.status(500).json({success:false,message:"Internal server error"});
  }

}
export const removeCouponToBag = async(req,res)=>{
  try {
    const{id} = req.user;
    const{bagId} = req.params;
    const{couponCode} = req.body;
    const bag = await Bag.findById(bagId).populate("Coupon");
    console.error("Coupon bag",bag);
    if(!bag){
      return res.status(404).json({message: "Bag Not Found"})
    }
    
    const coupon = await Coupon.findOne({CouponCode: couponCode});
    console.log("Coupon Code: ",coupon)
    if(!coupon){
      return res.status(404).json({message: "Coupon Not Found"})
    }
    if(!bag.Coupon){
      return res.status(400).json({message: "No Coupon Found"})
    }
    if(bag.userId.toString() !== id){
      return res.status(400).json({message: "Coupon cannot be applied to this bag"})
    }
    bag.Coupon = null;
    coupon.Status = "Active";
    
    await Promise.all([
      coupon.save(),
      bag.save()
    ])
    res.status(200).json({success:true,message: "Coupon Removed Successfully"})
  } catch (error) {
    console.error("Failed to apply coupon: ",error);
    res.status(500).json({success:false,message:"Internal server error"});
  }

}

export const addItemsToBag = A(async (req, res) => {
    try {
      console.log("Bag Body",req.body)
      const {userId,productId,quantity,color,size} = req.body
      if(!userId || !productId || !quantity || !color || !size){
        return res.status(400).json({message: "Please provide all the required fields"})
      }
      const FindUserBag = await Bag.findOne({userId});
      if(!FindUserBag){
        const convenienceFees = await WebSiteModel.findOne({tag:'ConvenienceFees'});
        const bag = new Bag({userId,ConvenienceFees:convenienceFees?.ConvenienceFees || 0,orderItems:[{productId,quantity,color,size}]})
        await bag.save()
      }else{
        const userBag = await Bag.findOne({userId})
        const product = userBag.orderItems.find(p => p.productId == productId)
        if(product){
          product.quantity = product.quantity + quantity
        }else{
          userBag.orderItems.push({productId,quantity,color,size})
        }
        const TotalBagAmount = calculateTotalAmount(bag.orderItems);
        userBag.TotalBagAmount = TotalBagAmount;
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
 function calculateTotalAmount(products) {
  return products.reduce((total, product) => {
    // Choose the salePrice if it exists, otherwise use the regular price
    const priceToUse = product.productId.salePrice || product.productId.price;
    return total + (product.quantity * priceToUse);
  }, 0);
}

 export const getbag = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the bag with populated orderItems.productId in one query
    const bag = await Bag.findOne({ userId }).populate('orderItems.productId Coupon').exec();

    if (!bag) {
      return res.status(404).json({ message: "Bag not found" });
    }

    console.log("Bag Items: ", bag);

    // Fetch all products from the bag's orderItems at once (reduce redundant DB calls)
    const productIds = bag.orderItems.map(o => o.productId._id);
    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Create a map for fast lookup of product sizes
    const productMap = products.reduce((acc, product) => {
      acc[product._id.toString()] = product;
      return acc;
    }, {});

    // Update size quantities based on original product data
    for (let o of bag.orderItems) {
      const originalProductData = productMap[o.productId._id.toString()];

      if (!originalProductData) {
        console.error(`Product with ID ${o.productId._id} not found`);
        continue;
      }

      // Find the corresponding size for the order item
      const originalProductSize = originalProductData.size.find(s => s._id.toString() === o.size._id);

      if (!originalProductSize) {
        console.error(`Size with ID ${o.size._id} not found for product ${o.productId._id}`);
        continue;
      }

      console.log("Bag Order Items size Quantity: ", o?.size?.quantity);

      // Update the size quantity if it doesn't match the original
      if (o?.size?.quantity !== originalProductSize?.quantity) {
        console.log("Updating size quantity");
        o.size.quantity = originalProductSize.quantity;
      }

      console.log("Original Product Size Quantity: ", originalProductSize.quantity);
    }

    // Save the updated bag
    await bag.save();

    res.status(200).json({
      success: true,
      bag
    });

  } catch (error) {
    console.error("Error Occurred during getting bag: ", error.message);
    res.status(500).json({ success:true, message: "Internal Server Error" });
  }
};



export const updateqtybag = async (req, res, next) => {
  try {
    // Destructure the request body to get the product ID and quantity
    const { id, qty } = req.body;

    // Find the original product from the database
    const originalProductData = await ProductModel.findById(id);
    if (!originalProductData) {
      return res.status(400).json({ message: "Product Not Found" });
    }

    // Find the user's shopping bag
    const bag = await Bag.findOne({ userId: req.user.id }).populate('orderItems.productId');;
    if (!bag) {
      return res.status(400).json({ message: "Bag Not Found" });
    }

    // Find the specific product in the user's bag
    const product = bag.orderItems.find(p => p.productId._id.toString() === id);
    if (!product) {
      return res.status(400).json({ message: "Product not found in bag" });
    }

    // Check if the product has a size and find the size data
    const originalProductDataSize = originalProductData.size.find(s => s._id.toString() === product.size._id.toString());
    if (!originalProductDataSize) {
      return res.status(400).json({ message: "Product size not found" });
    }

    // Log the original and updated product details for debugging
    // console.log("Original Product:", product);
    // console.log("Original Product Size:", originalProductDataSize);

    // If the size quantity in the bag doesn't match the original product size, update it
    if (product.size.quantity !== originalProductDataSize.quantity) {
      // console.log("Updating size quantity");
      product.size.quantity = originalProductDataSize.quantity; // Sync with original product size quantity
    }
    // Update the quantity in the bag
    product.quantity = qty;
    const TotalBagAmount = calculateTotalAmount(bag.orderItems);
    bag.TotalBagAmount = TotalBagAmount;
    console.log("Updated Bag:", bag);
    // Save the updated bag
    await bag.save();

    // Return a success response
    res.status(200).json({
      success: true,
      message: "Successfully updated Bag",
      bag
    });

  } catch (error) {
    console.error("Error Occurred during updating bag:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


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