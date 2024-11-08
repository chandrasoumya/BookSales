import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookDetails = ({ user }) => {
  const { id } = useParams(); // Fetch the book's ID from the URL
  const navigate = useNavigate(); // useNavigate for navigation
  const [book, setBook] = useState(null); // State to hold book details
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track any errors
  const [itemInCart, setItemInCart] = useState(false); // fecth if item in cart

  // Function to handle adding the book to the cart
  const handleAddToCart = async () => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      console.log(user.Email, book.bookId);
      // Make a POST request to add the book to the cart
      await axios.post(`http://localhost:5000/users/${user.Email}/cart`, {
        bookId: book.bookId, // Use the book's ID
        quantity: 1, // Default quantity of 1
      });
      alert("Book added to cart");
    } catch (err) {
      // console.error("Error adding book to cart:", err);
      alert("Error adding book to cart");
    }
  };

  // Function to handle Buy Now button click
  const handleBuyNow = () => {
    if (!user) {
      alert("Please log in to proceed with the purchase.");
      return;
    }
    navigate("/order", {
      state: {
        checkoutItems: [
          {
            title: book.title,
            quantity: 1,
            bookId: book.bookId,
            price: book.price,
          },
        ],
        total: book.price,
      },
    });
  };

  // Function to handle adding the book to the wishlist
  const handleAddToWishlist = async () => {
    if (!user) {
      alert("Please log in to add items to your wishlist.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/wishlist/", {
        email: user.Email, // Include the user's email
        mobile: user.Mobile, // Include the user's mobile number
        bookId: book.bookId, // Use the book's ID
        title: book.title, // Include the book title
      });
      alert("Book added to wishlist");
    } catch (err) {
      alert(
        "Error adding book to wishlist: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Fetch the book details from the server
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${id}`);
        setBook(response.data); // Set the fetched book details in state
        setLoading(false);
      } catch (err) {
        setError("Error fetching book details.");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]); // Run when the component is mounted or `id` changes

  // Render loading or error message
  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>{error}</p>;

  // Render the book details
  return (
    <div className="container mx-auto py-10 min-h-screen">
      {book ? (
        <div className="flex">
          <img src={book.img} alt={book.title} className="w-1/3" />
          <div className="ml-8">
            <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
            <p className="mb-2">
              <strong>Author:</strong> {book.author}
            </p>
            <p className="mb-6">{book.description}</p>
            <p className="mb-2">
              <strong>Category:</strong> {book.category}
            </p>
            <p className="mb-2">
              <strong>Pages:</strong> {book.pages}
            </p>
            <p className="mb-2">
              <strong>Language:</strong> {book.language}
            </p>
            <p className="mb-2">
              <strong>Published Date:</strong>{" "}
              {new Date(book.publishedDate).toLocaleDateString()}
            </p>
            <p className="mb-2">
              <strong>Stock:</strong> {book.stock}
            </p>
            <p className="text-2xl font-bold mb-6">{book.price}</p>

            {/* Conditional rendering based on stock */}
            {book.stock > 0 ? (
              <>
                <button
                  onClick={handleBuyNow}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-950"
                >
                  Buy Now
                </button>
                <br />
                <br />
                <button
                  onClick={handleAddToCart}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-950"
                >
                  Add to Cart
                </button>
              </>
            ) : (
              <button
                onClick={handleAddToWishlist}
                className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-800"
              >
                Add to Wishlist
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>Book not found</p>
      )}
    </div>
  );
};

export default BookDetails;
