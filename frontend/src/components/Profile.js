import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoIosPerson,
  IoIosMail,
  IoIosCall,
  IoIosCart,
  IoIosHeart,
} from "react-icons/io";

const Profile = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bookDetails, setBookDetails] = useState({});
  const [showOrders, setShowOrders] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch orders
      axios
        .get(`http://localhost:5000/orders/${user.Email}`)
        .then((response) => {
          setOrders(response.data);
          fetchBookDetails(response.data.map((order) => order.bookId));
        })
        .catch((error) => console.error("Error fetching orders:", error));

      // Fetch wishlist
      axios
        .get(`http://localhost:5000/wishlist/${user.Email}`)
        .then((response) => {
          setWishlist(response.data.items || []);
          fetchBookDetails(response.data.items.map((item) => item.bookId));
        })
        .catch((error) => console.error("Error fetching wishlist:", error));
    }
  }, [user]);

  const fetchBookDetails = async (bookIds) => {
    const promises = bookIds.map((bookId) =>
      axios.get(`http://localhost:5000/${bookId}`).catch((error) => {
        if (error.response?.status === 404) {
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
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-lg text-gray-700 font-semibold">
            No user data found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
          User Profile
        </h2>
        <div className="space-y-4">
          {/* User Info Section */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner flex items-center">
            <IoIosPerson className="text-2xl text-blue-600 mr-4" />
            <p className="text-gray-700 text-lg">
              <strong className="font-medium">First Name: </strong>
              {user.FName}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner flex items-center">
            <IoIosPerson className="text-2xl text-blue-600 mr-4" />
            <p className="text-gray-700 text-lg">
              <strong className="font-medium">Last Name: </strong>
              {user.LName}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner flex items-center">
            <IoIosMail className="text-2xl text-blue-600 mr-4" />
            <p className="text-gray-700 text-lg">
              <strong className="font-medium">Email: </strong>
              {user.Email}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner flex items-center">
            <IoIosCall className="text-2xl text-blue-600 mr-4" />
            <p className="text-gray-700 text-lg">
              <strong className="font-medium">Phone: </strong>
              {user.Mobile}
            </p>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mt-8">
          <h3
            className="text-2xl font-semibold text-blue-900 cursor-pointer flex items-center"
            onClick={() => setShowOrders(!showOrders)}
          >
            <IoIosCart className="text-xl mr-2" />
            Orders{" "}
            {showOrders ? (
              <IoIosArrowUp className="inline-block text-xl" />
            ) : (
              <IoIosArrowDown className="inline-block text-xl" />
            )}
          </h3>
          {showOrders && orders.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="bg-gray-100 p-4 rounded-lg shadow"
                >
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ${order.totalAmount}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  {bookDetails[order.bookId] && (
                    <div className="flex items-center mt-2">
                      <img
                        src={bookDetails[order.bookId].img}
                        alt={bookDetails[order.bookId].title}
                        className="w-16 h-24 mr-4"
                      />
                      <div>
                        <p>
                          <strong>Title:</strong>{" "}
                          {bookDetails[order.bookId].title}
                        </p>
                        <p>
                          <strong>Price:</strong> $
                          {bookDetails[order.bookId].price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            showOrders && <p className="text-gray-600 mt-4">No orders found</p>
          )}
        </div>

        {/* Wishlist Section */}
        <div className="mt-8">
          <h3
            className="text-2xl font-semibold text-blue-900 cursor-pointer flex items-center"
            onClick={() => setShowWishlist(!showWishlist)}
          >
            <IoIosHeart className="text-xl mr-2" />
            Wishlist{" "}
            {showWishlist ? (
              <IoIosArrowUp className="inline-block text-xl" />
            ) : (
              <IoIosArrowDown className="inline-block text-xl" />
            )}
          </h3>
          {showWishlist && wishlist.length > 0 ? (
            <ul className="space-y-4 mt-4">
              {wishlist.map((item) => (
                <li
                  key={item.bookId}
                  className="bg-gray-100 p-4 rounded-lg shadow"
                >
                  {bookDetails[item.bookId] && (
                    <div className="flex items-center">
                      <img
                        src={bookDetails[item.bookId].img}
                        alt={bookDetails[item.bookId].title}
                        className="w-16 h-24 mr-4"
                      />
                      <div>
                        <p>
                          <strong>Title:</strong>{" "}
                          {bookDetails[item.bookId].title}
                        </p>
                        <p>
                          <strong>Price:</strong> $
                          {bookDetails[item.bookId].price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            showWishlist && (
              <p className="text-gray-600 mt-4">No items in wishlist</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
