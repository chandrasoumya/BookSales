import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/${id}`);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching book details.");
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>{error}</p>;

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
            <button className="bg-blue-600 text-white px-6 py-2 rounded  hover:bg-blue-950">
              Buy Now
            </button>
            <br></br>
            <br></br>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-950">
              Add to cart
            </button>
          </div>
        </div>
      ) : (
        <p>Book not found.</p>
      )}
    </div>
  );
};

export default BookDetails;
