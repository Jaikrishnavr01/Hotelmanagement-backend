import express from 'express';
import { Roomdata, signin, signup, verifyToken } from '../Controllers/HotelController.js'

const router = express.Router()
router.use(express.json());

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/roomdata',verifyToken,Roomdata)


export default router;

