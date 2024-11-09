const express = require("express");
const router = express.Router();
const Order = require("../models/order"); // Adjust path as needed

// GET all orders
router.get("/orders/", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.bookId"); // Fetch all orders and populate book details
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders: " + err.message });
  }
});

// GET an order by ID
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.bookId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET orders by customer email
router.get("/orders/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await Order.find({
      email: new RegExp(email, "i"),
    }).populate("items");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for the given email" });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new order
router.post("/orders/", async (req, res) => {
  try {
    const {
      shippingDetails: { name, address, city, postalCode, phoneNumber },
      checkoutItems,
      totalAmount,
    } = req.body;

    // Ensure the totalAmount is a number, convert if necessary
    const totalAmountNumber = parseFloat(totalAmount);

    // Process the checkoutItems array (you can also perform additional validation here if needed)
    const items = checkoutItems.map((item) => ({
      bookId: item.bookId,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    }));

    // Create a new order document
    const newOrder = new Order({
      customerName: name,
      shippingAddress: address,
      city,
      postalCode,
      phoneNumber,
      items,
      totalAmount: totalAmountNumber,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT to update order status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE an order
router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.remove();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
