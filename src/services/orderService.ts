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

interface IOrderItems {
    id: number;
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    product_id: number;
    order_id: number;
}

export const createOrder = async (userID: number,transaction = null) => {
    try {
        let orderNumber = generateOrderNumber()
        return await db.Order.create({
            user_id: userID, 
            order_number: orderNumber,
            order_date: db.sequelize.literal('CURRENT_TIMESTAMP'),
            status: 'processing',
            payment_method: 'Credit Card'
        }, { transaction });
    } catch (error: any) {
        throw new Error(`Failed to create an order`);
    }
};

function generateOrderNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const randomString = `#${String(randomNumber).padStart(9, '0')}`;
    return randomString;
}

export const processOrderItem = async (item: IOrderItems, newOrder: IOrder, transaction = null) => {
    const product = await checkProductExistence(item.product_id, transaction);
    const quantity = item.quantity;

    validateQuantity(quantity, product.stock_quantity, item.product_id);
  
    const newStockQuantity = product.stock_quantity - quantity;
    await updateProductStock(product, newStockQuantity, transaction);

    await createOrderItem(product, newOrder, quantity, transaction);
};

// const discount = await getProductDiscount(product.id, transaction);
// const priceOfProductAfterDiscount = calculatePriceAfterDiscount(product, discount);
// totalPrice += priceOfProductAfterDiscount * quantity;
// these can be used to measure the total amount of the order items with the discount

const checkProductExistence = async (productId: number, transaction = null) => {
    const product = await db.Product.findOne({
      where: {
        id: productId,
      }
    }, { transaction });
  
    if (!product) {
      throw new Error(`Product with ID ${productId} not found.`);
    }
  
    return product;
};

const validateQuantity = (requestedQuantity: number, availableQuantity: number, productId: number) => {
    if (requestedQuantity > availableQuantity) {
        throw new Error(`Insufficient quantity for product with ID ${productId}.`);
    }
};
  
const updateProductStock = async (product: any, newQuantity: number, transaction = null) => {
    try {
        product.stock_quantity = newQuantity;
        await product.save({ transaction });
    } catch (error) {
        throw new Error(`failed to update product stock with ID ${product.id}.`);
    }
};


const getProductDiscount = async (productId: number, transaction = null) => {
    return await db.Discount.findOne({
      where: {
        id: productId,
      }
    }, { transaction });
};

const calculatePriceAfterDiscount = (product: IProduct, discount: IDiscount) => {
    const productPrice = product.price || 0;
    const discountPercentage = discount?.is_valid ? discount.percentage / 100 : 0;
    return productPrice - (discountPercentage * productPrice);
};

const createOrderItem = async (product: IProduct, newOrder: IOrder, quantity: number, transaction = null) => {
    try {
        await db.OrderItem.create({
          price: product.price,
          quantity,
          order_id: newOrder.id,
          product_id: product.id,
        }, { transaction });
    } catch (error:any) {
        throw new Error(`failed to create and order item for product with ID ${product.id}.`);
    }
};

export const updateOrderTotalAmount = async (newOrder: any, totalPrice: number, transaction = null) => {
    try {        
        newOrder.total_amount = totalPrice;
        await newOrder.save({ transaction });
    } catch (error) {
        throw new Error(`failed to update order total amount for order with ID ${newOrder.id}.`);
    }
};

export const getUserIdFromSession = async (session: string) => {
    const userSession = await db.Session.findOne({ where: { session } });
    if (!userSession) {
        throw new Error('Session not found');
    }
    const id = userSession.user_id; // get the user id from the session
    const user = await db.User.findOne({ where: { id } });
    if (!user) {
        throw new Error('User not found');
    }
    const userID = id
    return userID
}
