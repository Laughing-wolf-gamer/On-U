import express from 'express';
import { addNewProduct, createNewCoupon, deleteProduct, editCoupon, editProduct, fetchAllCoupons, fetchAllProducts, getallOrders, getOrderById, getProductById, removeCoupon, updateOrderStatus, uploadImage, uploadMultipleImages } from '../../controller/adminController/admin.product.controller.js';
import { addNewColorToSize, addNewSizeToProduct, getAllProducts, getCustomerGraphData, getMaxDeliveredOrders, getOrderDeliveredGraphData, getOrdersGraphData, getProductTotalStocks, getTotalOrders, getTotalUsers, getuser, logInUser, registerNewAdmin, removeColorFromSize, removeSizeFromProduct, UpdateColorStock, updateImages, UpdateSizeStock } from '../../controller/adminController/admin.auth.controller.js';
import ProtectAdminRoute from '../../Middelwares/adminProtectRoute.js';
import { upload } from '../../utilis/cloudinaryUtils.js';
import { isAuthenticateuser } from '../../Middelwares/authuser.js';

const route = express.Router();
route.post('/auth/register',registerNewAdmin)
route.post('/auth/login',logInUser)



route.get('/auth/check-auth',isAuthenticateuser,ProtectAdminRoute,getuser)
route.post('/product/add',ProtectAdminRoute,addNewProduct);
route.post('/upload-image',ProtectAdminRoute,upload.single('my_file'),uploadImage);
route.post('/upload-image-all',isAuthenticateuser,ProtectAdminRoute,upload.array('my_files[]',10),uploadMultipleImages);
route.get('/product/all',fetchAllProducts);
route.get('/product/get/:id',ProtectAdminRoute,getProductById);
route.put('/product/edit/:id',ProtectAdminRoute,editProduct);
route.delete('/product/del/:id',ProtectAdminRoute,deleteProduct);


route.get('/orders/getAllOrders',isAuthenticateuser,ProtectAdminRoute,getallOrders);
route.get('/orders/:orderId',isAuthenticateuser,ProtectAdminRoute,getOrderById)
route.put('/orders/updateOrderStatus/:orderId',isAuthenticateuser,ProtectAdminRoute,updateOrderStatus);



route.get('/stats/getTotalAllUsersCount',isAuthenticateuser,ProtectAdminRoute,getTotalUsers);
route.get('/stats/getMaxDeliveredOrders',isAuthenticateuser,ProtectAdminRoute,getMaxDeliveredOrders);
route.get('/stats/getCustomerGraphData',isAuthenticateuser,ProtectAdminRoute,getCustomerGraphData);
route.get('/stats/getOrderDeliveredGraphData',isAuthenticateuser,ProtectAdminRoute,getOrderDeliveredGraphData);

route.get('/stats/getOrderGraphData',isAuthenticateuser,ProtectAdminRoute,getOrdersGraphData);
route.get('/stats/getAllProductsCount',isAuthenticateuser,ProtectAdminRoute,getAllProducts);
route.get('/stats/getTotalOrdersLength',isAuthenticateuser,ProtectAdminRoute,getTotalOrders);


route.get('/stats/getTotalStock',isAuthenticateuser,ProtectAdminRoute,getProductTotalStocks);



route.patch('/product/update/updateSizeStock',isAuthenticateuser,ProtectAdminRoute,UpdateSizeStock);
route.patch('/product/update/updateColorStock',isAuthenticateuser,ProtectAdminRoute,UpdateColorStock);
route.patch('/product/update/addNewSizeStock',isAuthenticateuser,ProtectAdminRoute,addNewSizeToProduct);
route.patch('/product/update/addNewColorToSize',isAuthenticateuser,ProtectAdminRoute,addNewColorToSize);

route.patch('/product/update/removeColorFromSize',isAuthenticateuser,ProtectAdminRoute,removeColorFromSize);
route.patch('/product/update/removeSizeFromProduct',isAuthenticateuser,ProtectAdminRoute,removeSizeFromProduct);
route.patch('/product/update/updateImages',isAuthenticateuser,ProtectAdminRoute,updateImages);



// coupons.
route.post('/product/coupons/create',isAuthenticateuser,ProtectAdminRoute,createNewCoupon);
route.put('/product/coupons/edit/:couponId',isAuthenticateuser,ProtectAdminRoute,editCoupon);
route.delete('/product/coupons/remove/:couponId',isAuthenticateuser,ProtectAdminRoute,removeCoupon);
route.get('/product/coupons/all',isAuthenticateuser,ProtectAdminRoute,fetchAllCoupons);




// shipent logistic


export default route;