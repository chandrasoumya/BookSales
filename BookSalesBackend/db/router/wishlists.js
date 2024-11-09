const express = require("express");
const router = express.Router();
const Wishlist = require("../models/wishlist"); // Adjust path as needed

// GET all wishlist items for a user by email
router.get("/wishlist/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const wishlist = await Wishlist.findOne({ email }).populate("items");
    if (!wishlist) {
      return res
        .status(404)
        .json({ message: "No wishlist found for this email" });
    }
    res.json(wishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist: " + err.message });
  }
});

// POST add a new item to wishlist
router.post("/wishlist", async (req, res) => {
  try {
    const { email, mobile, bookId, title } = req.body;

    let wishlist = await Wishlist.findOne({ email });

    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = new Wishlist({
        email,
        mobile,
        items: [{ bookId, title }],
      });
    } else {
      // Check if the item already exists in the wishlist
      const itemExists = wishlist.items.some(
        (item) => item.bookId.toString() === bookId
      );

      if (itemExists) {
        return res.status(400).json({ message: "Item already in wishlist" });
      }

      // Add the new item to the wishlist
      wishlist.items.push({ bookId, title });
    }

    const savedWishlist = await wishlist.save();
    res.status(201).json(savedWishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to wishlist: " + err.message });
  }
});

// DELETE an item from wishlist by bookId
router.delete("/wishlist/:email/:bookId", async (req, res) => {
  try {
    const { email, bookId } = req.params;

    const wishlist = await Wishlist.findOne({ email });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter((item) => item.bookId !== bookId);
    const updatedWishlist = await wishlist.save();
    res.json({
      message: "Item removed from wishlist",
      wishlist: updatedWishlist,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting item from wishlist: " + err.message });
  }
});

module.exports = router;
