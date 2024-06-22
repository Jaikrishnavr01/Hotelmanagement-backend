import express from 'express';
import {signup} from '../Controllers/HotelController.js'

const router = express.Router()
router.use(express.json());

router.post('/signup',  signup);


export default router;

