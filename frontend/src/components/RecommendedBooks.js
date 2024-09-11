import React from "react";

const RecommendedBooks = () => {
  const books = [
    { id: 1, title: "I'm a product", price: "$20.00", img: "book.webp" },
    { id: 2, title: "I'm a product", price: "$18.00", img: "book.webp" },
    { id: 3, title: "I'm a product", price: "$18.00", img: "book.webp" },
    { id: 4, title: "I'm a product", price: "$18.00", img: "book.webp" },
    // Add more products as needed
  ];

  return (
    <section className="py-10 bg-blue-900 text-white" id="recommandation">
      <h2 className="text-3xl font-bold text-center mb-6">
        This Month's Recommended Books
      </h2>
      <div className="container mx-auto grid grid-cols-4 gap-4">
        {books.map((book) => (
          <div key={book.id} className="text-center">
            <img src={book.img} alt={book.title} className="mx-auto mb-4" />
            <p>{book.title}</p>
            <p className="font-bold">{book.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedBooks;
