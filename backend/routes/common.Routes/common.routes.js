import express from 'express';
import { addHomeCarousal, getHomeBanners } from '../../controller/commonControllers/common.controller.js';

const route = express.Router();

route.post('/create/home',addHomeCarousal)
route.get('/fetch/all/:ScreenType/:BannerType',getHomeBanners)
export default route