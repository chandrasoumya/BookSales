import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`/api/users/${user.Email}/cart`);
      setCartItems(response.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleQuantityChange = async (bookId, quantity) => {
    try {
      await axios.put(`/api/users/${user.Email}/cart`, { bookId, quantity });
      fetchCart();
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await axios.delete(`/api/users/${user.Email}/cart/${bookId}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div
              key={item.bookId}
              className="flex justify-between items-center mb-4"
            >
              <div className="flex items-center">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-16 h-16 mr-4"
                />
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div>
                <p className="font-bold">${item.price.toFixed(2)}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.bookId, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.bookId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button onClick={() => handleRemoveItem(item.bookId)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <p className="font-bold">Total: ${calculateTotal()}</p>
            <Link to="/checkout">
              <button className="bg-blue-500 text-white p-2 rounded">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
