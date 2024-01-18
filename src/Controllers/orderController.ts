import { createOrder, processOrderItem, getUserIdFromSession} from '../services/orderService';
import { placeOrderSchema } from '../validators/ordersSchema';

const db = require('../Database/Models/index.ts');

export const placeOrder = async (req, res) => {
  const transaction1 = await db.sequelize.transaction();
  try {
    await placeOrderSchema.validateAsync(req.body);
    const sessionId = req.headers['authorization'] as string;
    const userID = await getUserIdFromSession(sessionId);
    const products = req.body;

    const newOrder = await createOrder(userID, transaction1);
    for (const item of products) {
      await processOrderItem(item, newOrder, transaction1);
    }
    await transaction1.commit();
    res.status(200).json(newOrder);

    } catch (error: any) {
      await transaction1.rollback();
      if(error.isJoi === true){
        error.status = 422;
      }
      if (error.message.includes("Insufficient quantity")) {
        error.status = 409;
        res.status(error.status).json({ error: error.message });
      }else if(error.message.includes("Session not found")){
        error.status = 403;
        res.status(error.status).json({ error: error.message });
      } else {
        error.status = 500;
        res.status(error.status).json({ error: error.message });
      }
    }
};