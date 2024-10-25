import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      alert("Please enter a value to search.");
      return;
    }
    try {
      // Correctly set the URL based on the selected search criteria
      const response = await axios.get(
        `http://localhost:5000/${searchBy}/${encodeURIComponent(searchQuery)}`
      );

      // Navigate to the search results page
      navigate(
        `/search?query=${encodeURIComponent(searchQuery)}&searchBy=${searchBy}`
      );
      setSearchQuery(""); // Clear the search input
    } catch (err) {
      console.error("Error searching for books:", err);
      alert("An error occurred while searching. Please try again.");
    }
  };

  const navigateToRecommended = () => {
    navigate("/#recommendation");
  };

  const navigateToBestsellers = () => {
    navigate("/#bestsellers");
  };

  return (
    <header className="bg-blue-900 text-white p-4 text-xl">
      <nav>
        <ul className="flex space-x-4">
          <div className="text-2xl font-bold mr-8">THE LIBRARIANS</div>
          <li>
            <Link to="/" className="hover:text-gray-400">
              Home
            </Link>
          </li>
          <li>
            <button
              onClick={navigateToBestsellers}
              className="hover:text-gray-400"
            >
              Bestsellers
            </button>
          </li>
          <li>
            <button
              onClick={navigateToRecommended}
              className="hover:text-gray-400"
            >
              Recommended
            </button>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/profile" className="hover:text-gray-400">
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:text-gray-400">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="hover:text-gray-400">
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-4 flex items-center">
          <select
            className="p-2 text-black rounded mr-2"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
          </select>
          <input
            type="text"
            className="p-2 text-black rounded"
            placeholder={`Search by ${searchBy}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded ml-2"
          >
            Search
          </button>
        </form>
      </nav>
    </header>
  );
};

export default Header;
