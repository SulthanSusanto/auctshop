import asyncHandler from 'express-async-handler'
import Order from '../models/Order.js'

// @desc    Add order items
// @route   POST /api/v1/order
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order item')
    return
  } else {
    const order = new Order({
      orderItems,
      User: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

// @desc    GET order item by Id
// @route   POST /api/v1/order/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('User')
  if (order) {
    res.json(order)
  } else {
    res.status(400)
    throw new Error('Order not found')
  }
})

// @desc    Update order to be paid
// @route   PUT /api/v1/order/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { id } = req.params

  const order = await Order.findById(id)

  if (order) {
    ;(order.isPaid = true), (order.paidAt = Date.now())
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(400)
    throw new Error('Order not found')
  }
})

// @desc    Get logged to user orders
// @route   GET /api/v1/order/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ User: req.user._id })
  res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('User', 'name id')
  res.json(orders)
})

// @desc    Update order to be delivered
// @route   PUT /api/v1/order/:id/deliver
// @access  Private/admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const { id } = req.params

  const order = await Order.findById(id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(400)
    throw new Error('Order not found')
  }
})
