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

export const createOrder = async (transaction = null) => {
    try {
        return await db.Order.create({
            user_id: 1, // TODO: handel the user_id from the session 
            order_number: '#123456789', // TODO: Generate random order_number string
            order_date: db.sequelize.literal('CURRENT_TIMESTAMP'),
            status: 'processing',
            payment_method: 'Credit Card'
        }, { transaction });
    } catch (error: any) {
        console.error(`Failed to create an order: ${error.message}`);
    }
};

export const processOrderItem = async (item: IOrderItems, newOrder: IOrder, totalPrice: number, transaction = null) => {
    const product = await checkProductExistence(item.product_id, transaction);
    validateQuantity(item.quantity, product.stock_quantity, item.product_id);
  
    const newQuantity = product.stock_quantity - item.quantity;
    await updateProductStock(product, newQuantity, transaction);
  
    const discount = await getProductDiscount(product.id, transaction);
    const priceOfProductAfterDiscount = calculatePriceAfterDiscount(product, discount);
    const quantity = item.quantity;
    totalPrice += priceOfProductAfterDiscount * quantity;
  
    await createOrderItem(product, newOrder, quantity, transaction);
};

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
    product.stock_quantity = newQuantity;
    await product.save({ transaction });
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
    await db.OrderItem.create({
      price: product.price,
      quantity,
      order_id: newOrder.id,
      product_id: product.id,
    }, { transaction });
};

export const updateOrderTotalAmount = async (newOrder: any, totalPrice: number, transaction = null) => {
    newOrder.total_amount = totalPrice;
    await newOrder.save({ transaction });
};
  
