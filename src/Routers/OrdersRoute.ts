import express, { Router } from 'express';
import * as orderController from '../Controllers/orderController';
const router: Router = express.Router();

//Endpoint to place an order to a user 
router.post('/', orderController.placeOrder);

export default router;