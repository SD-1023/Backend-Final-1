import express, { Router } from 'express';
import { placeOrder } from '../Controllers/orderController';
const router: Router = express.Router();

//Endpoint to place an order to a user 
router.post('/', placeOrder);

export default router;