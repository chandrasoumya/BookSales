import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Bestsellers from "./components/Bestsellers";
import RecommendedBooks from "./components/RecommendedBooks";
import Footer from "./components/Footer";
import BookDetails from "./components/BookDetails";
import Register from "./components/Register";
import Login from "./components/Login";
import SearchResults from "./components/SearchResults";
import Profile from "./components/Profile";
import Cart from "./components/Cart"; // Import Cart component

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <Router>
      <div>
        <Header user={user} setUser={setUser} />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <Bestsellers />
                <RecommendedBooks />
              </>
            }
          />
          <Route path="/book/:id" element={<BookDetails user={user} />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setUser={setUser} setToken={setToken} />}
          />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />{" "}
          {/* Cart route */}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
