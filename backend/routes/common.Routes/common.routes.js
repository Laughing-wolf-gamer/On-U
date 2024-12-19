import express from 'express';
import { addHomeCarousal, getBanners } from '../../controller/commonControllers/common.controller.js';

const route = express.Router();

route.post('/create/home',addHomeCarousal)
route.get('/fetch/all',getBanners)
export default route