import React, { useState, useEffect } from "react";
import Papa from "papaparse";  // Importing PapaParse for CSV parsing
import "./App.css";

function App() {
    const [bookName, setBookName] = useState("");  // State for the input book name
    const [recommendedBooks, setRecommendedBooks] = useState([]);  // State for recommended books
    const [posterUrls, setPosterUrls] = useState([]);  // State for book posters
    const [error, setError] = useState("");  // State for handling errors
    const [bookList, setBookList] = useState([]);  // State for the dropdown list from CSV

    // Fetch CSV data (book names) from public/book.csv
    useEffect(() => {
        fetch("/book.csv")  // Correct path to the CSV file in public folder
            .then((response) => response.text())  // Read as plain text
            .then((csvData) => {
                Papa.parse(csvData, {
                    complete: (result) => {
                        // Assuming the first column of the CSV contains book names
                        const books = result.data
                                .map((row) => row[0])  // Extract the book names
                                .filter((book, index) => index !== 0);  // Remove the first row (header)
                            setBookList(books);  // Set the book names to the dropdown
                        },
                        header: false,  // No header row in CSV
                    });
                })
                .catch((err) => {
                    console.error("Error fetching CSV:", err);
                    setError("Failed to load book data.");
                });
        }, []);
    // Handle input change for book name
    const handleInputChange = (e) => {
        setBookName(e.target.value);
    };

    // Handle dropdown change for selecting a book
    const handleDropdownChange = (e) => {
        setBookName(e.target.value);
    };

    // Fetch recommendations from Flask API
    const fetchRecommendations = async () => {
        try {
            const response = await fetch("http://localhost:5002/api/recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ book_name: bookName }),
            });

            const data = await response.json();

            if (response.ok) {
                setRecommendedBooks(data.recommended_books);
                setPosterUrls(data.poster_url);
                setError("");  // Clear any previous errors
            } else {
                setRecommendedBooks([]);  // Clear previous recommendations
                setPosterUrls([]);  // Clear previous poster URLs
                setError(data.error || "Failed to fetch recommendations.");
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            setError("An error occurred while fetching recommendations.");
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                {/* Title and Description */}
                <h1>Meet Your Next Favourite Book</h1>
                <p>Deciding what to read next? You're in the right place. Tell us what titles or genres you've enjoyed in the past, and we'll give you surprisingly insightful recommendations.</p>

                <div className="form-container">
                    <input
                        type="text"
                        placeholder="Enter Book Name"
                        value={bookName}
                        onChange={handleInputChange}
                    />
                    <select onChange={handleDropdownChange} value={bookName}>
                        <option value="">Select a Book</option>
                        {bookList.map((book, index) => (
                            <option key={index} value={book}>
                                {book}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={fetchRecommendations}>Get Recommendations</button>

                {/* Display error message */}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {/* Display recommended books side by side */}
                {recommendedBooks.length > 0 && !error && (
                    <div className="recommendations">
                        <h3>Recommended Books:</h3>
                        <div className="books-list">
                            {recommendedBooks.slice(0, 5).map((book, index) => (
                                <div key={index} className="book">
                                    <p>{book}</p>
                                    {posterUrls[index] && <img src={posterUrls[index]} alt={book} />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
