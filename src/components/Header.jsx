import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';

const API_URL = 'http://localhost:3001/api';

function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchCart();
    
    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      fetchCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`);
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header-container">
      <div className="top-links-container">
        <div className="top-links container">
          <div className="top-links-area">
            <ul className="links">
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/admin">Admin</Link></li>
              <li><Link to="/login">Log In</Link></li>
            </ul>
          </div>
          <p className="welcome-msg">Welcome to the largest online store!</p>
        </div>
      </div>

      <div className="header container">
        <h1 className="logo">
          <Link to="/" title="Online Store">
            <strong>Online Store</strong>
          </Link>
        </h1>

        <div className="cart-area">
          <div className="custom-block" style={{ marginBottom: '4px', color: '#787d7f', fontSize: '14px', lineHeight: 'normal' }}>
            <div style={{ marginBottom: '4px' }}>
              <b>CALL US:</b> (555) 123-4567 (Office, Sales)
            </div>
            <div style={{ color: '#ed5348', lineHeight: '12px', letterSpacing: '1.5px', fontSize: '12px' }}>
              Availability and Price not guaranteed.<br />
              Pay only on invoice not order!
            </div>
          </div>
          <div className="mini-cart">
            <button 
              className="mybag-link" 
              onClick={() => setShowCart(!showCart)}
              onMouseEnter={() => setShowCart(true)}
              onMouseLeave={() => setShowCart(false)}
            >
              <span className="minicart-label">Cart</span>
              <span className="cart-info">
                <span className="cart-qty">{cartItemCount}</span>
                <span>Item(s)</span>
              </span>
            </button>
            {showCart && (
              <Cart 
                cartItems={cartItems} 
                onClose={() => setShowCart(false)}
                onUpdate={fetchCart}
              />
            )}
          </div>
        </div>

        <div className="search-area">
          <form className="form-search" onSubmit={handleSearch}>
            <input
              id="search"
              type="text"
              name="q"
              className="input-text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" title="Search" className="button">
              <i className="icon-search">🔍</i>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

export default Header;

