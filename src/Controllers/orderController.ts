import * as categoryService from '../services/categoryService';

const db = require('../Database/Models/index.ts');
interface IProduct {
  id: number;
  name: string;
  sub_title: string;
  model: string;
  description: string;
  price: number;
  stock_quantity: number;
}

interface IOrder {
  id: number;
  order_number: number;
  total_amount: number;
  order_date: string;
  status: string;
  payment_method: string;
}

interface IDiscount {
  id: number;
  percentage: number;
  start_date: string;
  end_date: string;
  is_valid: boolean;
}

export const placeOrder = async (req, res) => {
  try {
    const products = req.body;

    const newOrder = await db.Order.create({
      order_number: 'ORD123', // what is order_number
      total_amount: 0,
      order_date: db.sequelize.literal('CURRENT_TIMESTAMP'),
      status: 'Pending',
      payment_method: 'Credit Card'
    }) as unknown as IOrder | null ;

    let totalPrice = 0;
    for (const item of products) {
      //Check Product Existence
      const product = await db.Product.findOne({
        where: {
          id: item.product_id,
        }
      }) as IProduct | null;

      const discount = await db.Discount.findOne({
        where: {
          id: product?.id,
        }
      }) as IDiscount | null;
      
      let productPrice = (product ? product.price : 0);
      let discountPercentage = (discount?.is_valid ? discount.percentage : 0) / 100;
      let priceOfProductAfterDiscount =  productPrice - (discountPercentage * productPrice);
      let quantity = item.quantity;
      totalPrice += (priceOfProductAfterDiscount*quantity);
      await db.OrderItem.create({
        price: productPrice,
        quantity: quantity,
        order_id: newOrder?.id,
        product_id: product?.id,   
      });
    }

    await newOrder?.set(
      {
        total_amount: totalPrice,
      }
    )
    await newOrder?.save();

      res.status(200).json(newOrder);
    } catch (error) {
      res.status(500).json(error);
    }
};
