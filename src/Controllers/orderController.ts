import { createOrder, processOrderItem, updateOrderTotalAmount } from '../services/orderService';

const db = require('../Database/Models/index.ts');
export const placeOrder = async (req, res) => {
  const transaction1 = await db.sequelize.transaction();
  try {
    const products = req.body;
    const newOrder = await createOrder(transaction1);
    let totalPrice = 0;
    for (const item of products) {
      await processOrderItem(item, newOrder, totalPrice, transaction1);
    }
    // await updateOrderTotalAmount(newOrder, totalPrice,transaction1);
    await transaction1.commit();
    res.status(200).json(newOrder);

    } catch (error: any) {
      await transaction1.rollback();
      if (error.message.includes("Insufficient quantity")) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error." });
      }
    }
};