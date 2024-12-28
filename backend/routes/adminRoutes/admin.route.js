import express from 'express';
import { addNewProduct, deleteProduct, editProduct, FetchAllFilters, fetchAllProducts, FetchCategoryFilter, FetchGenderFilter, FetchSubCategoryFilter, SetCategoryFilter, SetGenderFilter, SetSubCategoryFilter, uploadImage, uploadMultipleImages } from '../../controller/adminController/admin.product.controller.js';
import { getuser, logInUser, registerNewAdmin, setAboutData } from '../../controller/adminController/admin.auth.controller.js';
import ProtectAdminRoute from '../../Middelwares/adminProtectRoute.js';
import { upload } from '../../utilis/cloudinaryUtils.js';

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

route.put('/website/about',ProtectAdminRoute,setAboutData);




// filters routes...
route.get('/product/filters',FetchAllFilters);



export default route;