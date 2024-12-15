import express from 'express';
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from '../../controller/adminController.js/admin.product.controller.js';
import ProtectAdminRoute from '../../Middelwares/adminProtectRoute.js';
import { upload } from '../../utilis/cloudinaryUtils.js';

const route = express.Router();
route.post('/product/add',ProtectAdminRoute,addNewProduct);
route.post('/upload-image',ProtectAdminRoute,upload.single('my_file'),uploadImage);
route.get('/product/all',ProtectAdminRoute,fetchAllProducts);
route.put('/product/edit/:id',ProtectAdminRoute,editProduct);
route.delete('/product/del/:id',ProtectAdminRoute,deleteProduct);



export default route;