import express from 'express';
import { Roomdata, deleteBooking, getAllData, getUserData, signin, signup, verifyToken } from '../Controllers/HotelController.js'

const router = express.Router()
router.use(express.json());

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/roomdata', verifyToken, Roomdata);
router.get("/alldata", getAllData);
router.get('/alldata/:userId', getUserData);

//problem
router.delete('/bookings/:bookingId', deleteBooking);
export default router;

