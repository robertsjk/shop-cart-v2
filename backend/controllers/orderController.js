import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// POST /api/orders
// PRIVATE
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('no order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// GET /api/orders/myorders
// PRIVATE
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// GET /api/orders/:id
// PRIVATE
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'User',
    'name email'
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// GET /api/orders/:id/pay
// PRIVATE
const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.send('update order to paid');
});

// GET /api/orders/:id/deliver
// PRIVATE
const updateOrderTDelivered = asyncHandler(async (req, res) => {
  res.send('update order to delivered');
});

// GET /api/orders
// PRIVATE / ADMIN
const getOrders = asyncHandler(async (req, res) => {
  res.send('get all orders');
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderTDelivered,
  getOrders,
};
