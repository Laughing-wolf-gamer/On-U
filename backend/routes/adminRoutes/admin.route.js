import express from 'express';
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts, getallOrders, getOrderById, uploadImage, uploadMultipleImages } from '../../controller/adminController/admin.product.controller.js';
import { getuser, logInUser, registerNewAdmin } from '../../controller/adminController/admin.auth.controller.js';
import ProtectAdminRoute from '../../Middelwares/adminProtectRoute.js';
import { upload } from '../../utilis/cloudinaryUtils.js';
import { isAuthenticateuser } from '../../Middelwares/authuser.js';

const route = express.Router();
route.post('/auth/register',registerNewAdmin)
route.post('/auth/login',logInUser)
route.get('/auth/check-auth',ProtectAdminRoute,getuser)
route.post('/product/add',ProtectAdminRoute,addNewProduct);
route.post('/upload-image',ProtectAdminRoute,upload.single('my_file'),uploadImage);
route.post('/upload-image-all',ProtectAdminRoute,upload.array('my_files[]',10),uploadMultipleImages);
route.get('/product/all',fetchAllProducts);
route.put('/product/edit/:id',ProtectAdminRoute,editProduct);
route.delete('/product/del/:id',ProtectAdminRoute,deleteProduct);


route.get('/orders/all',isAuthenticateuser,ProtectAdminRoute,getallOrders);
route.get('/orders/:orderId',isAuthenticateuser,ProtectAdminRoute,getOrderById)






// filters routes...
// route.get('/product/filters',FetchAllFilters);



export default route;