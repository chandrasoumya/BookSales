import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input

  const handleLogout = () => {
    setUser(null); // Update the user state in the parent component
    navigate("/login"); // Redirect to login page after logout
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(searchQuery)}`
      );

      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    } catch (err) {
      console.error("Error searching for books:", err);
      alert("Book Not Found");
    }
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
            <a href="#bestsellers" className="hover:text-gray-400">
              Bestsellers
            </a>
          </li>
          <li>
            <a href="#recommandation" className="hover:text-gray-400">
              Recommended
            </a>
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
        <form onSubmit={handleSearch} className="mt-4">
          <input
            type="text"
            className="p-2 text-black rounded"
            placeholder="Search by title"
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
