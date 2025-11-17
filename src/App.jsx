import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Admin from './pages/Admin';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleCartUpdate = () => {
    setCartUpdateTrigger((prev) => prev + 1);
  };

  return (
    <Router>
      <div className="wrapper">
        <div className="page">
          <Header onSearch={handleSearch} />
          <Navigation onCategorySelect={handleCategorySelect} />
          
          <main className="main-container">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                  />
                }
              />
              <Route path="/category/:categoryName" element={<Category />} />
              <Route
                path="/product/:id"
                element={<ProductDetail onCartUpdate={handleCartUpdate} />}
              />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderConfirmation />}
              />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
