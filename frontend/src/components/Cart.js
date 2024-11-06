import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [bookDetails, setBookDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${user.Email}/cart`
      );
      console.log(response.data.cart);
      setCartItems(response.data.cart);
      fetchBookDetails(response.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const fetchBookDetails = async (cartItems) => {
    setIsLoading(true);
    const bookIds = cartItems.map((item) => item.bookId);
    const promises = bookIds.map((bookId) =>
      axios.get(`http://localhost:5000/${bookId}`).catch((error) => {
        if (error.response.status === 404) {
          console.log(`Book not found: ${bookId}`);
          return null;
        } else {
          throw error;
        }
      })
    );
    const responses = await Promise.all(promises);
    const details = responses.reduce((acc, response) => {
      if (response && response.data) {
        acc[response.data.bookId] = response.data;
      }
      return acc;
    }, {});
    setBookDetails(details);
    setIsLoading(false);
  };

  const handleQuantityChange = async (bookId, quantity) => {
    try {
      await axios.put(`http://localhost:5000/users/${user.Email}/cart`, {
        bookId,
        quantity,
      });
      fetchCart();
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await axios.delete(
        `http://localhost:5000/users/${user.Email}/cart/${bookId}`
      );
      fetchCart();
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce(
        (total, item) =>
          total +
          (bookDetails[item.bookId]
            ? bookDetails[item.bookId].price * item.quantity
            : 0),
        0
      )
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
              {bookDetails[item.bookId] ? (
                <div className="flex items-center">
                  <img
                    src={bookDetails[item.bookId].img}
                    alt={bookDetails[item.bookId].title}
                    className="w-24 h-28 mr-4"
                  />
                  <div>
                    <h3 className="font-bold">
                      {bookDetails[item.bookId].title}
                    </h3>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
              <div>
                {bookDetails[item.bookId] ? (
                  <p className="font-bold">
                    ${bookDetails[item.bookId].price.toFixed(2)}
                  </p>
                ) : (
                  <p>Loading...</p>
                )}
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
