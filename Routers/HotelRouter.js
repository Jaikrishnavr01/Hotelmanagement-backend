import express from 'express';
import { Roomdata, getAllData, signin, signup, verifyToken } from '../Controllers/HotelController.js'

const router = express.Router()
router.use(express.json());

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/roomdata', verifyToken, Roomdata);
router.get("/alldata", getAllData);
export default router;

