import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../axios";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navbarRef = useRef(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchInitialData();
    updateCartCount();
  }, []);

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cartItems.length);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      await API.get(`/products`);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleNavbarToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleLinkClick = () => {
    setIsNavCollapsed(true);
    setShowDropdown(false);
  };

  const handleAddProductClick = (e) => {
    e.preventDefault();
    setIsNavCollapsed(true);
    setShowDropdown(false);

    const role = localStorage.getItem("role");
    const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

    if (isAdmin) {
      navigate("/add_product");
    } else {
      toast.error("Access denied: Admin only!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  // Live search as the user types (hits your backend search endpoint)
  const handleInputChange = async (value) => {
    setInput(value);

    if (value.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      // Calls your @GetMapping("/products/search") endpoint
      const response = await API.get(`/products/search?keyword=${value}`);
      setSearchResults(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent full page reload on form submit
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // When clicking a product from the dropdown list
  const handleSelectProduct = (productId) => {
    setShowDropdown(false);
    setInput("");
    navigate(`/product/${productId}`); // Or wherever your individual product page is routed
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm" ref={navbarRef}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Viktor
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavbarToggle}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/" onClick={handleLinkClick}>
                Home
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/add_product" onClick={handleAddProductClick}>
                Add Product
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/orders" onClick={handleLinkClick}>
                Orders
              </a>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            <a href="/cart" className="nav-link text-dark me-3 position-relative" onClick={handleLinkClick}>
              <i className="bi bi-cart me-1"></i>
              Cart
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </a>

            {token ? (
              <div className="d-flex align-items-center me-3">
                <span className="me-2 text-muted small">Hi, {username}</span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center me-3">
                <a
                  href="/login"
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={handleLinkClick}
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="btn btn-primary btn-sm"
                  onClick={handleLinkClick}
                >
                  Register
                </a>
              </div>
            )}

            {/* Search Form with Dropdown */}
            <div className="position-relative">
              <form className="d-flex" role="search" onSubmit={handleSubmit} id="searchForm">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Type to search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
                {isLoading && (
                  <span className="spinner-border spinner-border-sm text-success position-absolute end-0 top-50 translate-middle-y me-3" role="status"></span>
                )}
              </form>

              {/* Live Search Dropdown Menu */}
              {showDropdown && (
                <ul className="dropdown-menu show w-100 shadow-sm mt-1" style={{ maxHeight: "300px", overflowY: "auto", position: "absolute" }}>
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <li key={product.id}>
                        <button
                          className="dropdown-item d-flex justify-content-between align-items-center py-2"
                          type="button"
                          onClick={() => handleSelectProduct(product.id)}
                        >
                          <span className="text-truncate me-2">{product.name}</span>
                          <span className="badge bg-secondary">${product.price}</span>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="dropdown-item text-muted text-center py-2">No products found</span>
                    </li>
                  )}
                </ul>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
